"use client";

import { useState } from "react";
import Navbar from "@/public/components/navbar";
import Bottombar from "@/public/components/bottombar";
import AddProductModal from "@/public/components/addProduct";
import {
    Store,
    PackagePlus,
    Tag,
    Star,
    MapPin,
    Trash2,
    Box,
    DollarSign
} from "lucide-react";

interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    image: string;
}

export default function SellerProfilePage() {
    const [activeCategory, setActiveCategory] = useState("All Categories");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Initial dummy products listed by the seller
    const [products, setProducts] = useState<Product[]>([
        {
            id: "PROD-1",
            title: "Silky Straight Human Hair Bundle 18\"",
            description: "100% human virgin hair, tangle-free and minimal shedding.",
            price: 39.99,
            stock: 15,
            category: "Hair Extensions",
            image: "/16a00f01c9cb67b64346ad6c2e9d83a6d6cb97bb.jpg"
        },
        {
            id: "PROD-2",
            title: "3pc Hair Beauty Clips & Styling Set",
            description: "Professional grade stainless steel clips for sectioning hair.",
            price: 12.50,
            stock: 40,
            category: "Hair Tools",
            image: "/604418dbdc744a353d6b50fd94f7b95f1ba10927.jpg"
        },
        {
            id: "PROD-3",
            title: "Black Afro Kinkys Bulk Hair 12/16 Inch",
            description: "Perfect for braids, loc extensions, and natural styling.",
            price: 24.99,
            stock: 8,
            category: "Hair Extensions",
            image: "/848898184460f5ea60b8c7f9cac7c7d5cc355d58.jpg"
        }
    ]);

    const handleAddProduct = (newProductData: Omit<Product, "id">) => {
        const newProduct: Product = {
            id: `PROD-${Date.now()}`,
            ...newProductData,
        };
        setProducts([newProduct, ...products]);
    };

    const handleDeleteProduct = (id: string) => {
        setProducts(products.filter((p) => p.id !== id));
    };

    return (
        <main className="flex min-h-screen flex-col bg-[#E8C6B5] text-zinc-900">
            <Navbar activeCategory={activeCategory} onSelectCategory={setActiveCategory} />

            <div className="flex-1 p-6 sm:p-10 max-w-6xl w-full mx-auto flex flex-col gap-8">

                {/* Seller Profile Header Card */}
                <div className="bg-[#FDF6F0] border-2 border-white rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-5 w-full sm:w-auto">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#F4E3D7] border-2 border-white flex items-center justify-center text-[#5A3A33] shadow-inner shrink-0">
                            <Store className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.2]" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <h1 className="text-xl sm:text-2xl font-bold font-serif text-[#5A3A33]">
                                Haven Luxury Wigs & More
                            </h1>
                            <p className="text-xs sm:text-sm text-zinc-600">
                                seller@hairhaven.com
                            </p>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F4E3D7] text-[#5A3A33] text-[11px] font-semibold rounded-full w-fit mt-1 border border-white">
                                <Star className="w-3 h-3 fill-[#5A3A33]" /> Verified Storefront
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:items-end gap-2 text-xs sm:text-sm text-zinc-700 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-zinc-300/50">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#5A3A33]" />
                            <span>Abuja, Nigeria</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Box className="w-4 h-4 text-[#5A3A33]" />
                            <span>Active Listings: <strong>{products.length}</strong></span>
                        </div>
                    </div>
                </div>

                {/* Action Bar / Add Product Button */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <h2 className="text-xl font-bold font-serif text-[#5A3A33] flex items-center gap-2">
                        <Tag className="w-5 h-5" /> Store Products ({products.length})
                    </h2>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-3 bg-[#5A3A33] hover:bg-[#492e28] text-white text-sm font-semibold rounded-full shadow-sm transition-colors cursor-pointer"
                    >
                        <PackagePlus className="w-4 h-4" /> Add Product
                    </button>
                </div>

                {/* Display Products Put Out on the Platform */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-[#FDF6F0] border-2 border-white rounded-3xl p-5 shadow-xs flex flex-col justify-between gap-4 transition-all hover:shadow-md"
                        >
                            <div className="flex flex-col gap-3">
                                {/* Product Image */}
                                <div className="w-full h-44 bg-[#F4E3D7] rounded-2xl overflow-hidden border border-zinc-200 relative">
                                    <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-xs text-[#5A3A33] text-[10px] font-bold rounded-full shadow-2xs">
                                        {product.category}
                                    </span>
                                </div>

                                {/* Details */}
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-sm font-bold text-zinc-900 line-clamp-1">
                                        {product.title}
                                    </h3>
                                    <p className="text-xs text-zinc-600 line-clamp-2">
                                        {product.description || "No description provided."}
                                    </p>
                                </div>
                            </div>

                            {/* Footer Pricing & Actions */}
                            <div className="flex items-center justify-between pt-3 border-t border-zinc-300/40">
                                <div className="flex flex-col">
                                    <span className="text-base font-bold font-serif text-[#5A3A33]">
                                        ${product.price.toFixed(2)}
                                    </span>
                                    <span className="text-[11px] text-zinc-500">
                                        Stock: {product.stock} units
                                    </span>
                                </div>

                                <button
                                    onClick={() => handleDeleteProduct(product.id)}
                                    className="p-2.5 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-700 transition-colors cursor-pointer"
                                    title="Delete Product"
                                    aria-label="Delete Product"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {products.length === 0 && (
                        <div className="col-span-full py-12 text-center text-zinc-600 bg-[#FDF6F0] rounded-3xl border-2 border-white">
                            <p>You haven't listed any products yet. Click &quot;Add Product&quot; to get started!</p>
                        </div>
                    )}
                </div>

            </div>

            {/* Add Product Modal */}
            <AddProductModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAddProduct={handleAddProduct}
            />

            <Bottombar />
        </main>
    );
}