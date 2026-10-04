"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/public/components/navbar";
import Bottombar from "@/public/components/bottombar";
import { ShoppingCart, Loader2, ArrowLeft, Heart, Share2, Star, ShieldCheck, Truck, CheckCircle2, AlertCircle } from "lucide-react";
import { productAPI, api } from "@/src/lib/api";

// Look for the auth token wherever the sign-in flow might have stored it.
function getAuthToken(): string | null {
    if (typeof window === "undefined") return null;
    const keys = ["token", "accessToken", "access_token", "authToken", "jwt", "userToken"];
    for (const store of [window.localStorage, window.sessionStorage]) {
        for (const k of keys) {
            const v = store.getItem(k);
            if (v && v !== "undefined" && v !== "null") return v.replace(/^"|"$/g, "");
        }
        // token nested inside a stored user/auth object
        for (const k of ["user", "auth", "userData", "authUser"]) {
            try {
                const parsed = JSON.parse(store.getItem(k) || "null");
                const t = parsed?.token ?? parsed?.accessToken ?? parsed?.data?.token;
                if (t) return String(t);
            } catch { /* not JSON */ }
        }
    }
    const m = document.cookie.match(/(?:^|;\s*)(?:token|accessToken|jwt)=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : null;
}

interface Product {
    id?: string;
    _id?: string;
    title?: string;
    name?: string;
    description?: string;
    price: number | string;
    category?: string;
    images?: string[];
    image?: string;
    rating?: number;
    reviewsCount?: number;
    stock?: number;
}

type Notice = {
    type: "success" | "error";
    text: string;
    showCartLink?: boolean; // only true after a successful add-to-cart
};

// Must match the event name the cart page listens for
const CART_UPDATED_EVENT = "cart:updated";

const SELLER_BLOCKED_MSG =
    "Seller accounts can't add items to a cart. Please sign in with a buyer account to shop.";

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [adding, setAdding] = useState<boolean>(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(1);
    const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
    const [notice, setNotice] = useState<Notice | null>(null);
    const [isSellerAccount, setIsSellerAccount] = useState<boolean>(false); // set once the backend returns 403

    useEffect(() => {
        if (!id) return;

        const fetchProductDetails = async () => {
            try {
                setLoading(true);
                const res = await productAPI.getAllProducts();
                const responseBody = res.data;
                let extractedProducts: Product[] = [];

                if (Array.isArray(responseBody)) {
                    extractedProducts = responseBody;
                } else if (responseBody && typeof responseBody === "object") {
                    const innerData = responseBody.data;
                    if (Array.isArray(innerData)) {
                        extractedProducts = innerData;
                    } else if (innerData && typeof innerData === "object" && Array.isArray(innerData.products)) {
                        extractedProducts = innerData.products;
                    } else if (Array.isArray(responseBody.products)) {
                        extractedProducts = responseBody.products;
                    }
                }

                const found = extractedProducts.find((p: Product) => (p.id || p._id) === id);

                if (found) {
                    setProduct(found);
                } else {
                    setError("Product not found.");
                }
            } catch (err) {
                console.error("Failed to load product details:", err);
                setError("Failed to load product details.");
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [id]);

    const handleAddToCart = async () => {
        if (!product) return;
        const productId = product.id || product._id;
        if (!productId) return;

        // Already known to be a seller: don't hit the backend again
        if (isSellerAccount) {
            setNotice({ type: "error", text: SELLER_BLOCKED_MSG });
            return;
        }

        const token = getAuthToken();
        if (!token) {
            console.warn(
                "No auth token found. localStorage keys:", Object.keys(localStorage),
                "sessionStorage keys:", Object.keys(sessionStorage)
            );
            setNotice({
                type: "error",
                text: "Your login session token wasn't found in the browser. Please sign in again.",
            });
            return;
        }

        try {
            setAdding(true);
            setNotice(null);
            await api.post(
                "/cart/items",
                { productId, quantity },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Tell the rest of the app (cart page, navbar badge) the cart changed
            window.dispatchEvent(new Event(CART_UPDATED_EVENT));

            setNotice({
                type: "success",
                text: `Added ${quantity} ${quantity === 1 ? "item" : "items"} to your cart.`,
                showCartLink: true,
            });
            setQuantity(1);
        } catch (err: any) {
            console.error("Error adding to cart:", err?.response?.status, err?.response?.data);
            const status = err?.response?.status;

            let text: string;
            if (status === 403) {
                // Signed in, but not with a buyer account
                setIsSellerAccount(true);
                text = SELLER_BLOCKED_MSG;
            } else if (status === 401) {
                text = "Your session has expired or the token was rejected. Please sign in again.";
            } else {
                text = err?.response?.data?.message || "Failed to add item to cart. Please try again.";
            }

            setNotice({ type: "error", text });
        } finally {
            setAdding(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen flex-col bg-[#E8C6B5] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#5A3A33]" />
                <p className="text-sm font-medium text-[#5A3A33] mt-2">Loading product details...</p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="flex min-h-screen flex-col bg-[#E8C6B5] text-zinc-900">
                <Navbar activeCategory="" onSelectCategory={() => { }} />
                <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6">
                    <p className="text-red-700 font-medium">{error || "Product not found."}</p>
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="bg-[#5A3A33] text-white px-4 py-2 rounded-lg text-sm font-semibold"
                    >
                        Back to Dashboard
                    </button>
                </div>
                <Bottombar />
            </div>
        );
    }

    const title = product.title || product.name || "Product Details";
    const imagesList = (product.images && product.images.length > 0) ? product.images : (product.image ? [product.image] : ["/placeholder.jpg"]);
    const activeImage = imagesList[selectedImageIndex] || imagesList[0];
    const priceNum = typeof product.price === "number" ? product.price : parseFloat(product.price) || 0;
    const formattedPrice = `$${priceNum.toFixed(2)}`;

    return (
        <main className="flex min-h-screen flex-col bg-[#E8C6B5] text-zinc-900">
            <Navbar activeCategory="" onSelectCategory={() => { }} />

            <div className="flex-1 p-6 max-w-6xl w-full mx-auto flex flex-col gap-6">

                <div className="w-full">
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F4E3D7] border border-white text-[#5A3A33] text-sm font-semibold hover:bg-[#eacfb2] transition-colors shadow-sm"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#F4E3D7] border-2 border-white rounded-3xl p-6 sm:p-8 shadow-sm">

                    {/* Left Column: Image Gallery */}
                    <div className="flex flex-col gap-4">
                        <div className="w-full h-80 sm:h-[420px] rounded-2xl overflow-hidden bg-zinc-200 border border-white/60 relative">
                            <img src={activeImage} alt={title} className="w-full h-full object-cover object-center" />
                        </div>

                        {imagesList.length > 1 && (
                            <div className="flex items-center gap-3 overflow-x-auto pb-1">
                                {imagesList.map((imgUrl, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${selectedImageIndex === index ? "border-[#5A3A33] scale-105" : "border-white/80 opacity-70 hover:opacity-100"}`}
                                    >
                                        <img src={imgUrl} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Product Info & Actions */}
                    <div className="flex flex-col justify-between gap-6">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                {product.category && (
                                    <span className="text-xs uppercase tracking-wider font-semibold text-[#5A3A33]/80 bg-white/60 px-3 py-1 rounded-full w-fit">
                                        {product.category}
                                    </span>
                                )}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setIsWishlisted(!isWishlisted)}
                                        className={`p-2 rounded-full border border-white/80 transition-colors ${isWishlisted ? "bg-red-50 text-red-500" : "bg-white/50 text-[#5A3A33] hover:bg-white"}`}
                                        aria-label="Wishlist"
                                    >
                                        <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(window.location.href);
                                            setNotice({ type: "success", text: "Product link copied to clipboard." });
                                        }}
                                        className="p-2 rounded-full border border-white/80 bg-white/50 text-[#5A3A33] hover:bg-white transition-colors"
                                        aria-label="Share"
                                    >
                                        <Share2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#5A3A33] leading-snug">
                                {title}
                            </h1>

                            <div className="flex items-center gap-2">
                                <div className="flex items-center text-amber-500">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-current" />
                                    ))}
                                </div>
                                <span className="text-xs font-medium text-zinc-600">({product.reviewsCount || 12} reviews)</span>
                            </div>

                            <span className="text-2xl sm:text-3xl font-bold text-zinc-900 mt-1">
                                {formattedPrice}
                            </span>

                            <p className="text-sm text-zinc-700 leading-relaxed mt-2">
                                {product.description || "Elevate your look with premium quality craftsmanship. Designed for comfort, durability, and a flawless finish that lasts all day long."}
                            </p>
                        </div>

                        {/* Quantity Selector & Add to Cart */}
                        <div className="flex flex-col gap-4 pt-2 border-t border-white/60">
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-bold text-[#5A3A33] uppercase tracking-wider">Quantity</span>
                                <div className="flex items-center border border-white/80 bg-white/60 rounded-xl overflow-hidden">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-3 py-1.5 text-zinc-700 hover:bg-white transition-colors font-bold text-sm"
                                    >
                                        -
                                    </button>
                                    <span className="px-4 py-1.5 text-sm font-semibold text-zinc-900 min-w-10 text-center">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="px-3 py-1.5 text-zinc-700 hover:bg-white transition-colors font-bold text-sm"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={adding}
                                className="w-full flex items-center justify-center gap-2 bg-[#5A3A33] text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-[#432A25] transition-colors shadow-sm disabled:opacity-50"
                            >
                                {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
                                {adding ? "Adding..." : `Add to Cart — $${(priceNum * quantity).toFixed(2)}`}
                            </button>

                            {notice && (
                                <div
                                    role={notice.type === "error" ? "alert" : "status"}
                                    className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${
                                        notice.type === "success"
                                            ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                                            : "bg-red-50 border-red-200 text-red-700"
                                    }`}
                                >
                                    <span className="flex items-center gap-2">
                                        {notice.type === "success" ? (
                                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                                        ) : (
                                            <AlertCircle className="w-4 h-4 shrink-0" />
                                        )}
                                        {notice.text}
                                    </span>
                                    {notice.showCartLink && (
                                        <button
                                            onClick={() => router.push("/cart")}
                                            className="font-semibold underline shrink-0"
                                        >
                                            View cart
                                        </button>
                                    )}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-[#5A3A33]">
                                <div className="flex items-center gap-2 bg-white/40 p-2.5 rounded-xl border border-white/60">
                                    <Truck className="w-4 h-4 shrink-0" />
                                    <span>Fast Delivery Available</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/40 p-2.5 rounded-xl border border-white/60">
                                    <ShieldCheck className="w-4 h-4 shrink-0" />
                                    <span>100% Quality Guaranteed</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>

            <Bottombar />
        </main>
    );
}