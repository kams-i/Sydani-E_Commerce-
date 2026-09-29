"use client";

import { useState, useRef, useEffect } from "react";
import { X, Plus, Upload, Tag, DollarSign, Layers, Box, Trash2, Loader2, ChevronDown } from "lucide-react";
import { productAPI } from "@/src/lib/api";

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onProductAdded: () => void;
}

export const ProductCategoryValues = {
    HAIR_EXTENSIONS: "Hair Extensions",
    HAIR_TOOLS: "Hair Tools",
    ACCESSORIES: "Accessories",
    WIGS: "Wigs",
    OILS: "Oils",
    MORE: "More",
} as const;

export default function AddProductModal({ isOpen, onClose, onProductAdded }: AddProductModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [category, setCategory] = useState<string>(ProductCategoryValues.HAIR_EXTENSIONS);
    
    // Dropdown open state & click-outside ref
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const categoryDropdownRef = useRef<HTMLDivElement>(null);

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Close category dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
                setIsCategoryOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const filesArray = Array.from(e.target.files);
        const combinedFiles = [...selectedFiles, ...filesArray].slice(0, 10);
        setSelectedFiles(combinedFiles);
        const newPreviews = combinedFiles.map((file) => URL.createObjectURL(file));
        setPreviewUrls(newPreviews);
    };

    const handleRemoveFile = (indexToRemove: number) => {
        setSelectedFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
        setPreviewUrls((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Guard check to make sure fields aren't empty
        if (!title.trim() || !price || !stock) {
            setErrorMessage("Please fill in all required fields.");
            return;
        }

        try {
            setLoading(true);
            setErrorMessage("");

            // Build FormData matching backend expectations precisely
            const formData = new FormData();
            formData.append("title", title.trim());
            formData.append("description", description.trim());
            formData.append("price", price.toString());
            formData.append("stock", stock.toString());
            formData.append("category", category);

            // Append each file under the 'images' field key expected by multer
            selectedFiles.forEach((file) => {
                formData.append("images", file);
            });

            // Call API endpoint
            await productAPI.createProduct(formData);

            // Reset form fields
            setTitle("");
            setDescription("");
            setPrice("");
            setStock("");
            setCategory(ProductCategoryValues.HAIR_EXTENSIONS);
            setSelectedFiles([]);
            setPreviewUrls([]);

            onProductAdded();
            onClose();
        } catch (err: any) {
            console.error("Failed to create product:", err);
            setErrorMessage(err.response?.data?.message || "Failed to create product. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const categoriesList = Object.values(ProductCategoryValues);

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
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-[#F4E3D7] border border-white flex items-center justify-center text-[#5A3A33] hover:bg-[#ebd5c5] transition-colors cursor-pointer"
                        aria-label="Close modal"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {errorMessage && (
                    <div className="p-3 text-xs text-rose-700 bg-rose-100 border border-rose-200 rounded-xl">
                        {errorMessage}
                    </div>
                )}

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

                    {/* Custom Category Dropdown */}
                    <div className="flex flex-col gap-1.5 relative" ref={categoryDropdownRef}>
                        <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-[#5A3A33]" /> Category
                        </label>
                        
                        <button
                            type="button"
                            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                            className="w-full px-4 py-2.5 text-sm rounded-2xl bg-white border border-zinc-200 text-zinc-900 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#5A3A33] cursor-pointer"
                        >
                            <span>{category}</span>
                            <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${isCategoryOpen ? "rotate-180" : ""}`} />
                        </button>

                        {isCategoryOpen && (
                            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-zinc-200 rounded-2xl shadow-lg overflow-hidden z-20 py-1">
                                {categoriesList.map((cat) => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => {
                                            setCategory(cat);
                                            setIsCategoryOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                                            category === cat 
                                                ? "bg-[#F4E3D7] text-[#5A3A33] font-semibold" 
                                                : "text-zinc-700 hover:bg-zinc-50"
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Multi-Image / Video Upload Section */}
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

                        {previewUrls.length > 0 && (
                            <div className="grid grid-cols-4 gap-2.5 mt-2">
                                {previewUrls.map((src, index) => (
                                    <div key={index} className="relative group w-full h-20 rounded-xl overflow-hidden border border-zinc-200 bg-zinc-100">
                                        <img src={src} alt="Upload preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveFile(index)}
                                            className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm cursor-pointer"
                                            title="Remove file"
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
                        disabled={loading}
                        className="w-full mt-2 py-3 bg-[#5A3A33] hover:bg-[#492e28] text-white font-semibold rounded-full transition-colors cursor-pointer text-sm shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {loading ? "creating Product..." : "Create Product"}
                    </button>
                </form>
            </div>
        </div>
    );
}