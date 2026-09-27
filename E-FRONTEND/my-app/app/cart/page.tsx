"use client";

import { useState } from "react";
import Navbar from "@/public/components/navbar";
import Bottombar from "@/public/components/bottombar";
import {
    User,
    ShoppingCart,
    Globe,
    Search,
    ChevronRight,
    ShieldCheck,
    Trash2,
    Minus,
    Plus,
    PlusCircle,
    ChevronDown,
    CreditCard,
    Wallet,
    Landmark,
    CheckCircle2
} from "lucide-react";

// Customized Navbar for Cart page with the Shopping Cart icon highlighted
function CartNavbar() {
    const [activeCategory, setActiveCategory] = useState("All Categories");
    const categories = ["All Categories", "Hair Extensions", "Hair Tools", "Accessories", "Wigs", "Oils", "More"];

    return (
        <nav className="w-full bg-[#5A3A33] border-b-2 border-[#5C3A31]/30 px-6 pt-4 pb-3 shadow-sm text-white">
            <div className="max-w-7xl mx-auto flex flex-col gap-4">
                {/* Top Row: Logo, Search Bar, and Icons */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 shrink-0">
                        <img src="/Icon.png" alt="Hair Haven Logo" className="w-8 h-8 object-contain" />
                        <span className="text-sm font-bold tracking-tight text-white leading-tight">
                            Hair<br />Haven
                        </span>
                    </div>

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

                    <div className="flex items-center gap-5 shrink-0 text-white">
                        <button aria-label="User Profile" className="hover:text-[#D2CFC6] transition-colors">
                            <User className="w-5 h-5" />
                        </button>
                        {/* Highlighted Cart Icon */}
                        <button aria-label="Shopping Cart" className="text-[#D2CFC6] relative transition-colors">
                            <ShoppingCart className="w-5 h-5 stroke-[2.5]" />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#EFA899] rounded-full"></span>
                        </button>
                        <button aria-label="Change Language or Region" className="hover:text-[#D2CFC6] transition-colors">
                            <Globe className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Bottom Row: Categories */}
                <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-white/90 pt-1 border-t border-white/10 overflow-x-auto whitespace-nowrap gap-4 scrollbar-none">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`transition-colors pb-1 border-b-2 ${activeCategory === category ? "text-white border-white font-semibold" : "text-white/80 border-transparent hover:text-white"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
}

export default function CartPage() {
    // Toggle states: 
    // "empty" = empty cart view
    // "cart" = cart with items view
    // "shipping" = shipping details form view
    // "payment" = payment method view
    // "success" = payment success confirmation view
    const [viewState, setViewState] = useState<"empty" | "cart" | "shipping" | "payment" | "success">("cart");
    const [paymentMethod, setPaymentMethod] = useState<"card" | "wallet" | "transfer">("card");

    // Cart items state for the filled view
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            title: "1pc/3pcs multicolor Synthetic Hair Extensions, Sew-In",
            seller: "Fajjahstore",
            price: 3.99,
            quantity: 2,
            image: "/16a00f01c9cb67b64346ad6c2e9d83a6d6cb97bb.jpg",
        },
        {
            id: 2,
            title: "3pc Hair Beauty clips",
            seller: "Fajjahstore",
            price: 3.99,
            quantity: 2,
            image: "/604418dbdc744a353d6b50fd94f7b95f1ba10927.jpg",
        },
        {
            id: 3,
            title: "1 Pack Black Afro Kinkys Bulk Hair 12/16 Inch",
            seller: "Fajjahstore",
            price: 3.99,
            quantity: 2,
            image: "/848898184460f5ea60b8c7f9cac7c7d5cc355d58.jpg",
        },
    ]);

    const updateQuantity = (id: number, delta: number) => {
        setCartItems(items =>
            items.map(item => {
                if (item.id === id) {
                    const newQty = item.quantity + delta;
                    return { ...item, quantity: newQty > 0 ? newQty : 1 };
                }
                return item;
            })
        );
    };

    const removeItem = (id: number) => {
        setCartItems(items => items.filter(item => item.id !== id));
    };

    // Calculations for summary
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const displaySubtotal = subtotal > 0 ? subtotal : 13003.87;
    const savedAmount = 4552.11; 
    const finalTotal = displaySubtotal > savedAmount ? displaySubtotal - savedAmount : 0;

    return (
        <main className="flex min-h-screen flex-col bg-[#E8C6B5] text-zinc-900">
            <CartNavbar />

            <div className="flex-1 p-6 sm:p-10 max-w-7xl w-full mx-auto flex flex-col gap-6">

                {viewState === "empty" && (
                    /* ================= EMPTY CART VIEW ================= */
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        <div className="lg:col-span-8 flex flex-col gap-5">
                            <div className="bg-[#FDF6F0] border-2 border-white rounded-3xl p-6 shadow-xs flex flex-col gap-4">
                                <h1 className="text-xl sm:text-2xl font-bold font-serif text-[#5A3A33]">
                                    Cart
                                </h1>
                                <div className="bg-[#5A3A33] text-white px-4 py-3 rounded-xl flex items-center justify-between text-xs sm:text-sm font-medium cursor-pointer hover:bg-[#432A25] transition-colors">
                                    <span><strong className="font-bold">NEW SEASON SALE</strong> Ends: Aug 26, 23:59 PT</span>
                                    <ChevronRight className="w-4 h-4" />
                                </div>
                            </div>

                            <div className="bg-[#FDF6F0] border-2 border-white rounded-3xl p-12 shadow-xs flex flex-col items-center justify-center text-center gap-4 min-h-80">
                                <div className="w-24 h-24 rounded-full bg-pink-100 flex items-center justify-center overflow-hidden border border-zinc-200">
                                    <img
                                        src="/399dc223ab5ba012557fd9f0bab64f7f29450e42.jpg"
                                        alt="Empty shopping cart illustration"
                                        className="w-full h-full object-cover opacity-80"
                                    />
                                </div>
                                <p className="text-base font-semibold text-zinc-800">
                                    Your Cart is empty
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full max-w-xs">
                                    <button className="w-full bg-[#E5D2C5] hover:bg-[#d8c0b0] text-[#5A3A33] font-bold py-2.5 px-6 rounded-xl transition-colors shadow-xs text-sm">
                                        Sign in
                                    </button>
                                    <button
                                        onClick={() => window.location.href = "/dashboard"}
                                        className="w-full bg-[#5A3A33] hover:bg-[#432A25] text-white font-bold py-2.5 px-6 rounded-xl transition-colors shadow-xs text-sm"
                                    >
                                        Explore items
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-4 flex flex-col gap-5">
                            <div className="bg-[#FDF6F0] border-2 border-white rounded-3xl p-6 shadow-xs flex flex-col gap-5">
                                <h2 className="text-xl font-bold font-serif text-[#5A3A33]">
                                    Summary
                                </h2>
                                <div className="flex items-center justify-between text-sm font-medium text-zinc-800 pt-1">
                                    <span>Estimated total</span>
                                    <span className="text-lg font-bold text-zinc-900">$0</span>
                                </div>
                                <button disabled className="w-full bg-[#5A3A33]/50 text-white font-semibold py-3 rounded-2xl cursor-not-allowed text-sm">
                                    Checkout (0)
                                </button>
                            </div>

                            <div className="bg-[#FDF6F0] border-2 border-white rounded-3xl p-5 shadow-xs flex items-start gap-3">
                                <ShieldCheck className="w-5 h-5 text-zinc-700 shrink-0 mt-0.5" />
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wide">
                                        Buyer protection
                                    </h3>
                                    <p className="text-xs text-zinc-600 leading-relaxed">
                                        Get a full refund if the item is not as described or not delivered
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {viewState === "cart" && (
                    /* ================= CART WITH ITEMS VIEW ================= */
                    <div className="flex flex-col gap-6">

                        {/* Top Stepper Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FDF6F0] border-2 border-white px-6 py-4 rounded-3xl shadow-xs">
                            <h1 className="text-xl sm:text-2xl font-bold font-serif text-[#5A3A33]">
                                My Cart Page <span className="text-sm font-normal text-zinc-600">({cartItems.length} items)</span>
                            </h1>

                            {/* Step indicator graphics */}
                            <div className="hidden md:flex items-center gap-3 text-xs font-medium text-zinc-700">
                                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#5A3A33]"></span><span className="font-bold text-[#5A3A33]">Cart</span></div>
                                <div className="w-8 h-px bg-zinc-400"></div>
                                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full border border-zinc-400 bg-white"></span><span>Shipping info</span></div>
                                <div className="w-8 h-px bg-zinc-400"></div>
                                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full border border-zinc-400 bg-white"></span><span>Payment</span></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                            {/* Left Column: List of Items */}
                            <div className="lg:col-span-8 flex flex-col gap-4">
                                <div className="bg-[#FDF6F0] border-2 border-white rounded-3xl p-6 shadow-xs flex flex-col gap-4">
                                    {cartItems.length === 0 ? (
                                        <div className="text-center py-8 text-zinc-600 text-sm">
                                            Your cart is currently empty.
                                        </div>
                                    ) : (
                                        cartItems.map((item) => (
                                            <div
                                                key={item.id}
                                                className="bg-[#F4E3D7] border-2 border-white rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs"
                                            >
                                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                                    <div className="w-20 h-20 bg-white rounded-xl overflow-hidden shrink-0 border border-zinc-200">
                                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <h2 className="text-xs sm:text-sm font-semibold text-zinc-900 line-clamp-2 max-w-sm">
                                                            {item.title}
                                                        </h2>
                                                        <p className="text-[11px] text-zinc-600">
                                                            Seller: <span className="font-medium">{item.seller}</span>
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-300/40">
                                                    <div className="flex items-center bg-white border border-zinc-300 rounded-lg overflow-hidden shadow-2xs">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, -1)}
                                                            className="px-2 py-1 text-zinc-700 hover:bg-zinc-100 transition-colors"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="px-3 text-xs font-bold text-zinc-900">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, 1)}
                                                            className="px-2 py-1 text-zinc-700 hover:bg-zinc-100 transition-colors"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>

                                                    <div className="text-sm font-bold text-zinc-900 min-w-16 text-right">
                                                        ${(item.price * item.quantity).toFixed(2)}
                                                    </div>

                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-zinc-500 hover:text-red-600 transition-colors p-1"
                                                        aria-label="Remove item"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <button
                                    onClick={() => window.location.href = "/dashboard"}
                                    className="w-full bg-[#FDF6F0] hover:bg-[#f6ebd9] border-2 border-white rounded-2xl py-3.5 px-6 flex items-center justify-center gap-2 text-sm font-semibold text-[#5A3A33] shadow-xs transition-colors"
                                >
                                    <PlusCircle className="w-4 h-4" />
                                    Add Another Item
                                </button>
                            </div>

                            {/* Right Column: Cart Summary */}
                            <div className="lg:col-span-4 flex flex-col gap-5">
                                <div className="bg-[#FDF6F0] border-2 border-white rounded-3xl p-6 shadow-xs flex flex-col gap-4">
                                    <h2 className="text-xl font-bold font-serif text-[#5A3A33]">
                                        Cart Summary
                                    </h2>

                                    <div className="flex flex-col gap-2.5 text-xs sm:text-sm text-zinc-700 pt-1">
                                        <div className="flex items-center justify-between">
                                            <span>Subtotal</span>
                                            <span className="font-semibold text-zinc-900">${subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>saved</span>
                                            <span className="font-semibold text-emerald-700">-${savedAmount.toFixed(2)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Promo code</span>
                                            <span className="font-medium text-zinc-500">Entry</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Shipping fee</span>
                                            <span className="font-semibold text-zinc-900">Free</span>
                                        </div>
                                    </div>

                                    <hr className="border-zinc-300/50 my-1" />

                                    <div className="flex items-center justify-between text-base font-bold text-zinc-900">
                                        <span>Total</span>
                                        <span>${(subtotal > savedAmount ? subtotal - savedAmount : 0).toFixed(2)}</span>
                                    </div>

                                    {/* Place Order Trigger */}
                                    <button 
                                        onClick={() => setViewState("shipping")}
                                        className="w-full bg-[#5A3A33] hover:bg-[#432A25] text-white font-bold py-3.5 rounded-2xl shadow-sm transition-colors text-sm mt-2"
                                    >
                                        Place Order
                                    </button>

                                    <p className="text-[11px] text-zinc-500 text-center leading-relaxed">
                                        Upon clicking 'place order', I confirm I have read and acknowledge <a href="#" className="underline text-blue-600">all terms and policies</a>
                                    </p>
                                </div>

                                <div className="bg-[#FDF6F0] border-2 border-white rounded-3xl p-5 shadow-xs flex items-start gap-3">
                                    <ShieldCheck className="w-5 h-5 text-zinc-700 shrink-0 mt-0.5" />
                                    <div className="flex flex-col gap-1">
                                        <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wide">
                                            Buyer protection
                                        </h3>
                                        <p className="text-xs text-zinc-600 leading-relaxed">
                                            Get a full refund if the item is not as described or not delivered
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                {viewState === "shipping" && (
                    /* ================= SHIPPING DETAILS / ADDRESS VIEW ================= */
                    <div className="flex flex-col gap-6">

                        {/* Top Stepper Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-center py-2">
                            <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium text-zinc-700">
                                <div className="flex flex-col items-center gap-1.5">
                                    <span className="w-4 h-4 rounded-full bg-[#5A3A33] block"></span>
                                    <span className="text-[#5A3A33] font-semibold">Cart</span>
                                </div>
                                <div className="w-12 sm:w-20 h-px bg-zinc-400 mb-5"></div>
                                <div className="flex flex-col items-center gap-1.5">
                                    <span className="w-4 h-4 rounded-full bg-[#5A3A33] block"></span>
                                    <span className="text-[#5A3A33] font-bold">Shipping info</span>
                                </div>
                                <div className="w-12 sm:w-20 h-px bg-zinc-400 mb-5"></div>
                                <div className="flex flex-col items-center gap-1.5">
                                    <span className="w-4 h-4 rounded-full border border-zinc-400 bg-white block"></span>
                                    <span className="text-zinc-500">Payment</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                            {/* Left Column: Shipping Address Form */}
                            <div className="lg:col-span-8 bg-[#FDF6F0] border-2 border-white rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
                                <h2 className="text-lg sm:text-xl font-bold font-serif text-[#5A3A33] tracking-wide uppercase">
                                    Shipping Address
                                </h2>

                                <form id="shipping-form" onSubmit={(e) => { e.preventDefault(); setViewState("payment"); }} className="flex flex-col gap-4">
                                    {/* Email */}
                                    <div className="flex flex-col gap-1.5">
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            required
                                            className="w-full px-4 py-3 bg-transparent border-2 border-[#D2CFC6] rounded-xl text-sm text-zinc-900 placeholder-zinc-500 focus:outline-none focus:border-[#5A3A33]"
                                        />
                                    </div>

                                    {/* First & Last Name */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Full name"
                                            required
                                            className="w-full px-4 py-3 bg-transparent border-2 border-[#D2CFC6] rounded-xl text-sm text-zinc-900 placeholder-zinc-500 focus:outline-none focus:border-[#5A3A33]"
                                        />
                                        <input
                                            type="text"
                                            placeholder="LastName"
                                            required
                                            className="w-full px-4 py-3 bg-transparent border-2 border-[#D2CFC6] rounded-xl text-sm text-zinc-900 placeholder-zinc-500 focus:outline-none focus:border-[#5A3A33]"
                                        />
                                    </div>

                                    {/* Company */}
                                    <div className="flex flex-col gap-1.5">
                                        <input
                                            type="text"
                                            placeholder="Company (optional)"
                                            className="w-full px-4 py-3 bg-transparent border-2 border-[#D2CFC6] rounded-xl text-sm text-zinc-900 placeholder-zinc-500 focus:outline-none focus:border-[#5A3A33]"
                                        />
                                    </div>

                                    {/* State & Address */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="State"
                                            required
                                            className="w-full px-4 py-3 bg-transparent border-2 border-[#D2CFC6] rounded-xl text-sm text-zinc-900 placeholder-zinc-500 focus:outline-none focus:border-[#5A3A33]"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Address"
                                            required
                                            className="w-full px-4 py-3 bg-transparent border-2 border-[#D2CFC6] rounded-xl text-sm text-zinc-900 placeholder-zinc-500 focus:outline-none focus:border-[#5A3A33]"
                                        />
                                    </div>

                                    {/* Country Selector */}
                                    <div className="relative">
                                        <select
                                            defaultValue="Nigeria"
                                            className="w-full px-4 py-3 bg-transparent border-2 border-[#D2CFC6] rounded-xl text-sm text-zinc-900 focus:outline-none focus:border-[#5A3A33] appearance-none cursor-pointer"
                                        >
                                            <option value="Nigeria">Nigeria</option>
                                            <option value="Ghana">Ghana</option>
                                            <option value="United States">United States</option>
                                            <option value="United Kingdom">United Kingdom</option>
                                            <option value="Canada">Canada</option>
                                        </select>
                                        <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-zinc-600">
                                            <ChevronDown className="w-4 h-4" />
                                        </span>
                                    </div>

                                    {/* Postal Code & Telephone */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Postal Code"
                                            className="w-full px-4 py-3 bg-transparent border-2 border-[#D2CFC6] rounded-xl text-sm text-zinc-900 placeholder-zinc-500 focus:outline-none focus:border-[#5A3A33]"
                                        />
                                        <input
                                            type="tel"
                                            placeholder="Telephone"
                                            required
                                            className="w-full px-4 py-3 bg-transparent border-2 border-[#D2CFC6] rounded-xl text-sm text-zinc-900 placeholder-zinc-500 focus:outline-none focus:border-[#5A3A33]"
                                        />
                                    </div>
                                </form>
                            </div>

                            {/* Right Column: Summary */}
                            <div className="lg:col-span-4 flex flex-col gap-5">
                                <div className="bg-[#FDF6F0] border-2 border-white rounded-3xl p-6 shadow-xs flex flex-col gap-4">
                                    <h2 className="text-xl font-bold font-serif text-[#5A3A33]">
                                        Shipping address
                                    </h2>

                                    <div className="flex flex-col gap-3 text-xs sm:text-sm text-zinc-700 pt-1">
                                        <div className="flex items-center justify-between">
                                            <span>Subtotal</span>
                                            <span className="font-semibold text-zinc-900">${displaySubtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>saved</span>
                                            <span className="font-semibold text-zinc-900">-${savedAmount.toFixed(2)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Promo code</span>
                                            <span className="font-medium text-zinc-900">Entry</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Shipping fee</span>
                                            <span className="font-semibold text-zinc-900">Free</span>
                                        </div>
                                    </div>

                                    <hr className="border-zinc-300/50 my-1" />

                                    <div className="flex items-center justify-between text-base font-bold text-zinc-900">
                                        <span>Total</span>
                                        <span>${finalTotal.toFixed(2)}</span>
                                    </div>

                                    <button 
                                        type="submit"
                                        form="shipping-form"
                                        className="w-full bg-[#5A3A33] hover:bg-[#432A25] text-white font-bold py-3.5 rounded-2xl shadow-sm transition-colors text-sm mt-2 cursor-pointer"
                                    >
                                        Place Order
                                    </button>

                                    <p className="text-[11px] text-zinc-500 text-center leading-relaxed">
                                        Upon clicking 'place order', I confirm I have read and acknowledge <a href="#" className="underline text-blue-600">all terms and policies</a>
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                {viewState === "payment" && (
                    /* ================= PAYMENT METHOD VIEW ================= */
                    <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">

                        {/* Top Stepper Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-center py-2">
                            <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium text-zinc-700">
                                <div className="flex flex-col items-center gap-1.5">
                                    <span className="w-4 h-4 rounded-full bg-[#5A3A33] block"></span>
                                    <span className="text-[#5A3A33] font-semibold">Cart</span>
                                </div>
                                <div className="w-12 sm:w-20 h-px bg-zinc-400 mb-5"></div>
                                <div className="flex flex-col items-center gap-1.5">
                                    <span className="w-4 h-4 rounded-full bg-[#5A3A33] block"></span>
                                    <span className="text-[#5A3A33] font-semibold">Shipping info</span>
                                </div>
                                <div className="w-12 sm:w-20 h-px bg-zinc-400 mb-5"></div>
                                <div className="flex flex-col items-center gap-1.5">
                                    <span className="w-4 h-4 rounded-full bg-[#5A3A33] block"></span>
                                    <span className="text-[#5A3A33] font-bold">Payment</span>
                                </div>
                            </div>
                        </div>

                        {/* Unilateral Payment Card matching provided UI */}
                        <div className="bg-[#FDF6F0] border-2 border-white rounded-3xl p-6 sm:p-10 shadow-xs flex flex-col gap-6">
                            <h2 className="text-xl font-bold font-serif text-[#5A3A33]">
                                Payment Method
                            </h2>

                            {/* Payment Option Selector Buttons */}
                            <div className="grid grid-cols-3 gap-3 sm:gap-4">
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod("card")}
                                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                                        paymentMethod === "card"
                                            ? "border-[#5A3A33] bg-[#F4E3D7] text-[#5A3A33] shadow-xs"
                                            : "border-[#D2CFC6] bg-transparent text-zinc-600 hover:border-zinc-400"
                                    }`}
                                >
                                    <CreditCard className="w-6 h-6" />
                                    <span className="text-xs sm:text-sm font-semibold">Card</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod("wallet")}
                                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                                        paymentMethod === "wallet"
                                            ? "border-[#5A3A33] bg-[#F4E3D7] text-[#5A3A33] shadow-xs"
                                            : "border-[#D2CFC6] bg-transparent text-zinc-600 hover:border-zinc-400"
                                    }`}
                                >
                                    <Wallet className="w-6 h-6" />
                                    <span className="text-xs sm:text-sm font-semibold">Wallet</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod("transfer")}
                                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                                        paymentMethod === "transfer"
                                            ? "border-[#5A3A33] bg-[#F4E3D7] text-[#5A3A33] shadow-xs"
                                            : "border-[#D2CFC6] bg-transparent text-zinc-600 hover:border-zinc-400"
                                    }`}
                                >
                                    <Landmark className="w-6 h-6" />
                                    <span className="text-xs sm:text-sm font-semibold">Bank Transfer</span>
                                </button>
                            </div>

                            <form onSubmit={(e) => { e.preventDefault(); setViewState("success"); }} className="flex flex-col gap-5 pt-2">
                                {paymentMethod === "card" && (
                                    <>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-semibold text-zinc-800">Name on Card</label>
                                            <input
                                                type="text"
                                                placeholder="First & Last Name"
                                                required
                                                className="w-full px-4 py-3 bg-transparent border-2 border-[#D2CFC6] rounded-xl text-sm text-zinc-900 placeholder-zinc-500 focus:outline-none focus:border-[#5A3A33]"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-semibold text-zinc-800">Card Number</label>
                                            <input
                                                type="text"
                                                placeholder="0000 0000 0000 0000"
                                                required
                                                maxLength={19}
                                                className="w-full px-4 py-3 bg-transparent border-2 border-[#D2CFC6] rounded-xl text-sm text-zinc-900 placeholder-zinc-500 focus:outline-none focus:border-[#5A3A33]"
                                            />
                                        </div>

                                        <div className="grid grid-cols-3 gap-3 sm:gap-4">
                                            <div className="relative">
                                                <select
                                                    defaultValue=""
                                                    required
                                                    className="w-full px-3 py-3 bg-transparent border-2 border-[#D2CFC6] rounded-xl text-sm text-zinc-900 focus:outline-none focus:border-[#5A3A33] appearance-none cursor-pointer"
                                                >
                                                    <option value="" disabled>MM</option>
                                                    <option value="01">01</option><option value="02">02</option><option value="03">03</option><option value="04">04</option>
                                                    <option value="05">05</option><option value="06">06</option><option value="07">07</option><option value="08">08</option>
                                                    <option value="09">09</option><option value="10">10</option><option value="11">11</option><option value="12">12</option>
                                                </select>
                                                <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-zinc-600">
                                                    <ChevronDown className="w-3.5 h-3.5" />
                                                </span>
                                            </div>

                                            <div className="relative">
                                                <select
                                                    defaultValue=""
                                                    required
                                                    className="w-full px-3 py-3 bg-transparent border-2 border-[#D2CFC6] rounded-xl text-sm text-zinc-900 focus:outline-none focus:border-[#5A3A33] appearance-none cursor-pointer"
                                                >
                                                    <option value="" disabled>YYYY</option>
                                                    <option value="2026">2026</option><option value="2027">2027</option><option value="2028">2028</option>
                                                    <option value="2029">2029</option><option value="2030">2030</option><option value="2031">2031</option>
                                                </select>
                                                <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-zinc-600">
                                                    <ChevronDown className="w-3.5 h-3.5" />
                                                </span>
                                            </div>

                                            <div className="relative">
                                                <input
                                                    type="password"
                                                    placeholder="CVV"
                                                    required
                                                    maxLength={4}
                                                    className="w-full px-3 py-3 bg-transparent border-2 border-[#D2CFC6] rounded-xl text-sm text-zinc-900 placeholder-zinc-500 focus:outline-none focus:border-[#5A3A33]"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {paymentMethod === "wallet" && (
                                    <div className="p-6 bg-[#F4E3D7] border-2 border-white rounded-2xl flex flex-col items-center justify-center text-center gap-3">
                                        <Wallet className="w-10 h-10 text-[#5A3A33]" />
                                        <p className="text-sm font-semibold text-zinc-800">
                                            Pay securely using your Hair Haven Wallet balance.
                                        </p>
                                        <p className="text-xs text-zinc-600">Available Balance: <strong className="text-zinc-900">$15,450.00</strong></p>
                                    </div>
                                )}

                                {paymentMethod === "transfer" && (
                                    <div className="p-6 bg-[#F4E3D7] border-2 border-white rounded-2xl flex flex-col items-center justify-center text-center gap-3">
                                        <Landmark className="w-10 h-10 text-[#5A3A33]" />
                                        <p className="text-sm font-semibold text-zinc-800">
                                            Transfer funds directly to our designated bank account. Bank details will display upon confirmation.
                                        </p>
                                    </div>
                                )}

                                {/* Total Fee Section */}
                                <div className="bg-[#F4E3D7] border-2 border-white rounded-2xl p-4 flex items-center justify-between mt-2">
                                    <span className="text-sm font-bold text-[#5A3A33]">Total Fee to Pay:</span>
                                    <span className="text-lg font-bold text-zinc-900">${finalTotal.toFixed(2)}</span>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-[#5A3A33] hover:bg-[#432A25] text-white font-bold py-3.5 rounded-2xl shadow-sm transition-colors text-sm mt-2 cursor-pointer"
                                >
                                    Confirm Payment
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {viewState === "success" && (
                    /* ================= PAYMENT SUCCESS VIEW ================= */
                    <div className="flex flex-col items-center justify-center py-12 max-w-xl mx-auto w-full">
                        <div className="bg-[#FDF6F0] border-2 border-white rounded-3xl p-8 sm:p-12 shadow-xs flex flex-col items-center justify-center text-center gap-5 w-full">
                            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-xs">
                                <CheckCircle2 className="w-12 h-12" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <h1 className="text-2xl font-bold font-serif text-[#5A3A33]">
                                    Payment Successful!
                                </h1>
                                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                                    Thank you for your purchase. Your order has been placed successfully and is now being processed.
                                </p>
                            </div>

                            <div className="bg-[#F4E3D7] border-2 border-white rounded-2xl p-4 w-full flex flex-col gap-2 text-xs text-zinc-700">
                                <div className="flex justify-between">
                                    <span>Transaction Total:</span>
                                    <strong className="text-zinc-900">${finalTotal.toFixed(2)}</strong>
                                </div>
                                <div className="flex justify-between">
                                    <span>Payment Method:</span>
                                    <strong className="text-zinc-900 uppercase">{paymentMethod}</strong>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    window.location.href = "/dashboard";
                                }}
                                className="w-full bg-[#5A3A33] hover:bg-[#432A25] text-white font-bold py-3.5 rounded-2xl shadow-sm transition-colors text-sm mt-3 cursor-pointer"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                )}

            </div>

            <Bottombar />
        </main>
    );
}