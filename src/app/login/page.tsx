"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, ShieldAlert } from 'lucide-react';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        // Logika otentikasi sederhana (Bisa dikembangkan dengan tabel users di DB)
        if (username === 'admin' && password === 'admin123') {
            // Simpan status login di cookie/localStorage sederhana
            document.cookie = "isLoggedIn=true; path=/";
            router.push('/admin');
        } else {
            setError('Kredensial tidak valid. Silakan coba lagi.');
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-6">
            <div className="w-full max-w-md bg-[#0a0a0a] border border-white/5 p-10 shadow-2xl">
                <div className="flex flex-col items-center mb-10">
                    <div className="p-4 bg-orange-500/10 rounded-full text-orange-500 mb-4">
                        <Lock size={32} />
                    </div>
                    <h1 className="text-2xl font-black uppercase tracking-tighter text-white">
                        Admin <span className="text-orange-500">Access</span>
                    </h1>
                    <p className="text-gray-500 text-xs mt-2 uppercase tracking-[0.2em]">Restricted Area</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 p-4 text-red-500 text-xs flex items-center gap-3">
                            <ShieldAlert size={16} /> {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Username</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-black border border-white/10 p-4 pl-12 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
                                placeholder="Masukan username"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black border border-white/10 p-4 pl-12 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
                                placeholder="Masukan password"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-5 bg-orange-500 text-black font-black uppercase text-xs tracking-[0.2em] hover:bg-white transition-all shadow-[0_0_20px_rgba(249,115,22,0.2)]"
                    >
                        Login Sekarang
                    </button>
                </form>
            </div>
        </div>
    );
}