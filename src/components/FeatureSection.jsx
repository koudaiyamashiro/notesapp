import { BarChart3, Building2, Laptop, Map, Smartphone, Sparkles, Target } from 'lucide-react'
import SectionReveal from './SectionReveal.jsx'

const features = [
  {
    title: '市場価値スコア',
    description: '経験・スキル・市場需要を統合して、現在地と伸びしろをひと目で把握できます。',
    icon: BarChart3,
  },
  {
    title: '業界・職種の適性提案',
    description: '向いている業界・役割を根拠付きで整理し、優先順位まで導きます。',
    icon: Sparkles,
  },
  {
    title: '企業比較レポート',
    description: '年収、成長環境、カルチャーを同一条件で並べ、意思決定を支援します。',
    icon: Building2,
  },
  {
    title: 'キャリアロードマップ',
    description: '1年、3年、5年の意思決定と必要アクションを、実行レベルまで落とし込みます。',
    icon: Map,
  },
]

function StatChip({ label, value, sublabel }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
        <span className="rounded-full bg-[#EAF6FF] px-2.5 py-1 text-[11px] font-semibold text-sky-700">Live</span>
      </div>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{sublabel}</p>
    </div>
  )
}

function BrowserChrome() {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
        </div>
        <div className="rounded-full bg-[#F8FAFC] px-3 py-1 text-[11px] font-semibold text-slate-500">
          career-strategist.ai / result
        </div>
      </div>
      <span className="rounded-full bg-[#EAF6FF] px-3 py-1 text-[11px] font-semibold text-sky-700">Preview</span>
    </div>
  )
}

function DashboardMockup() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_34px_100px_rgba(15,23,42,0.09)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(14,165,233,0.12),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(79,123,255,0.12),transparent_28%),linear-gradient(180deg,#ffffff,#f8fbff)]" />
      <BrowserChrome />

      <div className="relative grid gap-4 p-4 xl:grid-cols-[1.02fr_0.98fr]">
        <div className="space-y-4 rounded-[1.6rem] border border-slate-200 bg-white p-4 shadow-[0_16px_45px_rgba(15,23,42,0.05)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Market value score</p>
              <p className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">78<span className="ml-1 text-xl text-slate-400">/100</span></p>
            </div>
            <div className="rounded-2xl bg-[#F8FAFC] px-3 py-2 text-right">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">AI match</p>
              <p className="mt-1 text-2xl font-semibold text-sky-600">92%</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-[#F8FAFC] p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">市場価値トレンド</p>
              <svg viewBox="0 0 180 84" className="mt-2 h-20 w-full">
                <defs>
                  <linearGradient id="feature-line" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#93c5fd" />
                    <stop offset="100%" stopColor="#0ea5e9" />
                  </linearGradient>
                </defs>
                <polyline points="6,64 34,58 62,46 90,40 118,28 146,22 174,12" fill="none" stroke="url(#feature-line)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6,64 34,58 62,46 90,40 118,28 146,22 174,12 L174,82 L6,82 Z" fill="rgba(14,165,233,0.12)" />
              </svg>
            </div>
            <div className="rounded-2xl bg-[#F8FAFC] p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">AIコメント</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                強みの再現性が高く、成長企業との相性が良い状態です。職務経歴書は成果起点で整理するとさらに精度が上がります。
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">レーダーチャート</p>
              <svg viewBox="0 0 140 120" className="mt-2 h-28 w-full">
                <polygon points="70,12 114,36 104,92 36,92 26,36" fill="rgba(14,165,233,0.08)" stroke="#93c5fd" strokeWidth="1.5" />
                <polygon points="70,22 103,38 94,80 46,80 37,38" fill="rgba(14,165,233,0.2)" stroke="#0ea5e9" strokeWidth="1.5" />
              </svg>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">企業比較</p>
              <div className="mt-3 space-y-2">
                {[
                  ['LayerX', 92],
                  ['SmartHR', 89],
                  ['mercari', 86],
                ].map(([name, fit]) => (
                  <div key={name} className="flex items-center gap-2 text-xs text-slate-600">
                    <span className="w-16 shrink-0 font-medium text-slate-900">{name}</span>
                    <div className="h-2 flex-1 rounded-full bg-slate-200">
                      <div className="h-2 rounded-full bg-[linear-gradient(90deg,#93c5fd,#0ea5e9)]" style={{ width: `${fit}%` }} />
                    </div>
                    <span className="w-8 text-right font-semibold text-sky-600">{fit}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">市場価値スコア</p>
              <div className="mt-2 flex items-end justify-between">
                <p className="text-2xl font-semibold text-slate-950">78</p>
                <span className="rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-sky-700 shadow-sm">上位18%</span>
              </div>
              <div className="mt-3 h-2.5 rounded-full bg-white">
                <div className="h-2.5 w-[78%] rounded-full bg-[linear-gradient(90deg,#0ea5e9,#4f7bff)]" />
              </div>
              <div className="mt-3 flex h-10 items-end gap-1.5">
                {[32, 40, 38, 52, 64, 72].map((bar) => (
                  <span key={bar} className="flex-1 rounded-t-full bg-[linear-gradient(180deg,rgba(191,219,254,0.8),rgba(14,165,233,0.92))]" style={{ height: `${bar}px` }} />
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">キャリアロードマップ</p>
              <div className="mt-3 space-y-2.5">
                {[
                  ['現在', '基礎固め・実績整理'],
                  ['1年後', 'スキル拡張・実績可視化'],
                  ['3年後', '役割拡大・専門性強化'],
                  ['5年後', 'リード・戦略牽引'],
                ].map(([label, text], index) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EAF6FF] text-[11px] font-semibold text-sky-700">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
                      <p className="text-sm text-slate-700">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white p-4 shadow-[0_16px_45px_rgba(15,23,42,0.05)]">
          <div className="absolute right-4 top-4 h-20 w-20 rounded-full bg-[radial-gradient(circle,rgba(14,165,233,0.16),transparent_68%)] blur-2xl" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <article key={feature.title} className="rounded-[1.5rem] border border-slate-200 bg-[#F8FAFC] p-5 shadow-[0_14px_40px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-1 hover:border-sky-200 hover:bg-white">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sky-600 shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-950">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{feature.description}</p>
                </article>
              )
            })}
          </div>

          <div className="mt-4 rounded-[1.6rem] border border-slate-200 bg-white p-4 shadow-[0_14px_40px_rgba(15,23,42,0.04)] lg:hidden">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Smartphone className="h-4 w-4 text-sky-500" />
                Mobile preview
              </div>
              <span className="rounded-full bg-[#EAF6FF] px-2.5 py-1 text-[11px] font-semibold text-sky-700">Responsive</span>
            </div>
            <div className="mt-3 rounded-[1.4rem] bg-[linear-gradient(180deg,#0f172a,#1e293b)] p-3 text-white">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-200">Score</p>
              <p className="mt-1 text-2xl font-semibold">78<span className="ml-1 text-sm text-slate-300">/100</span></p>
              <div className="mt-3 rounded-2xl bg-white/8 p-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-sky-100">Roadmap</p>
                <div className="mt-2 space-y-2 text-[10px] text-slate-200">
                  <div className="rounded-xl bg-white/10 px-2 py-2">1年: 実績の定量化</div>
                  <div className="rounded-xl bg-white/10 px-2 py-2">3年: 役割拡張</div>
                  <div className="rounded-xl bg-white/10 px-2 py-2">5年: リードへ</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute -right-4 bottom-6 hidden w-[180px] rounded-[1.8rem] border border-slate-200 bg-white p-3 shadow-[0_22px_70px_rgba(15,23,42,0.12)] lg:block">
            <div className="rounded-[1.2rem] bg-[linear-gradient(180deg,#0f172a,#1e293b)] p-3 text-white">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-200">Career AI</div>
                <div className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-semibold">Phone</div>
              </div>
              <div className="mt-3 rounded-2xl bg-white/8 p-3">
                <p className="text-[10px] uppercase tracking-[0.18em] text-sky-100">Score</p>
                <p className="mt-1 text-2xl font-semibold">78<span className="ml-1 text-sm text-slate-300">/100</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatChip label="市場価値" value="78 / 100" sublabel="現在地と伸びしろを同時に可視化" />
        <StatChip label="適性提案" value="3軸" sublabel="業界・職種・企業の優先順位を整理" />
        <StatChip label="行動計画" value="1 / 3 / 5年" sublabel="ロードマップを実行単位まで分解" />
      </div>
    </div>
  )
}

export default function FeatureSection() {
  return (
    <section id="feature" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <SectionReveal className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-5">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-sky-200 bg-[#EAF6FF] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
              <Target className="h-3.5 w-3.5" />
              What You Get
            </div>
            <h2 className="max-w-xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              AIがあなた専属の
              <span className="block text-slate-700">キャリア戦略コンサルに。</span>
            </h2>
            <p className="max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
              単なる求人紹介ではなく、診断結果をそのまま意思決定に使えるように、判断材料を整理して提示します。
            </p>

            <div className="rounded-[2rem] border border-slate-200 bg-[#F8FAFC] p-4 shadow-[0_16px_45px_rgba(15,23,42,0.05)]">
              <DashboardMockup />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <article
                  key={feature.title}
                  className="rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-[0_16px_45px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-[0_18px_55px_rgba(15,23,42,0.08)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EAF6FF] text-sky-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-[#F8FAFC] px-2.5 py-1 text-[11px] font-semibold text-slate-500">0{index + 1}</span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-950">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
                </article>
              )
            })}
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}
