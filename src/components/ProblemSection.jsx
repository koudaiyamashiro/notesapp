const PROBLEMS = [
  {
    title: '自分に向いている業界が分からない',
    description: '経験はあるが、どの業界で活躍できるか判断できない',
    key: '01',
  },
  {
    title: '職種ごとの将来性を比較できない',
    description: '営業、マーケティング、PM、コンサルなどの将来性や市場価値が見えない',
    key: '02',
  },
  {
    title: '企業ごとの違いが分からない',
    description: '求人票だけではカルチャーや成長環境の違いが判断できない',
    key: '03',
  },
  {
    title: '転職後のキャリアパスが見えない',
    description: '入社後3年、5年後にどう成長するかイメージできない',
    key: '04',
  },
  {
    title: '転職活動が感覚的になる',
    description: '求人を眺めてなんとなく応募してしまう',
    key: '05',
  },
]

export default function ProblemSection() {
  return (
    <section id="problem" className="bg-[#F5F7FA] py-24 text-slate-900">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.28em] text-sky-600">The Problem</p>
          <h2 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            求人を見るだけでは、キャリアは決められない。
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            情報は溢れているのに、自分にとっての最適解は見えていない。
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
          {PROBLEMS.map((item) => (
            <article key={item.title} className="group rounded-[1.8rem] border border-slate-200 bg-white p-8 shadow-[0_22px_70px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:border-sky-300">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF6FF] text-base font-semibold text-sky-700">
                {item.key}
              </div>
              <h3 className="mt-8 text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
