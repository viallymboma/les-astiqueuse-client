"use client"
import { useStore } from "@/store/useStore";
import { Star } from "lucide-react";

const AboutPage = () => {
    const { theme } = useStore();
  
    return (
      <div className={`min-h-screen pt-32 pb-20 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-[#185d88] via-[#307aa8] to-[#185d88]' 
          : 'bg-gradient-to-br from-[#b2d2e6] via-white to-[#a4d3f1]'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h1 className={`text-6xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
              À Propos de Nous
            </h1>
            <p className={`text-2xl ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'} max-w-3xl mx-auto`}>
              Votre partenaire de confiance pour un environnement impeccable
            </p>
          </div>
  
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            <div className={`p-12 rounded-3xl ${
              theme === 'dark'
                ? 'bg-white/10 backdrop-blur-xl border border-white/20'
                : 'bg-white/60 backdrop-blur-xl border border-[#6eaad0]/30'
            } shadow-2xl`}>
              <h2 className={`text-4xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
                Notre Mission
              </h2>
              <p className={`text-xl leading-relaxed ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
                Chez LesAstiqueuses, nous croyons que chaque espace mérite d&apos;être impeccable. Notre mission est de fournir des services de nettoyage exceptionnels qui transforment votre environnement en un lieu sain, propre et accueillant. Avec plus de 10 ans d&apos;expérience, nous combinons expertise professionnelle et produits écologiques pour des résultats qui dépassent vos attentes.
              </p>
            </div>
  
            <div className={`p-12 rounded-3xl ${
              theme === 'dark'
                ? 'bg-white/10 backdrop-blur-xl border border-white/20'
                : 'bg-white/60 backdrop-blur-xl border border-[#6eaad0]/30'
            } shadow-2xl`}>
              <h2 className={`text-4xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
                Nos Valeurs
              </h2>
              <ul className="space-y-4">
                {['Excellence', 'Fiabilité', 'Respect de l\'environnement', 'Satisfaction client'].map((value, i) => (
                  <li key={i} className={`flex items-center space-x-3 text-xl ${
                    theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'
                  }`}>
                    <Star className={`w-6 h-6 ${theme === 'dark' ? 'text-[#61c4f1]' : 'text-[#6eaad0]'}`} />
                    <span>{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: '10+', label: 'Années d\'expérience' },
              { number: '5000+', label: 'Clients satisfaits' },
              { number: '50+', label: 'Professionnels qualifiés' }
            ].map((stat, i) => (
              <div key={i} className={`p-10 rounded-3xl text-center ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-[#307aa8] to-[#185d88]'
                  : 'bg-gradient-to-br from-[#6eaad0] to-[#61c4f1]'
              } shadow-2xl transform hover:scale-105 transition-all duration-500`}>
                <div className="text-6xl font-bold text-white mb-4">{stat.number}</div>
                <div className="text-xl text-white/90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

export default AboutPage;
