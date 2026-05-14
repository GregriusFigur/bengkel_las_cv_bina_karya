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

    const [formData, setFormData] = useState({
        id: '',
        name: '',
        category: 'Kanopi',
        price: '',
        description: '',
        image: ''
    });

    // --- 1. PERBAIKAN LOGIKA FETCH SAAT COMPONENT MOUNT ---
    useEffect(() => {
        const isLoggedIn = document.cookie.includes('isLoggedIn=true');
        if (!isLoggedIn) {
            router.push('/login');
        } else {
            // Memanggil kedua fungsi fetch secara paralel
            Promise.all([fetchProducts(), fetchOrders()]).finally(() => {
                setLoading(false);
            });
        }
    }, [router]);

    // --- 2. PERBAIKAN: MENAMBAHKAN fetchProducts YANG HILANG ---
    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            setProducts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Gagal fetch produk:", error);
        }
    };

    // --- 3. PERBAIKAN: MENGHAPUS DUPLIKASI fetchOrders ---
    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            const data = await res.json();
            console.log("Data Pesanan:", data);
            setOrders(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Gagal fetch pesanan:", error);
        }
    };

    const handleUpdateOrderStatus = async (id: string, nextStatus: string) => {
        try {
            const res = await fetch('/api/orders', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: nextStatus }),
            });
            if (res.ok) {
                alert("Status diperbarui!");
                fetchOrders();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteOrder = async (id: string) => {
        if (confirm('Hapus pesanan ini?')) {
            const res = await fetch(`/api/orders?id=${id}`, { method: 'DELETE' });
            if (res.ok) fetchOrders();
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Hapus produk ini?')) {
            await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
            fetchProducts();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload: any = {
            name: formData.name,
            category: formData.category,
            price: Number(formData.price),
            description: formData.description,
            image: formData.image
        };

        if (isEditMode) {
            payload.id = formData.id;
        }

        const method = isEditMode ? 'PUT' : 'POST';

        try {
            const res = await fetch('/api/products', {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                setIsModalOpen(false);
                fetchProducts();
                alert(isEditMode ? "Produk diperbarui!" : "Produk berhasil ditambah!");
            } else {
                const errorData = await res.json();
                alert(`Gagal: ${errorData.error}`);
            }
        } catch (err) {
            alert("Terjadi kesalahan koneksi.");
        }
    };

    const openAddModal = () => {
        setIsEditMode(false);
        setFormData({ id: '', name: '', category: 'Kanopi', price: '', description: '', image: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (product: any) => {
        setIsEditMode(true);
        setFormData({
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price.toString(),
            description: product.description || '',
            image: product.image
        });
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex font-sans relative">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/5 bg-black p-8 flex flex-col justify-between hidden md:flex">
                <div>
                    <div className="flex items-center gap-3 text-orange-500 mb-12">
                        <Database size={24} />
                        <span className="font-black uppercase tracking-tighter text-xl text-white">
                            Bina<span className="text-orange-500">Karya</span>
                        </span>
                    </div>
                    <nav className="space-y-2">
                        <button onClick={() => setActiveTab('products')} className={`w-full px-4 py-3 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'products' ? 'bg-orange-500/10 text-orange-500 border-r-2 border-orange-500' : 'text-gray-500 hover:text-white'}`}>
                            <LayoutDashboard size={16} /> Dashboard
                        </button>
                        <button onClick={() => setActiveTab('orders')} className={`w-full px-4 py-3 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'orders' ? 'bg-orange-500/10 text-orange-500 border-r-2 border-orange-500' : 'text-gray-500 hover:text-white'}`}>
                            <div className="flex items-center gap-3"><Database size={16} /> Pesanan</div>
                            {orders.length > 0 && <span className="bg-orange-500 text-black px-1.5 py-0.5 rounded-full text-[8px] font-bold">{orders.length}</span>}
                        </button>
                    </nav>
                </div>
                <button onClick={() => { document.cookie = "isLoggedIn=; path=/;"; router.push('/login'); }} className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-500 transition-colors text-[10px] font-black uppercase border-t border-white/5 pt-6">
                    <LogOut size={16} /> Logout
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-12 overflow-y-auto">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter italic">{activeTab === 'products' ? 'Console' : 'Order'} <span className="text-orange-500">{activeTab === 'products' ? 'Admin' : 'Management'}</span></h1>
                        <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] font-bold">{activeTab === 'products' ? 'Database Management System' : 'Incoming Orders'}</p>
                    </div>
                    {activeTab === 'products' && (
                        <button onClick={openAddModal} className="bg-orange-500 text-black px-8 py-4 font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-white transition-all shadow-xl">
                            <Plus size={16} /> Tambah Varian
                        </button>
                    )}
                </header>

                {activeTab === 'products' ? (
                    <div className="bg-[#0a0a0a] border border-white/5 rounded-sm overflow-x-auto">
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
                                ) : products.length === 0 ? (
                                    <tr><td colSpan={4} className="p-10 text-center text-gray-500 text-xs">Belum ada produk.</td></tr>
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
                                        <td className="p-6 font-black text-white text-sm italic">
                                            Rp {Number(item.price).toLocaleString('id-ID')}
                                        </td>
                                        <td className="p-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => openEditModal(item)} className="p-2 bg-white/5 text-gray-400 hover:text-orange-500">
                                                    <Edit3 size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(item.id)} className="p-2 bg-white/5 text-gray-400 hover:text-red-500">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    /* Bagian Render Pesanan */
                    <div className="bg-[#0a0a0a] border border-white/5 rounded-sm overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 text-[9px] uppercase font-black tracking-[0.2em] text-gray-500 bg-white/[0.02]">
                                    <th className="p-6">Detail Pesanan</th>
                                    <th className="p-6">WhatsApp</th>
                                    <th className="p-6">Status</th>
                                    <th className="p-6 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {orders.map((order: any) => (
                                    <tr key={order.id} className="hover:bg-white/[0.01] transition-colors">
                                        <td className="p-6">
                                            <p className="font-black text-xs uppercase">{order.nama_produk}</p>
                                            <p className="text-[9px] text-gray-500">Ukuran: {order.panjang}x{order.lebar} ({order.luas}m²)</p>
                                        </td>
                                        <td className="p-6 text-xs font-mono">{order.no_whatsapp}</td>
                                        <td className="p-6">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                                className="bg-black border border-white/10 text-[10px] p-1 outline-none focus:border-orange-500"
                                            >
                                                <option value="PENDING">PENDING</option>
                                                <option value="DITERIMA">DITERIMA</option>
                                                <option value="PROSES">PROSES</option>
                                                <option value="SELESAI">SELESAI</option>
                                            </select>
                                        </td>
                                        <td className="p-6 text-right">
                                            <button onClick={() => handleDeleteOrder(order.id)} className="text-gray-500 hover:text-red-500">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
                    <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-md p-8 relative shadow-2xl">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={20} /></button>
                        <h2 className="text-2xl font-black uppercase italic mb-6 tracking-tighter">{isEditMode ? 'Edit' : 'Tambah'} <span className="text-orange-500">Varian</span></h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-[9px] uppercase font-bold text-gray-500">Nama Produk</label>
                                <input type="text" required className="w-full bg-white/5 border border-white/10 p-3 mt-1 text-sm focus:border-orange-500 outline-none" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[9px] uppercase font-bold text-gray-500">Kategori</label>
                                    <select className="w-full bg-[#111111] text-white border border-white/10 p-3 mt-1 text-sm focus:border-orange-500 outline-none" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                                        <option value="Kanopi">Kanopi</option>
                                        <option value="Pagar">Pagar</option>
                                        <option value="Furnitur">Furnitur</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[9px] uppercase font-bold text-gray-500">Harga /m²</label>
                                    <input type="number" required className="w-full bg-white/5 border border-white/10 p-3 mt-1 text-sm focus:border-orange-500 outline-none" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="text-[9px] uppercase font-bold text-gray-500">Keterangan Produk</label>
                                <textarea rows={3} className="w-full bg-white/5 border border-white/10 p-3 mt-1 text-sm focus:border-orange-500 outline-none resize-none" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-[10px] uppercase font-bold text-gray-500">URL Gambar</label>
                                <input type="text" required className="w-full bg-white/5 border border-white/10 p-3 mt-1 text-sm focus:border-orange-500 outline-none" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
                            </div>
                            <button type="submit" className="w-full bg-orange-500 text-black py-4 font-black uppercase text-[10px] tracking-[0.2em] hover:bg-white transition-all mt-4 flex items-center justify-center gap-2">
                                <Save size={16} /> {isEditMode ? 'Simpan Perubahan' : 'Tambahkan Produk'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}