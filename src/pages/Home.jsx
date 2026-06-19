import Header from '../components/Header.jsx'
import Hero from '../components/Hero.jsx'
import ProblemSection from '../components/ProblemSection.jsx'
import FeatureSection from '../components/FeatureSection.jsx'
import ComparisonSection from '../components/ComparisonSection.jsx'
import FlowSection from '../components/FlowSection.jsx'
import PricingSection from '../components/PricingSection.jsx'
import Footer from '../components/Footer.jsx'
import CTASection from '../components/CTASection.jsx'

export default function Home() {
  return (
    <div className="bg-slate-50 text-slate-950">
      <Header />
      <main>
        <Hero />
        <ProblemSection />
        <FeatureSection />
        <ComparisonSection />
        <FlowSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
