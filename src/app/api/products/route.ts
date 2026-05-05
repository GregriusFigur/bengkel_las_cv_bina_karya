import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET: Mengambil semua produk
export async function GET() {
  try {
    const [rows]: any = await db.query('SELECT * FROM tb_produk');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 });
  }
}

// POST: Menambah produk baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, category, price, description, image } = body;
    const query = 'INSERT INTO tb_produk (id, name, category, price, description, image) VALUES (?, ?, ?, ?, ?, ?)';
    await db.query(query, [id, name, category, price, description, image]);
    return NextResponse.json({ message: 'Produk berhasil ditambah' });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menambah data' }, { status: 500 });
  }
}

// PUT: Mengupdate produk lama
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, category, price, description, image } = body;
    const query = 'UPDATE tb_produk SET name=?, category=?, price=?, description=?, image=? WHERE id=?';
    await db.query(query, [name, category, price, description, image, id]);
    return NextResponse.json({ message: 'Produk berhasil diupdate' });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal update data' }, { status: 500 });
  }
}

// DELETE: Menghapus produk
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