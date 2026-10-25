import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useLayoutEffect, useRef, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { byCategory } from '../data/products'

/**
 * Pinned section: vertical scroll drives the tee lineup sideways.
 * Section height is derived from the track overflow so the pin lasts exactly as long as needed.
 */
export default function TeesScroller() {
  const tees = byCategory('tees')
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [distance, setDistance] = useState(0)

  useLayoutEffect(() => {
    const measure = () => {
      if (track.current) setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(track.current!)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })
  const x = useTransform(smooth, [0, 1], [0, -distance])
  const titleX = useTransform(smooth, [0, 1], ['0%', '-30%'])
  const bar = useTransform(smooth, [0, 1], [0, 1])

  return (
    <section id="tees" ref={section} className="relative bg-bone" style={{ height: `calc(100vh + ${distance}px)` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <motion.p
          style={{ x: titleX }}
          className="display pointer-events-none absolute left-4 top-[14vh] whitespace-nowrap text-[13vw] text-ink/[0.05] md:top-[10vh] md:text-[10vw]"
          aria-hidden
        >
          Unleash the rugged side
        </motion.p>

        <motion.div ref={track} style={{ x }} className="relative flex items-center gap-5 px-4 md:gap-8 md:px-8">
          <div className="w-[78vw] shrink-0 pr-4 sm:w-[48vw] md:w-[34vw] lg:w-[28vw]">
            <p className="eyebrow text-rust">Signature tees</p>
            <h2 className="display mt-4 text-4xl md:text-6xl">
              Unleash
              <br />
              <span className="text-rust">the rugged</span>
              <br />
              side
            </h2>
            <p className="mt-6 max-w-xs text-smoke">Heavyweight 240 GSM cotton. Ultra-soft bio-wash. Fearless chest print. Built for unyielding strength.</p>
            <p className="eyebrow mt-8 flex items-center gap-3 text-smoke">
              Scroll
              <motion.span animate={{ x: [0, 8, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>→</motion.span>
            </p>
          </div>
          {tees.map((p, i) => (
            <ProductCard key={p.handle} product={p} index={i} className={`w-[70vw] shrink-0 sm:w-[42vw] md:w-[28vw] lg:w-[22vw] ${i % 2 ? 'md:translate-y-16' : ''}`} />
          ))}
          <div className="w-[10vw] shrink-0" />
        </motion.div>

        <div className="absolute inset-x-4 bottom-8 h-px bg-ink/10 md:inset-x-8">
          <motion.div className="h-[2px] origin-left -translate-y-px bg-ink" style={{ scaleX: bar }} />
        </div>
      </div>
    </section>
  )
}
