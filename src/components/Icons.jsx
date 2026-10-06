// Lightweight stroke icons (24x24, currentColor) used across the storefront.
function Icon({ className = 'w-5 h-5', strokeWidth = 1.8, children, ...props }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  )
}

export const SearchIcon = (p) => (
  <Icon {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Icon>
)
export const BagIcon = (p) => (
  <Icon {...p}><path d="M6 7h12l1 13H5L6 7z" /><path d="M9 7a3 3 0 0 1 6 0" /></Icon>
)
export const UserIcon = (p) => (
  <Icon {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></Icon>
)
export const MenuIcon = (p) => (
  <Icon {...p}><path d="M4 7h16M4 12h16M4 17h16" /></Icon>
)
export const CloseIcon = (p) => (
  <Icon {...p}><path d="M6 6l12 12M18 6 6 18" /></Icon>
)
export const ArrowRightIcon = (p) => (
  <Icon {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Icon>
)
export const ChevronRightIcon = (p) => (
  <Icon {...p}><path d="m9 6 6 6-6 6" /></Icon>
)
export const ChevronDownIcon = (p) => (
  <Icon {...p}><path d="m6 9 6 6 6-6" /></Icon>
)
export const PlusIcon = (p) => (
  <Icon {...p}><path d="M12 5v14M5 12h14" /></Icon>
)
export const MinusIcon = (p) => (
  <Icon {...p}><path d="M5 12h14" /></Icon>
)
export const CheckIcon = (p) => (
  <Icon {...p}><path d="m5 12 5 5 9-10" /></Icon>
)
export const TruckIcon = (p) => (
  <Icon {...p}>
    <path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" />
    <circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" />
  </Icon>
)
export const ShieldIcon = (p) => (
  <Icon {...p}><path d="M12 3l8 4v5c0 5-3.4 8.5-8 9-4.6-.5-8-4-8-9V7l8-4z" /><path d="m9 12 2 2 4-4" /></Icon>
)
export const ReturnIcon = (p) => (
  <Icon {...p}><path d="M3 10a9 9 0 1 1 3 6.7" /><path d="M3 4v6h6" /></Icon>
)
export const HeadsetIcon = (p) => (
  <Icon {...p}><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><path d="M4 14h3v5H5a1 1 0 0 1-1-1v-4zM20 14h-3v5h2a1 1 0 0 0 1-1v-4z" /></Icon>
)
export const FilterIcon = (p) => (
  <Icon {...p}><path d="M4 6h16M7 12h10M10 18h4" /></Icon>
)
export const StarIcon = ({ className = 'w-4 h-4', filled = true }) => (
  <svg className={className} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3z" strokeLinejoin="round" />
  </svg>
)
export const ImageIcon = (p) => (
  <Icon {...p}><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="m21 16-5-5-9 9" /></Icon>
)
export const PinIcon = (p) => (
  <Icon {...p}><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></Icon>
)
export const PhoneIcon = (p) => (
  <Icon {...p}><path d="M5 4h3l2 5-2 1.5a11 11 0 0 0 5.5 5.5L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></Icon>
)
export const MailIcon = (p) => (
  <Icon {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></Icon>
)
export const ChevronUpIcon = (p) => (
  <Icon {...p}><path d="m6 15 6-6 6 6" /></Icon>
)
export const GripIcon = (p) => (
  <Icon {...p} strokeWidth={0} fill="currentColor">
    <circle cx="9" cy="6" r="1.5" /><circle cx="15" cy="6" r="1.5" />
    <circle cx="9" cy="12" r="1.5" /><circle cx="15" cy="12" r="1.5" />
    <circle cx="9" cy="18" r="1.5" /><circle cx="15" cy="18" r="1.5" />
  </Icon>
)
export const ChevronLeftIcon = (p) => (
  <Icon {...p}><path d="m15 6-6 6 6 6" /></Icon>
)
export const ArrowLeftIcon = (p) => (
  <Icon {...p}><path d="M19 12H5M11 18l-6-6 6-6" /></Icon>
)
export const HeartIcon = ({ filled = false, ...p }) => (
  <Icon {...p} {...(filled ? { fill: 'currentColor' } : {})}>
    <path d="M12 20.5s-7.2-4.5-9.5-8.8C1 8.3 2.3 5 5.6 4.2c2-.5 3.9.3 5 1.9l1.4 2 1.4-2c1.1-1.6 3-2.4 5-1.9 3.3.8 4.6 4.1 3.1 7.5-2.3 4.3-9.5 8.8-9.5 8.8z" />
  </Icon>
)
export const GridSmallIcon = (p) => (
  <Icon {...p} strokeWidth={0}>
    {[3, 10.5, 18].flatMap((y) =>
      [3, 10.5, 18].map((x) => <rect key={`${x}-${y}`} x={x} y={y} width="3" height="3" fill="currentColor" rx="0.5" />)
    )}
  </Icon>
)
export const GridIcon = (p) => (
  <Icon {...p} strokeWidth={0}>
    <rect x="3" y="3" width="8" height="8" fill="currentColor" rx="0.5" />
    <rect x="13" y="3" width="8" height="8" fill="currentColor" rx="0.5" />
    <rect x="3" y="13" width="8" height="8" fill="currentColor" rx="0.5" />
    <rect x="13" y="13" width="8" height="8" fill="currentColor" rx="0.5" />
  </Icon>
)
export const ListIcon = (p) => (
  <Icon {...p}>
    <rect x="3" y="4.5" width="3" height="3" fill="currentColor" stroke="none" />
    <rect x="3" y="10.5" width="3" height="3" fill="currentColor" stroke="none" />
    <rect x="3" y="16.5" width="3" height="3" fill="currentColor" stroke="none" />
    <path d="M9 6h12M9 12h12M9 18h12" />
  </Icon>
)

// Filled brand icons for social links
const brandPaths = {
  facebook: 'M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z',
  x: 'M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.2-8.3L1.8 3h6.4l4.4 5.8L17.8 3zm-1.1 16.2h1.7L7.4 4.7H5.5l11.2 14.5z',
  instagram: 'M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4 1.3-.1 1.7-.1 4.9-.1zm0 5a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2zm6.1-8.1a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0z',
  pinterest: 'M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.2-2 0-2.9l1.3-5.4s-.3-.7-.3-1.6c0-1.5.9-2.7 2-2.7.9 0 1.4.7 1.4 1.6 0 1-.6 2.4-.9 3.7-.3 1.1.6 2 1.7 2 2 0 3.5-2.1 3.5-5.2 0-2.7-1.9-4.6-4.7-4.6-3.2 0-5.1 2.4-5.1 4.9 0 1 .4 2 .9 2.6.1.1.1.2.1.3l-.3 1.4c-.1.2-.2.3-.4.2-1.4-.7-2.3-2.7-2.3-4.4 0-3.6 2.6-6.9 7.5-6.9 3.9 0 7 2.8 7 6.6 0 3.9-2.5 7.1-5.9 7.1-1.2 0-2.3-.6-2.6-1.3l-.7 2.7c-.3 1-1 2.2-1.4 2.9A10 10 0 1 0 12 2z',
  youtube: 'M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8zM9.7 15.1V8.9l5.8 3.1-5.8 3.1z',
  linkedin: 'M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6h.1c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5v6.2zM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2zM7.1 20.5H3.5V9h3.6v11.5z',
}

export const BrandIcon = ({ name, className = 'w-3.5 h-3.5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d={brandPaths[name]} />
  </svg>
)

// Admin panel
export const DashboardIcon = (p) => (
  <Icon {...p}><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></Icon>
)
export const ReceiptIcon = (p) => (
  <Icon {...p}><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3z" /><path d="M9 8h6M9 12h6M9 16h3" /></Icon>
)
export const BoxIcon = (p) => (
  <Icon {...p}><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3z" /><path d="m4 7.5 8 4.5 8-4.5M12 12v9" /></Icon>
)
export const TagIcon = (p) => (
  <Icon {...p}><path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9-9-9z" /><circle cx="7.5" cy="7.5" r="1.5" /></Icon>
)
export const UsersIcon = (p) => (
  <Icon {...p}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6" /></Icon>
)
export const LayersIcon = (p) => (
  <Icon {...p}><path d="m12 3 9 5-9 5-9-5 9-5z" /><path d="m3 13 9 5 9-5" /></Icon>
)
export const DownloadIcon = (p) => (
  <Icon {...p}><path d="M12 4v11M7 10l5 5 5-5M4 20h16" /></Icon>
)
export const PrinterIcon = (p) => (
  <Icon {...p}><path d="M7 8V3h10v5" /><rect x="3" y="8" width="18" height="9" rx="1" /><path d="M7 14h10v7H7z" /></Icon>
)
export const EditIcon = (p) => (
  <Icon {...p}><path d="M4 20h4L19 9l-4-4L4 16v4z" /><path d="m13.5 6.5 4 4" /></Icon>
)
export const TrashIcon = (p) => (
  <Icon {...p}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></Icon>
)
export const AlertIcon = (p) => (
  <Icon {...p}><path d="M12 3 2 20h20L12 3z" /><path d="M12 10v4M12 17h.01" /></Icon>
)
export const RefreshIcon = (p) => (
  <Icon {...p}><path d="M20 11a8 8 0 0 0-14.5-4.5L4 8M4 4v4h4M4 13a8 8 0 0 0 14.5 4.5L20 16M20 20v-4h-4" /></Icon>
)
export const ExternalIcon = (p) => (
  <Icon {...p}><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></Icon>
)
export const PauseIcon = (p) => (
  <Icon {...p}><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></Icon>
)
export const PlayIcon = (p) => (
  <Icon {...p}><path d="M7 4.5v15l12-7.5-12-7.5z" /></Icon>
)
export const HomeIcon = (p) => (
  <Icon {...p}><path d="M3 11.5 12 4l9 7.5" /><path d="M5.5 9.5V20h13V9.5" /><path d="M10 20v-5h4v5" /></Icon>
)
export const UploadIcon = (p) => (
  <Icon {...p}><path d="M12 16V5M7 10l5-5 5 5M4 20h16" /></Icon>
)
export const EyeIcon = (p) => (
  <Icon {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></Icon>
)
export const EyeOffIcon = (p) => (
  <Icon {...p}><path d="M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-2.2 3.2M6.6 6.6A17 17 0 0 0 2 12s3.5 7 10 7a10 10 0 0 0 5.4-1.6" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2M3 3l18 18" /></Icon>
)
