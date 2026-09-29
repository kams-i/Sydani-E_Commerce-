"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/public/components/navbar";
import Bottombar from "@/public/components/bottombar";
import { ShoppingCart, Loader2 } from "lucide-react";
import { productAPI, cartAPI } from "@/src/lib/api";

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
    tag?: string;
    badge?: string;
}

export default function Dashboard() {
    const router = useRouter();
    const [activeCategory, setActiveCategory] = useState("All Categories");
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [addingId, setAddingId] = useState<string | null>(null);

    const banners = [
        {
            tag: "Hot Tools, Hot Deals 🔥",
            heading: "Save up to \n30% OFF",
            subtitle: "On selected hair equipment.",
            buttonText: "Shop the deal!",
            image: "/dfdaa49cd1830ca2678db49e62ba0add10339c2e.jpg",
        },
        {
            tag: "New Arrivals",
            heading: "Discover your\nperfect wigs",
            subtitle: "",
            buttonText: "Explore now",
            image: "/db7a33d06adf1bb7b762e0ac6131bcb86ab543f7.jpg",
        },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-advance banner every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [banners.length]);

    const currentBanner = banners[currentIndex];

    // Fetch products from backend database on mount
    useEffect(() => {
        const fetchProducts = async () => {
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

                setProducts(extractedProducts);
                setError(null);
            } catch (err: any) {
                console.error("Failed to fetch products:", err);
                setError("Failed to load products from the server. Please try again later.");
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Handle adding item to cart
    const handleAddToCart = async (e: React.MouseEvent, productId: string) => {
        e.stopPropagation(); // Prevent card click event from triggering navigation
        try {
            setAddingId(productId);
            await cartAPI.addToCart({ productId, quantity: 1 });
            alert("Item added to cart successfully!");
        } catch (err: any) {
            console.error("Error adding item to cart:", err);
            alert(err.response?.data?.message || "Failed to add item to cart. Please make sure you are signed in.");
        } finally {
            setAddingId(null);
        }
    };

    const showAll = activeCategory === "All Categories";
    const safeProducts = Array.isArray(products) ? products : [];

    // Helper to normalize and match category names flexibly
    const filterByCategory = (categoryName: string) => {
        return safeProducts.filter((p) => {
            const cat = p.category || "";
            return cat.toLowerCase() === categoryName.toLowerCase();
        });
    };

    // Dynamic categorization based on backend records
    const trendingDealsItems = showAll ? safeProducts.slice(0, 4) : filterByCategory(activeCategory);
    const wigsItems = filterByCategory("Wigs");
    const hairAccessoriesItems = filterByCategory("Accessories");
    const hairExtensionsItems = filterByCategory("Hair Extensions");
    const oilsItems = filterByCategory("Oils");
    const hairToolsItems = filterByCategory("Hair Tools");

    // Helper to get image URL safely
    const getProductImage = (item: Product) => {
        if (item.images && item.images.length > 0) return item.images[0];
        if (item.image) return item.image;
        return "/placeholder.jpg";
    };

    // Helper to format price safely
    const formatPrice = (price: number | string) => {
        if (typeof price === "number") return `$${price.toFixed(2)}`;
        if (typeof price === "string") {
            const parsed = parseFloat(price);
            if (!isNaN(parsed)) return `$${parsed.toFixed(2)}`;
            if (price.startsWith("$")) return price;
        }
        return `$${price}`;
    };

    return (
        <main className="flex min-h-screen flex-col bg-[#E8C6B5] text-zinc-900">

            {/* Top Navbar Component with Category State */}
            <Navbar
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
            />

            {/* Main Content Area */}
            <div className="flex-1 p-6 max-w-7xl w-full mx-auto flex flex-col gap-6">

                {/* Promotional Hero Banner Section */}
                {(showAll || activeCategory === "Hair Tools") && (
                    <div className="w-full flex flex-col items-center gap-3">
                        <p className="text-[#5A3A33] font-serif text-sm sm:text-base tracking-wide font-medium">
                            Everything Hair. All in One Place
                        </p>

                        <div className="w-full border-2 border-white relative rounded-3xl overflow-hidden shadow-sm bg-pink-100 min-h-80 sm:min-h-95 flex items-start transition-all duration-500">
                            <div className="absolute inset-0 z-0">
                                <img
                                    src={currentBanner.image}
                                    alt="Promotional Banner"
                                    className="w-full h-full object-cover object-center transition-opacity duration-700"
                                />
                            </div>

                            <div className="relative z-10 p-6 sm:p-10 flex flex-col items-start gap-3 max-w-md">
                                <div className="bg-pink-300/85 backdrop-blur-sm text-[#5A3A33] px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm">
                                    {currentBanner.tag}
                                </div>

                                <h2 className="text-2xl sm:text-4xl font-medium text-zinc-900 tracking-tight leading-tight whitespace-pre-line">
                                    {currentBanner.heading}
                                </h2>

                                {currentBanner.subtitle && (
                                    <p className="text-xs sm:text-sm font-medium text-zinc-800">
                                        {currentBanner.subtitle}
                                    </p>
                                )}

                                <button className="mt-1 bg-black text-white px-5 py-2.5 rounded-lg text-xs font-semibold tracking-wide hover:bg-zinc-800 transition-colors shadow-md">
                                    {currentBanner.buttonText}
                                </button>
                            </div>

                            <div className="absolute bottom-4 right-6 z-20 flex items-center gap-1.5 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full">
                                {banners.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentIndex(index)}
                                        className={`h-2 rounded-full transition-all ${currentIndex === index ? "w-6 bg-white" : "w-2 bg-white/50"}`}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading & Error States */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-[#5A3A33]" />
                        <p className="text-sm font-medium text-[#5A3A33]">Loading products from database...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                {!loading && !error && (
                    <>
                        {/* Trending Deals / All Categories Section */}
                        {(showAll || activeCategory === "Hair Extensions" || activeCategory === "More") && trendingDealsItems.length > 0 && (
                            <div className="flex flex-col gap-4 pt-2">
                                <h2 className="text-xl sm:text-2xl font-bold text-[#5A3A33] font-serif">
                                    {showAll ? "Trending Deals" : activeCategory}
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                    {trendingDealsItems.map((item) => {
                                        const itemId = item.id || item._id || "";
                                        const title = item.title || item.name || "Product";
                                        return (
                                            <div
                                                key={itemId}
                                                onClick={() => router.push(`/product/${itemId}`)}
                                                className="bg-[#F4E3D7] border-2 border-white rounded-2xl p-3 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                            >
                                                <div className="w-full h-64 bg-zinc-200 rounded-xl overflow-hidden relative">
                                                    <img
                                                        src={getProductImage(item)}
                                                        alt={title}
                                                        className="w-full h-full object-cover object-center"
                                                    />
                                                </div>
                                                <div className="mt-3 flex flex-col justify-between flex-1 gap-2">
                                                    <p className="text-xs sm:text-sm font-medium text-zinc-800 line-clamp-2">
                                                        {title}
                                                    </p>
                                                    <div className="flex items-center justify-between pt-1">
                                                        <span className="text-sm sm:text-base font-bold text-zinc-900">
                                                            {formatPrice(item.price)}
                                                        </span>
                                                        <button
                                                            onClick={(e) => handleAddToCart(e, itemId)}
                                                            disabled={addingId === itemId}
                                                            aria-label="Add to cart"
                                                            className="p-2 rounded-lg bg-[#5A3A33] text-white hover:bg-[#432A25] transition-colors shadow-sm disabled:opacity-50"
                                                        >
                                                            {addingId === itemId ? (
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                            ) : (
                                                                <ShoppingCart className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Wigs Section */}
                        {(showAll || activeCategory === "Wigs") && wigsItems.length > 0 && (
                            <div className="flex flex-col gap-4 pt-2">
                                <h2 className="text-xl sm:text-2xl font-bold text-[#5A3A33] font-serif">
                                    Wigs
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                    {wigsItems.map((item) => {
                                        const itemId = item.id || item._id || "";
                                        const title = item.title || item.name || "Wig";
                                        return (
                                            <div
                                                key={itemId}
                                                onClick={() => router.push(`/product/${itemId}`)}
                                                className="bg-[#F4E3D7] border-2 border-white rounded-2xl p-3 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                            >
                                                <div className="w-full h-64 bg-zinc-200 rounded-xl overflow-hidden relative">
                                                    <img
                                                        src={getProductImage(item)}
                                                        alt={title}
                                                        className="w-full h-full object-cover object-center"
                                                    />
                                                </div>
                                                <div className="mt-3 flex flex-col justify-between flex-1 gap-2">
                                                    <p className="text-xs sm:text-sm font-medium text-zinc-800 line-clamp-2">
                                                        {title}
                                                    </p>
                                                    <div className="flex items-center justify-between pt-1">
                                                        <span className="text-sm sm:text-base font-bold text-[#C84B31]">
                                                            {formatPrice(item.price)}
                                                        </span>
                                                        <button
                                                            onClick={(e) => handleAddToCart(e, itemId)}
                                                            disabled={addingId === itemId}
                                                            aria-label="Add to cart"
                                                            className="p-1.5 sm:p-2 rounded-lg bg-transparent border border-[#5A3A33]/40 text-[#5A3A33] hover:bg-[#5A3A33] hover:text-white transition-colors shadow-sm disabled:opacity-50"
                                                        >
                                                            {addingId === itemId ? (
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                            ) : (
                                                                <ShoppingCart className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Hair Accessories Section */}
                        {(showAll || activeCategory === "Accessories") && hairAccessoriesItems.length > 0 && (
                            <div className="flex flex-col gap-4 pt-2">
                                <h2 className="text-xl sm:text-2xl font-bold text-[#5A3A33] font-serif">
                                    Hair Accessories
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                    {hairAccessoriesItems.map((item) => {
                                        const itemId = item.id || item._id || "";
                                        const title = item.title || item.name || "Accessory";
                                        return (
                                            <div
                                                key={itemId}
                                                onClick={() => router.push(`/product/${itemId}`)}
                                                className="bg-[#F4E3D7] border-2 border-white rounded-2xl p-3 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                            >
                                                <div className="w-full h-64 bg-zinc-200 rounded-xl overflow-hidden relative">
                                                    <img
                                                        src={getProductImage(item)}
                                                        alt={title}
                                                        className="w-full h-full object-cover object-center"
                                                    />
                                                </div>
                                                <div className="mt-3 flex flex-col justify-between flex-1 gap-2">
                                                    <p className="text-xs sm:text-sm font-medium text-zinc-800 line-clamp-2">
                                                        {title}
                                                    </p>
                                                    <div className="flex items-center justify-between pt-1">
                                                        <span className="text-sm sm:text-base font-bold text-[#C84B31]">
                                                            {formatPrice(item.price)}
                                                        </span>
                                                        <button
                                                            onClick={(e) => handleAddToCart(e, itemId)}
                                                            disabled={addingId === itemId}
                                                            aria-label="Add to cart"
                                                            className="p-1.5 sm:p-2 rounded-lg bg-transparent border border-[#5A3A33]/40 text-[#5A3A33] hover:bg-[#5A3A33] hover:text-white transition-colors shadow-sm disabled:opacity-50"
                                                        >
                                                            {addingId === itemId ? (
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                            ) : (
                                                                <ShoppingCart className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Empty State when no products match current category filter */}
                        {showAll && safeProducts.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                                <h3 className="text-xl font-bold text-[#5A3A33] font-serif">
                                    No Products Found
                                </h3>
                                <p className="text-sm text-zinc-700">
                                    There are currently no products available in the database. Check back soon!
                                </p>
                            </div>
                        )}

                        {!showAll && filterByCategory(activeCategory).length === 0 && (
                            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                                <h3 className="text-xl font-bold text-[#5A3A33] font-serif">
                                    {activeCategory}
                                </h3>
                                <p className="text-sm text-zinc-700">
                                    No products available in this category at the moment. Check back soon!
                                </p>
                            </div>
                        )}
                    </>
                )}

            </div>

            {/* Footer / Bottom Bar Component */}
            <Bottombar />

        </main>
    );
}