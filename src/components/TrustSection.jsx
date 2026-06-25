import { Building2, ShieldCheck, Sparkles, UsersRound } from 'lucide-react'
import CountUpNumber from './CountUpNumber.jsx'
import SectionReveal from './SectionReveal.jsx'

const trustStats = [
  { label: '診断実施', value: 18000, suffix: '+', helper: '累計セッション', icon: UsersRound },
  { label: '利用満足度', value: 95, suffix: '%', helper: 'アンケート回答ベース', icon: Sparkles },
  { label: '診断時間', value: 3, suffix: '分', helper: '平均所要時間', icon: ShieldCheck },
]

const logoNames = ['mercari', 'SmartHR', 'LayerX', 'freee', 'MIXI', 'Money Forward']

export default function TrustSection() {
  return (
    <section className="bg-white pb-20 pt-10">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <SectionReveal>
          <div className="rounded-[1.8rem] border border-slate-200 bg-[#F8FAFC] p-4 sm:p-6">
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

            <div className="mt-5 rounded-[1.2rem] border border-slate-200 bg-white px-5 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">導入イメージ（ダミー）</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {logoNames.map((logo) => (
                  <div key={logo} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-sm font-semibold text-slate-600">
                    <Building2 className="h-3.5 w-3.5 text-sky-500" />
                    {logo}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}
