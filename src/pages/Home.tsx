import { VelocityMarquee } from '../components/motion'
import { byCategory } from '../data/products'
import Categories from '../sections/Categories'
import DenimShowcase from '../sections/DenimShowcase'
import FitFinder from '../sections/FitFinder'
import Flannels from '../sections/Flannels'
import Hero from '../sections/Hero'
import Journal from '../sections/Journal'
import Manifesto from '../sections/Manifesto'
import ProductRail from '../sections/ProductRail'
import TeesScroller from '../sections/TeesScroller'

const STRIP = ['Denim built for grit', 'Made for the fearless few', '12oz battle-ready', 'Unyielding. Unstoppable.']

export default function Home({ ready }: { ready: boolean }) {
  return (
    <>
      <Hero ready={ready} />

      <div className="border-b border-ink/10 bg-rust py-5 text-bone md:py-7">
        <VelocityMarquee baseVelocity={-3}>
          {STRIP.map((s) => (
            <span key={s} className="display flex items-center text-3xl md:text-5xl">
              <span className="px-6 md:px-10">{s}</span>
              <svg viewBox="0 0 24 24" className="h-6 w-6 md:h-8 md:w-8" aria-hidden>
                <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" fill="currentColor" />
              </svg>
            </span>
          ))}
        </VelocityMarquee>
      </div>

      <Categories />
      <FitFinder />
      <ProductRail id="jeans" eyebrow="Premium men's jeans" title="The sleek" accent="denim edit" items={byCategory('jeans')} />
      <DenimShowcase />
      <Manifesto />
      <TeesScroller />
      <Flannels />
      <Journal />
    </>
  )
}
