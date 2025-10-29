
'use client';

import { services } from "@/dummy/data";
import { useStore } from "@/store/useStore";
import { ArrowRight, Award, CheckCircle, Clock, Shield } from "lucide-react";
import { useEffect, useState } from "react";

const HomePage = () => {
  const { theme } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  console.log(currentSlide)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-[#185d88] via-[#307aa8] to-[#185d88]' : 'bg-gradient-to-br from-[#b2d2e6] via-white to-[#a4d3f1]'}`}>
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute rounded-full opacity-20 animate-pulse ${
                theme === 'dark' ? 'bg-[#61c4f1]' : 'bg-[#6eaad0]'
              }`}
              style={{
                width: Math.random() * 300 + 50,
                height: Math.random() * 300 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 10}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`inline-block px-6 py-3 rounded-full mb-8 backdrop-blur-xl ${
            theme === 'dark' 
              ? 'bg-white/10 border border-white/20' 
              : 'bg-white/40 border border-[#6eaad0]/30'
          } shadow-2xl animate-bounce`}>
            <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#307aa8]'}`}>
              ✨ Service Premium de Nettoyage
            </span>
          </div>

          <h1 className={`text-6xl md:text-8xl font-bold mb-6 ${
            theme === 'dark' ? 'text-white' : 'text-[#185d88]'
          } tracking-tight leading-tight`}>
            Votre Espace<br />
            <span className={`bg-clip-text text-transparent bg-gradient-to-r ${
              theme === 'dark' 
                ? 'from-[#61c4f1] via-[#a4d3f1] to-[#b2d2e6]' 
                : 'from-[#6eaad0] via-[#61c4f1] to-[#307aa8]'
            }`}>
              Impeccable
            </span>
          </h1>

          <p className={`text-xl md:text-2xl mb-12 max-w-3xl mx-auto ${
            theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'
          } leading-relaxed`}>
            Des solutions de nettoyage professionnelles qui transforment votre environnement en un havre de paix et de propreté
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className={`group px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-[#61c4f1] to-[#6eaad0] text-white shadow-2xl shadow-[#61c4f1]/50'
                : 'bg-gradient-to-r from-[#6eaad0] to-[#61c4f1] text-white shadow-2xl shadow-[#6eaad0]/50'
            } hover:shadow-3xl flex items-center space-x-3`}>
              <span>Réserver Maintenant</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
            <button className={`px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-500 backdrop-blur-xl border-2 ${
              theme === 'dark'
                ? 'bg-white/10 border-white/30 text-white hover:bg-white/20'
                : 'bg-white/50 border-[#6eaad0]/50 text-[#185d88] hover:bg-white/70'
            } transform hover:scale-105 hover:-translate-y-1`}>
              Nos Services
            </button>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Garantie Qualité", desc: "100% satisfaction garantie" },
              { icon: Clock, title: "Service Rapide", desc: "Disponible 7j/7" },
              { icon: Award, title: "Équipe Expert", desc: "Professionnels certifiés" }
            ].map((item, i) => (
              <div key={i} className={`p-8 rounded-3xl backdrop-blur-xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 ${
                theme === 'dark'
                  ? 'bg-white/10 border border-white/20 hover:bg-white/15'
                  : 'bg-white/40 border border-[#6eaad0]/30 hover:bg-white/60'
              } shadow-2xl`}>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto ${
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-[#61c4f1] to-[#6eaad0]'
                    : 'bg-gradient-to-br from-[#6eaad0] to-[#61c4f1]'
                } shadow-lg`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
                  {item.title}
                </h3>
                <p className={theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`py-32 ${theme === 'dark' ? 'bg-[#185d88]' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className={`text-5xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
              Nos Services Premium
            </h2>
            <p className={`text-xl ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'} max-w-3xl mx-auto`}>
              Des solutions adaptées à tous vos besoins de nettoyage
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service) => (
              <>
              <div key={service.id} className={`group p-10 rounded-3xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-[#307aa8] to-[#185d88] border border-white/10'
                  : 'bg-gradient-to-br from-white to-[#b2d2e6] border border-[#6eaad0]/20'
              } shadow-2xl hover:shadow-3xl`}>
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-8 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-[#61c4f1] to-[#6eaad0]'
                    : 'bg-gradient-to-br from-[#6eaad0] to-[#61c4f1]'
                } shadow-lg transform group-hover:rotate-6 transition-transform duration-500`}>
                  <service.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className={`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
                  {service.title}
                </h3>
                <p className={`text-lg mb-6 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
                  {service.description}
                </p>
                <div className={`text-2xl font-bold mb-6 ${
                  theme === 'dark' ? 'text-[#61c4f1]' : 'text-[#307aa8]'
                }`}>
                  {service.price}
                </div>
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, i) => (
                    <li key={i} className={`flex items-center space-x-3 text-lg ${
                      theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'
                    }`}>
                      <CheckCircle className={`w-6 h-6 flex-shrink-0 ${
                        theme === 'dark' ? 'text-[#61c4f1]' : 'text-[#6eaad0]'
                      }`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button className={`w-full py-5 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-[#61c4f1] to-[#6eaad0] text-white hover:shadow-xl hover:shadow-[#61c4f1]/50'
                  : 'bg-gradient-to-r from-[#6eaad0] to-[#61c4f1] text-white hover:shadow-xl hover:shadow-[#6eaad0]/50'
              } transform hover:scale-105`}>
                <span>Réserver Maintenant</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              </>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;