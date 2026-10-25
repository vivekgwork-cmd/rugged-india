import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowIcon } from '../components/Icons'
import { EASE, Magnetic, SplitText } from '../components/motion'
import { FEATURED_HANDLE } from '../data/products'

const SLIDES = [
  { wide: '/images/hero-1-wide.webp', tall: '/images/hero-1.webp', eyebrow: 'Denim Shirts — SS26', line1: 'Denim built', line2: 'for grit.', pos: '50% 40%' },
  { wide: '/images/hero-2-wide.webp', tall: '/images/hero-2.webp', eyebrow: 'Explorer Flannels', line1: 'Rugged gear', line2: 'for real men.', pos: '50% 35%' },
  { wide: '/images/hero-3-wide.webp', tall: '/images/hero-3.webp', eyebrow: 'Obsidian Edge', line1: 'Gear up.', line2: 'Stay rugged.', pos: '50% 30%' },
  { wide: '/images/hero-4-wide.webp', tall: '/images/hero-4.webp', eyebrow: 'The Rugged Collection', line1: 'Made for the', line2: 'fearless few.', pos: '50% 35%' },
]
const DURATION = 6500

export default function Hero({ ready }: { ready: boolean }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const ref = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-40%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const veil = useTransform(scrollYProgress, [0, 1], [0, 0.6])

  useEffect(() => {
    if (!ready || paused) return
    const t = setTimeout(() => setIndex((i) => (i + 1) % SLIDES.length), DURATION)
    return () => clearTimeout(t)
  }, [index, ready, paused])

  const slide = SLIDES[index]

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[600px] overflow-hidden bg-ink text-bone">
      <motion.div className="absolute inset-0" style={{ y: imgY }}>
        <AnimatePresence initial={false}>
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ clipPath: 'inset(0 0 0 100%)' }}
            animate={{ clipPath: 'inset(0 0 0 0%)' }}
            exit={{ opacity: 1, transition: { duration: 1.3 } }}
            transition={{ duration: 1.3, ease: [0.77, 0, 0.18, 1] }}
          >
            <motion.picture
              className="block h-full w-full"
              initial={{ scale: 1.3 }}
              animate={{ scale: ready ? 1.04 : 1.3 }}
              transition={{ duration: DURATION / 1000 + 2, ease: 'easeOut' }}
            >
              <source media="(min-width: 768px)" srcSet={slide.wide} />
              <img src={slide.tall} alt="" className="h-full w-full object-cover" style={{ objectPosition: slide.pos }} />
            </motion.picture>
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-ink/40" />
        <motion.div className="absolute inset-0 bg-ink" style={{ opacity: veil }} />
      </motion.div>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative mx-auto flex h-full max-w-[1600px] flex-col justify-end px-4 pb-28 md:px-8 md:pb-32"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div key={index} exit={{ opacity: 0, y: -30, transition: { duration: 0.45, ease: EASE } }}>
            <div className="overflow-hidden">
              <motion.p
                className="eyebrow flex items-center gap-3 text-bone/80"
                initial={{ y: '100%' }}
                animate={{ y: ready ? '0%' : '100%' }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
              >
                <span className="inline-block h-px w-10 bg-rust" />
                {slide.eyebrow}
              </motion.p>
            </div>
            <h1 className="display mt-5 text-[9.5vw] md:text-[6.4vw] xl:text-[96px]">
              <SplitText text={slide.line1} animate={ready} delay={0.4} />
              <br />
              <SplitText
                text={slide.line2}
                animate={ready}
                delay={0.55}
                className="text-sand"
              />
            </h1>
          </motion.div>
        </AnimatePresence>

        <motion.div
          className="mt-8 flex flex-wrap items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 20 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.9 }}
        >
          <Magnetic>
            <Link
              to={`/product/${FEATURED_HANDLE}`}
              className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-bone py-4 pl-7 pr-5 text-sm font-semibold text-ink"
            >
              <span className="absolute inset-0 translate-y-full rounded-full bg-rust transition-transform duration-500 ease-out-expo group-hover:translate-y-0" />
              <span className="relative transition-colors duration-500 group-hover:text-bone">Shop the collection</span>
              <span className="relative grid h-7 w-7 place-items-center rounded-full bg-ink text-bone transition-transform duration-500 ease-out-expo group-hover:rotate-[-45deg]">
                <ArrowIcon className="h-3.5 w-3.5" />
              </span>
            </Link>
          </Magnetic>
          <a href="#unstoppable" className="group text-sm font-medium text-bone/90">
            Explore categories
            <span className="block h-px origin-left scale-x-50 bg-current transition-transform duration-500 group-hover:scale-x-100" />
          </a>
        </motion.div>
      </motion.div>

      {/* Slide progress */}
      <motion.div
        className="absolute inset-x-0 bottom-0 mx-auto flex max-w-[1600px] items-end gap-3 px-4 pb-8 md:gap-6 md:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ delay: 1.1 }}
      >
        {SLIDES.map((s, i) => (
          <button key={i} onClick={() => setIndex(i)} className="group flex-1 text-left md:max-w-[220px]" aria-label={`Show slide ${i + 1}`}>
            <span className={`hidden text-[11px] font-medium transition-colors md:block ${i === index ? 'text-bone' : 'text-bone/45 group-hover:text-bone/80'}`}>
              0{i + 1} — {s.eyebrow}
            </span>
            <span className="mt-2 block h-[2px] overflow-hidden bg-bone/25">
              {i === index && (
                <motion.span
                  key={`${index}-${paused}`}
                  className="block h-full origin-left bg-bone"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: paused ? 0.02 : 1 }}
                  transition={{ duration: paused ? 0.3 : DURATION / 1000, ease: 'linear' }}
                />
              )}
              {i < index && <span className="block h-full bg-bone/70" />}
            </span>
          </button>
        ))}
        <div className="ml-auto hidden flex-col items-center gap-2 text-bone/60 md:flex">
          <span className="eyebrow !text-[10px] [writing-mode:vertical-rl]">Scroll</span>
          <span className="relative h-12 w-px overflow-hidden bg-bone/20">
            <motion.span
              className="absolute inset-x-0 top-0 h-1/2 bg-bone"
              animate={{ y: ['-100%', '200%'] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </span>
        </div>
      </motion.div>
    </section>
  )
}
