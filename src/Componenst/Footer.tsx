import {  Phone, MapPin, Clock,} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/10 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* KOLOM 1: TENTANG & LOGO */}
        <div className="space-y-4">
          <div className="flex flex-col">
            <span className="text-xl font-bold uppercase tracking-tighter">
              Bengkel Las
            </span>
            <span className="text-gray-400 text-sm font-light uppercase tracking-widest">
              Cv Bina Karya
            </span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
            Solusi konstruksi besi terbaik untuk rumah dan industri. Spesialis pagar, kanopi, dan teralis dengan kualitas pengerjaan presisi.
          </p>
          
        </div>

        {/* KOLOM 2: LAYANAN KAMI */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b border-white/20 pb-2 inline-block">Layanan Kami</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="hover:text-white transition-colors cursor-pointer">• Pagar Minimalis & Tempa</li>
            <li className="hover:text-white transition-colors cursor-pointer">• Kanopi Baja Ringan & Galvalum</li>
            <li className="hover:text-white transition-colors cursor-pointer">• Teralis Jendela & Pintu Besi</li>
            <li className="hover:text-white transition-colors cursor-pointer">• Konstruksi Baja Berat</li>
          </ul>
        </div>

        {/* KOLOM 3: KONTAK & JAM OPERASIONAL */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b border-white/20 pb-2 inline-block">Hubungi Kami</h3>
          <div className="space-y-3 text-sm text-gray-400">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-white shrink-0" />
              <span>Jl. Industri No. 123, Pontianak, Kalimantan Barat</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={18} className="text-white shrink-0" />
              <span>+62 812-3456-7890</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={18} className="text-white shrink-0" />
              <span>Senin - Sabtu: 08.00 - 17.00 WIB</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;