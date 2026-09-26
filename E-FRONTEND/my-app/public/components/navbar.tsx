import { User, ShoppingCart, Globe, Search } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="w-full bg-[#5A3A33] border-b-2 border-[#5C3A31]/30 px-6 pt-4 pb-3 shadow-sm text-white">
      <div className="max-w-7xl mx-auto flex flex-col gap-4">

        {/* Top Row: Logo, Search Bar, and Icons */}
        <div className="flex items-center justify-between gap-4">

          {/* Logo and App Name */}
          <div className="flex items-center gap-3 shrink-0">
            <img
              src="/Icon.png"
              alt="Hair Haven Logo"
              className="w-8 h-8 object-contain"
            />
            <span className="text-sm font-bold tracking-tight text-white leading-tight">
              Hair<br />Haven
            </span>
          </div>

          {/* Middle Search Bar */}
          <div className="flex-1 max-w-2xl relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search for extensions"
              className="w-full pl-10 pr-4 py-2 text-sm rounded-full bg-white text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#D2CFC6]"
            />
          </div>

          {/* Right Side: Lucide Icons (User, Cart, Globe) */}
          <div className="flex items-center gap-5 shrink-0 text-white">
            <button aria-label="User Profile" className="hover:text-[#D2CFC6] transition-colors">
              <User className="w-5 h-5" />
            </button>
            <button aria-label="Shopping Cart" className="hover:text-[#D2CFC6] transition-colors">
              <ShoppingCart className="w-5 h-5" />
            </button>
            <button aria-label="Change Language or Region" className="hover:text-[#D2CFC6] transition-colors">
              <Globe className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Bottom Row: Categories Spread Evenly */}
        <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-white/90 pt-1 border-t border-white/10 overflow-x-auto whitespace-nowrap gap-4 scrollbar-none">
          <a href="#" className="hover:text-white transition-colors">All Categories</a>
          <a href="#" className="hover:text-white transition-colors">Hair Extensions</a>
          <a href="#" className="hover:text-white transition-colors">Hair Tools</a>
          <a href="#" className="hover:text-white transition-colors">Accessories</a>
          <a href="#" className="hover:text-white transition-colors">Wigs</a>
          <a href="#" className="hover:text-white transition-colors">Oils</a>
          <a href="#" className="hover:text-white transition-colors">More</a>
        </div>

      </div>
    </nav>
  );
}