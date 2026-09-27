"use client";

import { X, Package, CheckCircle2, Clock, Truck, MapPin, CreditCard } from "lucide-react";

export interface OrderItem {
    title: string;
    price: number;
    quantity: number;
    image: string;
}

export interface Order {
    id: string;
    date: string;
    status: string;
    total: number;
    itemsCount: number;
    deliveryAddress: string;
    paymentMethod?: string;
    items: OrderItem[];
}

interface OrderModalProps {
    order: Order | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function OrderDetailsModal({ order, isOpen, onClose }: OrderModalProps) {
    if (!isOpen || !order) return null;

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
                        <Package className="w-6 h-6" />
                        <h2 className="text-lg sm:text-xl font-bold font-serif">Order Details</h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-[#F4E3D7] border border-white flex items-center justify-center text-[#5A3A33] hover:bg-[#ebd5c5] transition-colors cursor-pointer"
                        aria-label="Close modal"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Order Summary Badge Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F4E3D7] border border-white rounded-2xl p-4">
                    <div>
                        <span className="text-xs text-zinc-600 block">Order ID</span>
                        <span className="text-sm font-bold text-[#5A3A33]">{order.id}</span>
                        <span className="text-xs text-zinc-500 block mt-0.5">{order.date}</span>
                    </div>
                    <div className="flex flex-col sm:items-end gap-1">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === "Delivered" 
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-200" 
                                : "bg-amber-100 text-amber-800 border border-amber-200"
                        }`}>
                            {order.status === "Delivered" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                            {order.status}
                        </span>
                    </div>
                </div>

                {/* Items List */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-sm font-bold text-[#5A3A33] uppercase tracking-wider text-xs">
                        Ordered Items ({order.itemsCount})
                    </h3>
                    <div className="flex flex-col gap-2.5 max-h-60 overflow-y-auto pr-1">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3.5 bg-white border border-zinc-200 rounded-2xl p-3 shadow-2xs">
                                <div className="w-14 h-14 bg-[#F4E3D7] rounded-xl overflow-hidden shrink-0 border border-zinc-200">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 flex flex-col gap-0.5">
                                    <h4 className="text-xs sm:text-sm font-semibold text-zinc-900 line-clamp-1">
                                        {item.title}
                                    </h4>
                                    <p className="text-xs text-zinc-600">
                                        Qty: <strong className="text-zinc-900">{item.quantity}</strong> × ${item.price.toFixed(2)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm font-bold text-[#5A3A33]">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Shipping & Payment Info */}
                <div className="flex flex-col gap-3 pt-2 border-t border-zinc-300/40 text-xs sm:text-sm text-zinc-700">
                    <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-[#5A3A33] shrink-0 mt-0.5" />
                        <div>
                            <span className="font-semibold text-zinc-900 block">Delivery Address</span>
                            <span className="text-zinc-600">{order.deliveryAddress}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <CreditCard className="w-4 h-4 text-[#5A3A33] shrink-0" />
                        <div>
                            <span className="font-semibold text-zinc-900">Payment: </span>
                            <span className="text-zinc-600">{order.paymentMethod || "Card ending in ••••"}</span>
                        </div>
                    </div>
                </div>

                {/* Total Cost Breakdown Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-zinc-300/40">
                    <span className="font-bold text-zinc-800">Total Amount</span>
                    <span className="text-lg font-bold font-serif text-[#5A3A33]">${order.total.toFixed(2)}</span>
                </div>

                <button
                    onClick={onClose}
                    className="w-full py-3 bg-[#5A3A33] hover:bg-[#492e28] text-white font-semibold rounded-full transition-colors cursor-pointer text-sm shadow-sm"
                >
                    Close Details
                </button>
            </div>
        </div>
    );
}