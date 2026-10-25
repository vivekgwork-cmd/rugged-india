import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import Lenis from 'lenis'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import CartDrawer from './components/CartDrawer'
import FlyToCart from './components/FlyToCart'
import Footer from './components/Footer'
import Header from './components/Header'
import Preloader from './components/Preloader'
import { CartProvider, useCart } from './context/CartContext'
import Home from './pages/Home'
import ProductPage from './pages/Product'

/** Black curtain that sweeps across between routes. */
function Page({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <motion.div
        className="pointer-events-none fixed inset-0 z-[80] origin-bottom bg-ink"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0, transition: { duration: 0.7, ease: [0.77, 0, 0.18, 1], delay: 0.05 } }}
        exit={{ scaleY: 0 }}
      />
      <motion.div
        className="pointer-events-none fixed inset-0 z-[80] origin-top bg-ink"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1, transition: { duration: 0.55, ease: [0.77, 0, 0.18, 1] } }}
      />
    </>
  )
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40 })
  return <motion.div className="fixed inset-x-0 top-0 z-[55] h-[2px] origin-left bg-rust" style={{ scaleX }} />
}

function Shell() {
  const location = useLocation()
  const { open } = useCart()
  const [intro, setIntro] = useState(location.pathname === '/')
  const lenis = useRef<Lenis | null>(null)
  const ready = !intro

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const l = new Lenis({ lerp: 0.1, wheelMultiplier: 1 })
    lenis.current = l
    let raf = requestAnimationFrame(function loop(t) {
      l.raf(t)
      raf = requestAnimationFrame(loop)
    })
    return () => {
      cancelAnimationFrame(raf)
      l.destroy()
    }
  }, [])

  // Freeze page scroll under overlays
  useEffect(() => {
    if (open || intro) lenis.current?.stop()
    else lenis.current?.start()
    document.documentElement.style.overflow = open || intro ? 'hidden' : ''
  }, [open, intro])

  // In-page anchors (/#flannels). After a route change, wait for the curtain to lift.
  const prevPath = useRef(location.pathname)
  useEffect(() => {
    const changed = prevPath.current !== location.pathname
    prevPath.current = location.pathname
    const id = location.hash.slice(1)
    if (!id) return
    const t = setTimeout(() => {
      const el = document.getElementById(id)
      if (!el) return
      if (lenis.current) lenis.current.scrollTo(el, { offset: -60 })
      else el.scrollIntoView({ behavior: 'smooth' })
    }, changed ? 1000 : 0)
    return () => clearTimeout(t)
  }, [location])

  return (
    <>
      <ScrollProgress />
      <Header />
      <AnimatePresence
        mode="wait"
        onExitComplete={() => {
          if (lenis.current) lenis.current.scrollTo(0, { immediate: true })
          else window.scrollTo(0, 0)
        }}
      >
        <motion.main key={location.pathname}>
          <Page>
            <Routes location={location}>
              <Route path="/" element={<Home ready={ready} />} />
              <Route path="/product/:handle" element={<ProductPage />} />
              <Route path="*" element={<Home ready={ready} />} />
            </Routes>
          </Page>
        </motion.main>
      </AnimatePresence>
      <Footer />
      <CartDrawer />
      <FlyToCart />
      <AnimatePresence>{intro && <Preloader onDone={() => setIntro(false)} />}</AnimatePresence>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <CartProvider>
        <Shell />
      </CartProvider>
    </BrowserRouter>
  )
}
