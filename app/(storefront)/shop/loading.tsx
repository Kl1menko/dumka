export default function ShopLoading() {
  return (
    <div className="min-h-screen pt-32 md:pt-40">
      <section className="border-b border-[#111111]/10">
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-12 px-4 pb-16 md:grid-cols-[0.78fr_1.22fr] md:px-8 md:pb-24">
          <div>
            <div className="mb-5 h-3 w-28 bg-[#111111]/10" />
            <div className="h-16 w-64 bg-[#111111]/10 md:h-24" />
          </div>
          <div className="max-w-3xl md:pt-8">
            <div className="h-10 w-full bg-[#111111]/10 md:h-16" />
            <div className="mt-4 h-10 w-2/3 bg-[#111111]/10 md:h-16" />
            <div className="mt-10 flex gap-4">
              <div className="h-3 w-24 bg-[#111111]/10" />
              <div className="h-3 w-32 bg-[#111111]/10" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1600px] grid-cols-2 gap-x-3 gap-y-10 px-4 py-8 sm:gap-x-5 md:gap-x-8 md:gap-y-16 md:px-8 md:py-12 xl:grid-cols-3">
        {Array.from({ length: 9 }).map((_, index) => (
          <div key={index}>
            <div className="aspect-[3/4] bg-[#111111]/10" />
            <div className="mt-3 h-4 w-3/4 bg-[#111111]/10" />
            <div className="mt-2 h-3 w-20 bg-[#111111]/10" />
          </div>
        ))}
      </section>
    </div>
  );
}
