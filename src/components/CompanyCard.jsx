export default function CompanyCard({ name, description }) {
  return (
    <article tabIndex={0} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.06)] transition-transform transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-100">
      <div className="text-lg font-semibold text-slate-950">{name}</div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
    </article>
  )
}
