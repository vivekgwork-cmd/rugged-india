import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react'
import type { Product } from '../data/products'

export type CartLine = { key: string; product: Product; size: string; qty: number }

type Flight = { id: number; src: string; from: DOMRect }

type CartCtx = {
  lines: CartLine[]
  count: number
  subtotal: number
  open: boolean
  setOpen: (v: boolean) => void
  add: (product: Product, size: string, qty?: number, from?: DOMRect) => void
  update: (key: string, qty: number) => void
  remove: (key: string) => void
  cartIconRef: RefObject<HTMLButtonElement | null>
  flights: Flight[]
  landFlight: (id: number) => void
}

const Ctx = createContext<CartCtx | null>(null)

export const FREE_SHIPPING_AT = 2999

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [open, setOpen] = useState(false)
  const [flights, setFlights] = useState<Flight[]>([])
  const cartIconRef = useRef<HTMLButtonElement | null>(null)
  const flightId = useRef(0)

  const add = useCallback<CartCtx['add']>((product, size, qty = 1, from) => {
    const key = `${product.handle}:${size}`
    setLines((prev) => {
      const hit = prev.find((l) => l.key === key)
      if (hit) return prev.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l))
      return [...prev, { key, product, size, qty }]
    })
    if (from) setFlights((f) => [...f, { id: ++flightId.current, src: product.images[0], from }])
  }, [])

  const update = useCallback((key: string, qty: number) => {
    setLines((prev) => (qty <= 0 ? prev.filter((l) => l.key !== key) : prev.map((l) => (l.key === key ? { ...l, qty } : l))))
  }, [])

  const remove = useCallback((key: string) => setLines((prev) => prev.filter((l) => l.key !== key)), [])
  const landFlight = useCallback((id: number) => setFlights((f) => f.filter((x) => x.id !== id)), [])

  const value = useMemo(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0)
    const subtotal = lines.reduce((n, l) => n + l.qty * l.product.price, 0)
    return { lines, count, subtotal, open, setOpen, add, update, remove, cartIconRef, flights, landFlight }
  }, [lines, open, add, update, remove, flights, landFlight])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useCart() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
