import { AnimatePresence, motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { byCategory, discount, inr } from '../data/products'
import { ArrowIcon, CheckIcon } from '../components/Icons'
import { EASE, Reveal, SplitText } from '../components/motion'

const SWATCH: Record<string, string> = {
  'Obsidian Edge': '#1a1a1c',
  'Midnight Forge': '#1f2b45',
  'Skybound Indigo': '#8fb0c9',
}

export default function DenimShowcase() {
  const shirts = byCategory('shirts').filter((p) => SWATCH[p.colorway])
  const [i, setI] = useState(0)
  const [size, setSize] = useState<string | null>(null)
  const [added, setAdded] = useState(false)
  const { add } = useCart()
  const imgRef = useRef<HTMLDivElement>(null)
  const p = shirts[i]
  if (!p) return null

  const addToBag = () => {
    if (!size) return
    add(p, size, 1, imgRef.current!.getBoundingClientRect())
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  return (
    <section className="grain relative overflow-hidden bg-ink py-24 text-bone md:py-36">
      {/* Ambient wash that tints with the selected colour */}
      <motion.div
        className="pointer-events-none absolute -right-1/4 top-0 h-[120%] w-[90%] rounded-full blur-[140px]"
        animate={{ backgroundColor: SWATCH[p.colorway] }}
        style={{ opacity: 0.55 }}
        transition={{ duration: 1.2 }}
      />

      <div className="relative mx-auto grid max-w-[1600px] gap-12 px-4 md:grid-cols-[1fr_1.1fr] md:items-center md:gap-20 md:px-8">
        <div className="order-2 md:order-1">
          <Reveal><p className="eyebrow text-rust">Rugged men's denim shirts</p></Reveal>
          <h2 className="display mt-4 text-4xl md:text-6xl">
            <SplitText text="Pick your" />
            <br />
            <SplitText text="wash." delay={0.1} className="text-sand" />
          </h2>

          <div className="mt-10 flex gap-4">
            {shirts.map((s, idx) => (
              <button
                key={s.handle}
                onClick={() => {
                  setI(idx)
                  setSize(null)
                }}
                aria-label={s.colorway}
                aria-pressed={i === idx}
                className="relative grid h-14 w-14 place-items-center"
              >
                {i === idx && (
                  <motion.span layoutId="swatch-ring" className="absolute inset-0 rounded-full border border-bone" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                )}
                <span className="h-10 w-10 rounded-full ring-1 ring-bone/20" style={{ background: SWATCH[s.colorway] }} />
              </button>
            ))}
          </div>

          <div className="mt-8 min-h-[120px] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={p.handle}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -40, opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <p className="display text-3xl md:text-4xl">{p.colorway}</p>
                <p className="mt-3 flex items-baseline gap-3">
                  <span className="text-xl font-semibold">{inr(p.price)}</span>
                  {p.compareAt && <span className="text-bone/40 line-through">{inr(p.compareAt)}</span>}
                  {discount(p) > 0 && <span className="text-xs font-bold text-rust">SAVE {discount(p)}%</span>}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {p.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`relative h-12 min-w-14 px-4 text-sm font-semibold transition-colors ${size === s ? 'text-ink' : 'text-bone/80 hover:text-bone'}`}
              >
                {size === s && <motion.span layoutId="denim-size" className="absolute inset-0 bg-bone" transition={{ type: 'spring', stiffness: 500, damping: 35 }} />}
                <span className="absolute inset-0 border border-bone/20" />
                <span className="relative">{s}</span>
              </button>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-6">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={addToBag}
              disabled={!size}
              className="relative flex h-14 min-w-[220px] items-center justify-center gap-2 overflow-hidden rounded-full bg-bone px-8 text-sm font-semibold text-ink transition-opacity disabled:opacity-40"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={added ? 'a' : size ? 'b' : 'c'}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  {added ? <><CheckIcon className="h-4 w-4" /> Added</> : size ? `Add to bag — ${size}` : 'Select a size'}
                </motion.span>
              </AnimatePresence>
            </motion.button>
            <Link to={`/product/${p.handle}`} className="group flex items-center gap-2 text-sm font-medium">
              Full details <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div ref={imgRef} className="relative order-1 aspect-[4/5] overflow-hidden md:order-2">
          <AnimatePresence initial={false}>
            <motion.img
              key={p.handle}
              src={p.images[0]}
              alt={`${p.name} — ${p.colorway}`}
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ clipPath: 'circle(0% at 50% 50%)', scale: 1.2 }}
              animate={{ clipPath: 'circle(75% at 50% 50%)', scale: 1 }}
              exit={{ opacity: 1, transition: { duration: 1 } }}
              transition={{ duration: 1, ease: [0.77, 0, 0.18, 1] }}
            />
          </AnimatePresence>
          <div className="absolute bottom-4 left-4 flex gap-1.5">
            {shirts.map((s, idx) => (
              <span key={s.handle} className={`h-1 rounded-full transition-all duration-500 ${idx === i ? 'w-8 bg-bone' : 'w-3 bg-bone/30'}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
