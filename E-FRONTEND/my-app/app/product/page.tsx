"use client";

import { useState } from "react";
import Navbar from "@/public/components/navbar";
import Bottombar from "@/public/components/bottombar";
import { Heart, Minus, Plus, Check, Star } from "lucide-react";

export default function ProductPage() {
    // Mock product state
    const [quantity, setQuantity] = useState(1);
    const [activeCategory, setActiveCategory] = useState("Oils");

    // Array of image thumbnails (you can replace these paths later)
    const images = [
        "/3f23dcb60daa5abe22e93cde017e86674fe234f8.jpg",
        "/3fed61d3350a6017c223a8128117e484e82a1571.jpg",
        "/940ce29de8de9f04b02a44bb7a4feb9c8f4938a9.jpg",
        "/ad18c947b3afff63082fcc2dfec149346f029d30.jpg",
        "/ed4301b481fa4842e742313c2015966d368e3657.jpg",
    ];

    const [selectedImage, setSelectedImage] = useState(images[0]);

    const handleIncrement = () => setQuantity((prev) => prev + 1);
    const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    return (
        <main className="flex min-h-screen flex-col bg-[#E8C6B5] text-zinc-900">
            {/* Top Navbar Component */}
            <Navbar
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
            />

            {/* Main Product Details Content */}
            <div className="flex-1 p-6 sm:p-10 max-w-7xl w-full mx-auto flex items-center justify-center">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 w-full items-start">

                    {/* Left Column: Image Gallery (Thumbnails + Main Preview) */}
                    <div className="lg:col-span-7 flex flex-col sm:flex-row gap-4 items-center sm:items-start justify-center">

                        {/* Vertical Thumbnail List */}
                        <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible order-2 sm:order-1">
                            {images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(img)}
                                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-white ${selectedImage === img
                                            ? "border-[#5A3A33] ring-2 ring-[#5A3A33]/20 shadow-md"
                                            : "border-white/80 opacity-70 hover:opacity-100"
                                        }`}
                                >
                                    <img
                                        src={img}
                                        alt={`Thumbnail ${index + 1}`}
                                        className="w-full h-full object-cover object-center"
                                    />
                                </button>
                            ))}
                        </div>

                        {/* Main Large Image Display */}
                        <div className="w-full max-w-lg aspect-square bg-[#F4E3D7] border-2 border-white rounded-3xl overflow-hidden relative shadow-sm order-1 sm:order-2 flex items-center justify-center">
                            <button
                                aria-label="Add to wishlist"
                                className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/80 backdrop-blur-md text-[#5A3A33] hover:bg-white transition-colors shadow-sm"
                            >
                                <Heart className="w-5 h-5" />
                            </button>
                            <img
                                src={selectedImage}
                                alt="Gisou Honey Infused Hair Oil"
                                className="w-full h-full object-cover object-center"
                            />
                        </div>

                    </div>

                    {/* Right Column: Product Information & Purchase Actions */}
                    <div className="lg:col-span-5 flex flex-col gap-5">

                        {/* Product Title */}
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-[#5A3A33] tracking-tight leading-snug">
                            Gisou Honey Infused Hair Oil (0.7 Fl Oz)
                        </h1>

                        {/* Description */}
                        <p className="text-sm sm:text-base text-zinc-800 leading-relaxed font-normal">
                            Intense hydration, long-lasting frizz control, up to 450°F heat protection, glossy shine, suitable for all hair types
                        </p>

                        {/* Rating & Brand */}
                        <div className="flex flex-wrap items-center gap-4 text-sm pt-1">
                            <div className="flex items-center gap-1.5 font-semibold text-zinc-900">
                                <span>5.0</span>
                                <div className="flex text-amber-500 gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-current" />
                                    ))}
                                </div>
                                <span className="text-zinc-600 font-normal">(100)</span>
                            </div>
                            <span className="text-zinc-400">|</span>
                            <div className="text-zinc-800">
                                <span className="font-medium">Brand:</span>{" "}
                                <span className="text-[#5A3A33] font-semibold">Gisou</span>{" "}
                                <a href="#" className="text-blue-600 hover:underline text-xs ml-1">
                                    Search for similar products
                                </a>
                            </div>
                        </div>

                        {/* Divider */}
                        <hr className="border-[#5A3A33]/20 my-1" />

                        {/* Pricing Details */}
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-4 text-xs text-zinc-600 font-medium">
                                <span>Tax inclusive <span className="font-semibold text-zinc-800">$50.00</span></span>
                                <span>Tax exclusive <span className="font-semibold text-zinc-800">$49.00</span></span>
                            </div>
                            <div className="text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight">
                                $50<span className="text-xl font-semibold">.00</span>
                            </div>
                        </div>

                        {/* Quantity Counter & Control Box */}
                        <div className="flex items-center justify-between bg-[#F4E3D7] border-2 border-white rounded-2xl p-2 max-w-sm shadow-sm">
                            <button
                                onClick={handleDecrement}
                                aria-label="Decrease quantity"
                                className="p-2.5 rounded-xl bg-white text-zinc-700 hover:bg-zinc-100 transition-colors shadow-xs"
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-lg font-bold text-zinc-900 px-4">
                                {quantity}
                            </span>
                            <button
                                onClick={handleIncrement}
                                aria-label="Increase quantity"
                                className="p-2.5 rounded-xl bg-white text-zinc-700 hover:bg-zinc-100 transition-colors shadow-xs"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3 max-w-sm pt-2">
                            <button className="w-full bg-[#F4E3D7] hover:bg-[#ebd5c5] border-2 border-white text-[#5A3A33] font-bold py-3.5 px-6 rounded-2xl shadow-sm transition-all text-center">
                                Add to cart
                            </button>
                            <button className="flex items-center justify-center gap-2 text-sm font-semibold text-[#5A3A33] hover:text-black transition-colors py-1">
                                <Heart className="w-4 h-4" />
                                Add to wishlist
                            </button>
                        </div>

                        {/* Delivery / Pickup Info Notice */}
                        <div className="flex items-start gap-2.5 pt-2 text-xs sm:text-sm text-zinc-800">
                            <Check className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium">
                                    Pickup available at Hair Haven HQ IDU
                                </p>
                                <a href="#" className="text-blue-600 underline hover:text-blue-800 mt-0.5 inline-block">
                                    See more on delivery details below
                                </a>
                            </div>
                        </div>

                    </div>

                </div>
            </div>

            {/* Footer / Bottom Bar Component */}
            <Bottombar />
        </main>
    );
}