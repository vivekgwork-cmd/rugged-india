import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
  type MotionValue,
} from 'framer-motion'
import { useEffect, useRef, useState, type ReactNode } from 'react'

export const EASE = [0.16, 1, 0.3, 1] as const

/** Fades + lifts children into view once. */
export function Reveal({
  children,
  delay = 0,
  y = 40,
  className,
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Splits a line into words that rise out of a mask. Pass `animate` to drive it
 * manually (e.g. hero slides); otherwise it plays when scrolled into view.
 */
export function SplitText({
  text,
  className,
  delay = 0,
  stagger = 0.06,
  animate,
}: {
  text: string
  className?: string
  delay?: number
  stagger?: number
  animate?: boolean
}) {
  const words = text.split(' ')
  const controlled = animate !== undefined
  // The wrapper is what gets observed: the words start clipped by their masks,
  // so observing them directly would never report them as in view.
  return (
    <motion.span
      className={`inline-block ${className ?? ''}`}
      aria-label={text}
      initial="hidden"
      {...(controlled
        ? { animate: animate ? 'show' : 'hidden' }
        : { whileInView: 'show', viewport: { once: true, margin: '-10% 0px' } })}
    >
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-top">
          <motion.span
            className="inline-block will-change-transform"
            variants={{
              hidden: { y: '110%' },
              show: { y: '0%', transition: { duration: 1, ease: EASE, delay: delay + i * stagger } },
            }}
          >
            {w}
            {i < words.length - 1 && ' '}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}

/** Image that drifts against scroll direction for depth. */
export function ParallaxImage({
  src,
  alt,
  className,
  imgClassName = '',
  strength = 12,
}: {
  src: string
  alt: string
  className?: string
  imgClassName?: string
  strength?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`])
  return (
    <div ref={ref} className={`overflow-hidden ${className ?? ''}`}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        style={{ y, scale: 1 + strength / 50 }}
        className={`h-full w-full object-cover ${imgClassName}`}
      />
    </div>
  )
}

/** Button that leans towards the pointer. */
export function Magnetic({ children, strength = 0.35, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useSpring(0, { stiffness: 220, damping: 15, mass: 0.4 })
  const y = useSpring(0, { stiffness: 220, damping: 15, mass: 0.4 })
  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className ?? ''}`}
      style={{ x, y }}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse') return
        const r = ref.current!.getBoundingClientRect()
        x.set((e.clientX - (r.left + r.width / 2)) * strength)
        y.set((e.clientY - (r.top + r.height / 2)) * strength)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}

/** Infinite marquee whose speed and direction react to scroll velocity. */
export function VelocityMarquee({
  children,
  baseVelocity = -2,
  className,
}: {
  children: ReactNode
  baseVelocity?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 })
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], { clamp: false })
  const skew = useTransform(smoothVelocity, [-2000, 0, 2000], [8, 0, -8])
  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`)
  const direction = useRef(1)

  useAnimationFrame((_, delta) => {
    if (reduce) return
    let moveBy = direction.current * baseVelocity * (delta / 1000)
    const vf = velocityFactor.get()
    if (vf < 0) direction.current = -1
    else if (vf > 0) direction.current = 1
    moveBy += direction.current * moveBy * vf
    baseX.set(baseX.get() + moveBy)
  })

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className ?? ''}`}>
      <motion.div className="flex w-max flex-nowrap" style={{ x, skewX: skew }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex shrink-0 items-center" aria-hidden={i > 0}>
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

/** Animated number for stats. */
export function useCountUp(progress: MotionValue<number>, to: number) {
  return useTransform(progress, (v) => Math.round(v * to).toLocaleString('en-IN'))
}

/** Subscribes to a CSS media query. */
export function useMediaQuery(query: string) {
  const [match, setMatch] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)
  useEffect(() => {
    const mql = window.matchMedia(query)
    const on = () => setMatch(mql.matches)
    mql.addEventListener('change', on)
    return () => mql.removeEventListener('change', on)
  }, [query])
  return match
}
