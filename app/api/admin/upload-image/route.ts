import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const DEFAULT_BUCKET = "product-images";
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Потрібна авторизація в адмінці." },
      { status: 401 }
    );
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: "Невірні дані форми." }, { status: 400 });
  }

  const files = formData
    .getAll("files")
    .filter((value): value is File => value instanceof File);

  if (files.length === 0) {
    return NextResponse.json({ error: "Не вибрано жодного файлу." }, { status: 400 });
  }

  const bucket = process.env.SUPABASE_PRODUCT_IMAGES_BUCKET || DEFAULT_BUCKET;
  const admin = createAdminClient();

  const bucketReady = await ensureBucketExists(admin, bucket);
  if (!bucketReady.ok) {
    return NextResponse.json(
      { error: bucketReady.error || "Не вдалося підготувати сховище зображень." },
      { status: 500 }
    );
  }

  const uploadedUrls: string[] = [];

  for (const file of files) {
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: `Файл "${file.name}" не є зображенням.` },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: `Файл "${file.name}" перевищує 10MB.` },
        { status: 400 }
      );
    }

    const safeName = sanitizeFileName(file.name);
    const ext = getFileExtension(safeName, file.type);
    const randomPart = crypto.randomUUID();
    const path = `products/${new Date().toISOString().slice(0, 10)}/${randomPart}.${ext}`;

    const bytes = await file.arrayBuffer();
    const { error: uploadError } = await admin.storage
      .from(bucket)
      .upload(path, bytes, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: `Не вдалося завантажити "${file.name}": ${uploadError.message}` },
        { status: 500 }
      );
    }

    const { data: publicData } = admin.storage.from(bucket).getPublicUrl(path);
    if (!publicData?.publicUrl) {
      return NextResponse.json(
        { error: `Не вдалося отримати URL для "${file.name}".` },
        { status: 500 }
      );
    }

    uploadedUrls.push(publicData.publicUrl);
  }

  return NextResponse.json({ urls: uploadedUrls });
}

async function ensureBucketExists(
  admin: ReturnType<typeof createAdminClient>,
  bucket: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { data: existing, error: getError } = await admin.storage.getBucket(bucket);
  if (existing && !getError) {
    return { ok: true };
  }

  const { error: createError } = await admin.storage.createBucket(bucket, {
    public: true,
    fileSizeLimit: `${MAX_FILE_SIZE_BYTES}`,
    allowedMimeTypes: ["image/*"],
  });

  if (createError) {
    return {
      ok: false,
      error: `Bucket "${bucket}" не знайдено і не вдалося створити: ${createError.message}`,
    };
  }

  return { ok: true };
}

function sanitizeFileName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9.\-_]/g, "");
}

function getFileExtension(fileName: string, mimeType: string) {
  const fromName = fileName.split(".").pop()?.trim().toLowerCase();
  if (fromName && fromName.length <= 5) {
    return fromName;
  }

  if (mimeType === "image/jpeg") return "jpg";
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  if (mimeType === "image/avif") return "avif";
  if (mimeType === "image/gif") return "gif";

  return "bin";
}
