export default function ProductLoading() {
  return (
    <div className="min-h-screen pb-28 pt-20 md:pb-16 md:pt-28">
      <div className="mx-auto max-w-[1500px] px-4 md:px-8">
        <div className="relative flex flex-col gap-10 lg:flex-row lg:gap-24">
          <div className="grid w-full gap-2 md:gap-8 lg:w-3/5">
            <div className="aspect-[4/5] bg-[#111111]/10" />
            <div className="hidden aspect-[4/5] bg-[#111111]/10 md:block" />
          </div>

          <div className="w-full lg:w-2/5">
            <div className="sticky top-32">
              <div className="mb-5 h-3 w-44 bg-[#111111]/10" />
              <div className="mb-4 h-14 w-4/5 bg-[#111111]/10" />
              <div className="mb-10 h-5 w-28 bg-[#111111]/10" />
              <div className="mb-10 flex gap-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-12 w-12 bg-[#111111]/10" />
                ))}
              </div>
              <div className="mb-12 hidden h-12 w-full bg-[#111111]/10 md:block" />
              <div className="space-y-5 border-t border-[#111111]/10 pt-6">
                <div className="h-4 w-full bg-[#111111]/10" />
                <div className="h-4 w-5/6 bg-[#111111]/10" />
                <div className="h-4 w-2/3 bg-[#111111]/10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
