import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { BagIcon, CloseIcon, MenuIcon, SearchIcon, UserIcon } from './Icons'
import { EASE } from './motion'
import { byCategory, FEATURED_HANDLE } from '../data/products'

const NAV = [
  { label: 'Jeans', to: `/product/${FEATURED_HANDLE}`, cat: 'jeans' as const },
  { label: 'Denim Shirts', to: '/#unstoppable', cat: 'shirts' as const },
  { label: 'Flannels', to: '/#flannels', cat: 'flannels' as const },
  { label: 'Tees', to: '/#tees', cat: 'tees' as const },
  { label: 'Journal', to: '/#journal' },
]

const MESSAGES = [
  'Free shipping on orders above ₹2,999',
  'Cash on delivery across India',
  '7-day easy returns & exchanges',
  '12oz battle-ready denim — built to last',
]

function AnnouncementBar() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % MESSAGES.length), 3500)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="relative h-8 overflow-hidden bg-ink text-bone">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.p
          key={i}
          className="eyebrow absolute inset-0 flex items-center justify-center !text-[10px] md:!text-[11px]"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {MESSAGES[i]}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

export default function Header() {
  const { count, setOpen, cartIconRef } = useCart()
  const { pathname } = useLocation()
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menu, setMenu] = useState(false)
  const [hover, setHover] = useState<string | null>(null)

  // Over the home hero the header is transparent; elsewhere it is always solid.
  const overHero = pathname === '/' && !scrolled
  const solid = !overHero || hover !== null

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 40)
    setHidden(y > 300 && y > prev && !menu)
  })

  useEffect(() => setMenu(false), [pathname])

  const hovered = NAV.find((n) => n.label === hover && n.cat)
  const preview = hovered?.cat ? byCategory(hovered.cat).slice(0, 4) : []

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{ y: hidden ? '-100%' : '0%' }}
        transition={{ duration: 0.45, ease: EASE }}
        onMouseLeave={() => setHover(null)}
      >
        <AnnouncementBar />
        <div
          className={`relative transition-colors duration-500 ${
            solid ? 'bg-bone/90 text-ink backdrop-blur-xl' : 'bg-transparent text-bone'
          } ${scrolled ? 'shadow-[0_1px_0_rgba(20,18,15,0.08)]' : ''}`}
        >
          <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 md:h-20 md:px-8">
            <button className="-ml-2 p-2 lg:hidden" aria-label="Open menu" onClick={() => setMenu(true)}>
              <MenuIcon className="h-6 w-6" />
            </button>

            <nav className="hidden items-center gap-8 lg:flex">
              {NAV.map((n) => (
                <Link
                  key={n.label}
                  to={n.to}
                  onMouseEnter={() => setHover(n.cat ? n.label : null)}
                  className="group relative py-2 text-[13px] font-medium tracking-wide"
                >
                  {n.label}
                  <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-500 ease-out-expo group-hover:origin-left group-hover:scale-x-100" />
                </Link>
              ))}
            </nav>

            <Link to="/" aria-label="The-Rugged home" className="absolute left-1/2 -translate-x-1/2">
              <span className="relative block h-9 w-[92px] md:h-11 md:w-[112px]">
                <img src="/images/logo.svg" alt="" className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${solid ? 'opacity-100' : 'opacity-0'}`} />
                <img src="/images/logo-light.svg" alt="" className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${solid ? 'opacity-0' : 'opacity-100'}`} />
              </span>
            </Link>

            <div className="flex items-center gap-1 md:gap-3">
              <button className="hidden p-2 md:block" aria-label="Search"><SearchIcon className="h-5 w-5" /></button>
              <button className="hidden p-2 md:block" aria-label="Account"><UserIcon className="h-5 w-5" /></button>
              <button ref={cartIconRef} className="relative -mr-2 p-2" aria-label={`Cart, ${count} items`} onClick={() => setOpen(true)}>
                <BagIcon className="h-[22px] w-[22px]" />
                <AnimatePresence>
                  {count > 0 && (
                    <motion.span
                      key={count}
                      initial={{ scale: 0 }}
                      animate={{ scale: [1.6, 1] }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                      className="absolute right-0.5 top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-rust px-1 text-[10px] font-bold text-white"
                    >
                      {count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>

          {/* Mega-menu preview */}
          <AnimatePresence>
            {preview.length > 0 && (
              <motion.div
                key="mega"
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="absolute inset-x-0 top-full hidden overflow-hidden border-t border-ink/10 bg-bone lg:block"
              >
                <div className="mx-auto grid max-w-[1600px] grid-cols-[220px_1fr] gap-10 px-8 py-8">
                  <div>
                    <p className="eyebrow text-smoke">Explore</p>
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={hover}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        className="display mt-3 text-4xl"
                      >
                        {hover}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    {preview.map((p, i) => (
                      <motion.div
                        key={p.handle}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * i, duration: 0.5, ease: EASE }}
                      >
                        <Link to={`/product/${p.handle}`} className="group block" onClick={() => setHover(null)}>
                          <div className="aspect-[4/5] overflow-hidden bg-paper">
                            <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105" />
                          </div>
                          <p className="mt-2 text-xs font-medium">{p.colorway || p.name}</p>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menu && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-ink text-bone lg:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div className="flex h-16 items-center justify-between px-4">
              <img src="/images/logo-light.svg" alt="The-Rugged" className="h-9" />
              <button className="-mr-2 p-2" aria-label="Close menu" onClick={() => setMenu(false)}>
                <CloseIcon className="h-6 w-6" />
              </button>
            </div>
            <nav className="mt-8 flex flex-col gap-2 px-4">
              {NAV.map((n, i) => (
                <div key={n.label} className="overflow-hidden">
                  <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: '0%' }}
                    transition={{ delay: 0.25 + i * 0.06, duration: 0.7, ease: EASE }}
                  >
                    <Link to={n.to} onClick={() => setMenu(false)} className="display block py-1 text-4xl">
                      {n.label}
                    </Link>
                  </motion.div>
                </div>
              ))}
            </nav>
            <motion.p
              className="eyebrow mt-auto px-4 pb-8 text-bone/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Made for the fearless few
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
