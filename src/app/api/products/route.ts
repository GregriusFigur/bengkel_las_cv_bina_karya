import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [rows]: any = await db.query('SELECT * FROM tb_produk');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Kita tidak mengambil 'id' dari body karena DB akan mengisinya secara otomatis
    const { name, category, price, description, image } = body;
    
    // Validasi input
    if (!name || !price) {
        return NextResponse.json({ error: 'Nama dan Harga wajib diisi' }, { status: 400 });
    }

    // Query INSERT tanpa menyertakan kolom 'id'
    const query = 'INSERT INTO tb_produk (name, category, price, description, image) VALUES (?, ?, ?, ?, ?)';
    await db.query(query, [name, category, price, description, image]);
    
    return NextResponse.json({ message: 'Produk berhasil ditambah' });
  } catch (error: any) {
    console.error("MySQL Error:", error);
    // Menampilkan pesan error spesifik jika terjadi masalah di database
    return NextResponse.json({ error: error.message || 'Gagal menambah data' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, category, price, description, image } = body;
    const query = 'UPDATE tb_produk SET name=?, category=?, price=?, description=?, image=? WHERE id=?';
    await db.query(query, [name, category, price, description, image, id]);
    return NextResponse.json({ message: 'Produk berhasil diupdate' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Gagal update data' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    await db.query('DELETE FROM tb_produk WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Produk berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal hapus data' }, { status: 500 });
  }
}