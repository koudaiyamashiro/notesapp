import { Link } from 'react-router-dom'

const productLinks = [
  { label: 'ホーム', href: '/' },
  { label: '診断開始', href: '/assessment' },
  { label: '診断結果', href: '/result' },
  { label: '企業比較', href: '/#comparison' },
  { label: '料金', href: '/#pricing' },
  { label: 'FAQ', href: '/#faq' },
]

const legalLinks = [
  { label: '利用規約', href: '/terms' },
  { label: 'プライバシーポリシー', href: '/privacy' },
  { label: '免責事項', href: '/disclaimer' },
  { label: '特定商取引法', href: '/commerce' },
]

const supportLinks = [
  { label: 'お問い合わせ', href: 'mailto:contact@career-strategist.ai', external: true },
  { label: 'FAQ', href: '/#faq' },
]

const companyLinks = [
  { label: '運営情報', href: '/commerce' },
  { label: '採用情報（準備中）', href: '#', external: true },
]

const snsLinks = [
  { label: 'GitHub', href: '#', external: true },
  { label: 'X', href: '#', external: true },
  { label: 'LinkedIn', href: '#', external: true },
]

function FooterLink({ label, href, external = false }) {
  if (external) {
    return (
      <a
        className="text-sm text-slate-600 transition hover:text-slate-900"
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noreferrer' : undefined}
      >
        {label}
      </a>
    )
  }

  return (
    <Link className="text-sm text-slate-600 transition hover:text-slate-900" to={href}>
      {label}
    </Link>
  )
}

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-700">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_1fr]">
          <div>
            <div className="inline-flex items-center gap-3">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500 text-base font-bold text-white">C</div>
              <p className="text-base font-semibold text-slate-900">Career Strategist AI</p>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-600">AIでキャリア意思決定を支援するサービス</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Product</p>
            <ul className="mt-5 space-y-2.5">
              {productLinks.map((item) => (
                <li key={item.label}><FooterLink label={item.label} href={item.href} /></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Legal</p>
            <ul className="mt-5 space-y-2.5">
              {legalLinks.map((item) => (
                <li key={item.label}><FooterLink label={item.label} href={item.href} /></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Support</p>
            <ul className="mt-5 space-y-2.5">
              {supportLinks.map((item) => (
                <li key={item.label}><FooterLink label={item.label} href={item.href} external={item.external} /></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Company</p>
            <ul className="mt-5 space-y-2.5">
              {companyLinks.map((item) => (
                <li key={item.label}><FooterLink label={item.label} href={item.href} external={item.external} /></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">SNS</p>
            <ul className="mt-5 space-y-2.5">
              {snsLinks.map((item) => (
                <li key={item.label}><FooterLink label={item.label} href={item.href} external={item.external} /></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500">
          <p>© 2026 Career Strategist AI</p>
          <p className="mt-1">All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
