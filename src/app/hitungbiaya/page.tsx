"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import {
  Ruler,
  Info,
  CheckCircle2,
  ChevronRight,
  LayoutGrid,
  Calculator,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

// --- PERUBAHAN DI SINI ---
// 1. Hapus PRODUCT_DATA statis. Kita ganti dengan definisi tipe dan daftar kategori manual.
// Definisi tipe produk sesuai struktur tabel DB
type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
};

// Daftar kategori manual untuk tombol filter (pastikan ejaannya sama dengan di DB)
const CATEGORIES_LIST = ['Kanopi', 'Pagar', 'Teralis', 'Pintu Besi'];

function KalkulatorContent() {
  const searchParams = useSearchParams();

  // --- PERUBAHAN DI SINI ---
  // 2. Tambahkan state untuk menampung data dari database dan status loading
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State utama (disesuaikan)
  const [category, setCategory] = useState<string>('Kanopi'); // Gunakan string biasa dulu
  // selectedVariant awalnya null, akan diisi setelah data loading selesai
  const [selectedVariant, setSelectedVariant] = useState<Product | null>(null);
  const [panjang, setPanjang] = useState<number>(0);
  const [lebar, setLebar] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  // --- PERUBAHAN DI SINI ---
  // 3. Masukkan kodingan mengambil data (Fetch) di sini
  // useEffect ini berjalan sekali saat halaman pertama kali dimuat (on mount)
  useEffect(() => {
    const fetchProductsFromDB = async () => {
      try {
        setLoading(true);
        // Memanggil API Route yang sudah kita buat sebelumnya
        const response = await fetch('/api/products');

        if (!response.ok) {
          throw new Error('Gagal mengambil data dari database');
        }

        const data = await response.json();
        setProducts(data); // Simpan data dari DB ke state

        // Logika untuk menentukan varian yang dipilih pertama kali
        const catQuery = searchParams.get('cat');
        const variantQuery = searchParams.get('variant');

        let initialCategory = 'Kanopi';
        let initialVariant = null;

        // Jika ada query di URL, prioritaskan itu
        if (catQuery && CATEGORIES_LIST.includes(catQuery)) {
          initialCategory = catQuery;
          if (variantQuery) {
            initialVariant = data.find((v: Product) => v.id === variantQuery);
          }
        }

        // Jika tidak ada query URL atau variant tidak ditemukan, ambil yang pertama dari kategori default
        if (!initialVariant) {
          initialVariant = data.find((p: Product) => p.category === initialCategory);
        }

        setCategory(initialCategory);
        // Jika DB kosong, initialVariant mungkin tetap null
        setSelectedVariant(initialVariant || data[0] || null);

      } catch (err: any) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false); // Matikan loading screen
      }
    };

    fetchProductsFromDB();
  }, [searchParams]); // Jalankan ulang jika URL parameter berubah


  // --- PERUBAHAN DI SINI ---
  // 4. Perbarui useEffect Kalkulasi untuk menangani selectedVariant yang bisa null
  useEffect(() => {
    if (selectedVariant) {
      setTotal(panjang * lebar * selectedVariant.price);
    } else {
      setTotal(0);
    }
  }, [panjang, lebar, selectedVariant]);

  // --- PERUBAHAN DI SINI ---
  // 5. Perbarui fungsi ganti kategori agar mencari varian pertama di daftar 'products' dinamis
  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    const firstVariantInCategory = products.find(p => p.category === cat);
    setSelectedVariant(firstVariantInCategory || null);
  };

  // --- PERUBAHAN DI SINI ---
  // 6. Tampilkan loading atau error screen
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        <p className="text-orange-500 font-black uppercase tracking-widest animate-pulse">Menghubungkan ke Database...</p>
      </div>
    );
  }

  if (error || products.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4 px-6 text-center">
        <Info size={48} className="text-red-500" />
        <h1 className="text-2xl font-bold text-red-500">Koneksi Database Gagal</h1>
        <p className="text-gray-500 max-w-md">
          {error ? `Detail: ${error}` : 'Database kosong. SIlakan isi data di tb_produk melalui HeidiSQL.'}
        </p>
        <Link href="/" className="mt-4 px-6 py-2 bg-white text-black font-bold uppercase text-xs">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  // --- PERUBAHAN DI SINI ---
  // 7. Filter produk yang ditampilkan berdasarkan kategori yang dipilih
  const filteredProducts = products.filter(p =>
    p.category.toLowerCase() === category.toLowerCase()
  );


  return (
    <div className="min-h-screen bg-black text-white pt-4 pb-20 px-6">
      <div className="max-w-7xl mx-auto">

        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-500 transition-colors mb-8 text-sm group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Kembali ke Beranda
        </Link>

        <header className="mb-12 border-l-4 border-orange-500 pl-6">
          <div className="flex items-center gap-3 text-orange-500 mb-2">
            <Calculator size={24} />
            <span className="text-xs font-bold uppercase tracking-[0.3em]">Smart Estimator</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
            Katalog <span className="text-orange-500">{category}</span> & Kalkulator
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          <div className="lg:col-span-8 space-y-12">

            {/* 01. PILIH KATEGORI */}
            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
                <LayoutGrid size={16} /> 01. Pilih Kategori Produk
              </h3>
              <div className="flex flex-wrap gap-3">
                {/* --- PERUBAHAN DI SINI --- */}
                {/* Gunakan CATEGORIES_LIST manual */}
                {CATEGORIES_LIST.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`px-8 py-3 rounded-sm text-xs font-black uppercase transition-all border ${category === cat
                      ? 'bg-orange-500 border-orange-500 text-black shadow-[0_0_20px_rgba(249,115,22,0.3)]'
                      : 'bg-transparent border-white/10 text-gray-400 hover:border-white/30'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </section>

            {/* 02. PILIH VARIAN DENGAN GAMBAR */}
            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
                <CheckCircle2 size={16} /> 02. Pilih Varian {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* --- PERUBAHAN DI SINI --- */}
                {/* Gunakan filteredProducts dari DB */}
                {filteredProducts.map((variant) => (
                  <div
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    // Gunakan optional chaining selectedVariant?.id
                    className={`group cursor-pointer transition-all duration-500 border-2 overflow-hidden ${selectedVariant?.id === variant.id
                      ? 'border-orange-500 bg-[#0f0f0f]'
                      : 'border-white/5 bg-[#0a0a0a] hover:border-white/20'
                      }`}
                  >
                    <div className="aspect-[16/10] relative overflow-hidden bg-gray-900">
                      <Image
                        src={variant.image || '/placeholder-image.jpg'} // Gunakan gambar cadangan jika path kosong
                        alt={variant.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        onError={(e) => {
                          // Jika gambar gagal dimuat, ganti ke gambar placeholder
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://placehold.co/600x400/000000/F97316?text=No+Image';
                        }}
                        className={`object-cover transition-transform duration-700 group-hover:scale-110 ${selectedVariant?.id === variant.id ? 'opacity-100' : 'opacity-50'
                          }`}
                      />
                      {selectedVariant?.id === variant.id && (
                        <div className="absolute top-4 right-4 bg-orange-500 p-2 rounded-full shadow-xl z-10">
                          <CheckCircle2 className="text-black" size={20} />
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <h4 className="font-bold uppercase tracking-tight text-lg group-hover:text-orange-500 transition-colors">
                        {variant.name}
                      </h4>
                      {/* description dari DB digunakan sebagai desc */}
                      <p className="text-xs text-gray-500 mt-1 mb-4">{variant.description}</p>

                      <div className="flex items-baseline gap-1">
                        <span className="text-[10px] text-gray-500 uppercase font-bold">Harga:</span>
                        <span className="text-lg font-black text-orange-500">
                          Rp {variant.price.toLocaleString('id-ID')}
                        </span>
                        <span className="text-[10px] text-gray-500 ml-1">/m²</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 03. DIMENSI */}
            <section className="bg-[#0a0a0a] p-10 border border-white/5">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-8 flex items-center gap-2">
                <Ruler size={16} /> 03. Tentukan Luas Area (m)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-black text-orange-500 tracking-widest">Panjang Area</label>
                  <input
                    type="number"
                    className="w-full bg-transparent border-b-2 border-white/10 py-4 text-5xl font-black focus:outline-none focus:border-orange-500 transition-colors placeholder:text-white/5"
                    placeholder="0.0"
                    onChange={(e) => setPanjang(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-black text-orange-500 tracking-widest">Lebar Area</label>
                  <input
                    type="number"
                    className="w-full bg-transparent border-b-2 border-white/10 py-4 text-5xl font-black focus:outline-none focus:border-orange-500 transition-colors placeholder:text-white/5"
                    placeholder="0.0"
                    onChange={(e) => setLebar(Number(e.target.value))}
                  />
                </div>
              </div>
            </section>
          </div>

          {/* RINGKASAN (STICKY) */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 bg-[#0a0a0a] border-t-4 border-orange-500 p-8 shadow-2xl">
              <h2 className="text-xl font-black uppercase italic tracking-tighter mb-8">Ringkasan Proyek</h2>

              <div className="space-y-6 text-sm">
                <div className="flex justify-between border-b border-white/5 pb-3">
                  <span className="text-gray-500 uppercase text-[10px] font-bold text-[10px]">Kategori</span>
                  <span className="font-bold text-orange-500">{category}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-3">
                  <span className="text-gray-500 uppercase text-[10px] font-bold text-[10px]">Pilihan</span>
                  {/* Gunakan optional chaining selectedVariant?.name */}
                  <span className="font-bold">{selectedVariant?.name || '-'}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-3">
                  <span className="text-gray-500 uppercase text-[10px] font-bold text-[10px]">Luas</span>
                  <span className="font-bold text-white">{(panjang * lebar).toFixed(2)} m²</span>
                </div>
              </div>

              <div className="mt-16 bg-white/5 p-6 border border-white/5">
                <p className="text-[10px] uppercase text-gray-500 font-black mb-2 tracking-widest text-center">Total Estimasi Biaya</p>
                <div className="text-4xl font-black text-orange-500 tracking-tighter text-center">
                  Rp {total.toLocaleString('id-ID')}
                </div>
              </div>

              <button className="w-full mt-8 py-5 bg-orange-500 text-black font-black uppercase text-xs tracking-[0.2em] hover:bg-white transition-all flex items-center justify-center gap-2 group">
                Kirim via WhatsApp
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function KalkulatorVarianPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-orange-500 font-black uppercase tracking-widest">Memuat Sistem...</div>}>
      <KalkulatorContent />
    </Suspense>
  );
}