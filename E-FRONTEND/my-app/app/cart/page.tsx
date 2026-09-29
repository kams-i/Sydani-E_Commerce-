"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Bottombar from "@/public/components/bottombar";
import { cartAPI, orderAPI } from "@/src/lib/api";
import {
    User,
    ShoppingCart,
    Globe,
    Search,
    ShieldCheck,
    Trash2,
    Minus,
    Plus,
    PlusCircle,
    ChevronDown,
    CreditCard,
    Wallet,
    Landmark,
    CheckCircle2,
    Package,
    Loader2,
} from "lucide-react";

// ---------- Types ----------
type CartItem = {
    id: string;        // cart item id (used for update/remove calls)
    productId: string;
    title: string;
    seller: string;
    price: number;
    quantity: number;
};

// ---------- Helpers ----------
// The backend response shape can vary (populated product vs. flat item),
// so we normalise defensively into one CartItem shape.
function normalizeCart(payload: any): CartItem[] {
    const cart = payload?.cart ?? payload?.data ?? payload;
    const rawItems: any[] = cart?.items ?? cart?.cartItems ?? cart?.products ?? [];

    return rawItems.map((it: any) => {
        const product =
            it.product && typeof it.product === "object"
                ? it.product
                : it.productId && typeof it.productId === "object"
                ? it.productId
                : it;

        const seller =
            product?.seller?.fullName ??
            product?.seller?.name ??
            product?.sellerName ??
            (typeof product?.seller === "string" ? product.seller : "") ??
            "";

        return {
            id: String(it._id ?? it.id),
            productId: String(product?._id ?? product?.id ?? it.productId ?? ""),
            title: product?.name ?? product?.title ?? it.name ?? it.title ?? "Untitled product",
            seller,
            price: Number(it.price ?? product?.price ?? 0),
            quantity: Number(it.quantity ?? 1),
        };
    });
}

function errMessage(err: any, fallback: string) {
    return err?.response?.data?.message ?? err?.message ?? fallback;
}

const money = (n: number) => `$${n.toFixed(2)}`;

// ---------- Navbar ----------
function CartNavbar({ count }: { count: number }) {
    const [activeCategory, setActiveCategory] = useState("All Categories");
    const categories = ["All Categories", "Hair Extensions", "Hair Tools", "Accessories", "Wigs", "Oils", "More"];

    return (
        <nav className="w-full bg-[#5A3A33] border-b-2 border-[#5C3A31]/30 px-6 pt-4 pb-3 shadow-sm text-white">
            <div className="max-w-7xl mx-auto flex flex-col gap-4">
                <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-bold tracking-tight text-white leading-tight shrink-0">
                        Hair<br />Haven
                    </span>

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
                        <button aria-label="Shopping Cart" className="text-[#D2CFC6] relative transition-colors">
                            <ShoppingCart className="w-5 h-5 stroke-[2.5]" />
                            {count > 0 && (
                                <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 bg-[#EFA899] text-[#5A3A33] text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {count}
                                </span>
                            )}
                        </button>
                        <button aria-label="Change Language or Region" className="hover:text-[#D2CFC6] transition-colors">
                            <Globe className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-white/90 pt-1 border-t border-white/10 overflow-x-auto whitespace-nowrap gap-4 scrollbar-none">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`transition-colors pb-1 border-b-2 ${
                                activeCategory === category
                                    ? "text-white border-white font-semibold"
                                    : "text-white/80 border-transparent hover:text-white"
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

// ---------- Shared bits ----------
const inputClass =
    "w-full px-4 py-3 bg-transparent border-2 border-[#D2CFC6] rounded-xl text-sm text-zinc-900 placeholder-zinc-500 focus:outline-none focus:border-[#5A3A33]";

function Stepper({ step }: { step: 1 | 2 | 3 }) {
    const dot = (n: number) =>
        n <= step ? "w-4 h-4 rounded-full bg-[#5A3A33] block" : "w-4 h-4 rounded-full border border-zinc-400 bg-white block";
    const label = (n: number) => (n === step ? "text-[#5A3A33] font-bold" : n < step ? "text-[#5A3A33] font-semibold" : "text-zinc-500");
    return (
        <div className="flex items-center justify-center py-2">
            <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium text-zinc-700">
                <div className="flex flex-col items-center gap-1.5"><span className={dot(1)} /><span className={label(1)}>Cart</span></div>
                <div className="w-12 sm:w-20 h-px bg-zinc-400 mb-5" />
                <div className="flex flex-col items-center gap-1.5"><span className={dot(2)} /><span className={label(2)}>Shipping info</span></div>
                <div className="w-12 sm:w-20 h-px bg-zinc-400 mb-5" />
                <div className="flex flex-col items-center gap-1.5"><span className={dot(3)} /><span className={label(3)}>Payment</span></div>
            </div>
        </div>
    );
}

function BuyerProtection() {
    return (
        <div className="bg-[#FDF6F0] border-2 border-white rounded-3xl p-5 shadow-xs flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-zinc-700 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wide">Buyer protection</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                    Get a full refund if the item is not as described or not delivered
                </p>
            </div>
        </div>
    );
}

// ---------- Page ----------
export default function CartPage() {
    // "cart" also renders the empty state automatically when there are no items
    const [viewState, setViewState] = useState<"cart" | "shipping" | "payment" | "success">("cart");
    const [paymentMethod, setPaymentMethod] = useState<"card" | "wallet" | "transfer">("card");

    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [busyItemId, setBusyItemId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [unauthorized, setUnauthorized] = useState(false);

    // Shipping: the backend only needs a single `shippingAddress` string,
    // so we collect the parts and join them at checkout.
    const [shipping, setShipping] = useState({
        address: "",
        city: "",
        state: "",
        country: "Nigeria",
        postalCode: "",
    });
    const [placingOrder, setPlacingOrder] = useState(false);
    const [orderTotal, setOrderTotal] = useState(0);

    // ----- API: load cart -----
    const fetchCart = useCallback(async (showSpinner = false) => {
        if (showSpinner) setLoading(true);
        try {
            const res = await cartAPI.getCart();
            setCartItems(normalizeCart(res.data));
            setUnauthorized(false);
            setError(null);
        } catch (err: any) {
            if (err?.response?.status === 401) {
                setUnauthorized(true);
                setCartItems([]);
            } else {
                setError(errMessage(err, "Could not load your cart."));
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCart(true);
        // Re-sync when the tab regains focus (e.g. after adding a product elsewhere)
        const onRefresh = () => fetchCart();
        window.addEventListener("focus", onRefresh);
        window.addEventListener("cart:updated", onRefresh); // fired by the product page after add-to-cart
        return () => {
            window.removeEventListener("focus", onRefresh);
            window.removeEventListener("cart:updated", onRefresh);
        };
    }, [fetchCart]);

    // ----- API: update quantity -----
    const updateQuantity = async (item: CartItem, delta: number) => {
        const newQty = item.quantity + delta;
        if (newQty < 1) return;

        setBusyItemId(item.id);
        // optimistic update
        setCartItems((items) => items.map((i) => (i.id === item.id ? { ...i, quantity: newQty } : i)));
        try {
            await cartAPI.updateCartItem(item.id, { quantity: newQty });
            await fetchCart();
        } catch (err: any) {
            setError(errMessage(err, "Could not update quantity."));
            await fetchCart(); // roll back to server truth
        } finally {
            setBusyItemId(null);
        }
    };

    // ----- API: remove item -----
    const removeItem = async (item: CartItem) => {
        setBusyItemId(item.id);
        try {
            await cartAPI.removeCartItem(item.id);
            setCartItems((items) => items.filter((i) => i.id !== item.id));
            setError(null);
        } catch (err: any) {
            setError(errMessage(err, "Could not remove item."));
        } finally {
            setBusyItemId(null);
        }
    };

    // ----- Summary (derived from live cart) -----
    const itemCount = useMemo(() => cartItems.reduce((n, i) => n + i.quantity, 0), [cartItems]);
    const subtotal = useMemo(() => cartItems.reduce((acc, i) => acc + i.price * i.quantity, 0), [cartItems]);
    const total = subtotal; // shipping is free; add discounts here when the backend returns them

    // ----- API: checkout -----
    const submitShipping = (e: React.FormEvent) => {
        e.preventDefault();
        setViewState("payment");
    };

    const confirmPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setPlacingOrder(true);
        setError(null);

        const shippingAddress = [
            shipping.address,
            shipping.city,
            shipping.state,
            shipping.postalCode,
            shipping.country,
        ]
            .map((s) => s.trim())
            .filter(Boolean)
            .join(", ");

        try {
            await orderAPI.checkout({ shippingAddress });
            setOrderTotal(total); // snapshot before the cart empties
            setCartItems([]);
            setViewState("success");
            fetchCart();
        } catch (err: any) {
            setError(errMessage(err, "Payment could not be completed. Please try again."));
        } finally {
            setPlacingOrder(false);
        }
    };

    const setField = (key: keyof typeof shipping) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setShipping((s) => ({ ...s, [key]: e.target.value }));

    const isEmpty = !loading && cartItems.length === 0;

    // Reusable order summary
    const SummaryRows = () => (
        <>
            <div className="flex flex-col gap-2.5 text-xs sm:text-sm text-zinc-700 pt-1">
                <div className="flex items-center justify-between">
                    <span>Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})</span>
                    <span className="font-semibold text-zinc-900">{money(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span>Shipping fee</span>
                    <span className="font-semibold text-zinc-900">Free</span>
                </div>
            </div>
            <hr className="border-zinc-300/50 my-1" />
            <div className="flex items-center justify-between text-base font-bold text-zinc-900">
                <span>Total</span>
                <span>{money(total)}</span>
            </div>
        </>
    );

    const ErrorBanner = () =>
        error ? (
            <div role="alert" className="bg-red-50 border-2 border-red-200 text-red-700 text-sm rounded-2xl px-4 py-3">
                {error}
            </div>
        ) : null;

    return (
        <main className="flex min-h-screen flex-col bg-[#E8C6B5] text-zinc-900">
            <CartNavbar count={itemCount} />

            <div className="flex-1 p-6 sm:p-10 max-w-7xl w-full mx-auto flex flex-col gap-6">

                {/* ================= LOADING ================= */}
                {viewState === "cart" && loading && (
                    <div className="flex items-center justify-center gap-3 py-24 text-[#5A3A33]">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-sm font-medium">Loading your cart...</span>
                    </div>
                )}

                {/* ================= EMPTY CART ================= */}
                {viewState === "cart" && isEmpty && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        <div className="lg:col-span-8 flex flex-col gap-5">
                            <div className="bg-[#FDF6F0] border-2 border-white rounded-3xl p-6 shadow-xs">
                                <h1 className="text-xl sm:text-2xl font-bold font-serif text-[#5A3A33]">Cart</h1>
                            </div>

                            <ErrorBanner />

                            <div className="bg-[#FDF6F0] border-2 border-white rounded-3xl p-12 shadow-xs flex flex-col items-center justify-center text-center gap-4 min-h-80">
                                <div className="w-24 h-24 rounded-full bg-pink-100 flex items-center justify-center border border-zinc-200 text-[#5A3A33]">
                                    <ShoppingCart className="w-10 h-10" />
                                </div>
                                <p className="text-base font-semibold text-zinc-800">
                                    {unauthorized ? "Sign in to see your cart" : "Your cart is empty"}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full max-w-xs">
                                    {unauthorized && (
                                        <button
                                            onClick={() => (window.location.href = "/signin")}
                                            className="w-full bg-[#E5D2C5] hover:bg-[#d8c0b0] text-[#5A3A33] font-bold py-2.5 px-6 rounded-xl transition-colors shadow-xs text-sm"
                                        >
                                            Sign in
                                        </button>
                                    )}
                                    <button
                                        onClick={() => (window.location.href = "/dashboard")}
                                        className="w-full bg-[#5A3A33] hover:bg-[#432A25] text-white font-bold py-2.5 px-6 rounded-xl transition-colors shadow-xs text-sm"
                                    >
                                        Explore items
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-4 flex flex-col gap-5">
                            <div className="bg-[#FDF6F0] border-2 border-white rounded-3xl p-6 shadow-xs flex flex-col gap-5">
                                <h2 className="text-xl font-bold font-serif text-[#5A3A33]">Summary</h2>
                                <div className="flex items-center justify-between text-sm font-medium text-zinc-800 pt-1">
                                    <span>Estimated total</span>
                                    <span className="text-lg font-bold text-zinc-900">{money(0)}</span>
                                </div>
                                <button disabled className="w-full bg-[#5A3A33]/50 text-white font-semibold py-3 rounded-2xl cursor-not-allowed text-sm">
                                    Checkout (0)
                                </button>
                            </div>
                            <BuyerProtection />
                        </div>
                    </div>
                )}

                {/* ================= CART WITH ITEMS ================= */}
                {viewState === "cart" && !loading && cartItems.length > 0 && (
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FDF6F0] border-2 border-white px-6 py-4 rounded-3xl shadow-xs">
                            <h1 className="text-xl sm:text-2xl font-bold font-serif text-[#5A3A33]">
                                My Cart{" "}
                                <span className="text-sm font-normal text-zinc-600">
                                    ({itemCount} {itemCount === 1 ? "item" : "items"})
                                </span>
                            </h1>
                            <div className="hidden md:flex items-center gap-3 text-xs font-medium text-zinc-700">
                                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#5A3A33]" /><span className="font-bold text-[#5A3A33]">Cart</span></div>
                                <div className="w-8 h-px bg-zinc-400" />
                                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full border border-zinc-400 bg-white" /><span>Shipping info</span></div>
                                <div className="w-8 h-px bg-zinc-400" />
                                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full border border-zinc-400 bg-white" /><span>Payment</span></div>
                            </div>
                        </div>

                        <ErrorBanner />

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                            {/* Items */}
                            <div className="lg:col-span-8 flex flex-col gap-4">
                                <div className="bg-[#FDF6F0] border-2 border-white rounded-3xl p-6 shadow-xs flex flex-col gap-4">
                                    {cartItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className={`bg-[#F4E3D7] border-2 border-white rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs transition-opacity ${
                                                busyItemId === item.id ? "opacity-60" : ""
                                            }`}
                                        >
                                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                                <div className="w-14 h-14 bg-white rounded-xl shrink-0 border border-zinc-200 flex items-center justify-center text-[#5A3A33]/60">
                                                    <Package className="w-6 h-6" />
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <h2 className="text-xs sm:text-sm font-semibold text-zinc-900 line-clamp-2 max-w-sm">
                                                        {item.title}
                                                    </h2>
                                                    {item.seller && (
                                                        <p className="text-[11px] text-zinc-600">
                                                            Seller: <span className="font-medium">{item.seller}</span>
                                                        </p>
                                                    )}
                                                    <p className="text-[11px] text-zinc-600">{money(item.price)} each</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-300/40">
                                                <div className="flex items-center bg-white border border-zinc-300 rounded-lg overflow-hidden shadow-2xs">
                                                    <button
                                                        onClick={() => updateQuantity(item, -1)}
                                                        disabled={busyItemId === item.id || item.quantity <= 1}
                                                        aria-label="Decrease quantity"
                                                        className="px-2 py-1 text-zinc-700 hover:bg-zinc-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="px-3 text-xs font-bold text-zinc-900">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item, 1)}
                                                        disabled={busyItemId === item.id}
                                                        aria-label="Increase quantity"
                                                        className="px-2 py-1 text-zinc-700 hover:bg-zinc-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>

                                                <div className="text-sm font-bold text-zinc-900 min-w-16 text-right">
                                                    {money(item.price * item.quantity)}
                                                </div>

                                                <button
                                                    onClick={() => removeItem(item)}
                                                    disabled={busyItemId === item.id}
                                                    className="text-zinc-500 hover:text-red-600 transition-colors p-1 disabled:opacity-40"
                                                    aria-label="Remove item"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => (window.location.href = "/dashboard")}
                                    className="w-full bg-[#FDF6F0] hover:bg-[#f6ebd9] border-2 border-white rounded-2xl py-3.5 px-6 flex items-center justify-center gap-2 text-sm font-semibold text-[#5A3A33] shadow-xs transition-colors"
                                >
                                    <PlusCircle className="w-4 h-4" />
                                    Add another item
                                </button>
                            </div>

                            {/* Summary */}
                            <div className="lg:col-span-4 flex flex-col gap-5">
                                <div className="bg-[#FDF6F0] border-2 border-white rounded-3xl p-6 shadow-xs flex flex-col gap-4">
                                    <h2 className="text-xl font-bold font-serif text-[#5A3A33]">Cart Summary</h2>
                                    <SummaryRows />
                                    <button
                                        onClick={() => setViewState("shipping")}
                                        className="w-full bg-[#5A3A33] hover:bg-[#432A25] text-white font-bold py-3.5 rounded-2xl shadow-sm transition-colors text-sm mt-2"
                                    >
                                        Place order
                                    </button>
                                    <p className="text-[11px] text-zinc-500 text-center leading-relaxed">
                                        Upon clicking 'place order', I confirm I have read and acknowledge{" "}
                                        <a href="#" className="underline text-blue-600">all terms and policies</a>
                                    </p>
                                </div>
                                <BuyerProtection />
                            </div>
                        </div>
                    </div>
                )}

                {/* ================= SHIPPING ================= */}
                {viewState === "shipping" && (
                    <div className="flex flex-col gap-6">
                        <Stepper step={2} />

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                            <div className="lg:col-span-8 bg-[#FDF6F0] border-2 border-white rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
                                <h2 className="text-lg sm:text-xl font-bold font-serif text-[#5A3A33] tracking-wide uppercase">
                                    Shipping Address
                                </h2>

                                <form id="shipping-form" onSubmit={submitShipping} className="flex flex-col gap-4">
                                    <input
                                        type="text"
                                        placeholder="Street address (e.g. Newark street, Suncity Estate)"
                                        required
                                        value={shipping.address}
                                        onChange={setField("address")}
                                        className={inputClass}
                                    />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="City"
                                            required
                                            value={shipping.city}
                                            onChange={setField("city")}
                                            className={inputClass}
                                        />
                                        <input
                                            type="text"
                                            placeholder="State"
                                            required
                                            value={shipping.state}
                                            onChange={setField("state")}
                                            className={inputClass}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="relative">
                                            <select
                                                value={shipping.country}
                                                onChange={setField("country")}
                                                className={`${inputClass} appearance-none cursor-pointer`}
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
                                        <input
                                            type="text"
                                            placeholder="Postal code (optional)"
                                            value={shipping.postalCode}
                                            onChange={setField("postalCode")}
                                            className={inputClass}
                                        />
                                    </div>
                                </form>

                                <button
                                    type="button"
                                    onClick={() => setViewState("cart")}
                                    className="self-start text-xs font-semibold text-[#5A3A33] underline"
                                >
                                    Back to cart
                                </button>
                            </div>

                            <div className="lg:col-span-4 flex flex-col gap-5">
                                <div className="bg-[#FDF6F0] border-2 border-white rounded-3xl p-6 shadow-xs flex flex-col gap-4">
                                    <h2 className="text-xl font-bold font-serif text-[#5A3A33]">Order Summary</h2>
                                    <SummaryRows />
                                    <button
                                        type="submit"
                                        form="shipping-form"
                                        className="w-full bg-[#5A3A33] hover:bg-[#432A25] text-white font-bold py-3.5 rounded-2xl shadow-sm transition-colors text-sm mt-2 cursor-pointer"
                                    >
                                        Continue to payment
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ================= PAYMENT ================= */}
                {viewState === "payment" && (
                    <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
                        <Stepper step={3} />

                        <div className="bg-[#FDF6F0] border-2 border-white rounded-3xl p-6 sm:p-10 shadow-xs flex flex-col gap-6">
                            <h2 className="text-xl font-bold font-serif text-[#5A3A33]">Payment Method</h2>

                            <div className="grid grid-cols-3 gap-3 sm:gap-4">
                                {([
                                    { key: "card", label: "Card", Icon: CreditCard },
                                    { key: "wallet", label: "Wallet", Icon: Wallet },
                                    { key: "transfer", label: "Bank Transfer", Icon: Landmark },
                                ] as const).map(({ key, label, Icon }) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setPaymentMethod(key)}
                                        className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                                            paymentMethod === key
                                                ? "border-[#5A3A33] bg-[#F4E3D7] text-[#5A3A33] shadow-xs"
                                                : "border-[#D2CFC6] bg-transparent text-zinc-600 hover:border-zinc-400"
                                        }`}
                                    >
                                        <Icon className="w-6 h-6" />
                                        <span className="text-xs sm:text-sm font-semibold">{label}</span>
                                    </button>
                                ))}
                            </div>

                            <form onSubmit={confirmPayment} className="flex flex-col gap-5 pt-2">
                                {paymentMethod === "card" && (
                                    <>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-semibold text-zinc-800">Name on Card</label>
                                            <input type="text" placeholder="First & Last Name" required className={inputClass} />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-semibold text-zinc-800">Card Number</label>
                                            <input type="text" placeholder="0000 0000 0000 0000" required maxLength={19} className={inputClass} />
                                        </div>
                                        <div className="grid grid-cols-3 gap-3 sm:gap-4">
                                            <div className="relative">
                                                <select defaultValue="" required className={`${inputClass} appearance-none cursor-pointer`}>
                                                    <option value="" disabled>MM</option>
                                                    {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")).map((m) => (
                                                        <option key={m} value={m}>{m}</option>
                                                    ))}
                                                </select>
                                                <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-zinc-600">
                                                    <ChevronDown className="w-3.5 h-3.5" />
                                                </span>
                                            </div>
                                            <div className="relative">
                                                <select defaultValue="" required className={`${inputClass} appearance-none cursor-pointer`}>
                                                    <option value="" disabled>YYYY</option>
                                                    {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() + i).map((y) => (
                                                        <option key={y} value={y}>{y}</option>
                                                    ))}
                                                </select>
                                                <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-zinc-600">
                                                    <ChevronDown className="w-3.5 h-3.5" />
                                                </span>
                                            </div>
                                            <input type="password" placeholder="CVV" required maxLength={4} className={inputClass} />
                                        </div>
                                    </>
                                )}

                                {paymentMethod === "wallet" && (
                                    <div className="p-6 bg-[#F4E3D7] border-2 border-white rounded-2xl flex flex-col items-center justify-center text-center gap-3">
                                        <Wallet className="w-10 h-10 text-[#5A3A33]" />
                                        <p className="text-sm font-semibold text-zinc-800">
                                            Pay securely using your Hair Haven Wallet balance.
                                        </p>
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

                                <div className="bg-[#F4E3D7] border-2 border-white rounded-2xl p-4 flex items-center justify-between mt-2">
                                    <span className="text-sm font-bold text-[#5A3A33]">Total Fee to Pay:</span>
                                    <span className="text-lg font-bold text-zinc-900">{money(total)}</span>
                                </div>

                                <ErrorBanner />

                                <button
                                    type="submit"
                                    disabled={placingOrder}
                                    className="w-full bg-[#5A3A33] hover:bg-[#432A25] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-2xl shadow-sm transition-colors text-sm mt-2 cursor-pointer flex items-center justify-center gap-2"
                                >
                                    {placingOrder && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {placingOrder ? "Placing order..." : "Confirm Payment"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setViewState("shipping")}
                                    className="self-center text-xs font-semibold text-[#5A3A33] underline"
                                >
                                    Back to shipping
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* ================= SUCCESS ================= */}
                {viewState === "success" && (
                    <div className="flex flex-col items-center justify-center py-12 max-w-xl mx-auto w-full">
                        <div className="bg-[#FDF6F0] border-2 border-white rounded-3xl p-8 sm:p-12 shadow-xs flex flex-col items-center justify-center text-center gap-5 w-full">
                            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-xs">
                                <CheckCircle2 className="w-12 h-12" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <h1 className="text-2xl font-bold font-serif text-[#5A3A33]">Payment Successful!</h1>
                                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                                    Thank you for your purchase. Your order has been placed successfully and is now being processed.
                                </p>
                            </div>

                            <div className="bg-[#F4E3D7] border-2 border-white rounded-2xl p-4 w-full flex flex-col gap-2 text-xs text-zinc-700">
                                <div className="flex justify-between">
                                    <span>Transaction Total:</span>
                                    <strong className="text-zinc-900">{money(orderTotal)}</strong>
                                </div>
                                <div className="flex justify-between">
                                    <span>Payment Method:</span>
                                    <strong className="text-zinc-900 uppercase">{paymentMethod}</strong>
                                </div>
                                <div className="flex justify-between gap-4 text-left">
                                    <span className="shrink-0">Ship to:</span>
                                    <strong className="text-zinc-900 text-right">
                                        {[shipping.address, shipping.city, shipping.state, shipping.country].filter(Boolean).join(", ")}
                                    </strong>
                                </div>
                            </div>

                            <button
                                onClick={() => (window.location.href = "/dashboard")}
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
