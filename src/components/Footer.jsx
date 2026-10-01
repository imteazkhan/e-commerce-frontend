import { Link } from 'react-router-dom'
import Logo from './Logo'
import { BrandIcon, HeadsetIcon, MailIcon } from './Icons'

const customerCare = [
  { to: '#', label: 'Contact' },
  { to: '#', label: 'Size Chart' },
  { to: '#', label: 'Store Locator' },
  { to: '#', label: 'How To Order' },
]

const important = [
  { to: '#', label: 'Blog & News' },
  { to: '#', label: 'About Us' },
  { to: '#', label: 'Who We Are' },
  { to: '#', label: 'FAQ' },
  { to: '#', label: 'Billing & Payments' },
  { to: '#', label: 'Delivery & Exchange Policy', strong: true },
]

const socials = ['facebook', 'x', 'instagram', 'pinterest', 'youtube', 'linkedin']

const payments = [
  { name: 'VISA', color: 'text-blue-800' },
  { name: 'MasterCard', color: 'text-red-600' },
  { name: 'AMEX', color: 'text-blue-600' },
  { name: 'bKash', color: 'text-pink-600' },
  { name: 'Nagad', color: 'text-orange-600' },
  { name: 'Rocket', color: 'text-purple-700' },
  { name: 'DBBL', color: 'text-emerald-700' },
]

function FooterColumn({ title, links }) {
  return (
    <div>
      <h4 className="mb-4 inline-block border-b border-gray-200 pb-1 text-xs font-bold uppercase tracking-[0.2em] text-gray-900">
        {title}
      </h4>
      <ul className="space-y-2.5 text-xs text-gray-600">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.to} className={`transition-colors hover:text-black ${l.strong ? 'font-medium uppercase' : ''}`}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-16 border-t border-gray-200 bg-white pb-8 pt-16">
      <div className="container-page">
        <div className="grid grid-cols-1 gap-10 pb-12 md:grid-cols-12">
          {/* Brand + helpline */}
          <div className="flex flex-col items-start pr-4 md:col-span-6 lg:col-span-5">
            <Logo light={false} className="mb-6 !items-start" />

            <div className="mb-3 flex items-start gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-red-500 text-red-500">
                <HeadsetIcon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-gray-500">Got questions? Call us 9 AM – 11 PM:</p>
                <a href="tel:+8801700000000" className="text-base font-bold tracking-wide text-gray-900 transition-colors hover:text-red-600">
                  +88 01700-000000
                </a>
              </div>
            </div>

            <div className="mb-6 flex items-center gap-2 text-xs text-gray-600">
              <MailIcon className="h-4 w-4 text-gray-500" />
              <a href="mailto:support@shopbd.com" className="transition-colors hover:text-black">support@shopbd.com</a>
            </div>

            <div className="flex items-center gap-2.5">
              {socials.map((name) => (
                <a
                  key={name}
                  href="#"
                  aria-label={name}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1e2329] text-white transition-colors hover:bg-brand-gold hover:text-black"
                >
                  <BrandIcon name={name} />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-3">
            <FooterColumn title="Customer Care" links={customerCare} />
          </div>
          <div className="md:col-span-3 lg:col-span-4">
            <FooterColumn title="Important" links={important} />
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 text-center">
          <p className="text-[11px] tracking-wider text-gray-500">
            © SHOPBD {year} | All rights reserved.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 border-t border-gray-100 pt-4 opacity-75 grayscale transition-all duration-300 hover:grayscale-0 sm:gap-4">
          <span className="mr-2 text-[10px] font-semibold uppercase tracking-widest text-gray-500">Pay with</span>
          {payments.map((p) => (
            <span key={p.name} className={`rounded bg-stone-100 px-2 py-1 text-[10px] font-bold ${p.color}`}>
              {p.name}
            </span>
          ))}
        </div>
      </div>
    </footer>
  )
}
