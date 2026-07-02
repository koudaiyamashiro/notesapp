import Header from '../Header.jsx'
import Footer from '../Footer.jsx'

function ClauseSection({ index, title, paragraphs = [], bullets = [] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
        第{index}条 {title}
      </h2>

      <div className="mt-4 space-y-3 text-sm leading-7 text-slate-700 sm:text-base">
        {paragraphs.map((text) => (
          <p key={text}>{text}</p>
        ))}
      </div>

      {bullets.length > 0 && (
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-7 text-slate-700 sm:text-base">
          {bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      )}
    </section>
  )
}

export default function LegalPageLayout({
  title,
  subtitle,
  revisedAt,
  sections,
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Header />

      <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
        <header className="rounded-3xl border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-slate-100 p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">Legal</p>
          <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">{title}</h1>
          <p className="mt-4 text-sm leading-7 text-slate-700 sm:text-base">{subtitle}</p>
          <p className="mt-4 text-xs text-slate-500">最終改定日: {revisedAt}</p>
        </header>

        <div className="mt-8 space-y-5 sm:mt-10">
          {sections.map((section, idx) => (
            <ClauseSection
              key={section.title}
              index={idx + 1}
              title={section.title}
              paragraphs={section.paragraphs}
              bullets={section.bullets}
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
