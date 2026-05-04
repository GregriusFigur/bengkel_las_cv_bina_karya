import Link from 'next/link';

const Header = () => {
  return (
    <nav className="sticky top-0 z-50 w-full bg-black border-b border-white/20 px-6 py-4">
      <div className="max-auto flex max-w-7xl items-center justify-between">

        {/* BAGIAN KIRI: LOGO DENGAN TEKS BERTINGKAT */}
        <div className="flex items-center gap-3">
          {/* Ikon Logo */}
          <div className="h-10 w-10 border-2 border-white flex items-center justify-center rounded-md bg-white shrink-0">
            <span className="text-black font-black text-xl">B</span>
          </div>

          {/* Teks Bertingkat */}
          <div className="flex flex-col justify-center leading-none">
            <span className="text-white font-bold text-lg tracking-tighter uppercase leading-tight">
              Bengkel las
            </span>
            <span className="text-gray-400 font-light text-xs uppercase tracking-[0.2em] -mt-1">
              Cv Bina Karya
            </span>
          </div>
        </div>

        {/* BAGIAN TENGAH: NAVIGATION BUTTONS */}
        <div className="hidden md:flex items-center space-x-2">
          <Link href="/">
            <button className="px-6 py-2 text-sm font-medium text-white hover:bg-white hover:text-black transition-all duration-300 rounded-full border border-transparent hover:border-white">
              Beranda
            </button>
          </Link>
          <Link href="/hitungbiaya">
            <button className="px-6 py-2 text-sm font-medium text-white hover:bg-white hover:text-black transition-all duration-300 rounded-full border border-transparent hover:border-white">
              Produk
            </button>
          </Link>
          <Link href="/contact">
            <button className="px-6 py-2 text-sm font-medium text-white hover:bg-white hover:text-black transition-all duration-300 rounded-full border border-transparent hover:border-white">
              Contact
            </button>
          </Link>
        </div>

        {/* BAGIAN KANAN: CALL TO ACTION (OPSIONAL AGAR SEIMBANG) */}
        <div className="hidden md:block">
          <div className="text-[10px] text-gray-500 uppercase tracking-widest">
            Bengkel Las Profesional
          </div>
        </div>

        {/* MOBILE MENU (Hanya muncul di HP) */}
        <div className="md:hidden text-white">
          <button className="p-2 border border-white/50 rounded">
            Menu
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Header;