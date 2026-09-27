"use client";

import { useState } from "react";
import { X, Plus, Upload, Tag, DollarSign, Layers, Box, Trash2 } from "lucide-react";

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddProduct: (product: {
        title: string;
        description: string;
        price: number;
        stock: number;
        category: string;
        image: string;
        images: string[];
    }) => void;
}

export default function AddProductModal({ isOpen, onClose, onAddProduct }: AddProductModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [category, setCategory] = useState("Hair Extensions");
    const [images, setImages] = useState<string[]>([]);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const filesArray = Array.from(e.target.files);
        
        // Convert files to local object URLs for preview (up to 10 files limit based on design)
        const newImageUrls = filesArray.map((file) => URL.createObjectURL(file));
        setImages((prev) => [...prev, ...newImageUrls].slice(0, 10));
    };

    const handleRemoveImage = (indexToRemove: number) => {
        setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !price || !stock) return;

        const primaryImage = images.length > 0 ? images[0] : "/16a00f01c9cb67b64346ad6c2e9d83a6d6cb97bb.jpg";

        onAddProduct({
            title,
            description,
            price: parseFloat(price) || 0,
            stock: parseInt(stock, 10) || 0,
            category,
            image: primaryImage,
            images,
        });

        // Reset fields and close
        setTitle("");
        setDescription("");
        setPrice("");
        setStock("");
        setImages([]);
        onClose();
    };

    return (
        <div 
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
        >
            <div 
                onClick={(e) => e.stopPropagation()} 
                className="bg-[#FDF6F0] border-2 border-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl flex flex-col p-6 sm:p-8 gap-6"
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-zinc-300/40 pb-4">
                    <div className="flex items-center gap-2 text-[#5A3A33]">
                        <Plus className="w-6 h-6" />
                        <h2 className="text-lg sm:text-xl font-bold font-serif">Add New Product</h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-[#F4E3D7] border border-white flex items-center justify-center text-[#5A3A33] hover:bg-[#ebd5c5] transition-colors cursor-pointer"
                        aria-label="Close modal"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Form Fields */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    
                    {/* Title */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5 text-[#5A3A33]" /> Product Title
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Silky Straight Human Hair Bundle 18&quot;"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2.5 text-sm rounded-2xl bg-white border border-zinc-200 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#5A3A33]"
                        />
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-zinc-700">Description</label>
                        <textarea
                            rows={3}
                            placeholder="Provide details about texture, length, quality, etc."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 text-sm rounded-2xl bg-white border border-zinc-200 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#5A3A33] resize-none"
                        />
                    </div>

                    {/* Price and Stock Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
                                <DollarSign className="w-3.5 h-3.5 text-[#5A3A33]" /> Price ($)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                placeholder="0.00"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full px-4 py-2.5 text-sm rounded-2xl bg-white border border-zinc-200 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#5A3A33]"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
                                <Box className="w-3.5 h-3.5 text-[#5A3A33]" /> Stock Quantity
                            </label>
                            <input
                                type="number"
                                required
                                placeholder="10"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                className="w-full px-4 py-2.5 text-sm rounded-2xl bg-white border border-zinc-200 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#5A3A33]"
                            />
                        </div>
                    </div>

                    {/* Category Selection */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-[#5A3A33]" /> Category
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-2.5 text-sm rounded-2xl bg-white border border-zinc-200 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#5A3A33]"
                        >
                            <option value="Hair Extensions">Hair Extensions</option>
                            <option value="Hair Tools">Hair Tools</option>
                            <option value="Accessories">Accessories</option>
                            <option value="Wigs">Wigs</option>
                            <option value="Oils">Oils</option>
                            <option value="More">More</option>
                        </select>
                    </div>

                    {/* Multi-Image Upload Section matching reference layout */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-zinc-700">Product Images / Videos</label>
                        
                        <label className="border-2 border-dashed border-zinc-300 hover:border-[#5A3A33] bg-white rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center">
                            <div className="w-10 h-10 rounded-full bg-[#F4E3D7] flex items-center justify-center text-[#5A3A33]">
                                <Upload className="w-5 h-5" />
                            </div>
                            <span className="text-xs sm:text-sm font-medium text-zinc-800">
                                Click to upload photos or videos
                            </span>
                            <span className="text-[11px] text-zinc-400">
                                PNG, JPG, GIF, MP4 up to 10 files
                            </span>
                            <input
                                type="file"
                                multiple
                                accept="image/*,video/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>

                        {/* Selected Previews Grid */}
                        {images.length > 0 && (
                            <div className="grid grid-cols-4 gap-2.5 mt-2">
                                {images.map((src, index) => (
                                    <div key={index} className="relative group w-full h-20 rounded-xl overflow-hidden border border-zinc-200 bg-zinc-100">
                                        <img src={src} alt="Upload preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                            title="Remove image"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                        {index === 0 && (
                                            <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded">
                                                Cover
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-2 py-3 bg-[#5A3A33] hover:bg-[#492e28] text-white font-semibold rounded-full transition-colors cursor-pointer text-sm shadow-sm"
                    >
                        Post Product
                    </button>
                </form>
            </div>
        </div>
    );
}