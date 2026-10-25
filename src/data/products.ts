import raw from './catalogue.json'

export type Product = {
  handle: string
  title: string
  type: string
  price: number
  compareAt: number | null
  sizes: string[]
  images: string[]
  body: string
  /** Short product name, e.g. "Sleek Straight Fit Jeans" */
  name: string
  /** Colourway, e.g. "Shadow Trail" */
  colorway: string
  category: 'jeans' | 'shirts' | 'flannels' | 'tees'
}

const categoryOf = (type: string): Product['category'] => {
  if (/jeans/i.test(type)) return 'jeans'
  if (/flannel/i.test(type)) return 'flannels'
  if (/t-shirt/i.test(type)) return 'tees'
  return 'shirts'
}

// Store titles are SEO-heavy ("The-Rugged Explorer Men’s Flannel Shirt – Desert Dune Check").
// Split them into a clean name + colourway for display.
const parseTitle = (title: string, handle: string) => {
  const [left, right] = title.split(/\s[–-]\s+/)
  let name = left
    .replace(/^The-Rugged\s+/i, '')
    .replace(/\s*Men[’']?s\s*/i, ' ')
    .replace(/\s+for Men\b/i, '')
    .replace(/\s+/g, ' ')
    .trim()
  let colorway = right?.replace(/\s+Check$/i, '').trim() ?? ''
  if (!colorway) {
    // e.g. "Signature Crew Neck T-Shirt" — colour lives in the handle
    const m = handle.match(/(evergreen-mist|onyx-depth|crimson-peak)/)
    if (m) colorway = m[1].replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    if (title.split(' ').length <= 2) {
      colorway = title
      name = 'Heavyweight Tee'
    }
  }
  return { name, colorway }
}

export const products: Product[] = (raw as Omit<Product, 'name' | 'colorway' | 'category'>[])
  .filter((p) => p.images.length > 1)
  .map((p) => ({ ...p, ...parseTitle(p.title, p.handle), category: categoryOf(p.type) }))

export const byCategory = (c: Product['category']) => products.filter((p) => p.category === c)
export const getProduct = (handle: string) => products.find((p) => p.handle === handle)

export const FEATURED_HANDLE = 'the-rugged-shadow-trail-straight-fit-jeans'

export const inr = (n: number) =>
  '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 0 })

export const discount = (p: Product) =>
  p.compareAt ? Math.round(((p.compareAt - p.price) / p.compareAt) * 100) : 0

/** Pulls paragraphs and "Heading: detail" feature bullets out of the Shopify body HTML. */
export function parseBody(html: string) {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const paragraphs: string[] = []
  const features: { title: string; text: string }[] = []
  doc.querySelectorAll('p, li').forEach((el) => {
    const text = el.textContent?.replace(/\s+/g, ' ').trim() ?? ''
    if (!text) return
    const strong = el.querySelector('strong, b')?.textContent?.trim()
    const m = text.match(/^([^:]{3,48}):\s*(.+)$/)
    if (m && (el.tagName === 'LI' || strong)) {
      if (!features.some((f) => f.title === m[1])) features.push({ title: m[1], text: m[2] })
    }
    else if (text.length > 60 && !/^product description/i.test(text) && !paragraphs.includes(text)) paragraphs.push(text)
  })
  return { paragraphs, features }
}
