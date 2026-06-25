import { Brain, Building2, ChartSpline, Route, Target } from 'lucide-react'
import SectionReveal from './SectionReveal.jsx'

const previewPanels = [
  {
    title: '市場価値スコア',
    subtitle: '78 / 100',
    description: '同年代比較で上位18%のポジション。強みと伸びしろを同時表示。',
    icon: ChartSpline,
  },
  {
    title: '向いている業界・職種',
    subtitle: 'ITコンサル / SaaS PMM / 事業企画',
    description: '志向性と経験の一致度をもとに優先順位を提案。',
    icon: Target,
  },
  {
    title: '企業比較',
    subtitle: '年収・成長環境・カルチャー',
    description: '同じ条件軸で横並び比較し、納得度の高い意思決定を支援。',
    icon: Building2,
  },
  {
    title: 'キャリアロードマップ',
    subtitle: '1年 / 3年 / 5年',
    description: 'キャリア戦略を実行アクションまで分解。面接で語る軸も整理。',
    icon: Route,
  },
]

export default function ResultPreviewSection() {
  return (
    <section id="result-preview" className="bg-[#F8FAFC] py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <SectionReveal>
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.28em] text-sky-600">Result Preview</p>
            <h2 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              診断後に何が得られるかを、
              <span className="block text-slate-700">先に体験できる構成に。</span>
            </h2>
          </div>
        </SectionReveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <SectionReveal>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Brain className="h-4 w-4 text-sky-500" />
                  AI分析サマリー
                </div>
                <span className="rounded-full bg-[#EAF6FF] px-3 py-1 text-xs font-semibold text-sky-700">診断結果画面モック</span>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">市場価値</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">78 / 100</p>
                  <p className="mt-2 text-xs text-slate-600">同年代上位18%・転職市場の需要上昇トレンド</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">推奨アクション</p>
                  <ul className="mt-2 space-y-2 text-xs text-slate-600">
                    <li>・成果事例をKPIで整理</li>
                    <li>・志望企業の事業比較を準備</li>
                    <li>・面接での訴求ポイントを統一</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">企業比較サマリー</p>
                <table className="mt-2 w-full text-left text-xs text-slate-600">
                  <thead>
                    <tr className="text-slate-500">
                      <th className="py-1 font-medium">企業</th>
                      <th className="py-1 font-medium">年収</th>
                      <th className="py-1 font-medium">環境</th>
                      <th className="py-1 font-medium">適合度</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-slate-100"><td className="py-1.5">LayerX</td><td>790-950万</td><td>高裁量</td><td className="font-semibold text-sky-600">92%</td></tr>
                    <tr className="border-t border-slate-100"><td className="py-1.5">SmartHR</td><td>740-900万</td><td>成長速い</td><td className="font-semibold text-sky-600">89%</td></tr>
                    <tr className="border-t border-slate-100"><td className="py-1.5">mercari</td><td>680-850万</td><td>挑戦的</td><td className="font-semibold text-sky-600">86%</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </SectionReveal>

          <div className="grid gap-4">
            {previewPanels.map((panel, index) => {
              const Icon = panel.icon
              return (
                <SectionReveal key={panel.title} delay={index * 0.07}>
                  <article className="rounded-[1.3rem] border border-slate-200 bg-white p-5 shadow-[0_14px_45px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5">
                    <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF6FF] text-sky-600">
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-500">{panel.title}</p>
                    <h3 className="mt-1 text-base font-semibold text-slate-900">{panel.subtitle}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{panel.description}</p>
                  </article>
                </SectionReveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
