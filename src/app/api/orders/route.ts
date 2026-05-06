import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'gunn064657A',
    database: 'db_bina_karya'
};

// --- FUNGSI WHATSAPP GATEWAY (PESAN OTOMATIS) ---
async function sendNotification(phone: string, status: string, product: string) {
    // Sanitasi Nomor: Pastikan format 62...
    let formattedPhone = phone.replace(/[^0-9]/g, '');
    if (formattedPhone.startsWith('0')) {
        formattedPhone = '62' + formattedPhone.slice(1);
    }

    // Template Pesan Otomatis Profesional
    const messages: Record<string, string> = {
        'PENDING': `*NOTIFIKASI PESANAN - BINA KARYA*\n\nHalo! Pesanan Anda untuk *${product}* telah kami terima. Tim kami akan segera melakukan verifikasi detail pesanan Anda. Terima kasih telah memesan!`,
        'DITERIMA': `*KONFIRMASI PESANAN - BINA KARYA*\n\nHalo! Pesanan Anda untuk *${product}* telah kami *KONFIRMASI*. Saat ini pesanan Anda masuk ke antrean pengerjaan. Mohon tunggu update selanjutnya.`,
        'PROSES': `*UPDATE PENGERJAAN - BINA KARYA*\n\nKabar baik! Pesanan *${product}* Anda saat ini sedang dalam *PROSES PENGERJAAN* oleh tim teknis kami. Kami pastikan kualitas terbaik untuk Anda.`,
        'SELESAI': `*PESANAN SELESAI - BINA KARYA*\n\nSelamat! Pesanan *${product}* Anda telah *SELESAI* dikerjakan. Tim kami akan segera menghubungi Anda untuk koordinasi jadwal pengiriman atau pemasangan. Terima kasih!`
    };

    const statusKey = status.toUpperCase();
    const messageContent = messages[statusKey] || `*UPDATE STATUS - BINA KARYA*\n\nHalo, status pesanan *${product}* Anda telah diperbarui menjadi: *${status}*.`;

    try {
        const response = await fetch('https://api.fonnte.com/send', {
            method: 'POST', 
            headers: { 'Authorization': 'mGRwmeqmeiWw4w1K9r2U' },
            body: new URLSearchParams({
                target: formattedPhone,
                message: messageContent
            })
        });
        const result = await response.json();
        console.log(`[WhatsApp] Status to ${formattedPhone} (${statusKey}):`, result.status ? 'SENT' : 'FAILED');
    } catch (err) {
        console.error("[WhatsApp] Error sending message:", err);
    }
}

// --- API HANDLERS ---

export async function GET() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM tb_pesanan ORDER BY created_at DESC');
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 });
    } finally { if (connection) await connection.end(); }
}

export async function POST(req: Request) {
    let connection;
    try {
        const body = await req.json();
        connection = await mysql.createConnection(dbConfig);
        const query = `INSERT INTO tb_pesanan (nama_produk, kategori, panjang, lebar, luas, total_harga, no_whatsapp, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [body.nama_produk, body.kategori, body.panjang, body.lebar, body.luas, body.total_harga, body.no_whatsapp, 'PENDING'];
        await connection.execute(query, values);
        
        // Kirim notifikasi awal secara otomatis
        if (body.no_whatsapp) {
            await sendNotification(body.no_whatsapp, 'PENDING', body.nama_produk);
        }
        
        return NextResponse.json({ message: 'Pesanan berhasil dibuat' }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Gagal membuat pesanan' }, { status: 500 });
    } finally { if (connection) await connection.end(); }
}

async function updateStatusHandler(req: Request) {
    let connection;
    try {
        const body = await req.json();
        const { id, status } = body;

        if (!id || !status) {
            return NextResponse.json({ error: 'ID dan Status diperlukan' }, { status: 400 });
        }

        connection = await mysql.createConnection(dbConfig);
        
        // 1. Ambil data pesanan (WA & Nama Produk) sebelum update
        const [rows]: any = await connection.execute(
            'SELECT no_whatsapp, nama_produk FROM tb_pesanan WHERE id = ?', 
            [id]
        );
        
        if (rows.length === 0) {
            return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });
        }

        const order = rows[0];

        // 2. Eksekusi Update Status di Database
        // Pastikan status di-toUpperCase agar cocok dengan kunci pesan
        const [updateResult]: any = await connection.execute(
            'UPDATE tb_pesanan SET status = ? WHERE id = ?', 
            [status.toUpperCase(), id]
        );

        if (updateResult.affectedRows === 0) {
            return NextResponse.json({ error: 'Gagal mengupdate database' }, { status: 500 });
        }
        
        // 3. TRIGGER PESAN OTOMATIS
        if (order.no_whatsapp) {
            // Kita gunakan await agar yakin pesan diproses sebelum respon dikirim
            await sendNotification(order.no_whatsapp, status, order.nama_produk);
        }
        
        return NextResponse.json({ 
            message: 'Status diperbarui dan pesan otomatis terkirim', 
            updatedStatus: status 
        });

    } catch (error: any) {
        console.error("Update Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        if (connection) await connection.end();
    }
}

export async function PUT(req: Request) { return updateStatusHandler(req); }
export async function PATCH(req: Request) { return updateStatusHandler(req); }

export async function DELETE(req: Request) {
    let connection;
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        connection = await mysql.createConnection(dbConfig);
        await connection.execute('DELETE FROM tb_pesanan WHERE id = ?', [id]);
        return NextResponse.json({ message: 'Pesanan dihapus' });
    } catch (error) {
        return NextResponse.json({ error: 'Gagal menghapus' }, { status: 500 });
    } finally { if (connection) await connection.end(); }
}