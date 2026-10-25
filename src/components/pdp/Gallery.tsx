import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { ArrowIcon, ArrowLeftIcon, CloseIcon, ExpandIcon } from '../Icons'
import { EASE } from '../motion'

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', scale: 1.05 }),
  center: { x: '0%', scale: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? '-30%' : '30%', opacity: 0.4 }),
}

export default function Gallery({ images, title }: { images: string[]; title: string }) {
  const [[index, dir], setState] = useState<[number, number]>([0, 0])
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null)
  const [lightbox, setLightbox] = useState(false)
  const frame = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const go = (to: number) => {
    const next = (to + images.length) % images.length
    setState([next, to > index ? 1 : -1])
  }

  const onDragEnd = (_: unknown, info: PanInfo) => {
    setTimeout(() => (dragging.current = false), 80)
    if (info.offset.x < -60 || info.velocity.x < -400) go(index + 1)
    else if (info.offset.x > 60 || info.velocity.x > 400) go(index - 1)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(index + 1)
      if (e.key === 'ArrowLeft') go(index - 1)
      if (e.key === 'Escape') setLightbox(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  useEffect(() => {
    document.documentElement.style.overflow = lightbox ? 'hidden' : ''
  }, [lightbox])

  return (
    <div className="flex flex-col-reverse gap-3 md:flex-row md:gap-4">
      {/* Thumbnails */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto md:max-h-[calc(100vh-160px)] md:w-20 md:flex-col md:overflow-y-auto">
        {images.map((src, i) => (
          <motion.button
            key={src}
            onClick={() => go(i)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.04, duration: 0.6, ease: EASE }}
            className="relative aspect-[4/5] w-16 shrink-0 overflow-hidden bg-paper md:w-full"
            aria-label={`View image ${i + 1}`}
          >
            <img src={src} alt="" className={`h-full w-full object-cover transition-opacity duration-300 ${i === index ? 'opacity-100' : 'opacity-50 hover:opacity-90'}`} />
            {i === index && <motion.span layoutId="thumb-ring" className="absolute inset-0 border-2 border-ink" transition={{ type: 'spring', stiffness: 400, damping: 35 }} />}
          </motion.button>
        ))}
      </div>

      {/* Main viewer */}
      <div
        ref={frame}
        className="relative aspect-[4/5] flex-1 cursor-zoom-in overflow-hidden bg-paper"
        onPointerMove={(e) => {
          if (e.pointerType !== 'mouse') return
          const r = frame.current!.getBoundingClientRect()
          setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 })
        }}
        onPointerLeave={() => setZoom(null)}
        onClick={() => !dragging.current && setLightbox(true)}
      >
        <AnimatePresence initial={false} custom={dir}>
          <motion.img
            key={index}
            src={images[index]}
            alt={`${title} — view ${index + 1}`}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.8, ease: EASE }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.3}
            onDragStart={() => (dragging.current = true)}
            onDragEnd={onDragEnd}
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>

        {/* Hover zoom layer (desktop) */}
        <AnimatePresence>
          {zoom && (
            <motion.div
              className="pointer-events-none absolute inset-0 hidden md:block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                backgroundImage: `url(${images[index]})`,
                backgroundSize: '200%',
                backgroundPosition: `${zoom.x}% ${zoom.y}%`,
                backgroundColor: '#fff',
              }}
            />
          )}
        </AnimatePresence>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
          <span className="rounded-full bg-white/85 px-3 py-1.5 text-xs font-semibold tabular-nums backdrop-blur">
            {String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
          </span>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-white/85 backdrop-blur">
            <ExpandIcon className="h-4 w-4" />
          </span>
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                go(index - 1)
              }}
              className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/85 backdrop-blur transition-transform hover:scale-110"
              aria-label="Previous image"
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                go(index + 1)
              }}
              className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/85 backdrop-blur transition-transform hover:scale-110"
              aria-label="Next image"
            >
              <ArrowIcon className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[95] flex flex-col bg-ink/95 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            data-lenis-prevent
          >
            <div className="flex items-center justify-between p-4 text-bone md:p-6">
              <span className="text-sm tabular-nums">
                {index + 1} / {images.length}
              </span>
              <button onClick={() => setLightbox(false)} className="grid h-11 w-11 place-items-center rounded-full bg-bone/10" aria-label="Close">
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="relative flex-1 overflow-hidden">
              <AnimatePresence initial={false} custom={dir}>
                <motion.img
                  key={index}
                  src={images[index]}
                  alt=""
                  custom={dir}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.7, ease: EASE }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={onDragEnd}
                  draggable={false}
                  className="absolute inset-0 m-auto max-h-full max-w-full object-contain"
                />
              </AnimatePresence>
            </div>
            <div className="no-scrollbar flex justify-center gap-2 overflow-x-auto p-4">
              {images.map((src, i) => (
                <button key={src} onClick={() => go(i)} className={`h-14 w-11 shrink-0 overflow-hidden transition-opacity ${i === index ? 'opacity-100 ring-2 ring-bone' : 'opacity-40'}`}>
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
