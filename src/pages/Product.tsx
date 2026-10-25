import { AnimatePresence, motion, useInView, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { useMemo, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import BuyBox from '../components/pdp/BuyBox'
import Gallery from '../components/pdp/Gallery'
import { ArrowIcon } from '../components/Icons'
import { EASE, ParallaxImage, Reveal, SplitText, VelocityMarquee } from '../components/motion'
import { useCart } from '../context/CartContext'
import { getProduct, inr, parseBody, products } from '../data/products'
import ProductRail from '../sections/ProductRail'

const CATEGORY = {
  jeans: { label: 'Jeans', anchor: 'jeans' },
  shirts: { label: 'Denim Shirts', anchor: 'unstoppable' },
  flannels: { label: 'Flannel Shirts', anchor: 'flannels' },
  tees: { label: 'T-Shirts', anchor: 'tees' },
}

/** Close-up storytelling block — only rendered when the product has enough detail shots. */
function Details({ images, features }: { images: string[]; features: { title: string; text: string }[] }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const big = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  const [a, b, c] = images

  return (
    <section id="details" ref={ref} className="grain overflow-hidden bg-ink py-24 text-bone md:py-36">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <Reveal><p className="eyebrow text-rust">Engineered details</p></Reveal>
        <h2 className="display mt-4 max-w-4xl text-4xl md:text-6xl">
          <SplitText text="Built for battle." />
          <br />
          <SplitText text="Worn by the real." delay={0.12} className="text-sand" />
        </h2>

        <div className="mt-16 grid gap-6 md:mt-24 md:grid-cols-12 md:gap-8">
          <div className="relative aspect-square overflow-hidden md:col-span-7 md:aspect-auto md:h-[80vh]">
            <motion.img src={a} alt="Leather patch detail" loading="lazy" style={{ y: big, scale: 1.18 }} className="h-full w-full object-cover" />
            <motion.span
              className="absolute left-[52%] top-[18%] grid h-10 w-10 place-items-center"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', delay: 0.5 }}
            >
              <span className="absolute inset-0 animate-ping rounded-full bg-bone/50" />
              <span className="h-3 w-3 rounded-full bg-bone" />
            </motion.span>
          </div>
          <div className="flex flex-col gap-6 md:col-span-5 md:gap-8">
            {[b, c].map((src, i) => (
              <motion.div
                key={src}
                className="aspect-[4/3] overflow-hidden"
                initial={{ clipPath: 'inset(0 0 100% 0)' }}
                whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 1.2, ease: [0.77, 0, 0.18, 1], delay: i * 0.15 }}
              >
                <ParallaxImage src={src} alt="" className="h-full w-full" strength={8} />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-16 grid gap-px bg-bone/10 sm:grid-cols-2 lg:grid-cols-5">
          {features.slice(0, 5).map((f, i) => (
            <motion.div
              key={f.title}
              className="bg-ink p-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE, delay: i * 0.08 }}
            >
              <span className="display text-3xl text-rust">0{i + 1}</span>
              <p className="mt-4 font-semibold">{f.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-bone/60">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function ProductPage() {
  const { handle = '' } = useParams()
  const product = getProduct(handle)
  const atcRef = useRef<HTMLDivElement>(null)
  const atcVisible = useInView(atcRef, { margin: '-80px 0px 0px 0px' })
  const end = useRef<HTMLDivElement>(null)
  const atEnd = useInView(end)
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 500))
  const { setOpen } = useCart()
  const features = useMemo(() => (product ? parseBody(product.body).features : []), [product])

  if (!product) return <Navigate to="/" replace />

  const related = products.filter((p) => p.category === product.category && p.handle !== product.handle)
  const pairWith = products.filter((p) => p.category !== product.category && p.category !== 'jeans').slice(0, 8)
  const hasDetails = product.images.length >= 8 && features.length > 0

  // Lifestyle/full-body shots for the gallery; close-ups are saved for the details story
  const gallery = hasDetails ? product.images.filter((_, i) => ![1, 4, 5].includes(i)) : product.images
  const closeups = [product.images[1], product.images[4], product.images[5]]

  const showBar = scrolled && !atcVisible && !atEnd

  return (
    <>
      <div data-pdp className="mx-auto max-w-[1600px] px-4 pb-20 pt-32 md:px-8 md:pt-36">
        <motion.nav
          className="flex items-center gap-2 text-xs text-smoke"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          aria-label="Breadcrumb"
        >
          <Link to="/" className="hover:text-ink">Home</Link>
          <span>/</span>
          <Link to={`/#${CATEGORY[product.category].anchor}`} className="hover:text-ink">{CATEGORY[product.category].label}</Link>
          <span>/</span>
          <span className="truncate text-ink">{product.name}</span>
        </motion.nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
          <motion.div
            data-gallery
            className="min-w-0 lg:sticky lg:top-28 lg:self-start"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.15 }}
          >
            <Gallery images={gallery} title={product.title} />
          </motion.div>
          <div className="min-w-0">
            <BuyBox product={product} atcRef={atcRef} />
          </div>
        </div>
      </div>

      <div className="border-y border-ink/10 py-6">
        <VelocityMarquee baseVelocity={-2}>
          {[product.name, product.colorway, '12oz denim', 'Built for the bold'].map((t) => (
            <span key={t} className="display flex items-center text-3xl md:text-5xl">
              <span className="px-6 md:px-10">{t}</span>
              <span className="h-3 w-3 rounded-full bg-rust" />
            </span>
          ))}
        </VelocityMarquee>
      </div>

      {hasDetails && <Details images={closeups} features={features} />}

      <ProductRail eyebrow="Same grit, different cut" title="You may" accent="also like" items={related} />
      <div className="bg-sand/40">
        <ProductRail eyebrow="Complete the look" title="Wear it" accent="with" items={pairWith} />
      </div>
      <div ref={end} />

      {/* Sticky add-to-bag bar */}
      <AnimatePresence>
        {showBar && (
          <motion.div
            className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-bone/95 backdrop-blur-xl"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="mx-auto flex max-w-[1600px] items-center gap-4 px-4 py-3 md:px-8">
              <img src={product.images[0]} alt="" className="h-14 w-12 bg-paper object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{product.name}</p>
                <p className="text-xs text-smoke">
                  {product.colorway} · <span className="font-semibold text-ink">{inr(product.price)}</span>
                </p>
              </div>
              <button
                onClick={() => {
                  atcRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }}
                className="hidden h-12 items-center gap-2 border border-ink px-6 text-sm font-semibold transition-colors hover:bg-ink hover:text-bone sm:flex"
              >
                Choose size
              </button>
              <button onClick={() => setOpen(true)} className="flex h-12 items-center gap-2 bg-ink px-5 text-sm font-semibold text-bone transition-colors hover:bg-rust md:px-6">
                View bag <ArrowIcon className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
