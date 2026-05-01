export default function AdminLoading() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="h-7 w-28 animate-pulse rounded bg-[#111]/8" />
          <div className="mt-1.5 h-3 w-16 animate-pulse rounded bg-[#111]/5" />
        </div>
        <div className="h-9 w-32 animate-pulse rounded bg-[#111]/8" />
      </div>

      {/* Toolbar skeleton */}
      <div className="mb-4 flex gap-2">
        <div className="h-9 w-64 animate-pulse rounded bg-[#111]/6" />
        <div className="h-9 w-32 animate-pulse rounded bg-[#111]/6" />
        <div className="h-9 w-32 animate-pulse rounded bg-[#111]/6" />
      </div>

      {/* Table skeleton */}
      <div className="overflow-hidden rounded border border-[#111]/8 bg-white">
        <div className="border-b border-[#111]/8 px-4 py-3">
          <div className="h-3 w-64 animate-pulse rounded bg-[#111]/6" />
        </div>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-[#111]/5 px-4 py-3 last:border-0">
            <div className="h-9 w-9 flex-shrink-0 animate-pulse rounded bg-[#111]/6" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-48 animate-pulse rounded bg-[#111]/8" />
              <div className="h-2.5 w-32 animate-pulse rounded bg-[#111]/5" />
            </div>
            <div className="h-3 w-20 animate-pulse rounded bg-[#111]/5" />
            <div className="h-3 w-16 animate-pulse rounded bg-[#111]/5" />
            <div className="h-5 w-9 animate-pulse rounded-full bg-[#111]/8" />
            <div className="h-3 w-14 animate-pulse rounded bg-[#111]/5" />
          </div>
        ))}
      </div>
    </div>
  );
}
