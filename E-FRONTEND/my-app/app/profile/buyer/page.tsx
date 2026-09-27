"use client";

import { useState } from "react";
import Navbar from "@/public/components/navbar";
import Bottombar from "@/public/components/bottombar";
import OrderDetailsModal, { Order } from "@/public/components/order";
import {
    User,
    Package,
    Clock,
    CheckCircle2,
    Truck,
    ChevronRight,
    MapPin,
    CreditCard,
    ShoppingBag
} from "lucide-react";

export default function BuyerProfilePage() {
    const [activeCategory, setActiveCategory] = useState("All Categories");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Sample past orders data for the buyer
    const pastOrders: Order[] = [
        {
            id: "ORD-98421",
            date: "September 15, 2026",
            status: "Delivered",
            total: 11.97,
            itemsCount: 3,
            deliveryAddress: "Plot 12, Gwarimpa Estate, Abuja",
            paymentMethod: "Visa card ending in 4892",
            items: [
                { title: "1pc/3pcs multicolor Synthetic Hair Extensions", price: 3.99, quantity: 2, image: "/16a00f01c9cb67b64346ad6c2e9d83a6d6cb97bb.jpg" },
                { title: "3pc Hair Beauty clips", price: 3.99, quantity: 1, image: "/604418dbdc744a353d6b50fd94f7b95f1ba10927.jpg" }
            ]
        },
        {
            id: "ORD-87302",
            date: "August 28, 2026",
            status: "Delivered",
            total: 7.98,
            itemsCount: 2,
            deliveryAddress: "Plot 12, Gwarimpa Estate, Abuja",
            paymentMethod: "Mastercard ending in 1024",
            items: [
                { title: "1 Pack Black Afro Kinkys Bulk Hair 12/16 Inch", price: 3.99, quantity: 2, image: "/848898184460f5ea60b8c7f9cac7c7d5cc355d58.jpg" }
            ]
        },
        {
            id: "ORD-76214",
            date: "August 10, 2026",
            status: "Processing",
            total: 15.96,
            itemsCount: 4,
            deliveryAddress: "Plot 12, Gwarimpa Estate, Abuja",
            paymentMethod: "Visa card ending in 4892",
            items: [
                { title: "Silky Straight Human Hair Bundle 18\"", price: 3.99, quantity: 4, image: "/16a00f01c9cb67b64346ad6c2e9d83a6d6cb97bb.jpg" }
            ]
        }
    ];

    const handleViewDetails = (order: Order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    return (
        <main className="flex min-h-screen flex-col bg-[#E8C6B5] text-zinc-900">
            <Navbar activeCategory={activeCategory} onSelectCategory={setActiveCategory} />

            <div className="flex-1 p-6 sm:p-10 max-w-6xl w-full mx-auto flex flex-col gap-8">

                {/* Profile Header Card with Profile Icon */}
                <div className="bg-[#FDF6F0] border-2 border-white rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-5 w-full sm:w-auto">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#F4E3D7] border-2 border-white flex items-center justify-center text-[#5A3A33] shadow-inner shrink-0">
                            <User className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.2]" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <h1 className="text-xl sm:text-2xl font-bold font-serif text-[#5A3A33]">
                                Ivoke Ambrose
                            </h1>
                            <p className="text-xs sm:text-sm text-zinc-600">
                                buyer@hairhaven.com
                            </p>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F4E3D7] text-[#5A3A33] text-[11px] font-semibold rounded-full w-fit mt-1 border border-white">
                                <ShoppingBag className="w-3 h-3" /> Verified Buyer
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:items-end gap-2 text-xs sm:text-sm text-zinc-700 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-zinc-300/50">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#5A3A33]" />
                            <span>Abuja, Nigeria</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-[#5A3A33]" />
                            <span>Default Payment: Card</span>
                        </div>
                    </div>
                </div>

                {/* Past Orders Section */}
                <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold font-serif text-[#5A3A33] flex items-center gap-2">
                            <Package className="w-5 h-5" /> Past Orders ({pastOrders.length})
                        </h2>
                    </div>

                    <div className="flex flex-col gap-4">
                        {pastOrders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-[#FDF6F0] border-2 border-white rounded-3xl p-6 shadow-xs flex flex-col gap-5 transition-all hover:shadow-md"
                            >
                                {/* Order Meta Header */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-300/40">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-bold text-[#5A3A33]">{order.id}</span>
                                        <span className="text-xs text-zinc-500">• {order.date}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${order.status === "Delivered"
                                                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                                : "bg-amber-100 text-amber-800 border border-amber-200"
                                            }`}>
                                            {order.status === "Delivered" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                                            {order.status}
                                        </span>
                                        <span className="text-sm font-bold text-zinc-900">${order.total.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Order Items list */}
                                <div className="flex flex-col gap-3">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4 bg-[#F4E3D7] border border-white rounded-2xl p-3">
                                            <div className="w-14 h-14 bg-white rounded-xl overflow-hidden shrink-0 border border-zinc-200">
                                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 flex flex-col gap-0.5">
                                                <h3 className="text-xs sm:text-sm font-semibold text-zinc-900 line-clamp-1">
                                                    {item.title}
                                                </h3>
                                                <p className="text-[11px] text-zinc-600">
                                                    Qty: <strong className="text-zinc-900">{item.quantity}</strong> × ${item.price.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Footer details */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-zinc-600 pt-2 gap-2">
                                    <div className="flex items-center gap-1.5">
                                        <Truck className="w-4 h-4 text-zinc-500" />
                                        <span>Shipped to: <strong className="text-zinc-800">{order.deliveryAddress}</strong></span>
                                    </div>
                                    <button
                                        onClick={() => handleViewDetails(order)}
                                        className="text-[#5A3A33] font-bold hover:underline flex items-center gap-1 w-fit cursor-pointer"
                                    >
                                        View Details <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Order Details Modal Popup */}
            <OrderDetailsModal
                order={selectedOrder}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            <Bottombar />
        </main>
    );
}