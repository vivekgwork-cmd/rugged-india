import { animate, motion, useInView, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Reveal } from '../components/motion'

const TEXT =
  'Crafted with premium heavyweight fabrics and timeless designs, our collection delivers bold essentials that stand strong through every season — keeping you sharp, confident and ready for anything.'

const STATS = [
  { value: 12, suffix: 'oz', label: 'Battle-ready denim' },
  { value: 240, suffix: ' GSM', label: 'Heavyweight cotton tees' },
  { value: 3, suffix: ' washes', label: 'Denim shirt colourways' },
  { value: 3, suffix: ' fits', label: 'Tapered · Straight · Bootcut' },
]

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.12, 1])
  return (
    <span className="relative mr-[0.25em] inline-block">
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  )
}

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, { duration: 1.8, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setN(Math.round(v)) })
    return () => c.stop()
  }, [inView, to])
  return (
    <span ref={ref} className="tabular-nums">
      {n}
      <span className="text-rust">{suffix}</span>
    </span>
  )
}

export default function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const words = TEXT.split(' ')

  return (
    <section className="mx-auto max-w-[1600px] px-4 py-28 md:px-8 md:py-44">
      <Reveal><p className="eyebrow text-rust">The rugged code</p></Reveal>
      <p ref={ref} className="mt-8 max-w-[1200px] text-[8.5vw] font-semibold leading-[1.05] tracking-tight md:text-[4.6vw] xl:text-7xl">
        {words.map((w, i) => (
          <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
            {w}
          </Word>
        ))}
      </p>

      <div className="mt-20 grid grid-cols-2 gap-x-6 gap-y-12 border-t border-ink/10 pt-12 md:mt-28 md:grid-cols-4">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08}>
            <p className="display text-4xl md:text-5xl">
              <Counter to={s.value} suffix={s.suffix} />
            </p>
            <p className="mt-3 text-sm text-smoke">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
