import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowIcon, CheckIcon } from './Icons'
import { EASE, SplitText } from './motion'

const COLS = [
  { title: 'Shop', links: ['Premium Jeans', 'Denim Shirts', 'Flannel Shirts', 'Signature Tees', 'New Arrivals'] },
  { title: 'Help', links: ['Track Order', 'Shipping Policy', 'Returns & Exchange', 'Size Guide', 'Contact Us'] },
  { title: 'Brand', links: ['Our Story', "RUGGED Man's Guide", 'Privacy Policy', 'Terms of Service'] },
]

function Newsletter() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (/^\S+@\S+\.\S+$/.test(email)) setDone(true)
  }
  return (
    <div className="grid gap-10 border-b border-bone/10 pb-16 md:grid-cols-2 md:items-end">
      <div>
        <p className="eyebrow text-rust">Unyielding. Unstoppable.</p>
        <h3 className="display mt-4 text-4xl md:text-6xl">
          <SplitText text="Join the" />
          <br />
          <SplitText text="fearless few" delay={0.1} className="text-sand" />
        </h3>
      </div>
      <form onSubmit={submit} className="relative">
        <p className="mb-4 max-w-sm text-sm text-bone/60">First access to drops, restocks and members-only pricing. No spam — only grit.</p>
        <AnimatePresence mode="wait" initial={false}>
          {done ? (
            <motion.div
              key="ok"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 border-b border-bone/30 py-4"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }}
                className="grid h-8 w-8 place-items-center rounded-full bg-rust"
              >
                <CheckIcon className="h-4 w-4" />
              </motion.span>
              <span className="text-lg">You're in. Welcome to the crew.</span>
            </motion.div>
          ) : (
            <motion.div key="form" exit={{ opacity: 0, y: -16 }} className="group flex items-center border-b border-bone/30 focus-within:border-bone">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                aria-label="Email address"
                className="w-full bg-transparent py-4 text-lg outline-none placeholder:text-bone/40"
              />
              <button type="submit" className="flex items-center gap-2 py-4 pl-4 text-sm font-semibold">
                Subscribe
                <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-focus-within:translate-x-1" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  )
}

export default function Footer() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const y = useTransform(scrollYProgress, [0, 1], ['40%', '0%'])
  const opacity = useTransform(scrollYProgress, [0.2, 0.9], [0, 1])

  return (
    <footer className="grain overflow-hidden bg-ink text-bone">
      <div className="mx-auto max-w-[1600px] px-4 pt-20 md:px-8 md:pt-28">
        <Newsletter />

        <div className="grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <img src="/images/logo-light.svg" alt="The-Rugged" className="h-14" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-bone/60">
              Crafted with premium heavyweight fabrics and timeless designs — bold essentials that stand strong through every season.
            </p>
          </div>
          {COLS.map((c) => (
            <div key={c.title}>
              <p className="eyebrow text-bone/40">{c.title}</p>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l}>
                    <Link to="/" className="group relative text-sm text-bone/80 transition-colors hover:text-bone">
                      {l}
                      <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-500 ease-out-expo group-hover:origin-left group-hover:scale-x-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div ref={ref} className="relative select-none overflow-hidden">
        <motion.p
          style={{ y, opacity }}
          transition={{ ease: EASE }}
          className="display text-center text-[17vw] leading-[0.85] text-bone/[0.07]"
          aria-hidden
        >
          RUGGED
        </motion.p>
        <div className="absolute inset-x-0 bottom-0 mx-auto flex max-w-[1600px] flex-col justify-between gap-2 px-4 py-6 text-xs text-bone/40 md:flex-row md:px-8">
          <span>© {new Date().getFullYear()} The-Rugged. Built for the bold.</span>
          <span>Made in India · Secure payments · COD available</span>
        </div>
      </div>
    </footer>
  )
}
