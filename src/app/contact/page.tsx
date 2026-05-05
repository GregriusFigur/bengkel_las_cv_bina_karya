"use client";

import React from 'react';
import {
    Mail,
    Phone,
    MapPin,
    Send,
    MessageSquare,
    Clock,
} from 'lucide-react';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-20 px-6">
            <div className="max-w-7xl mx-auto">

                {/* HEADER SECTION */}
                <header className="mb-16 border-l-4 border-orange-500 pl-6">
                    <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">
                        Hubungi <span className="text-orange-500">Kami</span>
                    </h1>
                    <p className="text-gray-500 max-w-2xl leading-relaxed">
                        Siap mewujudkan konstruksi besi impian Anda? Konsultasikan kebutuhan pagar, kanopi, atau teralis Anda langsung dengan ahli dari CV Bina Karya.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* KOLOM KIRI: INFO KONTAK & MAP */}
                    <div className="lg:col-span-5 space-y-8">

                        {/* CARD INFO */}
                        <div className="grid grid-cols-1 gap-4">
                            <div className="group bg-[#0a0a0a] border border-white/5 p-6 hover:border-orange-500/50 transition-all">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-orange-500/10 rounded-sm text-orange-500">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">WhatsApp / Telp</h4>
                                        <p className="text-lg font-bold hover:text-orange-500 transition-colors cursor-pointer">+62 812-3456-7890</p>
                                    </div>
                                </div>
                            </div>

                            <div className="group bg-[#0a0a0a] border border-white/5 p-6 hover:border-orange-500/50 transition-all">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-orange-500/10 rounded-sm text-orange-500">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">Email Resmi</h4>
                                        <p className="text-lg font-bold hover:text-orange-500 transition-colors cursor-pointer">halo@binakarya.com</p>
                                    </div>
                                </div>
                            </div>

                            <div className="group bg-[#0a0a0a] border border-white/5 p-6 hover:border-orange-500/50 transition-all">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-orange-500/10 rounded-sm text-orange-500">
                                        <Clock size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">Jam Operasional</h4>
                                        <p className="text-sm font-bold text-gray-300">Senin - Sabtu: 08.00 - 17.00 WIB</p>
                                        <p className="text-xs text-gray-500 mt-1 italic">*Minggu & Hari Libur Nasional Tutup</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* MAP PLACEHOLDER */}
                        <div className="relative w-full h-64 bg-[#0a0a0a] border border-white/5 overflow-hidden group">
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 group-hover:text-orange-500/50 transition-colors">
                                <MapPin size={48} className="mb-2" />
                                <span className="text-[10px] uppercase font-bold tracking-widest">Klik untuk lihat Google Maps</span>
                            </div>
                            {/* Gantilah src di bawah ini dengan embed link Google Maps asli workshop Anda */}
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126748.56347862248!2d107.5731164!3d-6.9034443!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e6398252477f%3A0x146a5027d332d56a!2sBandung%2C%20West%20Java!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid"
                                className="w-full h-full grayscale invert opacity-30 hover:opacity-100 transition-opacity"
                                loading="lazy"
                            ></iframe>
                        </div>
                    </div>

                    {/* KOLOM KANAN: FORM PESAN */}
                    <div className="lg:col-span-7">
                        <div className="bg-[#0a0a0a] border border-white/5 p-8 md:p-12 relative overflow-hidden">
                            {/* Dekorasi Latar Belakang */}
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <MessageSquare size={120} />
                            </div>

                            <h3 className="text-2xl font-black uppercase mb-8 flex items-center gap-3">
                                Kirim <span className="text-orange-500">Pesan</span>
                            </h3>

                            <form className="space-y-6 relative z-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Nama Lengkap</label>
                                        <input
                                            type="text"
                                            placeholder="Contoh: Budi Santoso"
                                            className="w-full bg-black border border-white/10 p-4 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Nomor WhatsApp</label>
                                        <input
                                            type="tel"
                                            placeholder="0812xxxx"
                                            className="w-full bg-black border border-white/10 p-4 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Kategori Kebutuhan</label>
                                    <search className="w-full bg-black border border-white/10 p-4 text-sm focus:outline-none focus:border-orange-500 transition-colors appearance-none">
                                        <option>Konsultasi Kanopi</option>
                                        <option>Pemesanan Pagar</option>
                                        <option>Teralis & Pintu Besi</option>
                                        <option>Lainnya</option>
                                    </search>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Pesan atau Pertanyaan</label>
                                    <textarea
                                        rows={5}
                                        placeholder="Jelaskan detail proyek atau pertanyaan Anda..."
                                        className="w-full bg-black border border-white/10 p-4 text-sm focus:outline-none focus:border-orange-500 transition-colors resize-none"
                                    ></textarea>
                                </div>

                                <button className="w-full py-5 bg-orange-500 text-black font-black uppercase text-xs tracking-[0.2em] hover:bg-white transition-all flex items-center justify-center gap-3 group">
                                    Kirim Sekarang
                                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </button>
                            </form>
                        </div>

                        {/* SOCIAL MEDIA LINKS */}
                        <div className="mt-8 flex items-center gap-6 justify-center lg:justify-start">
                            <span className="text-[10px] uppercase font-black text-gray-600 tracking-[0.3em]">Ikuti Kami:</span>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}