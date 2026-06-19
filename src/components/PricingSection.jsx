import PricingCard from './PricingCard.jsx'

const pricingPlans = [
  {
    title: 'Free',
    price: '0円',
    description: 'まずはトライアル。今の自分を見える化。',
    features: ['市場価値スコア（簡易）', 'おすすめ業界診断', '適職診断'],
  },
  {
    title: 'Standard',
    price: '550円/月',
    description: 'キャリアを具体化したい方に。',
    features: ['市場価値スコア（詳細）', 'おすすめ企業TOP10', '企業比較', 'AIキャリア相談（月5回）'],
    recommended: true,
  },
  {
    title: 'Pro',
    price: '1,498円/月',
    description: '戦略を実行まで支援するフル機能。',
    features: ['全機能利用可能', 'キャリアロードマップ', 'AIキャリア相談無制限', '職務経歴書作成', '面接対策', '転職戦略レポート'],
    featured: true,
  },
]

export default function PricingSection() {
  return (
    <section id="pricing" className="bg-slate-950 py-24 text-slate-100">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.28em] text-sky-400">Pricing</p>
          <h2 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
            転職前に、戦略をつくるサブスク。
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            まずは無料で現状を把握し、必要に応じて機能をアップグレードしていくモデルです。
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
