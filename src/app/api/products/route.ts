import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Ambil data dari MariaDB
    const [rows]: any = await db.query('SELECT * FROM tb_produk');

    // MAPPING: Pastikan nama properti sesuai dengan yang dibutuhkan frontend
    const products = rows.map((item: any) => ({
      id: item.id.toString(), // Pastikan ID berupa string
      name: item.name || item.nama_produk, // Sesuaikan jika kolom di DB bernama nama_produk
      category: item.category || item.kategori,
      price: Number(item.price || item.harga),
      description: item.description || item.desc, // Menangani jika kolom di DB bernama 'desc'
      image: item.image || item.foto || '/placeholder.jpg' // Menangani jika kolom di DB bernama 'foto'
    }));

    return NextResponse.json(products);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 });
  }
}