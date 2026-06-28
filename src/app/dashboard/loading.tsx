export default function DashboardLoading() {
  return (
    <div className="px-4 pt-10">
      <div className="mx-auto max-w-6xl animate-pulse">
        <div className="h-4 w-28 rounded-full bg-white/10" />
        <div className="mt-3 h-10 w-48 rounded-2xl bg-white/10" />

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_1.4fr]">
          <div className="h-56 rounded-[2rem] bg-white/10" />
          <div className="h-72 rounded-[2rem] bg-white/8" />
        </div>

        <div className="mt-12 h-7 w-40 rounded-full bg-white/10" />
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-2xl bg-white/8" />
          ))}
        </div>

        <div className="mt-12 h-7 w-40 rounded-full bg-white/10" />
        <div className="mt-4 space-y-2 rounded-2xl border border-white/10 p-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 rounded-xl bg-white/8" />
          ))}
        </div>
      </div>
    </div>
  );
}
