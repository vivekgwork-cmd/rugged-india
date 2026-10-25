import { animate, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { EASE } from './motion'

/** First-visit intro: counts up while the hero image decodes, then splits away. */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const [n, setN] = useState(0)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.src = window.innerWidth >= 768 ? '/images/hero-1-wide.webp' : '/images/hero-1.webp'
    const loaded = img.decode().catch(() => {})
    const count = animate(0, 100, { duration: 1.6, ease: [0.65, 0, 0.35, 1], onUpdate: (v) => setN(Math.round(v)) })
    Promise.all([loaded, count]).then(() => setLeaving(true))
    return () => count.stop()
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col bg-ink text-bone"
      initial={{ clipPath: 'inset(0 0 0% 0)' }}
      animate={leaving ? { clipPath: 'inset(0 0 100% 0)' } : undefined}
      transition={{ duration: 1, ease: [0.77, 0, 0.18, 1], delay: 0.2 }}
      onAnimationComplete={() => leaving && onDone()}
    >
      <div className="flex flex-1 items-center justify-center">
        <motion.img
          src="/images/logo-light.svg"
          alt="The-Rugged"
          className="h-20 md:h-28"
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          animate={{ opacity: leaving ? 0 : 1, y: leaving ? -30 : 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: EASE }}
        />
      </div>
      <div className="flex items-end justify-between px-4 pb-6 md:px-8 md:pb-8">
        <span className="eyebrow text-bone/50">Built for the bold</span>
        <span className="display text-6xl tabular-nums md:text-8xl">{String(n).padStart(3, '0')}</span>
      </div>
      <motion.div className="h-[3px] origin-left bg-rust" style={{ scaleX: n / 100 }} />
    </motion.div>
  )
}
