import { motion } from 'framer-motion'
import { ArrowIcon } from '../components/Icons'
import { EASE, Reveal, SplitText } from '../components/motion'

const POSTS = [
  { date: 'Jan 05, 2026', title: 'RUGGED Person: More Than Style, It’s a Mindset', excerpt: 'Fashion fades, but character remains. The RUGGED person chooses clothing that reflects who they are.', img: '/images/blog-1.webp' },
  { date: 'Dec 30, 2025', title: 'Best Outfits for Men This Winter', excerpt: 'The best winter outfits are built around quality, fit and versatility.', img: '/images/blog-2.webp' },
  { date: 'Dec 17, 2025', title: 'Premium Denim That Stands the Test of Time', excerpt: 'The future of rugged, sustainable denim — and why it matters.', img: '/images/blog-3.webp' },
  { date: 'Dec 16, 2025', title: 'How to Choose Premium Shirts for Office Wear', excerpt: 'Invest smart: fabric, fit and finish that work from boardroom to bar.', img: '/images/blog-4.webp' },
]

export default function Journal() {
  return (
    <section id="journal" className="mx-auto max-w-[1600px] px-4 pb-28 md:px-8 md:pb-40">
      <div className="flex items-end justify-between gap-6 border-t border-ink/10 pt-20">
        <div>
          <Reveal><p className="eyebrow text-rust">Journal</p></Reveal>
          <h2 className="display mt-4 text-4xl md:text-5xl">
            <SplitText text="RUGGED Man's" /> <SplitText text="guide" delay={0.1} className="text-rust" />
          </h2>
        </div>
        <a href="#journal" className="group hidden items-center gap-2 text-sm font-semibold md:flex">
          View all <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </a>
      </div>

      <div className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {POSTS.map((p, i) => (
          <motion.a
            key={p.title}
            href="#journal"
            className="group block"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.9, ease: EASE, delay: i * 0.08 }}
          >
            <div className="aspect-[3/2] overflow-hidden bg-sand">
              <img src={p.img} alt="" loading="lazy" className="h-full w-full object-cover grayscale-[30%] transition-all duration-[1.2s] ease-out-expo group-hover:scale-105 group-hover:grayscale-0" />
            </div>
            <p className="eyebrow mt-5 !text-[10px] text-smoke">{p.date}</p>
            <h3 className="mt-2 text-lg font-semibold leading-snug">
              <span className="bg-gradient-to-r from-ink to-ink bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
                {p.title}
              </span>
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-smoke">{p.excerpt}</p>
          </motion.a>
        ))}
      </div>
    </section>
  )
}
