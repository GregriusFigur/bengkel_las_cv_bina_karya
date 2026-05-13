"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Hammer, ShieldCheck, Clock, ShoppingCart, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [furnitureProducts, setFurnitureProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Produk untuk bagian Ready Stock
  useEffect(() => {
    const fetchFurniture = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        // Memfilter hanya kategori Furnitur/Ready Stock yang harganya fixed
        const filtered = data.filter((item: any) => item.category === 'Furnitur');
        setFurnitureProducts(filtered);
      } catch (error) {
        console.error("Gagal mengambil data produk:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFurniture();
  }, []);

  // Handler Pesan Langsung ke WA
  const handleOrderWhatsApp = (product: any) => {
    const message = `Halo CV Bina Karya, saya ingin memesan Produk Jadi:\n\n` +
      `Nama Produk: ${product.name}\n` +
      `Harga: Rp ${Number(product.price).toLocaleString('id-ID')}\n\n` +
      `Mohon informasi ketersediaan stoknya. Terima kasih.`;

    const encodedMsg = encodeURIComponent(message);
    window.open(`https://wa.me/6289517922319?text=${encodedMsg}`, '_blank');
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {/* HERO SECTION */}
      <section className="relative h-[90vh] flex items-center overflow-hidden border-b border-white/10">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[100px]" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/5 text-xs uppercase tracking-widest text-gray-300">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              Tersedia Layanan Survey Gratis
            </div>

            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9]">
              Konstruksi <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                Besi Presisi
              </span>
            </h1>

            <p className="text-gray-400 text-lg md:text-xl max-w-md leading-relaxed font-light">
              Kami mewujudkan keamanan dan estetika hunian Anda melalui pengerjaan las profesional. Spesialis Pagar, Kanopi, dan Konstruksi Baja.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href='/hitungbiaya' className="px-8 py-4 bg-white text-black font-bold uppercase text-sm tracking-widest hover:bg-orange-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group">
                Lihat Katalog
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href='https://wa.me/+6289517922319' className="px-8 py-4 border border-white/20 font-bold uppercase text-sm tracking-widest hover:bg-white/10 transition-all duration-300 text-center">
                Konsultasi Gratis
              </Link>
            </div>
          </div>

          <div className="relative hidden lg:block group">
            <div className="aspect-square border border-white/10 rounded-2xl relative overflow-hidden bg-white/5 shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=2070"
                alt="Workshop Bengkel Las"
                fill
                className="object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-8 left-8 p-5 bg-black/60 backdrop-blur-md border border-white/20 rounded-xl z-20">
                <p className="text-[10px] uppercase text-orange-500 font-bold tracking-widest mb-1">Workshop Pro</p>
                <p className="text-2xl font-black text-white uppercase italic tracking-tighter">CV Bina Karya</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-1 w-12 bg-orange-500" />
                  <p className="text-xs text-gray-400">Quality Assured</p>
                </div>
              </div>
              <div className="absolute top-6 right-6 w-16 h-16 border-t-2 border-r-2 border-orange-500/30 rounded-tr-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* KEUNGGULAN (TRUST INDICATORS) */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
              <ShieldCheck className="text-orange-500" />
            </div>
            <div>
              <h3 className="font-bold uppercase tracking-tight italic">Bahan Berkualitas</h3>
              <p className="text-gray-500 text-sm mt-1 font-light">Menggunakan besi SNI dan cat anti karat terbaik.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
              <Clock className="text-orange-500" />
            </div>
            <div>
              <h3 className="font-bold uppercase tracking-tight italic">Tepat Waktu</h3>
              <p className="text-gray-500 text-sm mt-1 font-light">Pengerjaan disiplin sesuai kesepakatan kontrak.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
              <Hammer className="text-orange-500" />
            </div>
            <div>
              <h3 className="font-bold uppercase tracking-tight italic">Tenaga Ahli</h3>
              <p className="text-gray-500 text-sm mt-1 font-light">Dikerjakan oleh teknisi las berpengalaman.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION PRODUK JADI (READY STOCK) */}
      <section className="py-24 bg-[#050505] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div className="space-y-2">
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">
                Ready <span className="text-orange-500">Stock</span>
              </h2>
              <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] font-bold">
                Produk Furnitur Siap Kirim Tanpa Custom
              </p>
            </div>
            <div className="h-[1px] flex-1 bg-white/10 mx-8 mb-4 hidden md:block"></div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-orange-500" size={40} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {furnitureProducts.map((product: any) => (
                <div key={product.id} className="group bg-[#0a0a0a] border border-white/5 p-4 transition-all duration-500 hover:border-orange-500/40 relative overflow-hidden">
                  {/* Image Container */}
                  <div className="relative aspect-square overflow-hidden mb-6 bg-neutral-900 border border-white/5">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 bg-orange-500 text-black text-[8px] font-black px-2 py-1 uppercase tracking-[0.2em]">
                      Best Seller
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-white font-black uppercase text-xl mb-2 tracking-tighter italic">
                    {product.name}
                  </h3>
                  <p className="text-gray-500 text-xs mb-8 line-clamp-2 uppercase leading-relaxed font-medium tracking-wide">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div>
                      <p className="text-[9px] text-gray-500 uppercase font-bold tracking-[0.2em] mb-1">Harga Satuan</p>
                      <p className="text-orange-500 text-xl font-black italic">
                        Rp {Number(product.price).toLocaleString('id-ID')}
                      </p>
                    </div>
                    <button
                      onClick={() => handleOrderWhatsApp(product)}
                      className="bg-white text-black p-4 hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-lg"
                      title="Pesan via WhatsApp"
                    >
                      <ShoppingCart size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && furnitureProducts.length === 0 && (
            <div className="text-center py-24 border border-dashed border-white/10 rounded-lg">
              <p className="text-gray-600 uppercase text-[10px] font-bold tracking-[0.4em]">Katalog produk jadi sedang diperbarui.</p>
            </div>
          )}
        </div>
      </section>

    </main>
  );
}