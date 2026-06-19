export default function PricingCard({ title, price, description, features, featured, recommended }) {
  return (
    <div className={`rounded-[2rem] border p-8 shadow-[0_28px_90px_rgba(15,23,42,0.12)] transition ${featured ? 'border-slate-900 bg-slate-950 text-white shadow-sky-500/20' : 'border-slate-800 bg-slate-900 text-slate-100'} ${recommended ? 'ring-1 ring-sky-500/30' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className={`text-xl font-semibold ${featured ? 'text-white' : 'text-slate-100'}`}>{title}</h3>
          <p className={`mt-2 text-sm ${featured ? 'text-slate-300' : 'text-slate-400'}`}>{description}</p>
        </div>
        {featured && <span className="rounded-full bg-sky-400 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-950">Best value</span>}
        {recommended && !featured && <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">Recommended</span>}
      </div>
      <div className="mt-10 space-y-3">
        <p className="text-4xl font-semibold text-white">{price}</p>
        <ul className="space-y-3 text-sm leading-6 text-slate-300">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-400"></span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <button className={`mt-10 w-full rounded-full px-5 py-3 text-sm font-semibold transition ${featured ? 'bg-white text-slate-950 hover:bg-slate-100' : 'bg-slate-800 text-white hover:bg-slate-700'}`}>
        今すぐ選ぶ
      </button>
    </div>
  )
}
