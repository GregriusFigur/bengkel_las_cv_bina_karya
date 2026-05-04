"use client";

import React, { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link'; // 1. IMPORT LINK DARI NEXT.JS

// Data Produk
const ALL_PRODUCTS = [
  {
    id: 1,
    name: 'Kanopi',
    category: 'Kanopi',
    price: '650.000',
    desc: 'Besi hollow 4x4, cat anti karat.',
    image: '/kanopi/k1.jpg'
  },
  {
    id: 2,
    name: 'Teralis',
    category: 'Teralis',
    price: '350.000',
    desc: 'Besi nako 12mm, motif tempa.',
    image: '/teralis/t1.jpg'
  },
  {
    id: 3,
    name: 'Pagar',
    category: 'Pagar',
    price: '600.000',
    desc: 'Atap transparan, rangka elegan.',
    image: '/pagar/p1.jpg'
  },
  {
    id: 4,
    name: 'Pintu',
    category: 'Pintu',
    price: '1.200.000',
    desc: 'Frame besi dengan kawat baja.',
    image: '/pintubesi/p1.jpg'
  },
];

const categories = ['Semua', 'Pagar', 'Kanopi', 'Teralis', 'Pintu'];

export default function ProdukPage() {
  const [activeTab, setActiveTab] = useState('Semua');

  const filteredProducts = activeTab === 'Semua'
    ? ALL_PRODUCTS
    : ALL_PRODUCTS.filter(p => p.category === activeTab);

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER HALAMAN */}
        <div className="mb-12">
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">
            Katalog <span className="text-orange-500">Produk</span>
          </h1>
          <p className="text-gray-400 max-w-xl">
            Jelajahi berbagai pilihan konstruksi besi berkualitas tinggi yang dirancang khusus untuk kekuatan dan keindahan hunian Anda.
          </p>
        </div>

        {/* FILTER & SEARCH */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 border-y border-white/10 py-6">
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-6 py-2 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === cat
                  ? 'bg-orange-500 text-black'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Cari produk..."
              className="w-full bg-white/5 border border-white/10 py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
        </div>

        {/* GRID PRODUK */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group bg-[#0f0f0f] border border-white/5 hover:border-orange-500/30 transition-all duration-500 overflow-hidden">

              <div className="aspect-square relative overflow-hidden bg-gray-900">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent opacity-60" />
              </div>

              <div className="p-6 relative">
                <div className="text-[10px] text-orange-500 font-bold uppercase tracking-[0.2em] mb-2">
                  {product.category}
                </div>
                <h3 className="text-xl font-bold uppercase mb-2 group-hover:text-orange-500 transition-colors">
                  {product.name}
                </h3>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                  {product.desc}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase">Harga Estimasi</p>
                    <p className="font-bold">Rp {product.price} <span className="text-[10px] text-gray-500">/m²</span></p>
                  </div>


                  {/* UPDATE DI SINI: Kirim category dan variant id ke URL */}
                  <Link href={`/hitungbiaya?cat=${product.category}&variant=${product.id}`}>
                    <button className="p-3 bg-white/5 hover:bg-orange-500 hover:text-black transition-all rounded-full group/btn shadow-lg">
                      <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </Link>

                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}