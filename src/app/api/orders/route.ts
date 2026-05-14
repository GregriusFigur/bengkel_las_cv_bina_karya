import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Menggunakan Pool agar koneksi lebih stabil dan tidak mudah 'timeout'
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'gunn064657A',
    database: 'db_bina_karya',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// --- FUNGSI WHATSAPP GATEWAY ---
async function sendNotification(phone: string, status: string, product: string) {
    let formattedPhone = phone.replace(/[^0-9]/g, '');
    if (formattedPhone.startsWith('0')) {
        formattedPhone = '62' + formattedPhone.slice(1);
    }

    const messages: Record<string, string> = {
        'PENDING': `*NOTIFIKASI PESANAN - BINA KARYA*\n\nHalo! Pesanan Anda untuk *${product}* telah kami terima. Tim kami akan segera melakukan verifikasi detail pesanan Anda. Terima kasih telah memesan!`,
        'DITERIMA': `*KONFIRMASI PESANAN - BINA KARYA*\n\nHalo! Pesanan Anda untuk *${product}* telah kami *KONFIRMASI*. Saat ini pesanan Anda masuk ke antrean pengerjaan. Mohon tunggu update selanjutnya.`,
        'PROSES': `*UPDATE PENGERJAAN - BINA KARYA*\n\nKabar baik! Pesanan *${product}* Anda saat ini sedang dalam *PROSES PENGERJAAN* oleh tim teknis kami. Kami pastikan kualitas terbaik untuk Anda.`,
        'SELESAI': `*PESANAN SELESAI - BINA KARYA*\n\nSelamat! Pesanan *${product}* Anda telah *SELESAI* dikerjakan. Tim kami akan segera menghubungi Anda untuk koordinasi jadwal pengiriman atau pemasangan. Terima kasih!`
    };

    const statusKey = status.toUpperCase();
    const messageContent = messages[statusKey] || `*UPDATE STATUS - BINA KARYA*\n\nHalo, status pesanan *${product}* Anda telah diperbarui menjadi: *${status}*.`;

    try {
        await fetch('https://api.fonnte.com/send', {
            method: 'POST', 
            headers: { 'Authorization': 'mGRwmeqmeiWw4w1K9r2U' },
            body: new URLSearchParams({
                target: formattedPhone,
                message: messageContent
            })
        });
    } catch (err) {
        console.error("[WhatsApp] Error:", err);
    }
}

// --- API HANDLERS ---

export async function GET() {
    try {
        // Mengambil data dari tb_pesanan
        const [rows] = await pool.query('SELECT * FROM tb_pesanan ORDER BY id DESC');
        
        // Memastikan data dikirim sebagai array, jika kosong kirim []
        return NextResponse.json(Array.isArray(rows) ? rows : []);
    } catch (error: any) {
        console.error("GET Orders Error:", error);
        return NextResponse.json({ error: 'Gagal mengambil data', details: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const query = `INSERT INTO tb_pesanan (nama_produk, kategori, panjang, lebar, luas, total_harga, no_whatsapp, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [
            body.nama_produk, 
            body.kategori, 
            body.panjang, 
            body.lebar, 
            body.luas, 
            body.total_harga, 
            body.no_whatsapp, 
            'PENDING'
        ];
        
        await pool.execute(query, values);
        
        if (body.no_whatsapp) {
            // Jalankan notifikasi tanpa 'await' di sini agar respon API lebih cepat
            sendNotification(body.no_whatsapp, 'PENDING', body.nama_produk);
        }
        
        return NextResponse.json({ message: 'Pesanan berhasil dibuat' }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: 'Gagal membuat pesanan', details: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, status } = body;

        if (!id || !status) {
            return NextResponse.json({ error: 'ID dan Status diperlukan' }, { status: 400 });
        }

        // 1. Ambil data sebelum update
        const [rows]: any = await pool.execute('SELECT no_whatsapp, nama_produk FROM tb_pesanan WHERE id = ?', [id]);
        
        if (rows.length === 0) {
            return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });
        }

        const order = rows[0];

        // 2. Update status (Gunakan format status asli agar cocok dengan template WA)
        await pool.execute('UPDATE tb_pesanan SET status = ? WHERE id = ?', [status, id]);
        
        // 3. Trigger WhatsApp
        if (order.no_whatsapp) {
            sendNotification(order.no_whatsapp, status, order.nama_produk);
        }
        
        return NextResponse.json({ message: 'Status diperbarui' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID diperlukan' }, { status: 400 });

        await pool.execute('DELETE FROM tb_pesanan WHERE id = ?', [id]);
        return NextResponse.json({ message: 'Pesanan dihapus' });
    } catch (error: any) {
        return NextResponse.json({ error: 'Gagal menghapus' }, { status: 500 });
    }
}