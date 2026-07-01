import { ShieldCheck, Sparkles, UsersRound } from 'lucide-react'
import CountUpNumber from './CountUpNumber.jsx'
import SectionReveal from './SectionReveal.jsx'

const trustStats = [
  { label: '診断実施', value: 18000, suffix: '+', helper: '累計セッション', icon: UsersRound },
  { label: '利用満足度', value: 95, suffix: '%', helper: 'アンケート回答ベース', icon: Sparkles },
  { label: '診断時間', value: 3, suffix: '分', helper: '平均所要時間', icon: ShieldCheck },
]

const logoGroups = [
  { name: 'mercari', mark: 'me', tone: 'sky' },
  { name: 'SmartHR', mark: 'SH', tone: 'navy' },
  { name: 'LayerX', mark: 'LX', tone: 'slate' },
  { name: 'freee', mark: 'fr', tone: 'ice' },
  { name: 'MIXI', mark: 'MX', tone: 'sky' },
  { name: 'Money Forward', mark: 'MF', tone: 'navy' },
  { name: 'Recruit', mark: 'RC', tone: 'ice' },
  { name: 'Sansan', mark: 'SS', tone: 'slate' },
  { name: 'Cybozu', mark: 'CY', tone: 'sky' },
  { name: 'DeNA', mark: 'DN', tone: 'navy' },
  { name: 'LINE Yahoo', mark: 'LY', tone: 'slate' },
  { name: 'CyberAgent', mark: 'CA', tone: 'ice' },
  { name: 'GMO', mark: 'GM', tone: 'sky' },
  { name: 'Rakuten', mark: 'RK', tone: 'navy' },
  { name: 'PayPay', mark: 'PP', tone: 'ice' },
  { name: 'Ubie', mark: 'UB', tone: 'slate' },
  { name: 'Visional', mark: 'VS', tone: 'sky' },
  { name: 'SmartNews', mark: 'SN', tone: 'navy' },
  { name: 'PKSHA', mark: 'PK', tone: 'slate' },
  { name: 'Preferred Networks', mark: 'PN', tone: 'ice' },
]

const marqueeLogos = [...logoGroups, ...logoGroups]

function toneClass(tone) {
  if (tone === 'navy') return 'border-sky-200/80 bg-[linear-gradient(135deg,#eff6ff,#ffffff)] text-slate-900'
  if (tone === 'ice') return 'border-slate-200 bg-[linear-gradient(135deg,#f8fafc,#eef6ff)] text-slate-800'
  if (tone === 'slate') return 'border-slate-200 bg-[linear-gradient(135deg,#ffffff,#f8fafc)] text-slate-900'
  return 'border-sky-200 bg-[linear-gradient(135deg,#f0f9ff,#ffffff)] text-slate-900'
}

function markClass(tone) {
  if (tone === 'navy') return 'bg-slate-900 text-white shadow-[0_10px_20px_rgba(15,23,42,0.14)]'
  if (tone === 'ice') return 'bg-white text-sky-700 border border-sky-100'
  if (tone === 'slate') return 'bg-slate-100 text-slate-700'
  return 'bg-sky-500 text-white shadow-[0_10px_24px_rgba(14,165,233,0.2)]'
}

export default function TrustSection() {
  return (
    <section className="bg-white pb-20 pt-10">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <SectionReveal>
          <div className="rounded-[1.8rem] border border-slate-200 bg-[linear-gradient(180deg,#f8fbff_0%,#f8fafc_100%)] p-4 sm:p-6">
            <div className="grid gap-4 md:grid-cols-3">
              {trustStats.map((item, index) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.label}
                    className={`rounded-[1.2rem] border border-slate-200 bg-white px-5 py-4 ${index === 2 ? 'md:border-l-slate-200' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
                      <Icon className="h-4 w-4 text-sky-500" />
                    </div>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">
                      <CountUpNumber value={item.value} suffix={item.suffix} />
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{item.helper}</p>
                  </div>
                )
              })}
            </div>

            <div className="mt-5 rounded-[1.4rem] border border-slate-200 bg-white px-5 py-5 shadow-[0_18px_40px_rgba(15,23,42,0.04)]">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">注目企業イメージ</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">SaaS・AI・事業開発領域で比較対象になりやすい企業群を、ロゴ風のビジュアルで一覧化しています。</p>
                </div>
                <p className="text-xs font-medium text-slate-500">Hover to pause</p>
              </div>

              <div className="logo-marquee mt-5">
                <div className="logo-marquee-track gap-3 pr-3">
                  {marqueeLogos.map((logo, index) => (
                    <div
                      key={`${logo.name}-${index}`}
                      className={`inline-flex min-w-[12rem] items-center gap-3 rounded-2xl border px-4 py-3 ${toneClass(logo.tone)}`}
                    >
                      <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[11px] font-semibold uppercase tracking-[0.16em] ${markClass(logo.tone)}`}>
                        {logo.mark}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{logo.name}</p>
                        <p className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-slate-500">Enterprise Signal</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}
