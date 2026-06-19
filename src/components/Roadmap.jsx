export default function Roadmap({ steps }) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">5年後ロードマップ</p>
      <div className="mt-6 space-y-4">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4">
            <span className="text-lg font-semibold text-slate-950">{step}</span>
            {index < steps.length - 1 && <span className="text-sky-500">→</span>}
          </div>
        ))}
      </div>
    </section>
  )
}
