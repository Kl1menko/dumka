import { ProductForm } from "../_components/ProductForm";

export const metadata = { title: "Додати товар — DUMKA Admin" };

export default function NewProductPage() {
  return (
    <div>
      <div className="mb-7">
        <a href="/admin" className="text-xs text-[#111]/40 hover:text-[#111]">
          ← Товари
        </a>
        <h1 className="mt-3 font-serif text-2xl text-[#111]">Додати товар</h1>
      </div>

      <ProductForm />
    </div>
  );
}
