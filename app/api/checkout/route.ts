import { NextResponse } from "next/server";

interface CheckoutRequestItem {
  variantId?: string;
  quantity?: number;
}

const CART_CREATE_MUTATION = `#graphql
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function POST(request: Request) {
  const shopDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const storefrontToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const apiVersion = process.env.SHOPIFY_STOREFRONT_API_VERSION || "2026-04";

  const tokenMissing = storefrontToken === "MY_SHOPIFY_STOREFRONT_ACCESS_TOKEN" || !storefrontToken;
  if (!shopDomain || tokenMissing) {
    return NextResponse.json(
      { error: "Оформлення замовлення тимчасово недоступне. Зв'яжіться з нами через Instagram або телефон шоуруму." },
      { status: 503 }
    );
  }

  const payload = await request.json().catch(() => null);
  const items = Array.isArray(payload?.items)
    ? (payload.items as CheckoutRequestItem[])
    : [];
  const lines = items
    .filter((item) => item.variantId && Number(item.quantity) > 0)
    .map((item) => ({
      merchandiseId: item.variantId,
      quantity: Number(item.quantity),
    }));

  if (lines.length === 0) {
    return NextResponse.json(
      { error: "Кошик порожній або містить товари без Shopify variant id." },
      { status: 400 }
    );
  }

  const response = await fetch(
    `https://${shopDomain}/api/${apiVersion}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Shopify-Storefront-Access-Token": storefrontToken,
      },
      body: JSON.stringify({
        query: CART_CREATE_MUTATION,
        variables: {
          input: {
            lines,
          },
        },
      }),
    }
  );

  const result = await response.json().catch(() => null);
  const userErrors = result?.data?.cartCreate?.userErrors || [];
  const checkoutUrl = result?.data?.cartCreate?.cart?.checkoutUrl;

  if (!response.ok || result?.errors?.length || userErrors.length || !checkoutUrl) {
    return NextResponse.json(
      {
        error:
          userErrors[0]?.message ||
          result?.errors?.[0]?.message ||
          "Shopify не зміг створити checkout.",
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ checkoutUrl });
}
