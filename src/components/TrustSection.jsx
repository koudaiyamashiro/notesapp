import { BarChart3, Clock3, Sparkles, TrendingUp, UsersRound } from 'lucide-react'
import CountUpNumber from './CountUpNumber.jsx'
import SectionReveal from './SectionReveal.jsx'

const stats = [
  { label: '診断実施', value: 18000, suffix: '+', helper: '累計セッション', trend: '前月比 +23%', icon: UsersRound, graph: 'bars' },
  { label: '利用満足度', value: 95, suffix: '%', helper: 'アンケート回答ベース', trend: '高評価を維持中', icon: Sparkles, graph: 'line' },
  { label: '診断時間', value: 3, suffix: '分', helper: '平均所要時間', trend: '時間効率が高い', icon: Clock3, graph: 'wave' },
]

const logos = [
  { name: 'mercari', tone: 'mercari' },
  { name: 'SmartHR', tone: 'smarthr' },
  { name: 'LayerX', tone: 'layerx' },
  { name: 'freee', tone: 'freee' },
  { name: 'MIXI', tone: 'mixi' },
  { name: 'Money Forward', tone: 'moneyforward' },
  { name: 'Recruit', tone: 'recruit' },
  { name: 'Sansan', tone: 'sansan' },
  { name: 'Cybozu', tone: 'cybozu' },
  { name: 'DeNA', tone: 'dena' },
  { name: 'UZABASE', tone: 'uzabase' },
  { name: 'HENNGE', tone: 'hennge' },
  { name: 'Raksul', tone: 'raksul' },
  { name: 'Chatwork', tone: 'chatwork' },
]

function BarsGraph({ values }) {
  return (
    <div className="flex h-10 items-end gap-1.5">
      {values.map((value, index) => (
        <span
          key={`${value}-${index}`}
          className="w-2.5 rounded-full bg-[linear-gradient(180deg,rgba(191,219,254,0.35),rgba(14,165,233,0.96))]"
          style={{ height: `${Math.max(10, value)}px` }}
        />
      ))}
    </div>
  )
}

function LineGraph({ values }) {
  const points = values.map((value, index) => `${index * 14},${68 - value}`).join(' ')
  return (
    <svg viewBox="0 0 100 72" className="h-12 w-full">
      <defs>
        <linearGradient id="trust-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>
      </defs>
      <polyline points={points} fill="none" stroke="url(#trust-line)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      {values.map((value, index) => (
        <circle key={`${value}-${index}`} cx={index * 14} cy={68 - value} r="1.8" fill="#0ea5e9" />
      ))}
    </svg>
  )
}

function WaveGraph({ values }) {
  const points = values.map((value, index) => `${index * 13},${60 - value}`).join(' ')
  return (
    <svg viewBox="0 0 100 60" className="h-12 w-full">
      <path d={`M0 ${60 - values[0]} ${points} L100 60 L0 60 Z`} fill="rgba(96,165,250,0.12)" />
      <polyline points={points} fill="none" stroke="#60a5fa" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LogoBadge({ item }) {
  const toneClass = {
    mercari: 'text-slate-950',
    smarthr: 'text-cyan-500',
    layerx: 'text-slate-950',
    freee: 'text-sky-600 italic',
    mixi: 'text-slate-950',
    moneyforward: 'text-slate-950',
    recruit: 'text-blue-700',
    sansan: 'text-slate-950',
    cybozu: 'text-sky-400',
    dena: 'text-slate-950',
    uzabase: 'text-slate-950',
    hennge: 'text-slate-950',
    raksul: 'text-slate-950',
    chatwork: 'text-rose-500',
  }[item.tone]

  const dotClass = {
    mercari: 'bg-[#ea352d]',
    smarthr: 'bg-[#00c4cc]',
    layerx: 'bg-[#0f172a]',
    freee: 'bg-[#00a4de]',
    mixi: 'bg-[#111827]',
    moneyforward: 'bg-[#111827]',
    recruit: 'bg-[#2f66f5]',
    sansan: 'bg-[#111827]',
    cybozu: 'bg-[#7bc4ff]',
    dena: 'bg-[#111827]',
    uzabase: 'bg-[#111827]',
    hennge: 'bg-[#111827]',
    raksul: 'bg-[#111827]',
    chatwork: 'bg-[#f87f00]',
  }[item.tone]

  return (
    <div className="inline-flex min-w-[148px] items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_10px_28px_rgba(15,23,42,0.04)]">
      <span className={`h-3.5 w-3.5 shrink-0 rounded-full ${dotClass}`} />
      <span className={`text-sm font-semibold tracking-[-0.02em] ${toneClass} ${item.tone === 'freee' ? 'font-serif italic' : ''}`}>{item.name}</span>
    </div>
  )
}

function StatCard({ item }) {
  const Icon = item.icon

  return (
    <article className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-[0_14px_36px_rgba(15,23,42,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
          <p className="mt-2 text-[2.2rem] font-semibold tracking-tight text-slate-950">
            <CountUpNumber value={item.value} suffix={item.suffix} />
          </p>
          <p className="mt-1 text-xs text-slate-500">{item.helper}</p>
        </div>
        <div className="rounded-2xl bg-[#EAF6FF] p-3 text-sky-600">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-4 rounded-[16px] bg-[#F8FAFC] px-3 py-3">
        <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          <span>TREND</span>
          <span className="text-sky-700">{item.trend}</span>
        </div>
        <div className="mt-2">{item.graph === 'bars' ? <BarsGraph values={[18, 26, 34, 42, 52, 64, 76]} /> : item.graph === 'line' ? <LineGraph values={[24, 30, 36, 42, 38, 45, 54, 62]} /> : <WaveGraph values={[12, 16, 14, 20, 16, 22, 18, 28]} />}</div>
      </div>
    </article>
  )
}

function AnalysisVisual() {
  return (
    <div className="relative h-full overflow-hidden rounded-[30px] border border-sky-100 bg-[radial-gradient(circle_at_20%_10%,rgba(14,165,233,0.15),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(47,86,255,0.12),transparent_28%),linear-gradient(180deg,#ffffff,#f7fbff)] p-5 shadow-[0_26px_84px_rgba(15,23,42,0.08)]">
      <div className="absolute inset-x-8 bottom-8 h-24 rounded-[28px] bg-[linear-gradient(180deg,rgba(255,255,255,0.76),rgba(226,239,255,0.84))] shadow-[0_22px_50px_rgba(14,165,233,0.12)]" />
      <div className="absolute inset-x-12 bottom-11 h-18 rounded-[26px] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(240,246,255,0.98))] shadow-[0_14px_30px_rgba(15,23,42,0.06)]" />
      <div className="absolute inset-x-16 bottom-14 h-14 rounded-[24px] bg-[linear-gradient(180deg,#ffffff,#eef6ff)] shadow-[0_12px_28px_rgba(15,23,42,0.06)]" />
      <div className="absolute left-[50%] bottom-20 h-4 w-[220px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(47,86,255,0.22),transparent_70%)] blur-md" />

      <div className="absolute left-5 top-8 h-[152px] w-[150px] rounded-[22px] border border-slate-200/80 bg-white/72 p-3 backdrop-blur-sm shadow-[0_14px_38px_rgba(15,23,42,0.06)]">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">市場価値スコア</p>
            <p className="mt-2 text-[2.2rem] font-semibold tracking-tight text-slate-950">72<span className="ml-1 text-base text-slate-400">/100</span></p>
          </div>
          <span className="rounded-full bg-[#EAF6FF] px-2.5 py-1 text-[11px] font-semibold text-sky-700">+23%</span>
        </div>
        <div className="mt-3 h-2.5 rounded-full bg-slate-200/80">
          <div className="h-2.5 w-[72%] rounded-full bg-[linear-gradient(90deg,#60a5fa,#0ea5e9)]" />
        </div>
        <div className="mt-4 flex items-end gap-1.5">
          {[18, 26, 22, 36, 44, 52].map((bar) => (
            <span key={bar} className="flex-1 rounded-t-full bg-[linear-gradient(180deg,rgba(191,219,254,0.6),rgba(14,165,233,0.92))]" style={{ height: `${bar}px` }} />
          ))}
        </div>
      </div>

      <div className="absolute left-[108px] top-5 h-[128px] w-[112px] rounded-[22px] border border-slate-200/80 bg-white/72 p-3 backdrop-blur-sm shadow-[0_14px_38px_rgba(15,23,42,0.06)]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">AIマッチ度</p>
        <div className="mt-2 flex items-center justify-center">
          <div className="relative h-16 w-16">
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
              <circle cx="50" cy="50" r="36" fill="none" stroke="#dbeafe" strokeWidth="10" />
              <circle cx="50" cy="50" r="36" fill="none" stroke="#0ea5e9" strokeWidth="10" strokeLinecap="round" strokeDasharray="226" strokeDashoffset="18" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-center">
              <div>
                <p className="text-[9px] uppercase tracking-[0.14em] text-slate-500">match</p>
                <p className="text-lg font-semibold text-slate-950">92%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute right-4 top-8 h-[164px] w-[154px] rounded-[24px] border border-slate-200/80 bg-white/76 p-3 backdrop-blur-sm shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">上昇カーブ</p>
          <TrendingUp className="h-4 w-4 text-sky-600" />
        </div>
        <svg viewBox="0 0 150 72" className="mt-3 h-20 w-full">
          <defs>
            <linearGradient id="trust-rise" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#93c5fd" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
          </defs>
          <path d="M6,58 C20,52 30,48 44,46 C58,44 66,36 78,32 C90,28 102,30 116,22 C128,16 136,12 144,8" fill="none" stroke="url(#trust-rise)" strokeWidth="3" strokeLinecap="round" />
          <path d="M6,58 C20,52 30,48 44,46 C58,44 66,36 78,32 C90,28 102,30 116,22 C128,16 136,12 144,8 L144,72 L6,72 Z" fill="rgba(14,165,233,0.12)" />
        </svg>
      </div>

      <div className="absolute right-10 bottom-9 h-[118px] w-[118px] rounded-full border border-slate-200/80 bg-white/78 p-3 shadow-[0_16px_40px_rgba(15,23,42,0.06)] backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">棒グラフ</p>
          <BarChart3 className="h-4 w-4 text-sky-600" />
        </div>
        <div className="mt-3 flex h-16 items-end justify-center gap-2">
          {[42, 58, 49, 66].map((bar) => (
            <span key={bar} className="w-4 rounded-t-full bg-[linear-gradient(180deg,rgba(191,219,254,0.6),rgba(14,165,233,0.94))]" style={{ height: `${bar}px` }} />
          ))}
        </div>
      </div>

      <div className="absolute left-[44%] top-[42%] h-[96px] w-[96px] rounded-full border border-sky-100 bg-white/80 p-2 shadow-[0_14px_36px_rgba(15,23,42,0.06)] backdrop-blur-sm">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r="34" fill="none" stroke="#dbeafe" strokeWidth="10" />
          <circle cx="50" cy="50" r="34" fill="none" stroke="#60a5fa" strokeWidth="10" strokeLinecap="round" strokeDasharray="214" strokeDashoffset="44" />
        </svg>
      </div>
    </div>
  )
}

function LogoMarquee() {
  const track = [...logos, ...logos]

  return (
    <div className="logo-marquee rounded-[20px] border border-slate-200 bg-white px-4 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">導入企業（一部）</p>
      <div className="mt-4 overflow-hidden rounded-[18px] bg-[#F8FAFC] px-3 py-3">
        <div className="logo-track">
          {track.map((item, index) => (
            <LogoBadge key={`${item.name}-${index}`} item={item} />
          ))}
        </div>
      </div>
      <div className="mt-4 flex justify-center gap-2">
        {[0, 1, 2, 3, 4, 5, 6].map((dot) => (
          <span key={dot} className={`h-1.5 w-1.5 rounded-full ${dot === 2 ? 'bg-sky-500' : 'bg-slate-200'}`} />
        ))}
      </div>
    </div>
  )
}

export default function TrustSection() {
  return (
    <section className="bg-white py-10 sm:py-12">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff,#f8fbff)] p-4 shadow-[0_26px_90px_rgba(15,23,42,0.08)] sm:p-5">
            <div className="grid gap-4 lg:grid-cols-[1.02fr_1.12fr] lg:gap-5">
              <div className="min-h-[380px] lg:min-h-[430px]">
                <AnalysisVisual />
              </div>

              <div className="grid gap-4">
                <div className="grid gap-4 md:grid-cols-3">
                  {stats.map((item) => (
                    <StatCard key={item.label} item={item} />
                  ))}
                </div>

                <LogoMarquee />
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}