import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowIcon } from '../components/Icons'
import { EASE, Reveal } from '../components/motion'

const FITS = [
  {
    id: 'tapered',
    tab: 'Tapered Fit',
    title: 'Sleek Tapered Fit Jeans',
    kicker: 'Forge your path in',
    copy: 'Shadow Trail tapered jeans — 12oz battle-ready denim engineered for tactical comfort and a commanding slim taper that dominates every terrain.',
    img: '/images/collage-tapered.webp',
    to: '/product/sleek-tapered-fit-men-s-jeans-shadow-trail',
    cta: 'Try now',
    meters: [
      { label: 'Thigh', value: 0.5 },
      { label: 'Knee', value: 0.4 },
      { label: 'Leg opening', value: 0.2 },
    ],
    leg: 'M38 6 L62 6 L64 60 L58 114 L52 114 L50 62 L48 114 L42 114 L36 60 Z',
  },
  {
    id: 'straight',
    tab: 'Straight Fit',
    title: 'Sleek Straight Fit Jeans',
    kicker: 'Stand firm in',
    copy: 'Steel Wave straight fit jeans — 12oz premium denim engineered for battle-tested durability and a classic cut that commands respect in any environment.',
    img: '/images/collage-straight.webp',
    to: '/product/the-rugged-steel-wave-straight-fit-jeans',
    cta: 'Shop now',
    meters: [
      { label: 'Thigh', value: 0.6 },
      { label: 'Knee', value: 0.6 },
      { label: 'Leg opening', value: 0.6 },
    ],
    leg: 'M36 6 L64 6 L65 60 L64 114 L53 114 L50 62 L47 114 L36 114 L35 60 Z',
  },
  {
    id: 'bootcut',
    tab: 'Bootcut',
    title: 'Sleek Bootcut Jeans',
    kicker: 'Ride out in',
    copy: 'Shadow Trail bootcut — a powerful fusion of classic western heritage and modern grit, with a subtle flare that sits clean over boots.',
    img: '/images/p/the-rugged-shadow-trail-bootcut-jeans-1.webp',
    to: '/product/the-rugged-shadow-trail-bootcut-jeans',
    cta: 'Shop now',
    meters: [
      { label: 'Thigh', value: 0.55 },
      { label: 'Knee', value: 0.45 },
      { label: 'Leg opening', value: 0.85 },
    ],
    leg: 'M37 6 L63 6 L64 60 L68 114 L54 114 L50 62 L46 114 L32 114 L36 60 Z',
  },
]

export default function FitFinder() {
  const [active, setActive] = useState(0)
  const fit = FITS[active]

  return (
    <section className="bg-sand/50 py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="flex flex-col items-center text-center">
          <Reveal><p className="eyebrow text-rust">Find your fit</p></Reveal>
          <Reveal delay={0.1}>
            <h2 className="display mt-4 text-4xl md:text-5xl">Three cuts. One code.</h2>
          </Reveal>

          <Reveal delay={0.2} className="mt-10">
            <div className="relative flex rounded-full bg-bone p-1.5" role="tablist">
              {FITS.map((f, i) => (
                <button
                  key={f.id}
                  role="tab"
                  aria-selected={active === i}
                  onClick={() => setActive(i)}
                  className={`relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-300 md:px-7 ${active === i ? 'text-bone' : 'text-ink/60 hover:text-ink'}`}
                >
                  {active === i && (
                    <motion.span layoutId="fit-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                  )}
                  <span className="relative">{f.tab}</span>
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="mt-14 grid items-center gap-10 md:mt-20 md:grid-cols-2 md:gap-16">
          <div className="relative aspect-square overflow-hidden bg-paper">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.img
                key={fit.id}
                src={fit.img}
                alt={fit.title}
                className="absolute inset-0 h-full w-full object-cover"
                initial={{ clipPath: 'inset(0 100% 0 0)', scale: 1.15 }}
                animate={{ clipPath: 'inset(0 0% 0 0)', scale: 1 }}
                exit={{ opacity: 0.6, transition: { duration: 1 } }}
                transition={{ duration: 1, ease: [0.77, 0, 0.18, 1] }}
              />
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={fit.id}
              initial="hidden"
              animate="show"
              exit="exit"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
                exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
              }}
            >
              {[
                <p key="k" className="text-lg font-medium text-smoke">{fit.kicker} The-Rugged</p>,
                <h3 key="t" className="display mt-2 text-3xl md:text-5xl">{fit.title}</h3>,
                <p key="c" className="mt-6 max-w-lg leading-relaxed text-ink/75">{fit.copy}</p>,
              ].map((el) => (
                <motion.div
                  key={el.key}
                  variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } }}
                >
                  {el}
                </motion.div>
              ))}

              <motion.div
                variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } }}
                className="mt-10 flex items-center gap-8 border-y border-ink/10 py-6"
              >
                <svg viewBox="0 0 100 120" className="h-28 w-20 shrink-0 text-ink" aria-hidden>
                  <motion.path
                    d={fit.leg}
                    fill="currentColor"
                    initial={{ pathLength: 0, fillOpacity: 0 }}
                    animate={{ pathLength: 1, fillOpacity: 1 }}
                    stroke="currentColor"
                    strokeWidth={1}
                    transition={{ duration: 1.1, ease: EASE }}
                  />
                </svg>
                <div className="flex-1 space-y-4">
                  {fit.meters.map((m, i) => (
                    <div key={m.label}>
                      <div className="flex justify-between text-[11px] font-semibold uppercase tracking-wider text-smoke">
                        <span>{m.label}</span>
                        <span>{m.value < 0.35 ? 'Slim' : m.value < 0.7 ? 'Regular' : 'Wide'}</span>
                      </div>
                      <div className="relative mt-2 h-[3px] bg-ink/10">
                        <motion.span
                          className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rust"
                          initial={{ left: '0%' }}
                          animate={{ left: `${m.value * 100}%` }}
                          transition={{ type: 'spring', stiffness: 120, damping: 16, delay: 0.3 + i * 0.08 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } }}>
                <Link
                  to={fit.to}
                  className="group mt-8 inline-flex items-center gap-3 rounded-full bg-ink py-4 pl-7 pr-5 text-sm font-semibold text-bone transition-colors hover:bg-rust"
                >
                  {fit.cta}
                  <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
