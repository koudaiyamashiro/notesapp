export default function PricingCard({ title, price, description, features, featured }) {
  return (
    <div className={`rounded-[2rem] border p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)] ${featured ? 'border-slate-900 bg-slate-950 text-white' : 'border-slate-200 bg-white text-slate-950'}`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className={`mt-2 text-sm ${featured ? 'text-slate-300' : 'text-slate-500'}`}>{description}</p>
        </div>
        {featured && <span className="rounded-full bg-sky-500 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white">人気</span>}
      </div>
      <div className="mt-10 space-y-3">
        <p className="text-4xl font-semibold">{price}</p>
        <ul className={`space-y-3 text-sm leading-6 ${featured ? 'text-slate-200' : 'text-slate-600'}`}>
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-500"></span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <button className={`mt-10 w-full rounded-full px-5 py-3 text-sm font-semibold transition ${featured ? 'bg-white text-slate-950 hover:bg-slate-100' : 'bg-slate-950 text-white hover:bg-slate-800'}`}>
        今すぐ選ぶ
      </button>
    </div>
  )
}
