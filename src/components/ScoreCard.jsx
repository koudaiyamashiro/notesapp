export default function ScoreCard({ score, label }) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)] transition-transform transform hover:scale-[1.01]">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">{label}</p>
      <p className="mt-4 text-5xl font-semibold tracking-tight text-slate-950">{score}</p>
    </div>
  )
}
