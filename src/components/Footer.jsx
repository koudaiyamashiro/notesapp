import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[#F8FAFC] text-slate-700">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          <div>
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-sky-500 text-lg font-bold text-white">C</div>
            <p className="mt-5 max-w-md text-sm leading-7 text-slate-600">
              転職活動の前に、戦略をつくるSaaS。AIがあなたのキャリア設計に寄り添います。
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">プロダクト</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              <li>機能</li>
              <li>料金</li>
              <li>比較</li>
              <li>診断</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">リソース</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              <li>キャリアガイド</li>
              <li>ブログ</li>
              <li>ヘルプ</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">会社情報</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              <li><Link className="transition hover:text-slate-900" to="/terms">利用規約</Link></li>
              <li><Link className="transition hover:text-slate-900" to="/privacy">プライバシーポリシー</Link></li>
              <li><Link className="transition hover:text-slate-900" to="/disclaimer">免責事項</Link></li>
              <li><Link className="transition hover:text-slate-900" to="/commerce">特定商取引法に基づく表記</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-200 pt-8 text-sm text-slate-500">
          © 2026 Career Strategist AI. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
