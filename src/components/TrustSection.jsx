import { ArrowUpRight, ShieldCheck, Sparkles, TrendingUp, UsersRound } from 'lucide-react'
import CountUpNumber from './CountUpNumber.jsx'
import SectionReveal from './SectionReveal.jsx'

const trustStats = [
  {
    label: '診断実施',
    value: 18000,
    suffix: '+',
    helper: '累計セッション',
    icon: UsersRound,
    trendLabel: '前月比 +23%',
    bars: [34, 42, 48, 56, 68, 84],
  },
  {
    label: '利用満足度',
    value: 95,
    suffix: '%',
    helper: 'アンケート回答ベース',
    icon: Sparkles,
    trendLabel: '高評価を維持中',
    line: [38, 44, 50, 56, 54, 60, 68, 76],
  },
  {
    label: '診断時間',
    value: 3,
    suffix: '分',
    helper: '平均所要時間',
    icon: ShieldCheck,
    trendLabel: '時間効率が高い',
    bars: [18, 24, 31, 28, 36],
  },
]

const logoRows = [
  ['mercari', 'SmartHR', 'LayerX', 'freee', 'MIXI', 'Money Forward', 'Recruit', 'Sansan', 'Cybozu', 'DeNA'],
  ['LayerX', 'freee', 'mercari', 'Sansan', 'MIXI', 'Recruit', 'Cybozu', 'SmartHR', 'Money Forward', 'DeNA'],
]

function MiniBars({ values }) {
  return (
    <div className="mt-3 flex h-10 items-end gap-1.5">
      {values.map((value, index) => (
        <span
          key={`${value}-${index}`}
          className="w-2.5 rounded-full bg-[linear-gradient(180deg,rgba(191,219,254,0.3),rgba(14,165,233,0.95))]"
          style={{ height: `${Math.max(14, value / 1.5)}%` }}
        />
      ))}
    </div>
  )
}

function MiniLine({ values }) {
  const points = values.map((value, index) => `${index * 14},${90 - value}`).join(' ')

  return (
    <div className="mt-3 h-10 overflow-hidden rounded-full bg-slate-100/70 px-1 py-2">
      <svg viewBox="0 0 100 40" className="h-full w-full">
        <polyline points={points} fill="none" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {values.map((value, index) => (
          <circle key={`${value}-${index}`} cx={index * 14} cy={90 - value} r="1.8" fill="#0ea5e9" />
        ))}
      </svg>
    </div>
  )
}

function LogoCard({ name }) {
  return (
    <div className="flex min-w-[154px] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[linear-gradient(135deg,rgba(14,165,233,0.16),rgba(47,86,255,0.12))] text-[11px] font-semibold uppercase tracking-[0.12em] text-sky-700">
        {name.slice(0, 2)}
      </div>
      <div className="leading-tight">
        <p className="text-sm font-semibold capitalize tracking-[-0.02em] text-slate-900">{name}</p>
        <p className="text-[11px] text-slate-500">Trusted by modern teams</p>
      </div>
    </div>
  )
}

function MetricCard({ item }) {
  const Icon = item.icon

  return (
    <div className="rounded-[1.35rem] border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            <CountUpNumber value={item.value} suffix={item.suffix} />
          </p>
          <p className="mt-1 text-xs text-slate-500">{item.helper}</p>
        </div>
        <div className="rounded-2xl bg-[#EAF6FF] p-3 text-sky-600">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-[#F8FAFC] px-3 py-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Trend</p>
        <p className="mt-1 text-xs font-semibold text-sky-700">{item.trendLabel}</p>
        {item.line ? <MiniLine values={item.line} /> : <MiniBars values={item.bars || []} />}
      </div>
    </div>
  )
}

function TrustVisualization() {
  return (
    <div className="relative overflow-hidden rounded-[2.25rem] border border-sky-100 bg-white p-5 shadow-[0_34px_110px_rgba(15,23,42,0.09)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(14,165,233,0.18),transparent_28%),radial-gradient(circle_at_78%_18%,rgba(47,86,255,0.16),transparent_28%),linear-gradient(180deg,rgba(248,251,255,0.96),rgba(255,255,255,0.98))]" />
      <div className="absolute left-6 top-8 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.18),transparent_68%)] blur-2xl" />

      <div className="relative space-y-4">
        <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Career dashboard</p>
              <h3 className="mt-1 text-lg font-semibold text-slate-950">市場価値を可視化する分析パネル</h3>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-[#EAF6FF] px-3 py-1 text-xs font-semibold text-sky-700">
              <TrendingUp className="h-3.5 w-3.5" />
              +12.4% month over month
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Market value score</p>
                  <p className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">72<span className="ml-1 text-xl text-slate-400">/100</span></p>
                </div>
                <div className="rounded-2xl bg-[#F8FAFC] px-3 py-2 text-right">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">AI match</p>
                  <p className="mt-1 text-2xl font-semibold text-sky-600">92%</p>
                </div>
              </div>
              <div className="mt-4 h-3 rounded-full bg-slate-100">
                <div className="h-3 w-[72%] rounded-full bg-[linear-gradient(90deg,#0ea5e9,#4f7bff)] shadow-[0_0_18px_rgba(14,165,233,0.35)]" />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-[#F8FAFC] p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Growth curve</p>
                  <svg viewBox="0 0 120 56" className="mt-2 h-14 w-full">
                    <polyline points="6,44 24,38 42,40 60,28 78,20 96,18 114,10" fill="none" stroke="#0ea5e9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="6" cy="44" r="2.5" fill="#0ea5e9" />
                    <circle cx="24" cy="38" r="2.5" fill="#0ea5e9" />
                    <circle cx="42" cy="40" r="2.5" fill="#0ea5e9" />
                    <circle cx="60" cy="28" r="2.5" fill="#0ea5e9" />
                    <circle cx="78" cy="20" r="2.5" fill="#0ea5e9" />
                    <circle cx="96" cy="18" r="2.5" fill="#0ea5e9" />
                    <circle cx="114" cy="10" r="2.5" fill="#0ea5e9" />
                  </svg>
                </div>
                <div className="rounded-2xl bg-[#F8FAFC] p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Radar summary</p>
                  <svg viewBox="0 0 120 56" className="mt-2 h-14 w-full">
                    <polygon points="60,7 100,26 88,48 32,48 20,26" fill="rgba(14,165,233,0.12)" stroke="#93c5fd" strokeWidth="1.5" />
                    <polygon points="60,13 89,28 79,42 41,42 30,28" fill="rgba(14,165,233,0.22)" stroke="#0ea5e9" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              <div className="rounded-[1.5rem] border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(248,251,255,0.96))] p-4 shadow-[0_18px_50px_rgba(15,23,42,0.06)] analysis-float">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  <span>Stability</span>
                  <span className="text-sky-600">86%</span>
                </div>
                <MiniBars values={[36, 44, 42, 56, 62, 68]} />
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.06)] analysis-float-soft">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Intent fit</p>
                    <p className="mt-1 text-xl font-semibold text-slate-950">AI Match</p>
                  </div>
                  <div className="rounded-2xl bg-[#F8FAFC] px-3 py-2 text-sky-600">
                    <Sparkles className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <div className="relative h-24 w-24">
                    <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                      <circle cx="50" cy="50" r="36" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                      <circle
                        cx="50"
                        cy="50"
                        r="36"
                        fill="none"
                        stroke="url(#trust-ring)"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray="226"
                        strokeDashoffset="18"
                      />
                      <defs>
                        <linearGradient id="trust-ring" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#38bdf8" />
                          <stop offset="100%" stopColor="#4f7bff" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Match</p>
                        <p className="text-2xl font-semibold text-slate-950">92%</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-slate-600">
                    <p>経験と市場ニーズの重なりが大きい領域を優先表示</p>
                    <p>面接で推すべき強みを自動で要約</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-[#F8FAFC] p-4 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Trend</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">市場価値の上昇トレンド</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-sky-500" />
                </div>
                <div className="mt-3 h-20 rounded-2xl bg-white p-3">
                  <svg viewBox="0 0 220 56" className="h-full w-full">
                    <path d="M0,46 C22,42 32,34 48,34 C64,34 76,24 92,24 C110,24 120,16 136,15 C154,14 172,20 188,12 C198,7 210,6 220,5" fill="none" stroke="#0ea5e9" strokeWidth="3.2" strokeLinecap="round" />
                    <path d="M0,46 C22,42 32,34 48,34 C64,34 76,24 92,24 C110,24 120,16 136,15 C154,14 172,20 188,12 C198,7 210,6 220,5 L220,56 L0,56 Z" fill="url(#trend-fill)" opacity="0.16" />
                    <defs>
                      <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#38bdf8" />
                        <stop offset="100%" stopColor="#ffffff" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Market value</p>
              <p className="mt-2 text-sm text-slate-600">今のあなたの市場価値を構造化して表示</p>
            </div>
            <div className="rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">AI match</p>
              <p className="mt-2 text-sm text-slate-600">強みと企業ニーズの一致度を定量化</p>
            </div>
            <div className="rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Decision layer</p>
              <p className="mt-2 text-sm text-slate-600">複数の判断材料を一画面で比較可能</p>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-[1.6rem] border border-slate-200 bg-white px-5 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">導入イメージ</p>
          <div className="marquee-shell mt-4 space-y-3 rounded-[1.2rem] border border-slate-200 bg-[#F8FAFC] p-3">
            {logoRows.map((row, rowIndex) => (
              <div key={`row-${rowIndex}`} className="overflow-hidden">
                <div className="marquee-track" style={{ animationDuration: rowIndex === 0 ? '28s' : '34s' }}>
                  <div className="marquee-row">
                    {row.map((logo, index) => (
                      <LogoCard key={`${logo}-${index}`} name={logo} />
                    ))}
                  </div>
                  <div className="marquee-row" aria-hidden="true">
                    {row.map((logo, index) => (
                      <LogoCard key={`${logo}-dup-${index}`} name={logo} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
  )
}

export default function TrustSection() {
  return (
    <section className="bg-white pb-20 pt-10">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <SectionReveal>
          <div className="rounded-[1.8rem] border border-slate-200 bg-[#F8FAFC] p-4 sm:p-6">
            <div className="grid gap-4 md:grid-cols-3">
              {trustStats.map((item) => (
                <MetricCard key={item.label} item={item} />
              ))}
            </div>

            <div className="mt-5">
              <TrustVisualization />
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}