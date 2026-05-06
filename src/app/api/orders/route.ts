import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'gunn064657A',
    database: 'db_bina_karya'
};

// --- FUNGSI WHATSAPP GATEWAY (Placeholder Fonnte) ---
async function sendNotification(phone: string, status: string, product: string) {
    const messages: Record<string, string> = {
        'DITERIMA': `Halo, pesanan Anda untuk *${product}* telah DITERIMA oleh CV Bina Karya. Kami akan segera memprosesnya.`,
        'PROSES': `Kabar baik! Pesanan *${product}* Anda sedang dalam PROSES PENGERJAAN oleh tim teknis kami.`,
        'SELESAI': `Pesanan *${product}* Anda telah SELESAI dikerjakan. Tim kami akan segera menghubungi Anda untuk jadwal pemasangan/pengiriman.`
    };

    try {
        await fetch('https://api.fonnte.com/send', {
            method: 'POST',
            headers: { 'Authorization': 'TOKEN_ANDA_DISINI' }, // Ganti dengan token API Anda
            body: new URLSearchParams({
                target: phone,
                message: messages[status] || `Status pesanan ${product} Anda berubah menjadi: ${status}`
            })
        });
    } catch (err) {
        console.error("Gagal mengirim WA:", err);
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const connection = await mysql.createConnection(dbConfig);
        
        // Tambahkan kolom no_whatsapp ke query INSERT
        const query = `INSERT INTO tb_pesanan (nama_produk, kategori, panjang, lebar, luas, total_harga, no_whatsapp) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const values = [body.nama_produk, body.kategori, body.panjang, body.lebar, body.luas, body.total_harga, body.no_whatsapp];
        
        await connection.execute(query, values);
        await connection.end();
        
        return NextResponse.json({ message: 'Pesanan berhasil dibuat' }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Gagal membuat pesanan' }, { status: 500 });
    }
}

// UPDATE STATUS OLEH ADMIN
export async function PATCH(req: Request) {
    try {
        const { id, status } = await req.json();
        const connection = await mysql.createConnection(dbConfig);
        
        // Ambil info pesanan sebelum update untuk kirim WA
        const [rows]: any = await connection.execute('SELECT no_whatsapp, nama_produk FROM tb_pesanan WHERE id = ?', [id]);
        const order = rows[0];

        // Update Status
        await connection.execute('UPDATE tb_pesanan SET status = ? WHERE id = ?', [status, id]);
        await connection.end();

        // Kirim Notifikasi WhatsApp Otomatis
        if (order && order.no_whatsapp) {
            await sendNotification(order.no_whatsapp, status, order.nama_produk);
        }
        
        return NextResponse.json({ message: 'Status berhasil diperbarui' });
    } catch (error) {
        return NextResponse.json({ error: 'Gagal update status' }, { status: 500 });
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