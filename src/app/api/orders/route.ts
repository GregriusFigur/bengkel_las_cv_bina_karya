import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nama_db_anda' // Sesuaikan dengan nama DB CV Bina Karya
};

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const connection = await mysql.createConnection(dbConfig);
        
        const query = `INSERT INTO tb_pesanan (nama_produk, kategori, panjang, lebar, luas, total_harga) VALUES (?, ?, ?, ?, ?, ?)`;
        const values = [body.nama_produk, body.kategori, body.panjang, body.lebar, body.luas, body.total_harga];
        
        await connection.execute(query, values);
        await connection.end();
        
        return NextResponse.json({ message: 'Pesanan berhasil dibuat' }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Gagal membuat pesanan' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM tb_pesanan ORDER BY created_at DESC');
        await connection.end();
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 });
    }
}