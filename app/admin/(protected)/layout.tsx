import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/actions/products";

export const metadata = { title: "DUMKA Admin" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-[#f7f7f5]">
      {/* Sidebar */}
      <aside className="flex w-52 flex-shrink-0 flex-col justify-between bg-[#0e0e0e] px-4 py-6 text-white">
        <div>
          <div className="mb-8 px-2">
            <p className="font-serif text-lg tracking-widest uppercase leading-none">Dumka</p>
            <p className="mt-1 text-[9px] uppercase tracking-widest text-white/30">Панель керування</p>
          </div>

          <nav className="flex flex-col gap-0.5">
            <a
              href="/admin"
              className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-white/70 transition hover:bg-white/8 hover:text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
              </svg>
              Товари
            </a>
            <a
              href="/admin/new"
              className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-white/70 transition hover:bg-white/8 hover:text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Додати товар
            </a>
          </nav>

          <div className="my-6 border-t border-white/8" />

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-white/35 transition hover:bg-white/8 hover:text-white/60 focus:outline-none"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            Відкрити сайт
          </a>
        </div>

        {/* Footer */}
        <div className="border-t border-white/8 pt-4">
          <p className="mb-2 truncate px-2.5 text-[11px] text-white/25">{user.email}</p>
          <form action={signOut}>
            <button
              type="submit"
              className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm text-white/40 transition hover:bg-white/8 hover:text-white/60 focus:outline-none"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Вийти
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto px-8 py-8">{children}</main>
    </div>
  );
}
