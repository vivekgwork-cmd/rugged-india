import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import { useMemo, useRef, useState, type FormEvent, type ReactNode, type RefObject } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { discount, FEATURED_HANDLE, inr, parseBody, products, type Product } from '../../data/products'
import { CashIcon, CheckIcon, HeartIcon, MinusIcon, PlusIcon, ReturnIcon, RulerIcon, ShieldIcon, StarIcon, TruckIcon } from '../Icons'
import { EASE } from '../motion'
import SizeGuide from './SizeGuide'

function Accordion({ title, children, defaultOpen = false }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-ink/10">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between py-5 text-left text-sm font-semibold" aria-expanded={open}>
        {title}
        <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.4, ease: EASE }}>
          <PlusIcon className="h-4 w-4" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-sm leading-relaxed text-ink/75">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function PincodeCheck() {
  const [pin, setPin] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const check = (e: FormEvent) => {
    e.preventDefault()
    if (!/^\d{6}$/.test(pin)) return setResult('error')
    const d = new Date()
    d.setDate(d.getDate() + 4)
    setResult(d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }))
  }
  return (
    <form onSubmit={check} className="mt-6">
      <div className="flex items-center border border-ink/15 focus-within:border-ink">
        <TruckIcon className="ml-4 h-5 w-5 shrink-0 text-smoke" />
        <input
          value={pin}
          onChange={(e) => {
            setPin(e.target.value.replace(/\D/g, '').slice(0, 6))
            setResult(null)
          }}
          inputMode="numeric"
          placeholder="Enter pincode for delivery date"
          aria-label="Pincode"
          className="w-full bg-transparent px-3 py-3.5 text-sm outline-none placeholder:text-smoke"
        />
        <button className="px-4 text-xs font-bold uppercase tracking-wider">Check</button>
      </div>
      <AnimatePresence mode="wait">
        {result && (
          <motion.p
            key={result}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mt-2 text-xs ${result === 'error' ? 'text-rust' : 'text-olive'}`}
          >
            {result === 'error' ? 'Please enter a valid 6-digit pincode.' : <>Estimated delivery by <b>{result}</b> · COD available</>}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  )
}

export default function BuyBox({ product, atcRef }: { product: Product; atcRef: RefObject<HTMLDivElement | null> }) {
  const { add, setOpen } = useCart()
  const [size, setSize] = useState<string | null>(null)
  const [qty, setQty] = useState(1)
  const [state, setState] = useState<'idle' | 'adding' | 'added'>('idle')
  const [warn, setWarn] = useState(false)
  const [guide, setGuide] = useState(false)
  const [liked, setLiked] = useState(false)
  const sizeRow = useAnimationControls()
  const btn = useRef<HTMLButtonElement>(null)
  const off = discount(product)
  const { paragraphs, features } = useMemo(() => parseBody(product.body), [product.body])

  // Same cut in other washes — shown as image swatches
  const siblings = products.filter((p) => p.category === product.category && p.type === product.type)

  const addToBag = (buyNow = false) => {
    if (!size) {
      setWarn(true)
      sizeRow.start({ x: [0, -10, 10, -6, 6, 0], transition: { duration: 0.45 } })
      return
    }
    setState('adding')
    setTimeout(() => {
      add(product, size, qty, btn.current!.closest('[data-pdp]')!.querySelector('[data-gallery] img')!.getBoundingClientRect())
      setState('added')
      if (buyNow) setTimeout(() => setOpen(true), 700)
      setTimeout(() => setState('idle'), 2000)
    }, 450)
  }

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } } }
  const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } } }

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">
      <motion.div variants={item} className="flex items-center gap-3">
        <span className="eyebrow !text-[10px] rounded-full bg-ink px-3 py-1.5 text-bone">Bestseller</span>
        {product.handle === FEATURED_HANDLE && (
          <span className="flex items-center gap-1.5 text-xs text-smoke">
            <span className="flex text-ink">{[0, 1, 2, 3, 4].map((i) => <StarIcon key={i} className="h-3.5 w-3.5" />)}</span>
            2 reviews
          </span>
        )}
      </motion.div>

      <motion.h1 variants={item} className="display mt-5 text-3xl md:text-[2.75rem]">
        {product.name}
      </motion.h1>
      <motion.p variants={item} className="mt-3 text-lg font-medium text-smoke">
        {product.colorway}
      </motion.p>

      <motion.div variants={item} className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-3xl font-semibold tabular-nums">{inr(product.price)}</span>
        {product.compareAt && <span className="text-lg text-smoke line-through">{inr(product.compareAt)}</span>}
        {off > 0 && (
          <span className="rounded-sm bg-rust/10 px-2 py-1 text-xs font-bold text-rust">
            Save {inr(product.compareAt! - product.price)} ({off}% off)
          </span>
        )}
        <span className="w-full text-xs text-smoke">Inclusive of all taxes</span>
      </motion.div>

      {siblings.length > 1 && (
        <motion.div variants={item} className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-wider">
            Wash: <span className="font-normal normal-case tracking-normal text-smoke">{product.colorway}</span>
          </p>
          <div className="mt-3 flex gap-2">
            {siblings.map((s) => (
              <Link
                key={s.handle}
                to={`/product/${s.handle}`}
                aria-label={s.colorway}
                className={`relative h-16 w-14 overflow-hidden bg-paper transition-opacity ${s.handle === product.handle ? 'ring-2 ring-ink ring-offset-2 ring-offset-bone' : 'opacity-60 hover:opacity-100'}`}
              >
                <img src={s.images[0]} alt="" className="h-full w-full object-cover" />
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div variants={item} className="mt-8">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider">
            Size {size && <span className="font-normal normal-case tracking-normal text-smoke">— {size}</span>}
          </p>
          <button onClick={() => setGuide(true)} className="flex items-center gap-1.5 text-xs font-medium underline-offset-4 hover:underline">
            <RulerIcon className="h-4 w-4" /> Size guide
          </button>
        </div>
        <motion.div animate={sizeRow} className="mt-3 grid grid-cols-5 gap-2">
          {product.sizes.map((s) => (
            <button
              key={s}
              onClick={() => {
                setSize(s)
                setWarn(false)
              }}
              className={`relative h-12 text-sm font-semibold transition-colors ${size === s ? 'text-bone' : 'hover:bg-ink/5'}`}
            >
              <span className={`absolute inset-0 border transition-colors ${warn ? 'border-rust/60' : 'border-ink/15'}`} />
              {size === s && <motion.span layoutId="pdp-size" className="absolute inset-0 bg-ink" transition={{ type: 'spring', stiffness: 500, damping: 35 }} />}
              <span className="relative">{s}</span>
            </button>
          ))}
        </motion.div>
        <AnimatePresence>
          {warn && (
            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-2 text-xs font-medium text-rust">
              Please select a size to continue.
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div variants={item} ref={atcRef} className="mt-6 flex gap-2">
        <div className="flex items-center border border-ink/15">
          <button className="grid h-14 w-11 place-items-center" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
            <MinusIcon className="h-4 w-4" />
          </button>
          <span className="w-6 overflow-hidden text-center text-sm font-semibold tabular-nums">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span key={qty} className="inline-block" initial={{ y: -14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 14, opacity: 0 }}>
                {qty}
              </motion.span>
            </AnimatePresence>
          </span>
          <button className="grid h-14 w-11 place-items-center" onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>

        <motion.button
          ref={btn}
          whileTap={{ scale: 0.98 }}
          onClick={() => addToBag()}
          className="group relative h-14 flex-1 overflow-hidden bg-ink text-sm font-semibold text-bone"
        >
          <span className="absolute inset-0 -translate-x-full bg-rust transition-transform duration-500 ease-out-expo group-hover:translate-x-0" />
          {state === 'adding' && (
            <motion.span className="absolute inset-y-0 left-0 bg-bone/20" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 0.45, ease: 'easeInOut' }} />
          )}
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={state}
              className="relative flex items-center justify-center gap-2"
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -24, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {state === 'idle' && 'Add to bag'}
              {state === 'adding' && 'Adding…'}
              {state === 'added' && (
                <>
                  <CheckIcon className="h-4 w-4" /> Added to bag
                </>
              )}
            </motion.span>
          </AnimatePresence>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => setLiked((v) => !v)}
          className="grid h-14 w-14 place-items-center border border-ink/15"
          aria-label="Add to wishlist"
          aria-pressed={liked}
        >
          <motion.span animate={{ scale: liked ? [1, 1.35, 1] : 1 }}>
            <HeartIcon className={`h-5 w-5 ${liked ? 'fill-rust text-rust' : ''}`} />
          </motion.span>
        </motion.button>
      </motion.div>

      <motion.button
        variants={item}
        onClick={() => addToBag(true)}
        className="mt-2 h-14 w-full border border-ink text-sm font-semibold transition-colors hover:bg-ink hover:text-bone"
      >
        Buy it now
      </motion.button>

      <motion.div variants={item}>
        <PincodeCheck />
      </motion.div>

      <motion.div variants={item} className="mt-8 grid grid-cols-2 gap-px bg-ink/10 sm:grid-cols-4">
        {[
          { Icon: ShieldIcon, t: '12oz denim' },
          { Icon: ReturnIcon, t: 'Easy exchange' },
          { Icon: CashIcon, t: 'COD available' },
          { Icon: TruckIcon, t: 'Pan-India shipping' },
        ].map(({ Icon, t }) => (
          <div key={t} className="flex flex-col items-center gap-2 bg-bone py-4 text-center">
            <Icon className="h-5 w-5" />
            <span className="text-[11px] font-medium">{t}</span>
          </div>
        ))}
      </motion.div>

      <motion.div variants={item} className="mt-8 border-t border-ink/10">
        <Accordion title="Description" defaultOpen>
          {paragraphs.slice(0, 2).map((p, i) => (
            <p key={i} className={i ? 'mt-3' : ''}>{p}</p>
          ))}
        </Accordion>
        {features.length > 0 && (
          <Accordion title="Key features">
            <ul className="space-y-3">
              {features.map((f) => (
                <li key={f.title} className="flex gap-3">
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-rust" />
                  <span>
                    <b className="text-ink">{f.title}.</b> {f.text}
                  </span>
                </li>
              ))}
            </ul>
          </Accordion>
        )}
        <Accordion title="Fabric & care">
          <p>Premium cotton-rich denim. Wash inside out in cold water with similar colours. Do not bleach. Line dry in shade. Warm iron on reverse.</p>
        </Accordion>
        <Accordion title="Shipping & exchange">
          <p>Dispatched within 24–48 hours across India. Size not right? Request an exchange from your order page.</p>
        </Accordion>
      </motion.div>

      <SizeGuide open={guide} onClose={() => setGuide(false)} sizes={product.sizes} category={product.category} />
    </motion.div>
  )
}
