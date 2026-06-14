export default function CarLoading() {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-40 pb-24 animate-pulse">
      <div className="h-4 w-24 rounded bg-[#161616]/5" />
      <div className="h-14 w-72 rounded bg-[#161616]/8 mt-4" />
      <div className="h-4 w-full max-w-lg rounded bg-[#161616]/5 mt-6" />
      <div className="h-4 w-2/3 max-w-md rounded bg-[#161616]/5 mt-2" />
      <div className="mt-10 grid grid-cols-2 sm:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="glass h-24" />
        ))}
      </div>
      <div className="glass h-64 mt-12" />
    </div>
  );
}
