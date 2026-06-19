export default function ComparisonCard({ company, sector, focus, highlight }) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
      <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{company}</p>
      <h3 className="mt-4 text-xl font-semibold text-slate-950">{sector}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{focus}</p>
      <div className="mt-5 rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">{highlight}</div>
    </div>
  )
}
