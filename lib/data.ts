import { Product, ProductVariant } from "./types";

export async function getProducts(): Promise<Product[]> {
  try {
    const url = 'https://j06wf9-vp.myshopify.com/products.json?limit=250';
    const response = await fetch(url, { next: { revalidate: 3600 } });
    const json = await response.json();

    const rawProducts = Array.isArray(json) ? json : json.products || [];

    return rawProducts.map((row: any) => {
      // Map shopify product to our type
      const variants: ProductVariant[] = (row.variants || []).map((v: any) => {
        const rawPrice = parseFloat(v.price || "0");
        const formattedPrice = new Intl.NumberFormat("uk-UA", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(rawPrice) + " ₴";
        
        return {
          title: v.title || "",
          price: formattedPrice,
          priceNumber: rawPrice,
          size: v.option1 || "",
          color: v.option2 || "",
          available: v.available ?? true,
        };
      });

      let defaultPrice = "0 ₴";
      if (variants.length > 0) {
        const minPriceVariant = variants.reduce((min, v) => (v.priceNumber < min.priceNumber ? v : min), variants[0]);
        defaultPrice = minPriceVariant.price;
      }

      return {
        handle: row.handle,
        title: row.title,
        bodyHtml: row.body_html || "",
        images: (row.images || []).map((img: any) => img.src),
        variants,
        price: defaultPrice,
      };
    });
  } catch (error) {
    console.error("Error reading products:", error);
    return [];
  }
}

export async function getProductByHandle(handle: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((p) => p.handle === handle);
}
