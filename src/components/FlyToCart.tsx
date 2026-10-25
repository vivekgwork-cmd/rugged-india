import { AnimatePresence, motion } from 'framer-motion'
import { useCart } from '../context/CartContext'

/** Thumbnails that arc from the "Add to bag" origin into the header bag icon. */
export default function FlyToCart() {
  const { flights, landFlight, cartIconRef } = useCart()
  const target = cartIconRef.current?.getBoundingClientRect()

  return (
    <AnimatePresence>
      {flights.map((f) => {
        const size = 72
        const startX = f.from.left + f.from.width / 2 - size / 2
        const startY = f.from.top + f.from.height / 2 - size / 2
        const endX = target ? target.left + target.width / 2 - size / 2 : window.innerWidth - 60
        const endY = target ? target.top + target.height / 2 - size / 2 : 20
        return (
          <motion.img
            key={f.id}
            src={f.src}
            alt=""
            className="pointer-events-none fixed left-0 top-0 z-[90] rounded-full object-cover shadow-2xl ring-2 ring-white"
            style={{ width: size, height: size }}
            initial={{ x: startX, y: startY, scale: 1.2, opacity: 0 }}
            animate={{
              x: [startX, (startX + endX) / 2, endX],
              y: [startY, Math.min(startY, endY) - 120, endY],
              scale: [1.2, 1, 0.25],
              opacity: [0, 1, 0.6],
            }}
            transition={{ duration: 0.9, ease: [0.5, 0, 0.3, 1], times: [0, 0.45, 1] }}
            onAnimationComplete={() => landFlight(f.id)}
          />
        )
      })}
    </AnimatePresence>
  )
}
