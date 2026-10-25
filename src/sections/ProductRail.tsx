import { animate, motion, useMotionValue, useMotionValueEvent, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { ArrowIcon, ArrowLeftIcon } from '../components/Icons'
import ProductCard from '../components/ProductCard'
import { EASE, Reveal, SplitText } from '../components/motion'
import type { Product } from '../data/products'

/** Draggable product carousel with arrow controls and a scrub bar. */
export default function ProductRail({
  eyebrow,
  title,
  accent,
  items,
  id,
}: {
  eyebrow: string
  title: string
  accent?: string
  items: Product[]
  id?: string
}) {
  const viewport = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const dragged = useRef(false)
  const [max, setMax] = useState(0)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)
  const progress = useTransform(x, (v) => (max ? Math.min(1, Math.max(0, -v / max)) : 0))
  const barWidth = useTransform(progress, (p) => `${Math.max(12, p * 100)}%`)

  useEffect(() => {
    const measure = () => {
      if (!viewport.current || !track.current) return
      const m = Math.max(0, track.current.scrollWidth - viewport.current.clientWidth)
      setMax(m)
      setAtEnd(m === 0)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(viewport.current!)
    return () => ro.disconnect()
  }, [items.length])

  useMotionValueEvent(x, 'change', (v) => {
    setAtStart(v > -4)
    setAtEnd(v < -max + 4)
  })

  const step = (dir: 1 | -1) => {
    const card = track.current?.firstElementChild as HTMLElement | null
    const w = card ? card.offsetWidth + 24 : 300
    const target = Math.min(0, Math.max(-max, x.get() - dir * w))
    animate(x, target, { type: 'spring', stiffness: 200, damping: 30 })
  }

  return (
    <section id={id} className="overflow-hidden py-24 md:py-32">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <Reveal><p className="eyebrow text-rust">{eyebrow}</p></Reveal>
            <h2 className="display mt-4 text-4xl md:text-5xl">
              <SplitText text={title} />
              {accent && (
                <>
                  {' '}
                  <SplitText text={accent} delay={0.15} className="text-rust" />
                </>
              )}
            </h2>
          </div>
          <div className="hidden gap-2 md:flex">
            {[
              { dir: -1 as const, Icon: ArrowLeftIcon, disabled: atStart, label: 'Previous' },
              { dir: 1 as const, Icon: ArrowIcon, disabled: atEnd, label: 'Next' },
            ].map(({ dir, Icon, disabled, label }) => (
              <motion.button
                key={dir}
                whileTap={{ scale: 0.9 }}
                aria-label={label}
                disabled={disabled}
                onClick={() => step(dir)}
                className="grid h-14 w-14 place-items-center rounded-full border border-ink/20 transition-colors hover:bg-ink hover:text-bone disabled:pointer-events-none disabled:opacity-30"
              >
                <Icon className="h-5 w-5" />
              </motion.button>
            ))}
          </div>
        </div>

        <div ref={viewport} className="mt-12 md:mt-16">
          <motion.div
            ref={track}
            className="flex cursor-grab gap-4 active:cursor-grabbing md:gap-6"
            style={{ x }}
            drag={max > 0 ? 'x' : false}
            dragConstraints={{ left: -max, right: 0 }}
            dragElastic={0.12}
            dragTransition={{ power: 0.25, timeConstant: 250 }}
            onDragStart={() => (dragged.current = true)}
            onDragEnd={() => setTimeout(() => (dragged.current = false), 80)}
            onClickCapture={(e) => {
              // Swallow the click that ends a drag so cards don't navigate
              if (dragged.current) {
                e.preventDefault()
                e.stopPropagation()
              }
            }}
          >
            {items.map((p, i) => (
              <ProductCard key={p.handle} product={p} index={i} className="w-[72vw] shrink-0 sm:w-[44vw] md:w-[30vw] lg:w-[23vw] 2xl:w-[340px]" />
            ))}
          </motion.div>
        </div>

        <div className="mt-10 h-px bg-ink/10">
          <motion.div className="h-[2px] -translate-y-px bg-ink" style={{ width: barWidth }} transition={{ ease: EASE }} />
        </div>
      </div>
    </section>
  )
}
