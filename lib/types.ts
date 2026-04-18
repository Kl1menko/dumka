export interface ProductVariant {
  title: string; // e.g. "S / Black"
  price: string; // formatted price
  priceNumber: number; // raw price for sorting if needed
  size: string; // Option1 Value
  color: string; // Option2 Value
  available: boolean; 
}

export interface Product {
  handle: string;
  title: string;
  bodyHtml: string;
  images: string[];
  variants: ProductVariant[];
  price: string; // lowest price formatted 
}
