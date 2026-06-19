import PricingCard from './PricingCard.jsx'

const pricingPlans = [
  {
    title: 'Free',
    price: '¥0',
    description: 'まずは現在地を知る',
    features: ['簡易キャリア診断', '市場価値スコア（概算）'],
  },
  {
    title: 'Standard',
    price: '¥980',
    description: '自己分析を深める',
    features: ['市場価値スコア（詳細）', '向いている業界診断', '職種診断'],
  },
  {
    title: 'Pro',
    price: '¥2,980',
    description: '戦略を実行に移す',
    features: ['企業比較レポート', 'キャリアロードマップ', '職務経歴書 自動生成', 'AIキャリア相談 無制限'],
    featured: true,
  },
]

export default function PricingSection() {
  return (
    <section id="pricing" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.28em] text-sky-500">Pricing</p>
          <h2 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            現在地を知るのは、無料から。
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            戦略を深めたくなったら、必要な機能だけアップグレード。いつでも変更できます。
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.title} {...plan} />
          ))}
        </div>
      </div>
    </section>
  )
}
