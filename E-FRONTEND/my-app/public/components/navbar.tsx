"use client";

import { useState } from "react";
import { User, ShoppingCart, Globe, Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface NavbarProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onSearch?: (query: string) => void;
}

export default function Navbar({
  activeCategory,
  onSelectCategory,
  searchQuery = "",
  onSearchChange,
  onSearch,
}: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [localQuery, setLocalQuery] = useState("");
  const query = onSearchChange ? searchQuery : localQuery;
  const showCategories = pathname === "/dashboard";
  const categories = [
    "All Categories",
    "Hair Extensions",
    "Hair Tools",
    "Accessories",
    "Wigs",
    "Oils",
    "More",
  ];

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedQuery = query.trim();
    if (onSearch) {
      onSearch(normalizedQuery);
      return;
    }
    router.push(normalizedQuery ? `/dashboard?search=${encodeURIComponent(normalizedQuery)}` : "/dashboard");
  };

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
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl relative">
            <button
              type="submit"
              aria-label="Search products"
              className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400 hover:text-zinc-700 cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>
            <input
              type="text"
              aria-label="Search products"
              placeholder="Search for products"
              value={query}
              onChange={(event) => {
                if (onSearchChange) {
                  onSearchChange(event.target.value);
                } else {
                  setLocalQuery(event.target.value);
                }
              }}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-full bg-white text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#D2CFC6]"
            />
          </form>

          {/* Right Side: Lucide Icons (User, Cart, Globe) */}
          <div className="flex items-center gap-5 shrink-0 text-white">
            <button
              aria-label="User Profile"
              onClick={() => window.location.href = "/profile"}
              className="hover:text-[#D2CFC6] transition-colors cursor-pointer"
            >
              <User className="w-5 h-5" />
            </button>
            <button
              aria-label="Shopping Cart"
              onClick={() => window.location.href = "/cart"}
              className="hover:text-[#D2CFC6] transition-colors cursor-pointer"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
            <button
              aria-label="Go to dashboard"
              onClick={() => router.push("/dashboard")}
              className="hover:text-[#D2CFC6] transition-colors cursor-pointer"
            >
              <Globe className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Bottom Row: Categories Spread Evenly */}
        {showCategories && (
          <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-white/90 pt-1 border-t border-white/10 overflow-x-auto whitespace-nowrap gap-4 scrollbar-none">
            {categories.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => onSelectCategory(category)}
                  className={`transition-colors pb-1 border-b-2 cursor-pointer ${isActive
                      ? "text-white border-white font-semibold"
                      : "text-white/80 border-transparent hover:text-white"
                    }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        )}

      </div>
    </nav>
  );
}