import { motion } from 'framer-motion'
import {
  BriefcaseBusiness,
  Building2,
  CircleDollarSign,
  MessageSquareMore,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionReveal from './SectionReveal.jsx'

const scoreBreakdown = [
  { label: '専門スキル', value: 82 },
  { label: '実務経験', value: 79 },
  { label: '市場ニーズ', value: 86 },
  { label: '成長余地', value: 77 },
]

const topCompanies = [
  { name: 'LayerX', fit: 92, range: '790-950万' },
  { name: 'SmartHR', fit: 89, range: '740-900万' },
  { name: 'mercari', fit: 86, range: '680-850万' },
]

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-white py-20 sm:py-24">
      <div className="absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_18%_8%,_rgba(14,165,233,0.16),_transparent_45%)]" />
      <div className="absolute right-0 top-24 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,_rgba(59,130,246,0.14),_transparent_60%)]" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
        <SectionReveal className="flex flex-col justify-center gap-8" y={18}>
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-sky-200 bg-[#EAF6FF] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
            <Sparkles className="h-3.5 w-3.5" />
            AIがあなたのキャリア戦略を設計
          </div>

          <div className="space-y-5">
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
              転職先を探す前に、
              <span className="block text-sky-600">あなたのキャリア戦略を設計する。</span>
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              経験・スキル・志向性をもとに、AIが市場価値、向いている業界・職種、企業候補、
              5年後のロードマップまで可視化。意思決定を構造化して、納得できる転職へ導きます。
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              className="inline-flex items-center justify-center rounded-full bg-sky-500 px-8 py-4 text-sm font-semibold text-white shadow-[0_20px_50px_rgba(14,165,233,0.25)] transition hover:-translate-y-0.5 hover:bg-sky-400"
              to="/assessment"
            >
              無料でキャリア分析を始める
            </Link>
            <div className="text-sm text-slate-500">3分で完了・会員登録不要・すべて無料</div>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200 bg-[#F8FAFC] p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-700 sm:gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2"><TrendingUp className="h-3.5 w-3.5 text-sky-500" />市場価値分析</span>
              <span className="text-sky-500">→</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2"><Building2 className="h-3.5 w-3.5 text-sky-500" />企業比較</span>
              <span className="text-sky-500">→</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2"><BriefcaseBusiness className="h-3.5 w-3.5 text-sky-500" />5年ロードマップ</span>
              <span className="text-sky-500">→</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2"><MessageSquareMore className="h-3.5 w-3.5 text-sky-500" />面接対策</span>
            </div>
          </div>
        </SectionReveal>

        <SectionReveal className="relative" delay={0.08} y={26}>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
            className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_36px_100px_rgba(15,23,42,0.1)] sm:p-6"
          >
            <div className="rounded-[1.4rem] border border-slate-200 bg-[#F8FAFC] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Career Strategist AI</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">診断結果ダッシュボード</p>
                </div>
                <span className="rounded-full bg-[#EAF6FF] px-3 py-1 text-xs font-semibold text-sky-700">Live Preview</span>
              </div>

              <div className="mt-4 grid gap-3 lg:grid-cols-5">
                <div className="rounded-xl border border-slate-200 bg-white p-4 lg:col-span-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">市場価値スコア</p>
                  <div className="mt-2 flex items-end justify-between">
                    <p className="text-4xl font-semibold text-slate-900">78</p>
                    <span className="rounded-full bg-[#EAF6FF] px-2.5 py-1 text-[11px] font-semibold text-sky-700">同年代上位18%</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-slate-200">
                    <motion.div
                      className="h-2 rounded-full bg-sky-500"
                      initial={{ width: 0 }}
                      animate={{ width: '78%' }}
                      transition={{ duration: 0.9, ease: 'easeOut', delay: 0.45 }}
                    />
                  </div>
                  <div className="mt-4 space-y-2">
                    {scoreBreakdown.map((item, index) => (
                      <div key={item.label} className="flex items-center gap-3 text-xs text-slate-600">
                        <span className="w-20 shrink-0">{item.label}</span>
                        <div className="h-1.5 flex-1 rounded-full bg-slate-100">
                          <motion.div
                            className="h-1.5 rounded-full bg-sky-400"
                            initial={{ width: 0 }}
                            animate={{ width: `${item.value}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 + index * 0.08 }}
                          />
                        </div>
                        <span className="w-8 text-right font-semibold text-slate-800">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 lg:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">あなたの強み</p>
                  <svg viewBox="0 0 200 180" className="mt-2 w-full">
                    <polygon points="100,20 165,58 145,136 55,136 35,58" fill="rgba(14,165,233,0.12)" stroke="#38bdf8" strokeWidth="2" />
                    <polygon points="100,34 150,62 132,124 68,124 50,62" fill="rgba(14,165,233,0.2)" stroke="#0ea5e9" strokeWidth="2" />
                    <text x="92" y="14" fontSize="10" fill="#64748b">戦略</text>
                    <text x="164" y="60" fontSize="10" fill="#64748b">推進</text>
                    <text x="142" y="149" fontSize="10" fill="#64748b">対話</text>
                    <text x="44" y="149" fontSize="10" fill="#64748b">分析</text>
                    <text x="20" y="60" fontSize="10" fill="#64748b">実装</text>
                  </svg>
                </div>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">向いている企業 TOP3</p>
                  <ul className="mt-3 space-y-2 text-xs text-slate-600">
                    {topCompanies.map((company) => (
                      <li key={company.name} className="flex items-center justify-between rounded-lg bg-[#F8FAFC] px-2.5 py-2">
                        <span>{company.name}</span>
                        <span className="font-semibold text-slate-900">{company.fit}%</span>
                        <span>{company.range}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">5年後の年収レンジ</p>
                  <div className="mt-3 rounded-lg bg-[#F8FAFC] p-3">
                    <svg viewBox="0 0 260 120" className="w-full">
                      <polyline points="12,96 74,84 136,67 198,44 248,28" fill="none" stroke="#0ea5e9" strokeWidth="3" />
                      <circle cx="12" cy="96" r="3" fill="#0ea5e9" />
                      <circle cx="74" cy="84" r="3" fill="#0ea5e9" />
                      <circle cx="136" cy="67" r="3" fill="#0ea5e9" />
                      <circle cx="198" cy="44" r="3" fill="#0ea5e9" />
                      <circle cx="248" cy="28" r="3" fill="#0ea5e9" />
                      <text x="4" y="112" fontSize="9" fill="#64748b">現在</text>
                      <text x="64" y="112" fontSize="9" fill="#64748b">1年</text>
                      <text x="126" y="112" fontSize="9" fill="#64748b">3年</text>
                      <text x="188" y="112" fontSize="9" fill="#64748b">5年</text>
                    </svg>
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#EAF6FF] px-2 py-1 text-[11px] font-semibold text-sky-700">
                    <CircleDollarSign className="h-3 w-3" />
                    想定: 820万〜980万
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </SectionReveal>
      </div>
    </section>
  )
}
