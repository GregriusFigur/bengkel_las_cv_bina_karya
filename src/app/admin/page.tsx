"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    LayoutDashboard, Plus, Trash2, LogOut,
    Database, X, Save, Edit3, Loader2
} from 'lucide-react';

export default function AdminDashboard() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const router = useRouter();

    // Form State
    // Tambahkan state baru di AdminDashboard
    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            const data = await res.json();

            // Cek apakah data yang datang adalah Array
            if (Array.isArray(data)) {
                setOrders(data);
            } else {
                // Jika bukan array (misal: objek error), set sebagai array kosong
                console.error("API tidak mengembalikan array:", data);
                setOrders([]);
            }
        } catch (error) {
            console.error("Gagal fetch data:", error);
            setOrders([]);
        }
    };

    const [formData, setFormData] = useState({
        id: '', name: '', category: 'Kanopi',
        price: '', description: '', image: ''
    });

    useEffect(() => {
        const isLoggedIn = document.cookie.includes('isLoggedIn=true');
        if (!isLoggedIn) {
            router.push('/login');
        } else {
            fetchProducts();
        }
    }, [router]);

    const fetchProducts = async () => {
        setLoading(true);
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
        setLoading(false);
    };

    const openAddModal = () => {
        setIsEditMode(false);
        setFormData({ id: '', name: '', category: 'Kanopi', price: '', description: '', image: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (product: any) => {
        setIsEditMode(true);
        setFormData({ ...product });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Hapus produk ini secara permanen?')) {
            await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
            fetchProducts();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = isEditMode ? 'PUT' : 'POST';

        const res = await fetch('/api/products', {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            setIsModalOpen(false);
            fetchProducts();
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex font-sans">
            {/* SIDEBAR */}
            <aside className="w-64 border-r border-white/5 bg-black p-8 flex flex-col justify-between hidden md:flex">
                <div>
                    {/* Logo Section */}
                    <div className="flex items-center gap-3 text-orange-500 mb-12">
                        <Database size={24} />
                        <span className="font-black uppercase tracking-tighter text-xl text-white">
                            Bina<span className="text-orange-500">Karya</span>
                        </span>
                    </div>

                    {/* Navigation Section */}
                    <nav className="space-y-2">
                        {/* Tombol Dashboard / Katalog */}
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`w-full px-4 py-3 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${activeTab === 'products'
                                ? 'bg-orange-500/10 text-orange-500 border-r-2 border-orange-500'
                                : 'text-gray-500 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <LayoutDashboard size={16} />
                            <span>Dashboard</span>
                        </button>

                        {/* Tombol Pesanan Masuk */}
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`w-full px-4 py-3 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${activeTab === 'orders'
                                ? 'bg-orange-500/10 text-orange-500 border-r-2 border-orange-500'
                                : 'text-gray-500 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <Database size={16} />
                                <span>Pesanan</span>
                            </div>

                            {/* Badge Notifikasi */}
                            {orders.length > 0 && (
                                <span className="bg-orange-500 text-black px-1.5 py-0.5 rounded-full text-[8px] font-bold animate-pulse">
                                    {orders.length}
                                </span>
                            )}
                        </button>
                    </nav>
                </div>

                {/* Logout Section */}
                <button
                    onClick={() => {
                        document.cookie = "isLoggedIn=; path=/;";
                        router.push('/login');
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-500 transition-colors text-[10px] font-black uppercase tracking-widest border-t border-white/5 pt-6"
                >
                    <LogOut size={16} /> Logout
                </button>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 p-6 md:p-12 overflow-y-auto">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter italic">
                            {activeTab === 'products' ? 'Console' : 'Order'} <span className="text-orange-500">{activeTab === 'products' ? 'Admin' : 'Management'}</span>
                        </h1>
                        <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] font-bold">
                            {activeTab === 'products' ? 'Database Management System' : 'Incoming Customer Orders'}
                        </p>
                    </div>

                    {/* Tombol Tambah Varian hanya muncul jika di tab Produk */}
                    {activeTab === 'products' && (
                        <button onClick={openAddModal} className="bg-orange-500 text-black px-8 py-4 font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-white transition-all shadow-xl">
                            <Plus size={16} /> Tambah Varian
                        </button>
                    )}
                </header>

                {/* KONTEN TAB: PRODUK */}
                {activeTab === 'products' && (
                    <div className="bg-[#0a0a0a] border border-white/5 rounded-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 text-[9px] uppercase font-black tracking-[0.2em] text-gray-500 bg-white/[0.02]">
                                    <th className="p-6">Produk & ID</th>
                                    <th className="p-6">Kategori</th>
                                    <th className="p-6 text-orange-500">Harga /m²</th>
                                    <th className="p-6 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <tr><td colSpan={4} className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-orange-500" /></td></tr>
                                ) : products.map((item: any) => (
                                    <tr key={item.id} className="hover:bg-white/[0.01] transition-colors group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-gray-900 border border-white/10 overflow-hidden">
                                                    <img src={item.image} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-xs uppercase">{item.name}</p>
                                                    <p className="text-[9px] text-gray-600 font-mono tracking-widest">{item.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase border border-white/10 px-2 py-1">{item.category}</span>
                                        </td>
                                        <td className="p-6 font-black text-white text-sm italic">Rp {Number(item.price).toLocaleString('id-ID')}</td>
                                        <td className="p-6">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => openEditModal(item)} className="p-2 bg-white/5 text-gray-400 hover:text-orange-500 transition-colors"><Edit3 size={16} /></button>
                                                <button onClick={() => handleDelete(item.id)} className="p-2 bg-white/5 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* KONTEN TAB: PESANAN */}
                {activeTab === 'orders' && (
                    <div className="bg-[#0a0a0a] border border-white/5 rounded-sm overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 text-[9px] uppercase font-black tracking-[0.2em] text-gray-500 bg-white/[0.02]">
                                    <th className="p-6">Tanggal</th>
                                    <th className="p-6">Produk</th>
                                    <th className="p-6">Dimensi (L x P)</th>
                                    <th className="p-6">Total Harga</th>
                                    <th className="p-6 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {orders.length === 0 ? (
                                    <tr><td colSpan={5} className="p-20 text-center text-gray-500 text-xs italic">Belum ada pesanan masuk.</td></tr>
                                ) : orders.map((order: any) => (
                                    <tr key={order.id} className="hover:bg-white/[0.01] transition-colors">
                                        <td className="p-6 text-[10px] font-mono text-gray-400">
                                            {new Date(order.created_at).toLocaleDateString('id-ID')}
                                        </td>
                                        <td className="p-6">
                                            <p className="font-black text-xs uppercase">{order.nama_produk}</p>
                                            <p className="text-[9px] text-orange-500 font-bold">{order.kategori}</p>
                                        </td>
                                        <td className="p-6 text-xs">
                                            {order.lebar}m x {order.panjang}m
                                            <span className="text-gray-500 ml-2">({order.luas}m²)</span>
                                        </td>
                                        <td className="p-6 font-black text-white text-sm italic">
                                            Rp {Number(order.total_harga).toLocaleString('id-ID')}
                                        </td>
                                        <td className="p-6 text-right">
                                            <span className="bg-orange-500/10 text-orange-500 border border-orange-500/20 px-3 py-1 text-[9px] font-black uppercase">
                                                {order.status || 'PENDING'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}