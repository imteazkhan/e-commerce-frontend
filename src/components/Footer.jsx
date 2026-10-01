import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 bg-primary rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-white">ShopBD</span>
          </div>
          <p className="text-sm leading-relaxed text-gray-400">
            Bangladesh's trusted online shop. Quality products, fast delivery,
            secure payment.
          </p>
          <div className="flex items-center gap-3 mt-5">
            <a
              href="#"
              className="w-9 h-9 border border-gray-700 rounded-md flex items-center justify-center hover:border-white hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z" />
              </svg>
            </a>
            <a
              href="#"
              className="w-9 h-9 border border-gray-700 rounded-md flex items-center justify-center hover:border-white hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 5.9c-.7.3-1.5.6-2.3.7.8-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1a4 4 0 0 0-6.8 3.6A11.4 11.4 0 0 1 3.9 4.6a4 4 0 0 0 1.2 5.4c-.6 0-1.2-.2-1.7-.5v.1a4 4 0 0 0 3.2 3.9c-.6.2-1.2.2-1.8.1a4 4 0 0 0 3.7 2.8A8 8 0 0 1 2 18.1a11.4 11.4 0 0 0 6.2 1.8c7.4 0 11.5-6.1 11.5-11.5v-.5c.8-.6 1.5-1.3 2.3-2z" />
              </svg>
            </a>
            <a
              href="#"
              className="w-9 h-9 border border-gray-700 rounded-md flex items-center justify-center hover:border-white hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4 1.3-.1 1.7-.1 4.9-.1zm0 5a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2zm6.1-8.1a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Shop */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
            Shop
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/products" className="hover:text-white transition-colors">All Products</Link></li>
            <li><Link to="/products?category=electronics" className="hover:text-white transition-colors">Electronics</Link></li>
            <li><Link to="/products?category=fashion" className="hover:text-white transition-colors">Fashion</Link></li>
            <li><Link to="/products?category=home" className="hover:text-white transition-colors">Home & Living</Link></li>
            <li><Link to="/products?sort=new" className="hover:text-white transition-colors">New Arrivals</Link></li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
            Help
          </h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Return Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
            Contact
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 0 1-2.828 0l-4.243-4.243a8 8 0 1 1 11.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
              </svg>
              <span>123 Dhanmondi, Dhaka 1205, Bangladesh</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 0 1 2-2h2.6a1 1 0 0 1 1 .8l.9 4a1 1 0 0 1-.3 1l-1.7 1.7a15 15 0 0 0 6 6l1.7-1.7a1 1 0 0 1 1-.3l4 .9a1 1 0 0 1 .8 1V19a2 2 0 0 1-2 2A17 17 0 0 1 3 5z" />
              </svg>
              <span>01700-000000</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l9 6 9-6M3 6h18v12H3z" />
              </svg>
              <span>support@shopbd.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} ShopBD. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>Payment:</span>
              <span className="px-2 py-1 border border-gray-700 rounded text-white">bKash</span>
              <span className="px-2 py-1 border border-gray-700 rounded text-white">Nagad</span>
              <span className="px-2 py-1 border border-gray-700 rounded text-white">Card</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}