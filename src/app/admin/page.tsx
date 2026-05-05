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
    const [activeTab, setActiveTab] = useState('products');
    const [orders, setOrders] = useState([]);

    // Form State mencakup Kategori dan Keterangan
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        category: 'Kanopi',
        price: '',
        description: '',
        image: ''
    });

    // Inisialisasi data saat halaman dimuat
    useEffect(() => {
        const isLoggedIn = document.cookie.includes('isLoggedIn=true');
        if (!isLoggedIn) {
            router.push('/login');
        } else {
            fetchProducts();
            fetchOrders();
        }
    }, [router]);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            const data = await res.json();
            if (Array.isArray(data)) {
                setOrders(data);
            } else {
                console.error("API tidak mengembalikan array:", data);
                setOrders([]);
            }
        } catch (error) {
            console.error("Gagal fetch data:", error);
            setOrders([]);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            setProducts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Gagal fetch produk:", error);
        } finally {
            setLoading(false);
        }
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
        <div className="min-h-screen bg-[#050505] text-white flex font-sans relative">
            {/* SIDEBAR */}
            <aside className="w-64 border-r border-white/5 bg-black p-8 flex flex-col justify-between hidden md:flex">
                <div>
                    <div className="flex items-center gap-3 text-orange-500 mb-12">
                        <Database size={24} />
                        <span className="font-black uppercase tracking-tighter text-xl text-white">
                            Bina<span className="text-orange-500">Karya</span>
                        </span>
                    </div>

                    <nav className="space-y-2">
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
                            {orders.length > 0 && (
                                <span className="bg-orange-500 text-black px-1.5 py-0.5 rounded-full text-[8px] font-bold animate-pulse">
                                    {orders.length}
                                </span>
                            )}
                        </button>
                    </nav>
                </div>

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

                    {activeTab === 'products' && (
                        <button onClick={openAddModal} className="bg-orange-500 text-black px-8 py-4 font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-white transition-all shadow-xl">
                            <Plus size={16} /> Tambah Varian
                        </button>
                    )}
                </header>

                {/* TAB PRODUK */}
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
                                        <td className="p-6 text-right">
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

                {/* TAB PESANAN */}
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

            {/* MODAL FORM TAMBAH/EDIT */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-md p-8 relative shadow-2xl">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
                            <X size={20} />
                        </button>

                        <h2 className="text-2xl font-black uppercase italic mb-6 tracking-tighter">
                            {isEditMode ? 'Edit' : 'Tambah'} <span className="text-orange-500">Varian</span>
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Nama */}
                            <div>
                                <label className="text-[9px] uppercase font-bold text-gray-500 tracking-widest">Nama Produk</label>
                                <input
                                    type="text" required
                                    placeholder="Contoh: Kanopi Atap Alderon"
                                    className="w-full bg-white/5 border border-white/10 p-3 mt-1 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Kategori */}
                                <div>
                                    <label className="text-[9px] uppercase font-bold text-gray-500 tracking-widest">Kategori</label>
                                    <select
                                        className="w-full bg-[#111111] text-white border border-white/10 p-3 mt-1 text-sm focus:outline-none focus:border-orange-500 appearance-none cursor-pointer"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        {/* Tambahkan gaya bg-zinc-900 pada option agar teks putih terlihat kontras saat dropdown terbuka */}
                                        <option value="Kanopi" className="bg-zinc-900 text-white">Kanopi</option>
                                        <option value="Pagar" className="bg-zinc-900 text-white">Pagar</option>
                                        <option value="Tralis" className="bg-zinc-900 text-white">Tralis</option>
                                        <option value="Pintu Besi" className="bg-zinc-900 text-white">Pintu Besi</option>
                                    </select>
                                </div>
                                {/* Harga */}
                                <div>
                                    <label className="text-[9px] uppercase font-bold text-gray-500 tracking-widest">Harga /m²</label>
                                    <input
                                        type="number" required
                                        placeholder="0"
                                        className="w-full bg-white/5 border border-white/10 p-3 mt-1 text-sm focus:outline-none focus:border-orange-500"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Keterangan Produk */}
                            <div>
                                <label className="text-[9px] uppercase font-bold text-gray-500 tracking-widest">Keterangan Produk</label>
                                <textarea
                                    rows={3}
                                    placeholder="Spesifikasi bahan, jenis cat, dll..."
                                    className="w-full bg-white/5 border border-white/10 p-3 mt-1 text-sm focus:outline-none focus:border-orange-500 resize-none"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            {/* URL Gambar */}
                            <div>
                                <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">URL Gambar</label>
                                <input
                                    type="text" required
                                    placeholder="https://..."
                                    className="w-full bg-white/5 border border-white/10 p-3 mt-1 text-sm font-mono text-[15px] focus:outline-none focus:border-orange-500"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                />
                            </div>

                            <button type="submit" className="w-full bg-orange-500 text-black py-4 font-black uppercase text-[10px] tracking-[0.2em] hover:bg-white transition-colors mt-4 flex items-center justify-center gap-2">
                                <Save size={16} /> {isEditMode ? 'Simpan Perubahan' : 'Tambahkan Produk'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}