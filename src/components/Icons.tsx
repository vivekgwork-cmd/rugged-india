import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>
const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', viewBox: '0 0 24 24' } as const

export const BagIcon = (p: P) => (
  <svg {...base} {...p}><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
)
export const SearchIcon = (p: P) => (
  <svg {...base} {...p}><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></svg>
)
export const UserIcon = (p: P) => (
  <svg {...base} {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg>
)
export const HeartIcon = (p: P) => (
  <svg {...base} {...p}><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" /></svg>
)
export const ArrowIcon = (p: P) => (
  <svg {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
)
export const ArrowLeftIcon = (p: P) => (
  <svg {...base} {...p}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
)
export const CloseIcon = (p: P) => (
  <svg {...base} {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>
)
export const PlusIcon = (p: P) => (
  <svg {...base} {...p}><path d="M12 5v14M5 12h14" /></svg>
)
export const MinusIcon = (p: P) => (
  <svg {...base} {...p}><path d="M5 12h14" /></svg>
)
export const CheckIcon = (p: P) => (
  <svg {...base} {...p}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
)
export const MenuIcon = (p: P) => (
  <svg {...base} {...p}><path d="M4 8h16M4 16h16" /></svg>
)
export const TruckIcon = (p: P) => (
  <svg {...base} {...p}><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="18" r="1.8" /><circle cx="17.5" cy="18" r="1.8" /></svg>
)
export const ReturnIcon = (p: P) => (
  <svg {...base} {...p}><path d="M4 9h11a5 5 0 0 1 0 10H8" /><path d="m8 5-4 4 4 4" /></svg>
)
export const ShieldIcon = (p: P) => (
  <svg {...base} {...p}><path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></svg>
)
export const CashIcon = (p: P) => (
  <svg {...base} {...p}><rect x="3" y="6" width="18" height="12" rx="1.5" /><circle cx="12" cy="12" r="2.5" /></svg>
)
export const RulerIcon = (p: P) => (
  <svg {...base} {...p}><path d="M3 15 15 3l6 6L9 21l-6-6Z" /><path d="m7 11 2 2M10 8l2 2M13 5l2 2" /></svg>
)
export const ExpandIcon = (p: P) => (
  <svg {...base} {...p}><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>
)
export const StarIcon = ({ filled = true, ...p }: P & { filled?: boolean }) => (
  <svg viewBox="0 0 24 24" {...p}>
    <path
      d="m12 3 2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8 6.6 19.7l1.1-6.1L3.2 9.4l6.1-.8L12 3Z"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinejoin="round"
    />
  </svg>
)
