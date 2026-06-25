export default function SectionCard({ id, title, subtitle, right, children, className = '' }) {
  return (
    <section id={id} className={`rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-7 ${className}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">{title}</h2>
          {subtitle && <p className="mt-2 text-sm leading-6 text-slate-600">{subtitle}</p>}
        </div>
        {right ? <div>{right}</div> : null}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  )
}
