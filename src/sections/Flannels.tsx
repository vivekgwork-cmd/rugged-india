import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowIcon } from '../components/Icons'
import { EASE, Reveal, SplitText } from '../components/motion'
import { byCategory, discount, inr } from '../data/products'

const LOOKS: Record<string, string> = {
  'Desert Dune': '/images/flannel-desert.webp',
  'Forest Canopy': '/images/flannel-forest.webp',
  'Timberland Rust': '/images/flannel-rust.webp',
}

export default function Flannels() {
  const flannels = byCategory('flannels')
  const [active, setActive] = useState(0)
  const banner = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: banner, offset: ['start end', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['-15%', '15%'])
  const clip = useTransform(scrollYProgress, [0, 0.35], ['inset(12% 8% 12% 8%)', 'inset(0% 0% 0% 0%)'])
  const p = flannels[active]

  return (
    <section id="flannels" className="pb-24 md:pb-36">
      {/* Expanding cinematic banner */}
      <div ref={banner} className="relative h-[80vh] min-h-[520px]">
        <motion.div style={{ clipPath: clip }} className="absolute inset-0 overflow-hidden bg-ink">
          <motion.img
            src="/images/heading-banner.webp"
            alt=""
            loading="lazy"
            style={{ y: bgY, scale: 1.3 }}
            className="h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/10" />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1600px] px-4 pb-12 text-bone md:px-8 md:pb-16">
            <Reveal><p className="eyebrow text-sand">Hand picked</p></Reveal>
            <h2 className="display mt-4 max-w-4xl text-4xl md:text-6xl">
              <SplitText text="Unyielding warmth." />
              <br />
              <SplitText text="Relentless style." delay={0.15} className="text-sand" />
            </h2>
          </div>
        </motion.div>
      </div>

      {/* Hover-to-preview list */}
      <div className="mx-auto mt-20 grid max-w-[1600px] gap-12 px-4 md:mt-28 md:grid-cols-[1.1fr_1fr] md:gap-20 md:px-8">
        <div>
          <Reveal><p className="eyebrow text-rust">The-Rugged Flannel Collection</p></Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-md leading-relaxed text-smoke">
              Engineered for men who demand rugged durability, unparalleled comfort, and timeless masculine design in every stitch — your ultimate flannel shirts for every season and mission.
            </p>
          </Reveal>

          <ul className="mt-12 border-t border-ink/15">
            {flannels.map((f, i) => (
              <li key={f.handle} className="border-b border-ink/15">
                <Link
                  to={`/product/${f.handle}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="group relative flex items-center justify-between overflow-hidden py-6 md:py-8"
                >
                  <motion.span
                    className="absolute inset-0 origin-bottom bg-ink"
                    initial={false}
                    animate={{ scaleY: active === i ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                  />
                  <span className={`relative flex items-baseline gap-4 transition-colors duration-500 md:gap-6 ${active === i ? 'pl-4 text-bone md:pl-6' : 'pl-0'}`} style={{ transitionProperty: 'color, padding' }}>
                    <span className="text-xs tabular-nums opacity-50">0{i + 1}</span>
                    <span className="display text-2xl md:text-4xl">{f.colorway}</span>
                  </span>
                  <span className={`relative flex items-center gap-4 pr-4 transition-colors duration-500 md:pr-6 ${active === i ? 'text-bone' : ''}`}>
                    <span className="hidden text-sm sm:inline">{inr(f.price)}</span>
                    <ArrowIcon className={`h-6 w-6 transition-transform duration-500 ${active === i ? '-rotate-45' : ''}`} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative aspect-[4/5] overflow-hidden bg-paper md:sticky md:top-28 md:aspect-[3/4] md:self-start">
          <AnimatePresence initial={false}>
            <motion.img
              key={p?.handle}
              src={p ? LOOKS[p.colorway] ?? p.images[0] : ''}
              alt={p ? `${p.name} — ${p.colorway}` : ''}
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ clipPath: 'inset(100% 0 0 0)', scale: 1.15 }}
              animate={{ clipPath: 'inset(0% 0 0 0)', scale: 1 }}
              exit={{ opacity: 1, transition: { duration: 0.9 } }}
              transition={{ duration: 0.9, ease: [0.77, 0, 0.18, 1] }}
            />
          </AnimatePresence>
          {p && discount(p) > 0 && (
            <motion.span
              key={`b-${p.handle}`}
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: -12 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.4 }}
              className="display absolute right-5 top-5 grid h-20 w-20 place-items-center rounded-full bg-rust text-center text-base leading-none text-bone"
            >
              -{discount(p)}%
            </motion.span>
          )}
        </div>
      </div>
    </section>
  )
}
