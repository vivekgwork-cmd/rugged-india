import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowIcon } from '../components/Icons'
import { EASE, Reveal, SplitText, useMediaQuery } from '../components/motion'
import { byCategory, FEATURED_HANDLE } from '../data/products'

const TILES = [
  { title: 'Rugged Denim Shirt', sub: '3 washes', img: '/images/cat-shirts.webp', to: `/product/${byCategory('shirts')[0]?.handle}`, shift: [40, -40] },
  { title: 'Forged Black Jeans', sub: 'Tapered · Straight · Bootcut', img: '/images/cat-jeans.webp', to: `/product/${FEATURED_HANDLE}`, shift: [140, -60] },
  { title: 'Ironclad Crew Tee', sub: '240 GSM cotton', img: '/images/cat-tees.webp', to: `/product/${byCategory('tees')[0]?.handle}`, shift: [70, -20] },
]

function Tile({ t, i, progress }: { t: (typeof TILES)[number]; i: number; progress: MotionValue<number> }) {
  // Each column drifts at its own pace for a staggered, layered feel
  const desktop = useMediaQuery('(min-width: 768px)')
  const y = useTransform(progress, [0, 1], desktop ? t.shift : [0, 0])
  return (
    <motion.div style={{ y }} className={i === 1 ? 'md:mt-24' : ''}>
      <Link to={t.to} className="group block">
        <motion.div
          className="relative aspect-[4/5] overflow-hidden bg-paper"
          initial={{ clipPath: 'inset(100% 0 0 0)' }}
          whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 1.2, ease: [0.77, 0, 0.18, 1], delay: i * 0.12 }}
        >
          <motion.img
            src={t.img}
            alt={t.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.07]"
            initial={{ scale: 1.25 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: EASE, delay: i * 0.12 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
          <span className="absolute bottom-4 right-4 grid h-12 w-12 scale-0 place-items-center rounded-full bg-bone text-ink transition-transform duration-500 ease-out-expo group-hover:scale-100">
            <ArrowIcon className="h-5 w-5 -rotate-45" />
          </span>
          <span className="display absolute left-4 top-4 text-sm text-ink/30">0{i + 1}</span>
        </motion.div>
        <div className="mt-4 flex items-end justify-between gap-4">
          <div>
            <h3 className="display text-2xl md:text-[1.7rem]">{t.title}</h3>
            <p className="mt-1 text-sm text-smoke">{t.sub}</p>
          </div>
          <span className="eyebrow relative pb-1 text-[10px]">
            Shop
            <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-30 bg-ink transition-transform duration-500 group-hover:scale-x-100" />
          </span>
        </div>
      </Link>
    </motion.div>
  )
}

export default function Categories() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })

  return (
    <section id="unstoppable" ref={ref} className="mx-auto max-w-[1600px] px-4 py-24 md:px-8 md:py-36">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <Reveal><p className="eyebrow text-rust">In demand</p></Reveal>
          <h2 className="display mt-4 text-4xl md:text-6xl">
            <SplitText text="For the" />
            <br />
            <SplitText text="unstoppable" delay={0.1} className="text-rust" />
          </h2>
        </div>
        <Reveal delay={0.2} className="max-w-sm text-smoke">
          Three pillars of the rugged wardrobe. Heavyweight fabrics, reinforced stitching and cuts that hold their shape — season after season.
        </Reveal>
      </div>

      <div className="mt-16 grid gap-10 md:mt-24 md:grid-cols-3 md:gap-6 lg:gap-10">
        {TILES.map((t, i) => (
          <Tile key={t.title} t={t} i={i} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  )
}
