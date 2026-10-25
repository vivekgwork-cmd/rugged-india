import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import type { Product } from '../../data/products'
import { CloseIcon } from '../Icons'
import { EASE } from '../motion'

// Jeans sizes are waist inches; tops use a standard chest guide.
const TOPS: Record<string, number> = { M: 40, L: 42, XL: 44, '2XL': 46 }

export default function SizeGuide({
  open,
  onClose,
  sizes,
  category,
}: {
  open: boolean
  onClose: () => void
  sizes: string[]
  category: Product['category']
}) {
  const [unit, setUnit] = useState<'in' | 'cm'>('in')
  const jeans = category === 'jeans'
  const rows = sizes.map((s) => {
    const inches = jeans ? Number(s) : TOPS[s] ?? 0
    return { size: s, value: unit === 'in' ? inches : Math.round(inches * 2.54) }
  })

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-[85] bg-ink/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            role="dialog"
            aria-label="Size guide"
            className="fixed inset-x-0 bottom-0 z-[86] mx-auto max-w-lg bg-bone p-6 md:inset-y-0 md:my-auto md:h-fit md:p-10"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="eyebrow text-rust">Fit help</p>
                <p className="display mt-2 text-3xl">Size guide</p>
              </div>
              <button onClick={onClose} className="-mr-2 p-2" aria-label="Close size guide">
                <CloseIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="relative mt-6 inline-flex rounded-full bg-sand p-1">
              {(['in', 'cm'] as const).map((u) => (
                <button key={u} onClick={() => setUnit(u)} className={`relative px-5 py-1.5 text-xs font-semibold ${unit === u ? 'text-bone' : ''}`}>
                  {unit === u && <motion.span layoutId="unit-pill" className="absolute inset-0 rounded-full bg-ink" />}
                  <span className="relative">{u === 'in' ? 'Inches' : 'CM'}</span>
                </button>
              ))}
            </div>

            <table className="mt-6 w-full text-sm">
              <thead>
                <tr className="border-b border-ink/15 text-left text-xs uppercase tracking-wider text-smoke">
                  <th className="py-3 font-semibold">Size</th>
                  <th className="py-3 font-semibold">{jeans ? 'Waist' : 'Chest'}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <motion.tr
                    key={r.size}
                    className="border-b border-ink/10"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.04 }}
                  >
                    <td className="py-3 font-semibold">{r.size}</td>
                    <td className="py-3 tabular-nums">
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.span key={unit} className="inline-block" initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }}>
                          {r.value} {unit}
                        </motion.span>
                      </AnimatePresence>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-xs text-smoke">
              {jeans ? 'Between sizes? Size up for a relaxed fit through the seat and thigh.' : 'Between sizes? Size up for a relaxed, boxy drape.'}
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
