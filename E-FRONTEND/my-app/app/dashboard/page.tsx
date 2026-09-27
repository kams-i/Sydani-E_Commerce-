"use client";

import { useState, useEffect } from "react";
import Navbar from "@/public/components/navbar";
import Bottombar from "@/public/components/bottombar";
import { ShoppingCart } from "lucide-react";

export default function Dashboard() {
    const [activeCategory, setActiveCategory] = useState("All Categories");

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

    // Dummy data for the 4 Trending Deals items
    const trendingDeals = [
        {
            id: 1,
            title: "5*5 200% Brown Density Body wave",
            price: "$27.89",
            image: "/77ebc86847ed3dde591a0b99e355ec8894d8f5c7.jpg",
        },
        {
            id: 2,
            title: "1 Pack Black Afro Kinkys Bulk Hair 12/16 inch",
            price: "$2.57",
            image: "/59f319226a7dde7f2379ab20552774beccb6a55c.jpg",
        },
        {
            id: 3,
            title: "1pc/3pcs multicolor Synthetic Hair Extensions, Sew-in",
            price: "$1.89",
            image: "/399dc223ab5ba012557fd9f0bab64f7f29450e42.jpg",
        },
        {
            id: 4,
            title: "1pc Adjustable Hair Curler Rotatable Power",
            price: "$12.00",
            image: "/82f8e9f529fc4a00f8b443a89f78e749bc44f145.jpg",
        },
    ];

    // Dummy data for the Wigs section items matching your reference layout
    const wigsItems = [
        {
            id: 1,
            tag: "-11%",
            title: "5*5 200% Brown Density Body wave",
            price: "$27.89",
            image: "/852caf3d69999f7ab03189833b59cb62b348a62c.jpg",
        },
        {
            id: 2,
            tag: "-55%",
            title: "1 Pack Black Afro Kinkys Bulk Hair 12/16 inch",
            price: "$2.57",
            image: "/848898184460f5ea60b8c7f9cac7c7d5cc355d58.jpg",
        },
        {
            id: 3,
            tag: "-59%",
            badge: "#7 Bestseller",
            title: "1pc/3pcs multicolor Synthetic Hair Extensions, Sew-In",
            price: "$1.89",
            image: "/16a00f01c9cb67b64346ad6c2e9d83a6d6cb97bb.jpg",
        },
        {
            id: 4,
            tag: "-57%",
            title: "1pc Adjustable Hair Curler Rotatable Power",
            price: "$12.02",
            image: "/92c42f029407b1917299dc1d5ee3e60e10a95309.jpg",
        },
    ];

    // Dummy data for the Hair Accessories section items
    const hairAccessoriesItems = [
        {
            id: 1,
            tag: "-15%",
            title: "Elastic Headbands & Satin Scrunchies Set",
            price: "$4.99",
            image: "/b629730db675b7a20688f5ca40921e5adf1be6e9.jpg",
        },
        {
            id: 2,
            tag: "-40%",
            title: "Pink Hair Styling Spray Bottle & Clips Kit",
            price: "$3.50",
            image: "/f3f35273cffd877558529f7b9b44b93fed4a124a.jpg",
        },
        {
            id: 3,
            tag: "-50%",
            badge: "Top Rated",
            title: "Satin Silk Sleep Bonnets (Brown & Black)",
            price: "$5.20",
            image: "/78686720d97109ba8c16a75391668d7c91a58bed.jpg",
        },
        {
            id: 4,
            tag: "-30%",
            title: "Pearl & Star Decorative Hair Clips Set",
            price: "$2.99",
            image: "/604418dbdc744a353d6b50fd94f7b95f1ba10927.jpg",
        },
    ];

    const showAll = activeCategory === "All Categories";

    return (
        <main className="flex min-h-screen flex-col bg-[#E8C6B5] text-zinc-900">

            {/* Top Navbar Component with Category State */}
            <Navbar 
                activeCategory={activeCategory} 
                onSelectCategory={setActiveCategory} 
            />

            {/* Main Content Area */}
            <div className="flex-1 p-6 max-w-7xl w-full mx-auto flex flex-col gap-6">

                {/* Promotional Hero Banner Section (Shows on All Categories or specific fits) */}
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

                {/* Trending Deals Section */}
                {(showAll || activeCategory === "Hair Extensions") && (
                    <div className="flex flex-col gap-4 pt-2">
                        <h2 className="text-xl sm:text-2xl font-bold text-[#5A3A33] font-serif">
                            Trending Deals
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {trendingDeals.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-[#F4E3D7] border-2 border-white rounded-2xl p-3 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="w-full h-64 bg-zinc-200 rounded-xl overflow-hidden relative">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover object-center"
                                        />
                                    </div>
                                    <div className="mt-3 flex flex-col justify-between flex-1 gap-2">
                                        <p className="text-xs sm:text-sm font-medium text-zinc-800 line-clamp-2">
                                            {item.title}
                                        </p>
                                        <div className="flex items-center justify-between pt-1">
                                            <span className="text-sm sm:text-base font-bold text-zinc-900">
                                                {item.price}
                                            </span>
                                            <button
                                                aria-label="Add to cart"
                                                className="p-2 rounded-lg bg-[#5A3A33] text-white hover:bg-[#432A25] transition-colors shadow-sm"
                                            >
                                                <ShoppingCart className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Wigs Section */}
                {(showAll || activeCategory === "Wigs") && (
                    <div className="flex flex-col gap-4 pt-2">
                        <h2 className="text-xl sm:text-2xl font-bold text-[#5A3A33] font-serif">
                            Wigs
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {wigsItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-[#F4E3D7] border-2 border-white rounded-2xl p-3 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="w-full h-64 bg-zinc-200 rounded-xl overflow-hidden relative">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover object-center"
                                        />
                                    </div>
                                    <div className="mt-3 flex flex-col justify-between flex-1 gap-2">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <span className="bg-[#EFA899] text-[#5A3A33] font-bold text-[10px] px-1.5 py-0.5 rounded">
                                                {item.tag}
                                            </span>
                                            {item.badge && (
                                                <span className="bg-[#DEB887]/60 text-[#5A3A33] font-semibold text-[10px] px-1.5 py-0.5 rounded">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs sm:text-sm font-medium text-zinc-800 line-clamp-2">
                                            {item.title}
                                        </p>
                                        <div className="flex items-center justify-between pt-1">
                                            <span className="text-sm sm:text-base font-bold text-[#C84B31]">
                                                {item.price}
                                            </span>
                                            <button
                                                aria-label="Add to cart"
                                                className="p-1.5 sm:p-2 rounded-lg bg-transparent border border-[#5A3A33]/40 text-[#5A3A33] hover:bg-[#5A3A33] hover:text-white transition-colors shadow-sm"
                                            >
                                                <ShoppingCart className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Hair Accessories Section */}
                {(showAll || activeCategory === "Accessories") && (
                    <div className="flex flex-col gap-4 pt-2">
                        <h2 className="text-xl sm:text-2xl font-bold text-[#5A3A33] font-serif">
                            Hair Accessories
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {hairAccessoriesItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-[#F4E3D7] border-2 border-white rounded-2xl p-3 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="w-full h-64 bg-zinc-200 rounded-xl overflow-hidden relative">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover object-center"
                                        />
                                    </div>
                                    <div className="mt-3 flex flex-col justify-between flex-1 gap-2">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <span className="bg-[#EFA899] text-[#5A3A33] font-bold text-[10px] px-1.5 py-0.5 rounded">
                                                {item.tag}
                                            </span>
                                            {item.badge && (
                                                <span className="bg-[#DEB887]/60 text-[#5A3A33] font-semibold text-[10px] px-1.5 py-0.5 rounded">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs sm:text-sm font-medium text-zinc-800 line-clamp-2">
                                            {item.title}
                                        </p>
                                        <div className="flex items-center justify-between pt-1">
                                            <span className="text-sm sm:text-base font-bold text-[#C84B31]">
                                                {item.price}
                                            </span>
                                            <button
                                                aria-label="Add to cart"
                                                className="p-1.5 sm:p-2 rounded-lg bg-transparent border border-[#5A3A33]/40 text-[#5A3A33] hover:bg-[#5A3A33] hover:text-white transition-colors shadow-sm"
                                            >
                                                <ShoppingCart className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State / Placeholder for categories with no mock data yet (Oils, Hair Tools, More) */}
                {(!showAll && 
                  activeCategory !== "Hair Extensions" && 
                  activeCategory !== "Wigs" && 
                  activeCategory !== "Accessories") && (
                    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                        <h3 className="text-xl font-bold text-[#5A3A33] font-serif">
                            {activeCategory}
                        </h3>
                        <p className="text-sm text-zinc-700">
                            No products available in this category at the moment. Check back soon!
                        </p>
                    </div>
                )}

            </div>

            {/* Footer / Bottom Bar Component */}
            <Bottombar />

        </main>
    );
}