'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, Shield, Sparkles, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { useStore } from '@/store/useStore';

const services = [
  {
    id: 1,
    title: "Nettoyage Résidentiel",
    description: "Service de nettoyage complet pour votre maison. Nous prenons soin de chaque détail pour que votre espace soit impeccable.",
    icon: Home,
    price: "À partir de 45€",
    features: ["Cuisine & Salle de bain", "Chambres & Salon", "Aspirateur & Serpillière", "Dépoussiérage complet"],
    details: "Notre service de nettoyage résidentiel est conçu pour vous offrir un environnement sain et propre. Nos professionnels utilisent des produits écologiques et des techniques modernes pour garantir un résultat impeccable."
  },
  {
    id: 2,
    title: "Nettoyage Professionnel",
    description: "Des solutions de nettoyage adaptées aux entreprises et bureaux pour maintenir un environnement professionnel.",
    icon: Shield,
    price: "Sur devis",
    features: ["Bureaux & Espaces communs", "Sanitaires professionnels", "Vitres & Surfaces", "Désinfection complète"],
    details: "Maintenez un environnement de travail propre et professionnel avec notre service dédié aux entreprises. Planning flexible et équipe discrète garantis."
  },
  {
    id: 3,
    title: "Nettoyage en Profondeur",
    description: "Un nettoyage intensif et détaillé pour retrouver l'éclat d'origine de votre espace.",
    icon: Sparkles,
    price: "À partir de 120€",
    features: ["Dégraissage cuisine", "Traitement des tapis", "Nettoyage murs & plafonds", "Désinfection approfondie"],
    details: "Pour les grandes occasions ou un rafraîchissement complet, notre service de nettoyage en profondeur couvre chaque recoin de votre espace avec une attention méticuleuse."
  },
  {
    id: 4,
    title: "Service Express",
    description: "Besoin urgent d'un nettoyage rapide ? Notre équipe intervient dans les plus brefs délais.",
    icon: Clock,
    price: "À partir de 60€",
    features: ["Intervention rapide", "Disponible 7j/7", "Équipe professionnelle", "Résultats garantis"],
    details: "Service d'urgence disponible pour vos besoins imprévus. Nous intervenons rapidement tout en maintenant nos standards de qualité élevés."
  }
];

export default function ServicesPage() {
  const { theme } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`min-h-screen pt-32 pb-20 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-[#185d88] via-[#307aa8] to-[#185d88]' 
        : 'bg-gradient-to-br from-[#b2d2e6] via-white to-[#a4d3f1]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className={`text-6xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
            Nos Services
          </h1>
          <p className={`text-2xl ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'} max-w-3xl mx-auto`}>
            Des solutions professionnelles pour tous vos besoins
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {services.map((service) => (
            <div key={service.id} className={`p-12 rounded-3xl transition-all duration-500 hover:scale-105 ${
              theme === 'dark'
                ? 'bg-white/10 backdrop-blur-xl border border-white/20'
                : 'bg-white/60 backdrop-blur-xl border border-[#6eaad0]/30'
            } shadow-2xl hover:shadow-3xl`}>
              <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-8 ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-[#61c4f1] to-[#6eaad0]'
                  : 'bg-gradient-to-br from-[#6eaad0] to-[#61c4f1]'
              } shadow-xl`}>
                <service.icon className="w-12 h-12 text-white" />
              </div>
              <h2 className={`text-4xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
                {service.title}
              </h2>
              <p className={`text-xl mb-8 leading-relaxed ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
                {service.description}
              </p>
              <div className={`text-3xl font-bold mb-8 ${theme === 'dark' ? 'text-[#61c4f1]' : 'text-[#307aa8]'}`}>
                {service.price}
              </div>
              <div className={`p-6 rounded-2xl mb-8 ${
                theme === 'dark' ? 'bg-white/5' : 'bg-[#6eaad0]/10'
              }`}>
                <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
                  Inclus dans ce service :
                </h3>
                <ul className="space-y-4">
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
              <p className={`text-lg mb-8 italic ${theme === 'dark' ? 'text-[#b2d2e6]/80' : 'text-[#6d89a3]/80'}`}>
                {service.details}
              </p>
              <Link href="/dashboard" className={`block w-full py-5 rounded-xl text-center font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-[#61c4f1] to-[#6eaad0] text-white hover:shadow-xl hover:shadow-[#61c4f1]/50'
                  : 'bg-gradient-to-r from-[#6eaad0] to-[#61c4f1] text-white hover:shadow-xl hover:shadow-[#6eaad0]/50'
              } transform hover:scale-105`}>
                <span>Réserver Maintenant</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}