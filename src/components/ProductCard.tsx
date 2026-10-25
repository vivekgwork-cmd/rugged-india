import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { discount, inr, type Product } from '../data/products'
import { CheckIcon, HeartIcon, PlusIcon } from './Icons'
import { EASE } from './motion'

export default function ProductCard({ product, index = 0, className = '' }: { product: Product; index?: number; className?: string }) {
  const { add } = useCart()
  const [hover, setHover] = useState(false)
  const [quick, setQuick] = useState(false)
  const [liked, setLiked] = useState(false)
  const [added, setAdded] = useState<string | null>(null)
  const off = discount(product)
  const alt = product.images[1] ?? product.images[0]

  const quickAdd = (size: string, el: HTMLElement) => {
    add(product, size, 1, el.closest('[data-card]')!.querySelector('img')!.getBoundingClientRect())
    setAdded(size)
    setTimeout(() => {
      setAdded(null)
      setQuick(false)
    }, 1400)
  }

  return (
    <motion.article
      data-card
      className={`group relative ${className}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-5% 0px' }}
      transition={{ duration: 0.9, ease: EASE, delay: (index % 4) * 0.08 }}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => {
        setHover(false)
        setQuick(false)
      }}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-paper">
        <Link to={`/product/${product.handle}`} draggable={false} className="block h-full w-full" aria-label={product.title}>
          <motion.img
            src={product.images[0]}
            alt={product.title}
            loading="lazy"
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
            animate={{ scale: hover ? 1.06 : 1 }}
            transition={{ duration: 1.2, ease: EASE }}
          />
          <motion.img
            src={alt}
            alt=""
            loading="lazy"
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
            initial={false}
            animate={{ clipPath: hover ? 'inset(0% 0 0 0)' : 'inset(100% 0 0 0)', scale: hover ? 1 : 1.12 }}
            transition={{ duration: 0.8, ease: EASE }}
          />
        </Link>

        {off > 0 && (
          <span className="absolute left-3 top-3 bg-ink px-2 py-1 text-[10px] font-bold tracking-wider text-bone">-{off}%</span>
        )}

        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={() => setLiked((v) => !v)}
          aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={liked}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/80 backdrop-blur"
        >
          <motion.span animate={{ scale: liked ? [1, 1.4, 1] : 1 }} transition={{ duration: 0.4 }}>
            <HeartIcon className={`h-[18px] w-[18px] transition-colors ${liked ? 'fill-rust text-rust' : ''}`} />
          </motion.span>
        </motion.button>

        {/* Quick add */}
        <div className="absolute inset-x-3 bottom-3">
          <AnimatePresence mode="wait" initial={false}>
            {quick ? (
              <motion.div
                key="sizes"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="rounded-sm bg-white/95 p-3 backdrop-blur"
              >
                <p className="eyebrow mb-2 !text-[10px] text-smoke">{added ? 'Added to bag' : 'Select size'}</p>
                <div className="flex flex-wrap gap-1.5">
                  {product.sizes.map((s, i) => (
                    <motion.button
                      key={s}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.035 }}
                      onClick={(e) => quickAdd(s, e.currentTarget)}
                      className={`grid h-9 min-w-9 flex-1 place-items-center border px-2 text-xs font-semibold transition-colors ${
                        added === s ? 'border-ink bg-ink text-bone' : 'border-ink/15 hover:border-ink'
                      }`}
                    >
                      {added === s ? <CheckIcon className="h-4 w-4" /> : s}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.button
                key="cta"
                onClick={() => setQuick(true)}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: hover ? 0 : 20, opacity: hover ? 1 : 0 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="hidden w-full items-center justify-center gap-2 rounded-sm bg-white/95 py-3 text-xs font-semibold tracking-wide backdrop-blur md:flex"
              >
                <PlusIcon className="h-4 w-4" /> Quick add
              </motion.button>
            )}
          </AnimatePresence>
          {!quick && (
            <button
              onClick={() => setQuick(true)}
              aria-label="Quick add"
              className="absolute bottom-0 right-0 grid h-9 w-9 place-items-center rounded-full bg-white/90 md:hidden"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <Link to={`/product/${product.handle}`} className="mt-3 block">
        <p className="eyebrow !text-[10px] text-smoke">{product.colorway || product.type}</p>
        <h3 className="mt-1 text-[15px] font-semibold leading-snug">{product.name}</h3>
        <p className="mt-1.5 flex items-baseline gap-2 text-sm">
          <span className="font-semibold">{inr(product.price)}</span>
          {product.compareAt && <span className="text-smoke line-through">{inr(product.compareAt)}</span>}
        </p>
      </Link>
    </motion.article>
  )
}
