export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-200">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          <div>
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-sky-500 text-lg font-bold text-white">C</div>
            <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
              「求人を探す」から「キャリアを設計する」へ。AIがあなた専属のキャリア戦略コンサルになります。
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">プロダクト</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              <li>機能</li>
              <li>料金</li>
              <li>デモ</li>
              <li>導入事例</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">リソース</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              <li>キャリアガイド</li>
              <li>ブログ</li>
              <li>ヘルプセンター</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">会社情報</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              <li>運営会社</li>
              <li>採用情報</li>
              <li>お問い合わせ</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8 text-sm text-slate-500">
          © 2026 Career Strategist AI. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
