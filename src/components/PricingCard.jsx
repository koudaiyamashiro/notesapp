export default function PricingCard({ title, price, description, features, featured, recommended }) {
  return (
    <div className={`rounded-[2rem] border p-8 shadow-[0_28px_90px_rgba(15,23,42,0.08)] transition ${featured ? 'border-sky-200 bg-[#EAF6FF] text-slate-900' : 'border-slate-200 bg-white text-slate-900'} ${recommended ? 'ring-1 ring-sky-300/70' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
          <p className="mt-2 text-sm text-slate-600">{description}</p>
        </div>
        {featured && <span className="rounded-full bg-sky-500 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white">Best value</span>}
        {recommended && !featured && <span className="rounded-full bg-[#EAF6FF] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">Recommended</span>}
      </div>
      <div className="mt-10 space-y-3">
        <p className="text-4xl font-semibold text-slate-900">{price}</p>
        <ul className="space-y-3 text-sm leading-6 text-slate-600">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-500"></span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <button className={`mt-10 w-full rounded-full px-5 py-3 text-sm font-semibold transition ${featured ? 'bg-sky-500 text-white hover:bg-sky-400' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
        今すぐ選ぶ
      </button>
    </div>
  )
}
