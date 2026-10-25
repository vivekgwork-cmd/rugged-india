// Downloads imagery from the-rugged.com into public/images as optimized webp.
// Usage: node scripts/fetch-assets.mjs
import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const OUT = path.resolve('public/images')
const CDN = 'https://the-rugged.com/cdn/shop/'
const UA = { 'User-Agent': 'Mozilla/5.0', Accept: 'image/avif,image/webp,*/*' }

// [remote path, local name, max width]
const assets = [
  ['files/logo.svg', 'logo.svg', 0],
  ['files/Logo_for_trans.svg', 'logo-light.svg', 0],
  // hero slideshow (desktop + mobile)
  ['files/4_09802d5a-2f79-469b-8ffc-f68aa2291aeb.png', 'hero-1.webp', 2200],
  ['files/1_fca81ee7-1020-44c7-8c9f-fdd91ab0cedd.png', 'hero-2.webp', 2200],
  ['files/3_fb51e9a8-368a-4a28-8823-a1dc4de48e6b.png', 'hero-3.webp', 2200],
  ['files/2_40e87243-63fe-4712-aae9-04903335c17b.png', 'hero-4.webp', 2200],
  ['files/IMG_2745_1.jpg', 'hero-1-m.webp', 1000],
  ['files/chhch_1.jpg', 'hero-2-m.webp', 1000],
  ['files/IMG_2719_1.jpg', 'hero-3-m.webp', 1000],
  ['files/chh_1.jpg', 'hero-4-m.webp', 1000],
  // categories
  ['files/1.png', 'cat-shirts.webp', 1000],
  ['files/2.png', 'cat-jeans.webp', 1000],
  ['files/Untitled_design_6.png', 'cat-tees.webp', 1000],
  // collage / editorial
  ['files/Black_jeans.svg', 'collage-tapered.webp', 1400],
  ['files/Untitled_design_44.png', 'collage-straight.webp', 1400],
  ['files/Untitled_design_54658465-326c-4ed9-83c9-c58c4c065adf.svg', 'banner-wide.webp', 2200],
  ['files/Brown_Flannel_01a15b50-6951-45fa-98da-22d9312a778f.svg', 'flannel-hero.webp', 1600],
  ['files/Beige_Flannels_for_Men.svg', 'flannel-desert.webp', 1000],
  ['files/Green_Flannel_Shirt_For_Men.svg', 'flannel-forest.webp', 1000],
  ['files/Brown_Flannels_for_Men.svg', 'flannel-rust.webp', 1000],
  ['files/Add_a_heading_66669105-bf83-4c19-b1ad-db837e5f062b.png', 'heading-banner.webp', 1600],
  // journal
  ['articles/rugged-person-more-than-style-it-s-a-mindset.png', 'blog-1.webp', 900],
  ['articles/best-outfits-for-men-this-winter-premium-style-meets-comfort_0e7aeac3-c4a3-4fd1-9ffb-da7e1fe3a3bb.png', 'blog-2.webp', 900],
  ['articles/rugged-men-s-clothing-brands-with-sustainable-options-premium-denim-that-stands-the-test-of-time_2dfbc6bf-8e5a-43eb-96ec-39064231575c.png', 'blog-3.webp', 900],
  ['articles/how-to-choose-premium-men-s-shirts-for-office-wear-rugged_9f443f87-7621-4a57-86c3-acae9b0ac321.png', 'blog-4.webp', 900],
]

// product images: [handle, file list, take N]
const products = JSON.parse(await (await fetch('https://the-rugged.com/products.json?limit=250', { headers: UA })).text()).products
const PDP = 'the-rugged-shadow-trail-straight-fit-jeans'
for (const p of products) {
  const take = p.handle === PDP ? 12 : 3
  p.images.slice(0, take).forEach((img, i) => {
    const file = img.src.split("?")[0]
    assets.push([file, `p/${p.handle}-${i}.webp`, p.handle === PDP ? 1600 : 900])
  })
}

await fs.mkdir(path.join(OUT, 'p'), { recursive: true })

async function grab([remote, local, width]) {
  const dest = path.join(OUT, local)
  try { await fs.access(dest); return } catch {}
  const isSvg = remote.endsWith('.svg')
  const url = (remote.startsWith("http") ? "" : CDN) + remote + (!isSvg && width ? `?width=${width}` : '')
  const res = await fetch(url, { headers: UA })
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  const buf = Buffer.from(await res.arrayBuffer())
  if (local.endsWith('.svg')) return fs.writeFile(dest, buf)
  // SVG files on the store wrap raster photos — rasterize them
  let img = sharp(buf, isSvg ? { density: 72, limitInputPixels: false } : {})
  if (width) img = img.resize({ width, withoutEnlargement: !isSvg })
  try {
    await img.webp({ quality: 80 }).toFile(dest)
  } catch (e) {
    if (!isSvg) throw e
    // Too large for librsvg — pull the biggest embedded bitmap out instead
    const b64 = [...buf.toString('latin1').matchAll(/data:image\/(?:png|jpe?g|webp);base64,([A-Za-z0-9+/=]+)/g)]
      .map((m) => m[1])
      .sort((a, b) => b.length - a.length)[0]
    if (!b64) throw e
    await sharp(Buffer.from(b64, 'base64')).resize({ width }).webp({ quality: 80 }).toFile(dest)
  }
}

const queue = [...assets]
await Promise.all(Array.from({ length: 6 }, async () => {
  while (queue.length) {
    const a = queue.shift()
    try { await grab(a); process.stdout.write('.') } catch (e) { console.error('\nFAIL', a[1], e.message) }
  }
}))

// emit a trimmed product catalogue for the app
const catalogue = products.map((p) => ({
  handle: p.handle,
  title: p.title,
  type: p.product_type,
  price: Number(p.variants[0].price),
  compareAt: p.variants[0].compare_at_price ? Number(p.variants[0].compare_at_price) : null,
  sizes: p.options.find((o) => o.name === 'Size')?.values ?? [],
  images: p.images.slice(0, p.handle === PDP ? 12 : 3).map((_, i) => `/images/p/${p.handle}-${i}.webp`),
  body: p.body_html,
}))
await fs.writeFile('src/data/catalogue.json', JSON.stringify(catalogue, null, 2))
console.log(`\ndone: ${assets.length} assets, ${catalogue.length} products`)
