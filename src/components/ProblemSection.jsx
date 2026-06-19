const PROBLEMS = [
  {
    title: '自分に向いている業界がわからない',
    description: '求人が多すぎて、あなたに合う業界が絞り込めない。',
    icon: '🗺️',
  },
  {
    title: '職種ごとの将来性が比較できない',
    description: 'どの職種が今後伸びるのかが明確でない。',
    icon: '📈',
  },
  {
    title: '企業ごとの違いがわからない',
    description: '同じ業界でも企業によってキャリアが大きく変わる。',
    icon: '🏢',
  },
  {
    title: '転職後のキャリアパスが見えない',
    description: '今の選択が5年後にどうつながるか想像できない。',
    icon: '🧭',
  },
  {
    title: '職務経歴書や面接対策が属人的',
    description: '企業や職種ごとに最適な準備がバラバラになる。',
    icon: '📝',
  },
]

export default function ProblemSection() {
  return (
    <section id="problem" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.28em] text-sky-500">The Problem</p>
          <h2 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            求人を見るだけでは、キャリアは決められない。
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            「なんとなく転職」をなくす。情報は溢れているのに、自分にとっての最適解は見えてこない――その理由は5つあります。
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
          {PROBLEMS.map((item) => (
            <article key={item.title} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-sky-100 text-2xl">
                {item.icon}
              </div>
              <h3 className="mt-6 text-lg font-semibold text-slate-950">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
