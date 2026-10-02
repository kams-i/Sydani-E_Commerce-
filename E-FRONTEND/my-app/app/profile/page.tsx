"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/public/components/navbar";
import Bottombar from "@/public/components/bottombar";
import OrderDetailsModal, { Order } from "@/public/components/order";
import AddProductModal from "@/public/components/addProduct";
import { userAPI, orderAPI, productAPI } from "@/src/lib/api";
import {
    User,
    Store,
    Package,
    Clock,
    CheckCircle2,
    Truck,
    ChevronRight,
    MapPin,
    Phone,
    ShoppingBag,
    Star,
    Tag,
    PackagePlus,
    Trash2,
    Box,
    Loader2,
    ImageIcon,
    AlertCircle,
} from "lucide-react";

// ---------- Types ----------
interface Profile {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    role: "buyer" | "seller" | string;
}

interface SellerProduct {
    id: string;
    title: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    image?: string;
}

// ---------- Helpers ----------
// Backend response shapes aren't guaranteed, so unwrap defensively.
const unwrap = (body: any) => body?.data ?? body;

function toProfile(body: any): Profile {
    const d = unwrap(body);
    const u = d?.user ?? d;
    return {
        id: String(u?._id ?? u?.id ?? ""),
        fullName: u?.fullName ?? u?.name ?? "Your account",
        email: u?.email ?? "",
        phone: u?.phone,
        role: String(u?.role ?? "buyer").toLowerCase(),
    };
}

function toOrders(body: any): Order[] {
    const d = unwrap(body);
    const list: any[] = Array.isArray(d) ? d : d?.orders ?? [];
    return list.map((o: any) => {
        const rawItems: any[] = o.items ?? o.orderItems ?? o.products ?? [];
        const items = rawItems.map((it: any) => {
            const p = it.product && typeof it.product === "object" ? it.product : it;
            return {
                title: p?.name ?? p?.title ?? it.name ?? "Product",
                price: Number(it.price ?? p?.price ?? 0),
                quantity: Number(it.quantity ?? 1),
                image: p?.images?.[0] ?? p?.image ?? "",
            };
        });
        const rawStatus = String(o.status ?? "processing");
        const paymentMethod =
            o.paymentMethod ??
            o.paymentType ??
            o.payment_method ??
            o.payment?.method ??
            o.paymentDetails?.method;
        return {
            id: String(o._id ?? o.id),
            date: o.createdAt
                ? new Date(o.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                : "",
            status: rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase(),
            total: Number(o.totalAmount ?? o.total ?? o.totalPrice ?? items.reduce((s, i) => s + i.price * i.quantity, 0)),
            itemsCount: items.reduce((s, i) => s + i.quantity, 0),
            deliveryAddress: o.shippingAddress ?? o.deliveryAddress ?? "",
            paymentMethod: typeof paymentMethod === "string" && paymentMethod.trim()
                ? paymentMethod
                : "Not specified",
            items,
        } as Order;
    });
}

function toProducts(body: any): SellerProduct[] {
    const d = unwrap(body);
    const list: any[] = Array.isArray(d) ? d : d?.products ?? [];
    return list.map((p: any) => ({
        id: String(p._id ?? p.id),
        title: p.name ?? p.title ?? "Untitled product",
        description: p.description ?? "",
        price: Number(p.price ?? 0),
        stock: Number(p.stock ?? p.quantity ?? 0),
        category: p.category ?? "",
        image: p.images?.[0] ?? p.image,
    }));
}

const errMsg = (e: any, fallback: string) => e?.response?.data?.message ?? e?.message ?? fallback;

// ---------- Page ----------
export default function ProfilePage() {
    const [activeCategory, setActiveCategory] = useState("All Categories");

    const [profile, setProfile] = useState<Profile | null>(null);
    const [pageLoading, setPageLoading] = useState(true);
    const [pageError, setPageError] = useState<string | null>(null);
    const [unauthorized, setUnauthorized] = useState(false);

    // buyer state
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

    // seller state
    const [products, setProducts] = useState<SellerProduct[]>([]);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Role-specific data
    const loadRoleData = useCallback(async (role: string) => {
        if (role === "seller") {
            const res = await productAPI.getSellerProducts();
            setProducts(toProducts(res.data));
        } else {
            const res = await orderAPI.getUserOrders();
            setOrders(toOrders(res.data));
        }
    }, []);

    useEffect(() => {
        const init = async () => {
            try {
                const res = await userAPI.getCurrentUser();
                const me = toProfile(res.data);
                setProfile(me);
                await loadRoleData(me.role);
            } catch (err: any) {
                if (err?.response?.status === 401) setUnauthorized(true);
                else setPageError(errMsg(err, "Could not load your profile."));
            } finally {
                setPageLoading(false);
            }
        };
        init();
    }, [loadRoleData]);

    const refreshProducts = async () => {
        try {
            const res = await productAPI.getSellerProducts();
            setProducts(toProducts(res.data));
        } catch (err: any) {
            setPageError(errMsg(err, "Could not refresh your products."));
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!window.confirm("Delete this product? This can't be undone.")) return;
        setDeletingId(id);
        try {
            await productAPI.deleteProduct(id);
            setProducts((list) => list.filter((p) => p.id !== id));
        } catch (err: any) {
            setPageError(errMsg(err, "Could not delete the product."));
        } finally {
            setDeletingId(null);
        }
    };

    const isSeller = profile?.role === "seller";

    // ----- Loading / auth / error states -----
    if (pageLoading) {
        return (
            <main className="flex min-h-screen flex-col bg-[#E8C6B5]">
                <Navbar activeCategory={activeCategory} onSelectCategory={setActiveCategory} />
                <div className="flex-1 flex items-center justify-center gap-3 text-[#5A3A33]">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm font-medium">Loading your profile...</span>
                </div>
                <Bottombar />
            </main>
        );
    }

    if (unauthorized || !profile) {
        return (
            <main className="flex min-h-screen flex-col bg-[#E8C6B5]">
                <Navbar activeCategory={activeCategory} onSelectCategory={setActiveCategory} />
                <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6 text-center">
                    <p className="text-sm font-medium text-zinc-800">
                        {unauthorized ? "Sign in to view your profile." : pageError ?? "Profile unavailable."}
                    </p>
                    <button
                        onClick={() => (window.location.href = "/")}
                        className="bg-[#5A3A33] text-white px-5 py-2.5 rounded-xl text-sm font-semibold"
                    >
                        Sign in
                    </button>
                </div>
                <Bottombar />
            </main>
        );
    }

    return (
        <main className="flex min-h-screen flex-col bg-[#E8C6B5] text-zinc-900">
            <Navbar activeCategory={activeCategory} onSelectCategory={setActiveCategory} />

            <div className="flex-1 p-6 sm:p-10 max-w-6xl w-full mx-auto flex flex-col gap-8">

                {/* ===== Shared profile header ===== */}
                <div className="bg-[#FDF6F0] border-2 border-white rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-5 w-full sm:w-auto">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#F4E3D7] border-2 border-white flex items-center justify-center text-[#5A3A33] shadow-inner shrink-0">
                            {isSeller ? <Store className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.2]" /> : <User className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.2]" />}
                        </div>
                        <div className="flex flex-col gap-1">
                            <h1 className="text-xl sm:text-2xl font-bold font-serif text-[#5A3A33]">{profile.fullName}</h1>
                            <p className="text-xs sm:text-sm text-zinc-600">{profile.email}</p>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F4E3D7] text-[#5A3A33] text-[11px] font-semibold rounded-full w-fit mt-1 border border-white">
                                {isSeller ? <Star className="w-3 h-3 fill-[#5A3A33]" /> : <ShoppingBag className="w-3 h-3" />}
                                {isSeller ? "Seller" : "Buyer"}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:items-end gap-2 text-xs sm:text-sm text-zinc-700 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-zinc-300/50">
                        {profile.phone && (
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-[#5A3A33]" />
                                <span>{profile.phone}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            {isSeller ? <Box className="w-4 h-4 text-[#5A3A33]" /> : <Package className="w-4 h-4 text-[#5A3A33]" />}
                            <span>
                                {isSeller ? "Active listings" : "Orders placed"}:{" "}
                                <strong>{isSeller ? products.length : orders.length}</strong>
                            </span>
                        </div>
                    </div>
                </div>

                {pageError && (
                    <div role="alert" className="flex items-center gap-2 bg-red-50 border-2 border-red-200 text-red-700 text-sm rounded-2xl px-4 py-3">
                        <AlertCircle className="w-4 h-4 shrink-0" /> {pageError}
                    </div>
                )}

                {/* ===== SELLER VIEW ===== */}
                {isSeller && (
                    <>
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <h2 className="text-xl font-bold font-serif text-[#5A3A33] flex items-center gap-2">
                                <Tag className="w-5 h-5" /> Store products ({products.length})
                            </h2>
                            <button
                                onClick={() => setIsCreateOpen(true)}
                                className="flex items-center gap-2 px-5 py-3 bg-[#5A3A33] hover:bg-[#492e28] text-white text-sm font-semibold rounded-full shadow-sm transition-colors cursor-pointer"
                            >
                                <PackagePlus className="w-4 h-4" /> Add product
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className={`bg-[#FDF6F0] border-2 border-white rounded-3xl p-5 shadow-xs flex flex-col justify-between gap-4 transition-all hover:shadow-md ${deletingId === product.id ? "opacity-50" : ""
                                        }`}
                                >
                                    <div className="flex flex-col gap-3">
                                        <div className="w-full h-44 bg-[#F4E3D7] rounded-2xl overflow-hidden border border-zinc-200 relative flex items-center justify-center text-[#5A3A33]/50">
                                            {product.image ? (
                                                <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageIcon className="w-8 h-8" />
                                            )}
                                            {product.category && (
                                                <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 text-[#5A3A33] text-[10px] font-bold rounded-full">
                                                    {product.category}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <h3 className="text-sm font-bold text-zinc-900 line-clamp-1">{product.title}</h3>
                                            <p className="text-xs text-zinc-600 line-clamp-2">
                                                {product.description || "No description provided."}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-zinc-300/40">
                                        <div className="flex flex-col">
                                            <span className="text-base font-bold font-serif text-[#5A3A33]">${product.price.toFixed(2)}</span>
                                            <span className="text-[11px] text-zinc-500">Stock: {product.stock} units</span>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteProduct(product.id)}
                                            disabled={deletingId === product.id}
                                            className="p-2.5 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-700 transition-colors cursor-pointer disabled:cursor-not-allowed"
                                            title="Delete product"
                                            aria-label="Delete product"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {products.length === 0 && (
                                <div className="col-span-full py-12 text-center text-zinc-600 bg-[#FDF6F0] rounded-3xl border-2 border-white">
                                    <p>You haven't listed any products yet. Click &quot;Add product&quot; to get started.</p>
                                </div>
                            )}
                        </div>

                        <AddProductModal
                            isOpen={isCreateOpen}
                            onClose={() => setIsCreateOpen(false)}
                            onProductAdded={refreshProducts}
                        />
                    </>
                )}

                {/* ===== BUYER VIEW ===== */}
                {!isSeller && (
                    <div className="flex flex-col gap-5">
                        <h2 className="text-xl font-bold font-serif text-[#5A3A33] flex items-center gap-2">
                            <Package className="w-5 h-5" /> Past orders ({orders.length})
                        </h2>

                        {orders.length === 0 && (
                            <div className="py-12 text-center text-zinc-600 bg-[#FDF6F0] rounded-3xl border-2 border-white">
                                <p className="mb-4">You haven't placed any orders yet.</p>
                                <button
                                    onClick={() => (window.location.href = "/dashboard")}
                                    className="bg-[#5A3A33] text-white px-5 py-2.5 rounded-xl text-sm font-semibold"
                                >
                                    Explore items
                                </button>
                            </div>
                        )}

                        <div className="flex flex-col gap-4">
                            {orders.map((order) => (
                                <div
                                    key={order.id}
                                    className="bg-[#FDF6F0] border-2 border-white rounded-3xl p-6 shadow-xs flex flex-col gap-5 transition-all hover:shadow-md"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-300/40">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-bold text-[#5A3A33]">#{String(order.id).slice(-8).toUpperCase()}</span>
                                            {order.date && <span className="text-xs text-zinc-500">• {order.date}</span>}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${order.status === "Delivered"
                                                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                                    : "bg-amber-100 text-amber-800 border border-amber-200"
                                                    }`}
                                            >
                                                {order.status === "Delivered" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                                                {order.status}
                                            </span>
                                            <span className="text-sm font-bold text-zinc-900">${order.total.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-4 bg-[#F4E3D7] border border-white rounded-2xl p-3">
                                                <div className="w-14 h-14 bg-white rounded-xl overflow-hidden shrink-0 border border-zinc-200 flex items-center justify-center text-[#5A3A33]/50">
                                                    {item.image ? (
                                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Package className="w-5 h-5" />
                                                    )}
                                                </div>
                                                <div className="flex-1 flex flex-col gap-0.5">
                                                    <h3 className="text-xs sm:text-sm font-semibold text-zinc-900 line-clamp-1">{item.title}</h3>
                                                    <p className="text-[11px] text-zinc-600">
                                                        Qty: <strong className="text-zinc-900">{item.quantity}</strong> × ${item.price.toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-zinc-600 pt-2 gap-2">
                                        <div className="flex items-center gap-1.5">
                                            <Truck className="w-4 h-4 text-zinc-500" />
                                            <span>
                                                Shipped to:{" "}
                                                <strong className="text-zinc-800">{order.deliveryAddress || "Not provided"}</strong>
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setSelectedOrder(order);
                                                setIsOrderModalOpen(true);
                                            }}
                                            className="text-[#5A3A33] font-bold hover:underline flex items-center gap-1 w-fit cursor-pointer"
                                        >
                                            View details <ChevronRight className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <OrderDetailsModal
                            order={selectedOrder}
                            isOpen={isOrderModalOpen}
                            onClose={() => setIsOrderModalOpen(false)}
                        />
                    </div>
                )}
            </div>

            <Bottombar />
        </main>
    );
}
