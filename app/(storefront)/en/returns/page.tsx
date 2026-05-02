import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Returns | DUMKA by Nadiya Dumka",
  description: "Returns policy and process for DUMKA by Nadiya Dumka.",
};

export default function ReturnsPageEn() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20 md:px-8 md:py-28">
      <p className="mb-4 text-[11px] uppercase tracking-widest text-[#111]/40">Service</p>
      <h1 className="mb-16 font-serif text-4xl uppercase tracking-wide md:text-5xl">
        Returns
      </h1>

      <div className="space-y-14">
        <section>
          <h2 className="mb-6 text-[11px] font-medium uppercase tracking-widest text-[#111]/40">
            Return conditions
          </h2>
          <div className="space-y-4 text-sm leading-7 text-[#111]/70">
            <p>
              Returns are accepted within <span className="text-[#111]">14 days</span> of receipt.
            </p>
            <p>Items must meet the following conditions:</p>
            <ul className="ml-4 space-y-2 list-none">
              {[
                "Unworn and unused",
                "Original tags attached",
                "No traces of make-up, fragrance, or damage",
                "Original packaging retained",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2.5 h-px w-4 shrink-0 bg-[#111]/30" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-[11px] font-medium uppercase tracking-widest text-[#111]/40">
            How to initiate a return
          </h2>
          <div className="space-y-6 text-sm leading-7 text-[#111]/70">
            {[
              {
                step: "01",
                text: "Email dumkaprotebe@gmail.com with your order number and a brief reason for return.",
              },
              {
                step: "02",
                text: "Within one business day we will confirm the return and provide the return address.",
              },
              {
                step: "03",
                text: "Send the item via Nova Poshta or any courier of your choice. Keep the tracking number.",
              },
              {
                step: "04",
                text: "Once received and inspected, we will issue a refund within 3–5 business days to the original payment card.",
              },
            ].map(({ step, text }) => (
              <div key={step} className="flex gap-6">
                <span className="shrink-0 font-serif text-2xl text-[#111]/15">{step}</span>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-[11px] font-medium uppercase tracking-widest text-[#111]/40">
            Non-returnable items
          </h2>
          <div className="space-y-4 text-sm leading-7 text-[#111]/70">
            <p>
              Made-to-order and custom-fitted garments — individual commissions, structural
              alterations, or size adjustments made to the buyer's measurements.
            </p>
            <p>
              Items showing signs of wear, damage, or missing original tags.
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-[11px] font-medium uppercase tracking-widest text-[#111]/40">
            Return shipping costs
          </h2>
          <div className="space-y-4 text-sm leading-7 text-[#111]/70">
            <p>
              Return shipping is the buyer's responsibility, except where a manufacturing defect or
              our error is involved — in which case we cover the cost.
            </p>
          </div>
        </section>
      </div>

      <div className="mt-16 border-t border-[#111]/8 pt-10">
        <p className="mb-6 text-sm text-[#111]/50">
          Have a question or an unusual situation?
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="mailto:dumkaprotebe@gmail.com"
            className="primary-button inline-block px-8 py-3 text-xs"
          >
            Write to us
          </a>
          <Link
            href="/en/delivery"
            className="ghost-button inline-block px-8 py-3 text-xs"
          >
            Delivery &amp; payment
          </Link>
        </div>
      </div>
    </main>
  );
}
