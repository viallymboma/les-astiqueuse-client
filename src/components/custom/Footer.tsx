"use client"
import { useStore } from "@/store/useStore";
import { Facebook, Instagram, Sparkles, Twitter } from "lucide-react";

const Footer = () => {
    const { theme } = useStore();
  
    return (
      <footer className={`py-16 ${theme === 'dark' ? 'bg-[#185d88]' : 'bg-[#307aa8]'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-[#61c4f1] to-[#6eaad0] shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">LesAstiqueuses</h3>
              </div>
              <p className="text-[#b2d2e6] leading-relaxed">
                Votre partenaire de confiance pour des services de nettoyage professionnels et écologiques.
              </p>
            </div>
            <div>
              <h4 className="text-xl font-bold text-white mb-6">Services</h4>
              <ul className="space-y-3 text-[#b2d2e6]">
                <li><a href="#" className="hover:text-white transition-colors">Nettoyage Résidentiel</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Nettoyage Professionnel</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Nettoyage en Profondeur</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Service Express</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold text-white mb-6">Entreprise</h4>
              <ul className="space-y-3 text-[#b2d2e6]">
                <li><a href="#" className="hover:text-white transition-colors">À Propos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carrières</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Témoignages</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold text-white mb-6">Contact</h4>
              <ul className="space-y-3 text-[#b2d2e6]">
                <li>+33 1 23 45 67 89</li>
                <li>contact@LesAstiqueuses.fr</li>
                <li>Paris, France</li>
              </ul>
              <div className="flex space-x-4 mt-6">
                {[Facebook, Instagram, Twitter].map((Icon, i) => (
                  <button key={i} className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300">
                    <Icon className="w-5 h-5 text-white" />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8 text-center text-[#b2d2e6]">
            <p>© 2025 LesAstiqueuses. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    );
  };

export default Footer;