const PROBLEMS = [
  {
    title: '自分に向いている業界が分からない',
    description: '経験はあるが、どの業界で活躍できるか判断できない',
    icon: '🧭',
  },
  {
    title: '職種ごとの将来性を比較できない',
    description: '営業、マーケティング、PM、コンサルなどの将来性や市場価値が見えない',
    icon: '📈',
  },
  {
    title: '企業ごとの違いが分からない',
    description: '求人票だけではカルチャーや成長環境の違いが判断できない',
    icon: '🏢',
  },
  {
    title: '転職後のキャリアパスが見えない',
    description: '入社後3年、5年後にどう成長するかイメージできない',
    icon: '🛣️',
  },
  {
    title: '転職活動が感覚的になる',
    description: '求人を眺めてなんとなく応募してしまう',
    icon: '⚠️',
  },
]

export default function ProblemSection() {
  return (
    <section id="problem" className="bg-slate-950 py-24 text-slate-100">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.28em] text-sky-400">The Problem</p>
          <h2 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            求人を見るだけでは、キャリアは決められない。
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            情報は溢れているのに、自分にとっての最適解は見えていない。
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
          {PROBLEMS.map((item) => (
            <article key={item.title} className="group rounded-[2rem] border border-slate-800 bg-slate-900 p-8 shadow-[0_30px_90px_rgba(15,23,42,0.18)] transition hover:-translate-y-1 hover:border-sky-500 hover:bg-slate-950">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-sky-500 text-3xl shadow-lg shadow-sky-500/20">
                {item.icon}
              </div>
              <h3 className="mt-8 text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
