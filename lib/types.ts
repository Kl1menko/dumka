export interface ProductVariant {
  id: string;
  title: string;
  price: string;        // formatted UAH string for display
  priceNumber: number;  // raw UAH value
  size: string;
  color: string;
  available: boolean;
}

export interface Product {
  handle: string;
  title: string;
  bodyHtml: string;
  images: string[];
  variants: ProductVariant[];
  price: string;        // lowest variant price, formatted
  priceNumber: number;  // lowest variant price, raw UAH
  productType: string;
  tags: string[];
  sortOrder?: number;
  published?: boolean;
}
