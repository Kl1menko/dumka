import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Delivery & Payment | DUMKA by Nadiya Dumka",
  description: "Shipping, payment, and returns policy for DUMKA by Nadiya Dumka.",
};

export default function DeliveryPageEn() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20 md:px-8 md:py-28">
      <p className="mb-4 text-[11px] uppercase tracking-widest text-[#111]/40">Service</p>
      <h1 className="mb-16 font-serif text-4xl uppercase tracking-wide md:text-5xl">
        Delivery &amp; Payment
      </h1>

      <div className="space-y-14">
        <section>
          <h2 className="mb-6 text-[11px] font-medium uppercase tracking-widest text-[#111]/40">
            Delivery within Ukraine
          </h2>
          <div className="space-y-4 text-sm leading-7 text-[#111]/70">
            <p>
              Complimentary Nova Poshta delivery across Ukraine on orders
              from <span className="text-[#111]">1&nbsp;500&nbsp;₴</span>. For smaller orders,
              standard carrier rates apply.
            </p>
            <p>
              Estimated delivery — <span className="text-[#111]">1–3 business days</span> after
              order confirmation. A tracking number is sent via email or Telegram once the parcel
              is dispatched.
            </p>
            <p>
              In-store pickup is available at our Lviv showroom at no additional cost — please
              arrange in advance.
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-[11px] font-medium uppercase tracking-widest text-[#111]/40">
            International shipping
          </h2>
          <div className="space-y-4 text-sm leading-7 text-[#111]/70">
            <p>
              We ship internationally via Ukrposhta and international couriers. Rates and transit
              times vary by destination — please enquire at the showroom or by email.
            </p>
            <p>
              Import duties and taxes are the responsibility of the recipient.
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-[11px] font-medium uppercase tracking-widest text-[#111]/40">
            Payment
          </h2>
          <div className="space-y-4 text-sm leading-7 text-[#111]/70">
            <p>
              We accept online card payments (Visa / Mastercard) via Shopify's secure checkout, as
              well as cash-on-delivery through Nova Poshta.
            </p>
            <p>
              For corporate or made-to-order commissions, payment by bank transfer is available
              after details are confirmed.
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-[11px] font-medium uppercase tracking-widest text-[#111]/40">
            Returns
          </h2>
          <div className="space-y-4 text-sm leading-7 text-[#111]/70">
            <p>
              Returns are accepted within <span className="text-[#111]">14 days</span> of receipt.
              Items must be in original condition — with tags attached, unworn, and free of any
              odours or damage.
            </p>
            <p>
              To initiate a return, please email{" "}
              <a
                href="mailto:dumkaprotebe@gmail.com"
                className="text-[#111] underline underline-offset-4"
              >
                dumkaprotebe@gmail.com
              </a>{" "}
              with your order number and reason. We will respond with instructions within one
              business day.
            </p>
            <p>
              Made-to-order and custom-fitted garments are non-returnable.
            </p>
            <p>
              Return shipping costs are the buyer's responsibility, except where a manufacturing
              defect or our error is involved.
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-[11px] font-medium uppercase tracking-widest text-[#111]/40">
            Showroom / Fitting
          </h2>
          <div className="space-y-4 text-sm leading-7 text-[#111]/70">
            <p>
              All pieces can be tried on in person in Lviv. We recommend booking in advance so our
              stylist can prepare the right sizes and complementary pieces for you.
            </p>
            <div className="mt-2 space-y-1 text-[#111]/55">
              <p>Shpytalna St, 1, Lviv</p>
              <p>Magnus shopping centre, 3rd floor</p>
              <p>+38 (067) 757-01-21</p>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-16 border-t border-[#111]/8 pt-10">
        <p className="mb-6 text-sm text-[#111]/50">
          Have a question? We are always here.
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="mailto:dumkaprotebe@gmail.com"
            className="primary-button inline-block px-8 py-3 text-xs"
          >
            Write to us
          </a>
          <Link
            href="/en/shop"
            className="ghost-button inline-block px-8 py-3 text-xs"
          >
            Shop now
          </Link>
        </div>
      </div>
    </main>
  );
}
