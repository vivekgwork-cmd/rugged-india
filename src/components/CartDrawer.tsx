import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FREE_SHIPPING_AT, useCart } from '../context/CartContext'
import { inr, products } from '../data/products'
import { ArrowIcon, BagIcon, CloseIcon, MinusIcon, PlusIcon } from './Icons'
import { EASE } from './motion'

export default function CartDrawer() {
  const { open, setOpen, lines, subtotal, update, remove, add } = useCart()
  const remaining = Math.max(0, FREE_SHIPPING_AT - subtotal)
  const progress = Math.min(1, subtotal / FREE_SHIPPING_AT)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setOpen])

  // Suggest a tee — the cheapest way to cross the free-shipping line
  const upsell = products.find((p) => p.category === 'tees' && !lines.some((l) => l.product.handle === p.handle))

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[70] bg-ink/50 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            role="dialog"
            aria-label="Shopping cart"
            data-lenis-prevent
            className="fixed inset-y-0 right-0 z-[71] flex w-full max-w-[440px] flex-col bg-bone"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
              <p className="display text-2xl">Your bag</p>
              <button onClick={() => setOpen(false)} className="-mr-2 p-2" aria-label="Close cart">
                <CloseIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Free shipping meter */}
            <div className="px-6 pt-5">
              <p className="text-[13px]">
                {remaining > 0 ? (
                  <>You're <b>{inr(remaining)}</b> away from <b>free shipping</b></>
                ) : (
                  <>🎉 You've unlocked <b>free shipping</b></>
                )}
              </p>
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-ink/10">
                <motion.div
                  className="h-full origin-left rounded-full bg-rust"
                  initial={false}
                  animate={{ scaleX: progress }}
                  transition={{ duration: 0.8, ease: EASE }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {lines.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex h-full flex-col items-center justify-center text-center"
                >
                  <BagIcon className="h-12 w-12 text-smoke" />
                  <p className="display mt-6 text-3xl">Empty. For now.</p>
                  <p className="mt-2 max-w-[260px] text-sm text-smoke">Gear up with denim forged for the fearless few.</p>
                  <button onClick={() => setOpen(false)} className="mt-6 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-bone">
                    Keep exploring
                  </button>
                </motion.div>
              ) : (
                <ul>
                  <AnimatePresence initial={false}>
                    {lines.map((l) => (
                      <motion.li
                        key={l.key}
                        layout
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 60, height: 0, paddingTop: 0, paddingBottom: 0 }}
                        transition={{ duration: 0.45, ease: EASE }}
                        className="flex gap-4 overflow-hidden border-b border-ink/10 py-4"
                      >
                        <Link to={`/product/${l.product.handle}`} onClick={() => setOpen(false)} className="h-28 w-[88px] shrink-0 overflow-hidden bg-paper">
                          <img src={l.product.images[0]} alt="" className="h-full w-full object-cover" />
                        </Link>
                        <div className="flex flex-1 flex-col">
                          <div className="flex justify-between gap-2">
                            <div>
                              <p className="text-sm font-semibold leading-snug">{l.product.name}</p>
                              <p className="mt-0.5 text-xs text-smoke">{l.product.colorway} · Size {l.size}</p>
                            </div>
                            <button onClick={() => remove(l.key)} className="h-fit text-smoke hover:text-ink" aria-label="Remove">
                              <CloseIcon className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-center rounded-full border border-ink/15">
                              <button className="p-2" onClick={() => update(l.key, l.qty - 1)} aria-label="Decrease"><MinusIcon className="h-3.5 w-3.5" /></button>
                              <span className="w-6 overflow-hidden text-center text-sm tabular-nums">
                                <AnimatePresence mode="popLayout" initial={false}>
                                  <motion.span key={l.qty} className="inline-block" initial={{ y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 12, opacity: 0 }}>
                                    {l.qty}
                                  </motion.span>
                                </AnimatePresence>
                              </span>
                              <button className="p-2" onClick={() => update(l.key, l.qty + 1)} aria-label="Increase"><PlusIcon className="h-3.5 w-3.5" /></button>
                            </div>
                            <p className="text-sm font-semibold tabular-nums">{inr(l.product.price * l.qty)}</p>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}

              {lines.length > 0 && upsell && (
                <motion.div layout className="mt-6 rounded-sm bg-sand/60 p-4">
                  <p className="eyebrow text-smoke">Complete the kit</p>
                  <div className="mt-3 flex items-center gap-3">
                    <img src={upsell.images[0]} alt="" className="h-16 w-16 bg-paper object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{upsell.colorway} Tee</p>
                      <p className="text-xs text-smoke">{inr(upsell.price)}</p>
                    </div>
                    <button onClick={() => add(upsell, 'L')} className="rounded-full border border-ink px-4 py-2 text-xs font-semibold transition-colors hover:bg-ink hover:text-bone">
                      Add · L
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-ink/10 px-6 py-5">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span className="font-semibold tabular-nums">{inr(subtotal)}</span>
                </div>
                <p className="mt-1 text-xs text-smoke">Taxes included. Shipping calculated at checkout.</p>
                <CheckoutButton />
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function CheckoutButton() {
  const [hover, setHover] = useState(false)
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative mt-4 flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-ink py-4 text-sm font-semibold text-bone"
    >
      <motion.span className="absolute inset-0 bg-rust" initial={false} animate={{ y: hover ? '0%' : '101%' }} transition={{ duration: 0.45, ease: EASE }} />
      <span className="relative">Checkout securely</span>
      <motion.span className="relative" animate={{ x: hover ? 4 : 0 }}><ArrowIcon className="h-4 w-4" /></motion.span>
    </button>
  )
}
