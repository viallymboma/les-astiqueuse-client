'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, Award, CheckCircle, Clock, Shield, Sparkles, Star, Users, 
  Heart, Zap, TrendingUp, Phone, Mail 
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Service, ServiceWithIcon } from '@/types/service';
import { formatPrice, mapServiceWithIcon } from '@/lib/services';

// Footer Component (your provided one)

export default function HomePage() {
  const { theme } = useStore();
  const [services, setServices] = useState<ServiceWithIcon[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch('/api/services');
        if (!response.ok) throw new Error('Failed to fetch');
        const data: Service[] = await response.json();
        const servicesWithIcons = data
          .filter(s => s.status === 'ACTIVE' && s.code !== 'TEST')
          .map(mapServiceWithIcon);
        setServices(servicesWithIcons);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const testimonials = [
    { name: "Marie Laurent", role: "Particulier", text: "Service impeccable ! Mon appartement n'a jamais été aussi propre. L'équipe est professionnelle et ponctuelle.", rating: 5, image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80" },
    { name: "Pierre Dubois", role: "Entreprise", text: "Nous faisons appel à LesAstiqueuses depuis 2 ans. Excellente qualité de service, je recommande vivement.", rating: 5, image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80" },
    { name: "Sophie Martin", role: "Particulier", text: "Un service exceptionnel avec des produits écologiques. Je suis ravie du résultat à chaque fois.", rating: 5, image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" }
  ];

  const stats = [
    { icon: Users, value: '5000+', label: 'Clients Satisfaits', color: 'from-[#6eaad0] to-[#307aa8]' },
    { icon: Star, value: '4.9/5', label: 'Note Moyenne', color: 'from-[#61c4f1] to-[#6eaad0]' },
    { icon: Award, value: '10+', label: 'Ans d\'Expérience', color: 'from-[#307aa8] to-[#185d88]' },
    { icon: TrendingUp, value: '98%', label: 'Taux de Satisfaction', color: 'from-green-400 to-emerald-500' }
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-[#185d88] via-[#307aa8] to-[#185d88]' : 'bg-gradient-to-br from-[#b2d2e6] via-white to-[#a4d3f1]'}`}>
      {/* Hero Section with Parallax */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute rounded-full opacity-10 ${theme === 'dark' ? 'bg-[#61c4f1]' : 'bg-[#6eaad0]'}`}
              style={{
                width: Math.random() * 400 + 100,
                height: Math.random() * 400 + 100,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 20 + 15}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        {/* Floating Icons with Parallax */}
        <div className="absolute inset-0 pointer-events-none">
          <Sparkles className="absolute top-20 left-20 w-12 h-12 text-[#6eaad0]/30 animate-bounce" style={{ transform: `translateY(${scrollY * 0.1}px)` }} />
          <Star className="absolute top-40 right-32 w-10 h-10 text-[#61c4f1]/30 animate-bounce" style={{ animationDelay: '1s', transform: `translateY(${scrollY * 0.15}px)` }} />
          <Heart className="absolute bottom-32 left-40 w-14 h-14 text-[#307aa8]/30 animate-bounce" style={{ animationDelay: '2s', transform: `translateY(${scrollY * 0.2}px)` }} />
          <Zap className="absolute top-60 right-20 w-16 h-16 text-[#6eaad0]/20 animate-pulse" style={{ transform: `translateY(${scrollY * 0.12}px)` }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8" style={{ transform: `translateX(${Math.min(scrollY * 0.1, 50)}px)`, opacity: Math.max(1 - scrollY / 500, 0.3) }}>
              <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full backdrop-blur-xl ${
                theme === 'dark' ? 'bg-white/10 border border-white/20' : 'bg-white/60 border border-[#6eaad0]/30'
              } shadow-lg animate-bounce`}>
                <Sparkles className={`w-4 h-4 ${theme === 'dark' ? 'text-[#61c4f1]' : 'text-[#307aa8]'}`} />
                <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#307aa8]'}`}>
                  Service Premium de Nettoyage
                </span>
              </div>
              <h1 className={`text-5xl md:text-7xl font-bold ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'} tracking-tight leading-tight`}>
                Votre Espace
                <br />
                <span className="relative inline-block">
                  <span className="absolute -inset-2 bg-gradient-to-r from-[#61c4f1]/30 to-[#6eaad0]/30 blur-2xl animate-pulse"></span>
                  <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-[#6eaad0] via-[#61c4f1] to-[#307aa8]">
                    Impeccable
                  </span>
                </span>
              </h1>
              <p className={`text-xl leading-relaxed ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
                Des solutions de nettoyage professionnelles qui transforment votre environnement en un havre de paix et de propreté
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/new-client" className="group relative px-8 py-5 rounded-xl font-bold text-lg text-white overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#6eaad0] via-[#61c4f1] to-[#307aa8]"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#61c4f1] to-[#6eaad0] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="relative flex items-center justify-center">
                    Réserver Maintenant
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                  </span>
                </Link>
                <Link href="/services" className={`px-8 py-5 rounded-xl font-semibold text-lg backdrop-blur-xl border transition-all duration-300 transform hover:scale-105 ${
                  theme === 'dark' ? 'bg-white/5 border-white/20 text-white hover:bg-white/10' : 'bg-white/40 border-[#6eaad0]/40 text-[#185d88] hover:bg-white/60'
                }`}>
                  Découvrir nos services
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                {[
                  { icon: Users, value: '5000+', label: 'Clients' },
                  { icon: Star, value: '4.9/5', label: 'Avis' },
                  { icon: Award, value: '10+', label: 'Ans' }
                ].map((stat, i) => (
                  <div key={i} className={`p-4 rounded-xl backdrop-blur-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white/40'} transform hover:scale-110 transition-all duration-300`}>
                    <stat.icon className={`w-8 h-8 mb-2 ${theme === 'dark' ? 'text-[#61c4f1]' : 'text-[#6eaad0]'}`} />
                    <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>{stat.value}</p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Hero Images Grid */}
            <div className="relative" style={{ transform: `translateY(${Math.min(scrollY * 0.15, 80)}px)` }}>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-[#6eaad0] to-[#61c4f1] rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl h-96">
                    <img
                      src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80"
                      alt="Professional Cleaning Service"
                      className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#185d88]/80 via-[#307aa8]/30 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center space-x-3 mb-2">
                        <CheckCircle className="w-6 h-6 text-white" />
                        <span className="text-white font-bold text-lg">Certification ISO 9001</span>
                      </div>
                      <p className="text-[#b2d2e6] text-sm">Qualité garantie</p>
                    </div>
                  </div>
                </div>
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#307aa8] to-[#185d88] rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition duration-700"></div>
                  <div className="relative rounded-2xl overflow-hidden shadow-xl h-48">
                    <img
                      src="https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=400&q=80"
                      alt="Team Member"
                      className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#185d88]/70 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white font-semibold text-sm">Équipe Professionnelle</p>
                    </div>
                  </div>
                </div>
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition duration-700"></div>
                  <div className="relative rounded-2xl overflow-hidden shadow-xl h-48">
                    <img
                      src="https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&q=80"
                      alt="Eco-Friendly Products"
                      className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#185d88]/70 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white font-semibold text-sm">Produits Écologiques</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`absolute -bottom-6 -right-6 p-6 rounded-2xl shadow-2xl backdrop-blur-xl animate-bounce ${
                theme === 'dark' ? 'bg-white/10 border border-white/20' : 'bg-white'
              }`} style={{animationDelay: '0.5s'}}>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>98%</p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>Satisfaction</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className={`py-16 ${theme === 'dark' ? 'bg-[#185d88]/50' : 'bg-white/80'} backdrop-blur-xl border-y ${theme === 'dark' ? 'border-white/10' : 'border-[#6eaad0]/20'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center group cursor-pointer">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <p className={`text-4xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>{stat.value}</p>
                <p className={`text-sm ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className={`px-6 py-2 rounded-full text-sm font-semibold ${theme === 'dark' ? 'bg-[#61c4f1]/20 text-[#61c4f1]' : 'bg-[#6eaad0]/20 text-[#307aa8]'}`}>
              Pourquoi Nous Choisir
            </span>
            <h2 className={`text-5xl font-bold mt-6 mb-4 ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
              Notre Engagement Qualité
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Garantie Qualité", desc: "100% satisfaction garantie ou remboursé", color: "from-[#6eaad0] to-[#307aa8]" },
              { icon: Clock, title: "Service Rapide", desc: "Intervention sous 24h, disponible 7j/7", color: "from-[#61c4f1] to-[#6eaad0]" },
              { icon: Award, title: "Équipe Experte", desc: "Professionnels formés et certifiés", color: "from-[#307aa8] to-[#185d88]" }
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${item.color} rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500`}></div>
                <div className={`relative p-8 rounded-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 shadow-xl ${
                  theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-white/60 border border-[#6eaad0]/20'
                }`}>
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 bg-gradient-to-br ${item.color} shadow-lg transform group-hover:rotate-12 transition-transform duration-300`}>
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className={`text-xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
                    {item.title}
                  </h3>
                  <p className={`${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className={`py-24 ${theme === 'dark' ? 'bg-[#185d88]' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className={`px-6 py-2 rounded-full text-sm font-semibold ${theme === 'dark' ? 'bg-[#61c4f1]/20 text-[#61c4f1]' : 'bg-[#6eaad0]/20 text-[#307aa8]'}`}>
              Nos Services
            </span>
            <h2 className={`text-5xl font-bold mt-6 mb-4 ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
              Solutions Professionnelles
            </h2>
            <p className={`text-lg ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'} max-w-2xl mx-auto`}>
              Des services adaptés à tous vos besoins de nettoyage
            </p>
          </div>
          {loading ? (
            <div className="text-center py-12">
              <div className={`inline-block animate-spin rounded-full h-12 w-12 border-b-2 ${theme === 'dark' ? 'border-white' : 'border-[#185d88]'}`}></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div key={service.id} className={`group p-8 rounded-2xl transition-all duration-300 hover:scale-105 ${
                  theme === 'dark' ? 'bg-gradient-to-br from-[#307aa8] to-[#185d88] border border-white/10' : 'bg-gradient-to-br from-white to-[#b2d2e6]/30 border border-[#6eaad0]/20'
                } shadow-lg hover:shadow-2xl`}>
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${
                    theme === 'dark' ? 'bg-gradient-to-br from-[#61c4f1] to-[#6eaad0]' : 'bg-gradient-to-br from-[#6eaad0] to-[#61c4f1]'
                  } shadow-md transform group-hover:rotate-3 transition-transform duration-300`}>
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className={`text-2xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
                    {service.name}
                  </h3>
                  <p className={`text-sm mb-4 line-clamp-2 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
                    {service.description}
                  </p>
                  <div className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-[#61c4f1]' : 'text-[#307aa8]'}`}>
                    {formatPrice(service.standardRate, service.preferredRate)}
                  </div>
                  {service.options.length > 0 && (
                    <div className="space-y-2 mb-6">
                      {service.options.slice(0, 3).map((option) => (
                        <div key={option.id} className={`flex items-start space-x-2 text-sm ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
                          <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${theme === 'dark' ? 'text-[#61c4f1]' : 'text-[#6eaad0]'}`} />
                          <span>{option.optionName}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <Link href={`/services/${service.id}`} className={`block w-full py-3 rounded-lg text-center font-semibold text-sm transition-all duration-300 ${
                    theme === 'dark' ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-[#6eaad0]/20 text-[#307aa8] hover:bg-[#6eaad0]/30'
                  }`}>
                    En savoir plus
                  </Link>
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-12">
            <Link href="/services" className={`inline-flex items-center space-x-2 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
              theme === 'dark' ? 'bg-gradient-to-r from-[#61c4f1] to-[#6eaad0] text-white hover:shadow-xl' : 'bg-gradient-to-r from-[#6eaad0] to-[#61c4f1] text-white hover:shadow-xl'
            }`}>
              <span>Voir tous les services</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className={`px-6 py-2 rounded-full text-sm font-semibold ${theme === 'dark' ? 'bg-[#61c4f1]/20 text-[#61c4f1]' : 'bg-[#6eaad0]/20 text-[#307aa8]'}`}>
              Témoignages
            </span>
            <h2 className={`text-5xl font-bold mt-6 mb-4 ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
              Ils Nous Font Confiance
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <div key={i} className={`p-8 rounded-2xl backdrop-blur-xl shadow-xl hover:scale-105 transition-all duration-300 ${
                theme === 'dark' ? 'bg-white/10 border border-white/20' : 'bg-white/80'
              }`}>
                <div className="flex items-center mb-6">
                  <img src={testimonial.image} alt={testimonial.name} className="w-16 h-16 rounded-full object-cover mr-4" />
                  <div>
                    <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>{testimonial.name}</p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className={`text-base italic ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
                  {`${testimonial.text}`}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-24 relative overflow-hidden ${theme === 'dark' ? 'bg-gradient-to-br from-[#307aa8] to-[#185d88]' : 'bg-gradient-to-br from-[#6eaad0] to-[#61c4f1]'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6">
            <h2 className={`text-4xl md:text-5xl font-bold ${theme === 'dark' ? 'text-white' : 'text-white'} tracking-tight`}>
              Prêt à un Espace Impeccable ?
            </h2>
            <p className={`text-xl ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-white/90'} max-w-2xl mx-auto`}>
              Réservez votre première intervention en moins de 2 minutes. 
              Service disponible dans votre commune dès aujourd&quot;hui.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link 
              href="/reservation" 
              className="group relative px-10 py-5 rounded-xl font-bold text-lg text-white overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#6eaad0] via-[#61c4f1] to-[#307aa8]"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#61c4f1] to-[#6eaad0] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative flex items-center justify-center">
                Commencer Maintenant
                <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-2 transition-transform" />
              </span>
            </Link>

            <Link 
              href="tel:+33123456789" 
              className={`px-10 py-5 rounded-xl font-semibold text-lg backdrop-blur-xl border-2 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 ${
                theme === 'dark' 
                  ? 'bg-white/10 border-white/30 text-white hover:bg-white/20' 
                  : 'bg-white/20 border-white/40 text-white hover:bg-white/30'
              }`}
            >
              <Phone className="w-5 h-5" />
              Nous Appeler
            </Link>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Mail className={`w-4 h-4 ${theme === 'dark' ? 'text-[#61c4f1]' : 'text-white'}`} />
              <span className={theme === 'dark' ? 'text-[#b2d2e6]' : 'text-white/80'}>contact@LesAstiqueuses.fr</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/30"></div>
            <div className="flex items-center gap-2">
              <Phone className={`w-4 h-4 ${theme === 'dark' ? 'text-[#61c4f1]' : 'text-white'}`} />
              <span className={theme === 'dark' ? 'text-[#b2d2e6]' : 'text-white/80'}>+33 1 23 45 67 89</span>
            </div>
          </div>

          <p className={`mt-8 text-sm ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-white/70'}`}>
            Pas encore disponible dans votre commune ? 
            <Link href="/login" className="underline ml-1 font-medium hover:text-white transition">
              Soyez informé en priorité
            </Link>
          </p>
        </div>
      </section>

      {/* Footer */}
      {/* <Footer /> */}
    </div>
  );
}

// 'use client';

// import { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { ArrowRight, Award, CheckCircle, Clock, Shield, Sparkles } from 'lucide-react';
// import { useStore } from '@/store/useStore';
// import { Service, ServiceWithIcon } from '@/types/service';
// import { formatPrice, mapServiceWithIcon } from '@/lib/services';

// export default function HomePage() {
//   const { theme } = useStore();
//   const [services, setServices] = useState<ServiceWithIcon[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchServices() {
//       try {
//         const response = await fetch('/api/services'); // Use internal API route
//         if (!response.ok) throw new Error('Failed to fetch');
//         const data: Service[] = await response.json();
//         const servicesWithIcons = data
//           .filter(s => s.status === 'ACTIVE' && s.code !== 'TEST')
//           .map(mapServiceWithIcon);
//         setServices(servicesWithIcons);
//       } catch (error) {
//         console.error('Failed to fetch services:', error);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchServices();
//   }, []);

//   return (
//     <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-[#185d88] via-[#307aa8] to-[#185d88]' : 'bg-gradient-to-br from-[#b2d2e6] via-white to-[#a4d3f1]'}`}>
//       {/* Hero Section */}
//       <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
//         <div className="absolute inset-0 overflow-hidden">
//           {[...Array(15)].map((_, i) => (
//             <div
//               key={i}
//               className={`absolute rounded-full opacity-10 ${
//                 theme === 'dark' ? 'bg-[#61c4f1]' : 'bg-[#6eaad0]'
//               }`}
//               style={{
//                 width: Math.random() * 400 + 100,
//                 height: Math.random() * 400 + 100,
//                 left: `${Math.random() * 100}%`,
//                 top: `${Math.random() * 100}%`,
//                 animation: `float ${Math.random() * 20 + 15}s ease-in-out infinite`,
//                 animationDelay: `${Math.random() * 5}s`,
//               }}
//             />
//           ))}
//         </div>

//         <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-32">
//           <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full mb-8 backdrop-blur-xl ${
//             theme === 'dark' 
//               ? 'bg-white/10 border border-white/20' 
//               : 'bg-white/60 border border-[#6eaad0]/30'
//           } shadow-lg`}>
//             <Sparkles className={`w-4 h-4 ${theme === 'dark' ? 'text-[#61c4f1]' : 'text-[#307aa8]'}`} />
//             <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#307aa8]'}`}>
//               Service Premium de Nettoyage
//             </span>
//           </div>

//           <h1 className={`text-5xl md:text-7xl lg:text-8xl font-bold mb-8 ${
//             theme === 'dark' ? 'text-white' : 'text-[#185d88]'
//           } tracking-tight leading-tight`}>
//             Votre Espace
//             <br />
//             <span className={`bg-clip-text text-transparent bg-gradient-to-r ${
//               theme === 'dark' 
//                 ? 'from-[#61c4f1] via-[#a4d3f1] to-[#b2d2e6]' 
//                 : 'from-[#6eaad0] via-[#61c4f1] to-[#307aa8]'
//             }`}>
//               Impeccable
//             </span>
//           </h1>

//           <p className={`text-lg md:text-xl lg:text-2xl mb-12 max-w-3xl mx-auto ${
//             theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'
//           } leading-relaxed font-light`}>
//             Des solutions de nettoyage professionnelles qui transforment votre environnement en un havre de paix et de propreté
//           </p>

//           <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//             <Link href="/dashboard" className={`group px-8 py-4 rounded-xl font-semibold text-base transition-all duration-300 transform hover:scale-105 ${
//               theme === 'dark'
//                 ? 'bg-gradient-to-r from-[#61c4f1] to-[#6eaad0] text-white shadow-lg shadow-[#61c4f1]/30'
//                 : 'bg-gradient-to-r from-[#6eaad0] to-[#61c4f1] text-white shadow-lg shadow-[#6eaad0]/30'
//             } hover:shadow-xl flex items-center space-x-2`}>
//               <span>Réserver Maintenant</span>
//               <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//             </Link>
//             <Link href="/services" className={`px-8 py-4 rounded-xl font-semibold text-base transition-all duration-300 backdrop-blur-xl border ${
//               theme === 'dark'
//                 ? 'bg-white/5 border-white/20 text-white hover:bg-white/10'
//                 : 'bg-white/40 border-[#6eaad0]/40 text-[#185d88] hover:bg-white/60'
//             } transform hover:scale-105`}>
//               Découvrir nos services
//             </Link>
//           </div>

//           <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
//             {[
//               { icon: Shield, title: "Garantie Qualité", desc: "100% satisfaction garantie" },
//               { icon: Clock, title: "Service Rapide", desc: "Disponible 7j/7" },
//               { icon: Award, title: "Équipe Experte", desc: "Professionnels certifiés" }
//             ].map((item, i) => (
//               <div key={i} className={`p-6 rounded-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 ${
//                 theme === 'dark'
//                   ? 'bg-white/5 border border-white/10 hover:bg-white/10'
//                   : 'bg-white/40 border border-[#6eaad0]/20 hover:bg-white/60'
//               } shadow-lg`}>
//                 <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 mx-auto ${
//                   theme === 'dark'
//                     ? 'bg-gradient-to-br from-[#61c4f1] to-[#6eaad0]'
//                     : 'bg-gradient-to-br from-[#6eaad0] to-[#61c4f1]'
//                 } shadow-md`}>
//                   <item.icon className="w-7 h-7 text-white" />
//                 </div>
//                 <h3 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
//                   {item.title}
//                 </h3>
//                 <p className={`text-sm ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
//                   {item.desc}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Services Section */}
//       <section className={`py-24 ${theme === 'dark' ? 'bg-[#185d88]' : 'bg-white'}`}>
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
//               Nos Services Premium
//             </h2>
//             <p className={`text-lg ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'} max-w-2xl mx-auto font-light`}>
//               Des solutions adaptées à tous vos besoins de nettoyage
//             </p>
//           </div>

//           {loading ? (
//             <div className="text-center py-12">
//               <div className={`inline-block animate-spin rounded-full h-12 w-12 border-b-2 ${
//                 theme === 'dark' ? 'border-white' : 'border-[#185d88]'
//               }`}></div>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {services.map((service) => (
//                 <div key={service.id} className={`group p-8 rounded-2xl transition-all duration-300 hover:scale-105 ${
//                   theme === 'dark'
//                     ? 'bg-gradient-to-br from-[#307aa8] to-[#185d88] border border-white/10'
//                     : 'bg-gradient-to-br from-white to-[#b2d2e6]/30 border border-[#6eaad0]/20'
//                 } shadow-lg hover:shadow-2xl`}>
//                   <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${
//                     theme === 'dark'
//                       ? 'bg-gradient-to-br from-[#61c4f1] to-[#6eaad0]'
//                       : 'bg-gradient-to-br from-[#6eaad0] to-[#61c4f1]'
//                   } shadow-md transform group-hover:rotate-3 transition-transform duration-300`}>
//                     <service.icon className="w-8 h-8 text-white" />
//                   </div>
//                   <h3 className={`text-2xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
//                     {service.name}
//                   </h3>
//                   <p className={`text-sm mb-4 line-clamp-2 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
//                     {service.description}
//                   </p>
//                   <div className={`text-xl font-bold mb-4 ${
//                     theme === 'dark' ? 'text-[#61c4f1]' : 'text-[#307aa8]'
//                   }`}>
//                     {formatPrice(service.standardRate, service.preferredRate)}
//                   </div>
//                   {service.options.length > 0 && (
//                     <div className="space-y-2 mb-6">
//                       {service.options.slice(0, 3).map((option) => (
//                         <div key={option.id} className={`flex items-start space-x-2 text-sm ${
//                           theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'
//                         }`}>
//                           <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
//                             theme === 'dark' ? 'text-[#61c4f1]' : 'text-[#6eaad0]'
//                           }`} />
//                           <span>{option.optionName}</span>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                   <Link href={`/services/${service.id}`} className={`block w-full py-3 rounded-lg text-center font-semibold text-sm transition-all duration-300 ${
//                     theme === 'dark'
//                       ? 'bg-white/10 text-white hover:bg-white/20'
//                       : 'bg-[#6eaad0]/20 text-[#307aa8] hover:bg-[#6eaad0]/30'
//                   }`}>
//                     En savoir plus
//                   </Link>
//                 </div>
//               ))}
//             </div>
//           )}

//           <div className="text-center mt-12">
//             <Link href="/services" className={`inline-flex items-center space-x-2 px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
//               theme === 'dark'
//                 ? 'bg-gradient-to-r from-[#61c4f1] to-[#6eaad0] text-white hover:shadow-xl hover:shadow-[#61c4f1]/30'
//                 : 'bg-gradient-to-r from-[#6eaad0] to-[#61c4f1] text-white hover:shadow-xl hover:shadow-[#6eaad0]/30'
//             } transform hover:scale-105`}>
//               <span>Voir tous les services</span>
//               <ArrowRight className="w-5 h-5" />
//             </Link>
//           </div>
//         </div>
//       </section>

//       <style jsx>{`
//         @keyframes float {
//           0%, 100% {
//             transform: translate(0, 0) scale(1);
//           }
//           33% {
//             transform: translate(30px, -30px) scale(1.1);
//           }
//           66% {
//             transform: translate(-20px, 20px) scale(0.9);
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// 'use client';

// import { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { ArrowRight, Award, CheckCircle, Clock, Shield, Sparkles } from 'lucide-react';
// import { useStore } from '@/store/useStore';
// import { Service, ServiceWithIcon } from '@/types/service';
// import { formatPrice, mapServiceWithIcon } from '@/lib/services';

// export default function HomePage() {
//   const { theme } = useStore();
//   const [services, setServices] = useState<ServiceWithIcon[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchServices() {
//       try {
//         const response = await fetch('https://www.dev.lesastiqueuses.fr/api/v1/services');
//         const data: Service[] = await response.json();
//         const servicesWithIcons = data
//           .filter(s => s.status === 'ACTIVE' && s.code !== 'TEST')
//           .map(mapServiceWithIcon);
//         setServices(servicesWithIcons);
//       } catch (error) {
//         console.error('Failed to fetch services:', error);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchServices();
//   }, []);

//   return (
//     <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-[#185d88] via-[#307aa8] to-[#185d88]' : 'bg-gradient-to-br from-[#b2d2e6] via-white to-[#a4d3f1]'}`}>
//       {/* Hero Section */}
//       <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
//         <div className="absolute inset-0 overflow-hidden">
//           {[...Array(15)].map((_, i) => (
//             <div
//               key={i}
//               className={`absolute rounded-full opacity-10 ${
//                 theme === 'dark' ? 'bg-[#61c4f1]' : 'bg-[#6eaad0]'
//               }`}
//               style={{
//                 width: Math.random() * 400 + 100,
//                 height: Math.random() * 400 + 100,
//                 left: `${Math.random() * 100}%`,
//                 top: `${Math.random() * 100}%`,
//                 animation: `float ${Math.random() * 20 + 15}s ease-in-out infinite`,
//                 animationDelay: `${Math.random() * 5}s`,
//               }}
//             />
//           ))}
//         </div>

//         <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-32">
//           <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full mb-8 backdrop-blur-xl ${
//             theme === 'dark' 
//               ? 'bg-white/10 border border-white/20' 
//               : 'bg-white/60 border border-[#6eaad0]/30'
//           } shadow-lg`}>
//             <Sparkles className={`w-4 h-4 ${theme === 'dark' ? 'text-[#61c4f1]' : 'text-[#307aa8]'}`} />
//             <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#307aa8]'}`}>
//               Service Premium de Nettoyage
//             </span>
//           </div>

//           <h1 className={`text-5xl md:text-7xl lg:text-8xl font-bold mb-8 ${
//             theme === 'dark' ? 'text-white' : 'text-[#185d88]'
//           } tracking-tight leading-tight`}>
//             Votre Espace
//             <br />
//             <span className={`bg-clip-text text-transparent bg-gradient-to-r ${
//               theme === 'dark' 
//                 ? 'from-[#61c4f1] via-[#a4d3f1] to-[#b2d2e6]' 
//                 : 'from-[#6eaad0] via-[#61c4f1] to-[#307aa8]'
//             }`}>
//               Impeccable
//             </span>
//           </h1>

//           <p className={`text-lg md:text-xl lg:text-2xl mb-12 max-w-3xl mx-auto ${
//             theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'
//           } leading-relaxed font-light`}>
//             Des solutions de nettoyage professionnelles qui transforment votre environnement en un havre de paix et de propreté
//           </p>

//           <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//             <Link href="/dashboard" className={`group px-8 py-4 rounded-xl font-semibold text-base transition-all duration-300 transform hover:scale-105 ${
//               theme === 'dark'
//                 ? 'bg-gradient-to-r from-[#61c4f1] to-[#6eaad0] text-white shadow-lg shadow-[#61c4f1]/30'
//                 : 'bg-gradient-to-r from-[#6eaad0] to-[#61c4f1] text-white shadow-lg shadow-[#6eaad0]/30'
//             } hover:shadow-xl flex items-center space-x-2`}>
//               <span>Réserver Maintenant</span>
//               <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//             </Link>
//             <Link href="/services" className={`px-8 py-4 rounded-xl font-semibold text-base transition-all duration-300 backdrop-blur-xl border ${
//               theme === 'dark'
//                 ? 'bg-white/5 border-white/20 text-white hover:bg-white/10'
//                 : 'bg-white/40 border-[#6eaad0]/40 text-[#185d88] hover:bg-white/60'
//             } transform hover:scale-105`}>
//               Découvrir nos services
//             </Link>
//           </div>

//           <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
//             {[
//               { icon: Shield, title: "Garantie Qualité", desc: "100% satisfaction garantie" },
//               { icon: Clock, title: "Service Rapide", desc: "Disponible 7j/7" },
//               { icon: Award, title: "Équipe Experte", desc: "Professionnels certifiés" }
//             ].map((item, i) => (
//               <div key={i} className={`p-6 rounded-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 ${
//                 theme === 'dark'
//                   ? 'bg-white/5 border border-white/10 hover:bg-white/10'
//                   : 'bg-white/40 border border-[#6eaad0]/20 hover:bg-white/60'
//               } shadow-lg`}>
//                 <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 mx-auto ${
//                   theme === 'dark'
//                     ? 'bg-gradient-to-br from-[#61c4f1] to-[#6eaad0]'
//                     : 'bg-gradient-to-br from-[#6eaad0] to-[#61c4f1]'
//                 } shadow-md`}>
//                   <item.icon className="w-7 h-7 text-white" />
//                 </div>
//                 <h3 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
//                   {item.title}
//                 </h3>
//                 <p className={`text-sm ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
//                   {item.desc}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Services Section */}
//       <section className={`py-24 ${theme === 'dark' ? 'bg-[#185d88]' : 'bg-white'}`}>
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
//               Nos Services Premium
//             </h2>
//             <p className={`text-lg ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'} max-w-2xl mx-auto font-light`}>
//               Des solutions adaptées à tous vos besoins de nettoyage
//             </p>
//           </div>

//           {loading ? (
//             <div className="text-center py-12">
//               <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-current"></div>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {services.map((service) => (
//                 <div key={service.id} className={`group p-8 rounded-2xl transition-all duration-300 hover:scale-105 ${
//                   theme === 'dark'
//                     ? 'bg-gradient-to-br from-[#307aa8] to-[#185d88] border border-white/10'
//                     : 'bg-gradient-to-br from-white to-[#b2d2e6]/30 border border-[#6eaad0]/20'
//                 } shadow-lg hover:shadow-2xl`}>
//                   <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${
//                     theme === 'dark'
//                       ? 'bg-gradient-to-br from-[#61c4f1] to-[#6eaad0]'
//                       : 'bg-gradient-to-br from-[#6eaad0] to-[#61c4f1]'
//                   } shadow-md transform group-hover:rotate-3 transition-transform duration-300`}>
//                     <service.icon className="w-8 h-8 text-white" />
//                   </div>
//                   <h3 className={`text-2xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
//                     {service.name}
//                   </h3>
//                   <p className={`text-sm mb-4 line-clamp-2 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
//                     {service.description}
//                   </p>
//                   <div className={`text-xl font-bold mb-4 ${
//                     theme === 'dark' ? 'text-[#61c4f1]' : 'text-[#307aa8]'
//                   }`}>
//                     {formatPrice(service.standardRate, service.preferredRate)}
//                   </div>
//                   {service.options.length > 0 && (
//                     <div className="space-y-2 mb-6">
//                       {service.options.slice(0, 3).map((option) => (
//                         <div key={option.id} className={`flex items-start space-x-2 text-sm ${
//                           theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'
//                         }`}>
//                           <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
//                             theme === 'dark' ? 'text-[#61c4f1]' : 'text-[#6eaad0]'
//                           }`} />
//                           <span>{option.optionName}</span>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                   <Link href={`/services`} className={`block w-full py-3 rounded-lg text-center font-semibold text-sm transition-all duration-300 ${
//                     theme === 'dark'
//                       ? 'bg-white/10 text-white hover:bg-white/20'
//                       : 'bg-[#6eaad0]/20 text-[#307aa8] hover:bg-[#6eaad0]/30'
//                   }`}>
//                     En savoir plus
//                   </Link>
//                 </div>
//               ))}
//             </div>
//           )}

//           <div className="text-center mt-12">
//             <Link href="/services" className={`inline-flex items-center space-x-2 px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
//               theme === 'dark'
//                 ? 'bg-gradient-to-r from-[#61c4f1] to-[#6eaad0] text-white hover:shadow-xl hover:shadow-[#61c4f1]/30'
//                 : 'bg-gradient-to-r from-[#6eaad0] to-[#61c4f1] text-white hover:shadow-xl hover:shadow-[#6eaad0]/30'
//             } transform hover:scale-105`}>
//               <span>Voir tous les services</span>
//               <ArrowRight className="w-5 h-5" />
//             </Link>
//           </div>
//         </div>
//       </section>

//       <style jsx>{`
//         @keyframes float {
//           0%, 100% {
//             transform: translate(0, 0) scale(1);
//           }
//           33% {
//             transform: translate(30px, -30px) scale(1.1);
//           }
//           66% {
//             transform: translate(-20px, 20px) scale(0.9);
//           }
//         }
//       `}</style>
//     </div>
//   );
// }


// 'use client';

// import { services } from "@/dummy/data";
// import { useStore } from "@/store/useStore";
// import { ArrowRight, Award, CheckCircle, Clock, Shield } from "lucide-react";
// import { useEffect, useState } from "react";

// const HomePage = () => {
//   const { theme } = useStore();
//   const [currentSlide, setCurrentSlide] = useState(0);
//   console.log(currentSlide)

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % 3);
//     }, 5000);
//     return () => clearInterval(timer);
//   }, []);

//   return (
//     <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-[#185d88] via-[#307aa8] to-[#185d88]' : 'bg-gradient-to-br from-[#b2d2e6] via-white to-[#a4d3f1]'}`}>
//       <div className="relative h-screen flex items-center justify-center overflow-hidden">
//         <div className="absolute inset-0 overflow-hidden">
//           {[...Array(20)].map((_, i) => (
//             <div
//               key={i}
//               className={`absolute rounded-full opacity-20 animate-pulse ${
//                 theme === 'dark' ? 'bg-[#61c4f1]' : 'bg-[#6eaad0]'
//               }`}
//               style={{
//                 width: Math.random() * 300 + 50,
//                 height: Math.random() * 300 + 50,
//                 left: `${Math.random() * 100}%`,
//                 top: `${Math.random() * 100}%`,
//                 animationDelay: `${Math.random() * 5}s`,
//                 animationDuration: `${Math.random() * 10 + 10}s`
//               }}
//             />
//           ))}
//         </div>

//         <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <div className={`inline-block px-6 py-3 rounded-full mb-8 backdrop-blur-xl ${
//             theme === 'dark' 
//               ? 'bg-white/10 border border-white/20' 
//               : 'bg-white/40 border border-[#6eaad0]/30'
//           } shadow-2xl animate-bounce`}>
//             <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#307aa8]'}`}>
//               ✨ Service Premium de Nettoyage
//             </span>
//           </div>

//           <h1 className={`text-6xl md:text-8xl font-bold mb-6 ${
//             theme === 'dark' ? 'text-white' : 'text-[#185d88]'
//           } tracking-tight leading-tight`}>
//             Votre Espace<br />
//             <span className={`bg-clip-text text-transparent bg-gradient-to-r ${
//               theme === 'dark' 
//                 ? 'from-[#61c4f1] via-[#a4d3f1] to-[#b2d2e6]' 
//                 : 'from-[#6eaad0] via-[#61c4f1] to-[#307aa8]'
//             }`}>
//               Impeccable
//             </span>
//           </h1>

//           <p className={`text-xl md:text-2xl mb-12 max-w-3xl mx-auto ${
//             theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'
//           } leading-relaxed`}>
//             Des solutions de nettoyage professionnelles qui transforment votre environnement en un havre de paix et de propreté
//           </p>

//           <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
//             <button className={`group px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 ${
//               theme === 'dark'
//                 ? 'bg-gradient-to-r from-[#61c4f1] to-[#6eaad0] text-white shadow-2xl shadow-[#61c4f1]/50'
//                 : 'bg-gradient-to-r from-[#6eaad0] to-[#61c4f1] text-white shadow-2xl shadow-[#6eaad0]/50'
//             } hover:shadow-3xl flex items-center space-x-3`}>
//               <span>Réserver Maintenant</span>
//               <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
//             </button>
//             <button className={`px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-500 backdrop-blur-xl border-2 ${
//               theme === 'dark'
//                 ? 'bg-white/10 border-white/30 text-white hover:bg-white/20'
//                 : 'bg-white/50 border-[#6eaad0]/50 text-[#185d88] hover:bg-white/70'
//             } transform hover:scale-105 hover:-translate-y-1`}>
//               Nos Services
//             </button>
//           </div>

//           <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
//             {[
//               { icon: Shield, title: "Garantie Qualité", desc: "100% satisfaction garantie" },
//               { icon: Clock, title: "Service Rapide", desc: "Disponible 7j/7" },
//               { icon: Award, title: "Équipe Expert", desc: "Professionnels certifiés" }
//             ].map((item, i) => (
//               <div key={i} className={`p-8 rounded-3xl backdrop-blur-xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 ${
//                 theme === 'dark'
//                   ? 'bg-white/10 border border-white/20 hover:bg-white/15'
//                   : 'bg-white/40 border border-[#6eaad0]/30 hover:bg-white/60'
//               } shadow-2xl`}>
//                 <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto ${
//                   theme === 'dark'
//                     ? 'bg-gradient-to-br from-[#61c4f1] to-[#6eaad0]'
//                     : 'bg-gradient-to-br from-[#6eaad0] to-[#61c4f1]'
//                 } shadow-lg`}>
//                   <item.icon className="w-8 h-8 text-white" />
//                 </div>
//                 <h3 className={`text-xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
//                   {item.title}
//                 </h3>
//                 <p className={theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}>
//                   {item.desc}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className={`py-32 ${theme === 'dark' ? 'bg-[#185d88]' : 'bg-white'}`}>
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-20">
//             <h2 className={`text-5xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
//               Nos Services Premium
//             </h2>
//             <p className={`text-xl ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'} max-w-3xl mx-auto`}>
//               Des solutions adaptées à tous vos besoins de nettoyage
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             {services.map((service) => (
//               <>
//               <div key={service.id} className={`group p-10 rounded-3xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 ${
//                 theme === 'dark'
//                   ? 'bg-gradient-to-br from-[#307aa8] to-[#185d88] border border-white/10'
//                   : 'bg-gradient-to-br from-white to-[#b2d2e6] border border-[#6eaad0]/20'
//               } shadow-2xl hover:shadow-3xl`}>
//                 <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-8 ${
//                   theme === 'dark'
//                     ? 'bg-gradient-to-br from-[#61c4f1] to-[#6eaad0]'
//                     : 'bg-gradient-to-br from-[#6eaad0] to-[#61c4f1]'
//                 } shadow-lg transform group-hover:rotate-6 transition-transform duration-500`}>
//                   <service.icon className="w-10 h-10 text-white" />
//                 </div>
//                 <h3 className={`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
//                   {service.title}
//                 </h3>
//                 <p className={`text-lg mb-6 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
//                   {service.description}
//                 </p>
//                 <div className={`text-2xl font-bold mb-6 ${
//                   theme === 'dark' ? 'text-[#61c4f1]' : 'text-[#307aa8]'
//                 }`}>
//                   {service.price}
//                 </div>
//                 <ul className="space-y-3 mb-8">
//                   {service.features.map((feature, i) => (
//                     <li key={i} className={`flex items-center space-x-3 text-lg ${
//                       theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'
//                     }`}>
//                       <CheckCircle className={`w-6 h-6 flex-shrink-0 ${
//                         theme === 'dark' ? 'text-[#61c4f1]' : 'text-[#6eaad0]'
//                       }`} />
//                       <span>{feature}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//               <button className={`w-full py-5 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
//                 theme === 'dark'
//                   ? 'bg-gradient-to-r from-[#61c4f1] to-[#6eaad0] text-white hover:shadow-xl hover:shadow-[#61c4f1]/50'
//                   : 'bg-gradient-to-r from-[#6eaad0] to-[#61c4f1] text-white hover:shadow-xl hover:shadow-[#6eaad0]/50'
//               } transform hover:scale-105`}>
//                 <span>Réserver Maintenant</span>
//                 <ArrowRight className="w-5 h-5" />
//               </button>
//               </>
//           ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HomePage;