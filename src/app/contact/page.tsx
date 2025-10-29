"use client"
import { useStore } from "@/store/useStore";
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { useState } from "react";

const ContactPage = () => {
    const { theme } = useStore();
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      alert('Message envoyé avec succès! Nous vous contacterons bientôt.');
      setFormData({ name: '', email: '', phone: '', message: '' });
    };
  
    return (
      <div className={`min-h-screen pt-32 pb-20 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-[#185d88] via-[#307aa8] to-[#185d88]' 
          : 'bg-gradient-to-br from-[#b2d2e6] via-white to-[#a4d3f1]'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h1 className={`text-6xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
              Contactez-Nous
            </h1>
            <p className={`text-2xl ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'} max-w-3xl mx-auto`}>
              Nous sommes là pour répondre à toutes vos questions
            </p>
          </div>
  
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className={`p-12 rounded-3xl ${
              theme === 'dark'
                ? 'bg-white/10 backdrop-blur-xl border border-white/20'
                : 'bg-white/60 backdrop-blur-xl border border-[#6eaad0]/30'
            } shadow-2xl`}>
              <h2 className={`text-3xl font-bold mb-8 ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
                Envoyez-nous un message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
                    Nom Complet
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className={`w-full px-6 py-4 rounded-xl transition-all duration-300 ${
                      theme === 'dark'
                        ? 'bg-white/10 border border-white/20 text-white placeholder-[#b2d2e6]/50 focus:bg-white/15 focus:border-[#61c4f1]'
                        : 'bg-white/50 border border-[#6eaad0]/30 text-[#185d88] placeholder-[#6d89a3]/50 focus:bg-white focus:border-[#6eaad0]'
                    } focus:outline-none focus:ring-2 focus:ring-[#61c4f1]/50`}
                    placeholder="Jean Dupont"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className={`w-full px-6 py-4 rounded-xl transition-all duration-300 ${
                      theme === 'dark'
                        ? 'bg-white/10 border border-white/20 text-white placeholder-[#b2d2e6]/50 focus:bg-white/15 focus:border-[#61c4f1]'
                        : 'bg-white/50 border border-[#6eaad0]/30 text-[#185d88] placeholder-[#6d89a3]/50 focus:bg-white focus:border-[#6eaad0]'
                    } focus:outline-none focus:ring-2 focus:ring-[#61c4f1]/50`}
                    placeholder="jean.dupont@email.com"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className={`w-full px-6 py-4 rounded-xl transition-all duration-300 ${
                      theme === 'dark'
                        ? 'bg-white/10 border border-white/20 text-white placeholder-[#b2d2e6]/50 focus:bg-white/15 focus:border-[#61c4f1]'
                        : 'bg-white/50 border border-[#6eaad0]/30 text-[#185d88] placeholder-[#6d89a3]/50 focus:bg-white focus:border-[#6eaad0]'
                    } focus:outline-none focus:ring-2 focus:ring-[#61c4f1]/50`}
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
                    Message
                  </label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={5}
                    className={`w-full px-6 py-4 rounded-xl transition-all duration-300 ${
                      theme === 'dark'
                        ? 'bg-white/10 border border-white/20 text-white placeholder-[#b2d2e6]/50 focus:bg-white/15 focus:border-[#61c4f1]'
                        : 'bg-white/50 border border-[#6eaad0]/30 text-[#185d88] placeholder-[#6d89a3]/50 focus:bg-white focus:border-[#6eaad0]'
                    } focus:outline-none focus:ring-2 focus:ring-[#61c4f1]/50`}
                    placeholder="Décrivez vos besoins..."
                  />
                </div>
                <button type="submit" className={`w-full py-5 rounded-xl font-bold text-lg transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-[#61c4f1] to-[#6eaad0] text-white hover:shadow-xl hover:shadow-[#61c4f1]/50'
                    : 'bg-gradient-to-r from-[#6eaad0] to-[#61c4f1] text-white hover:shadow-xl hover:shadow-[#6eaad0]/50'
                } transform hover:scale-105`}>
                  Envoyer le Message
                </button>
              </form>
            </div>
  
            <div className="space-y-8">
              {[
                { icon: Phone, title: 'Téléphone', content: '+33 1 23 45 67 89', link: 'tel:+33123456789' },
                { icon: Mail, title: 'Email', content: 'contact@LesAstiqueuses.fr', link: 'mailto:contact@LesAstiqueuses.fr' },
                { icon: MapPin, title: 'Adresse', content: '123 Avenue des Champs, 75008 Paris' }
              ].map((item, i) => (
                <div key={i} className={`p-8 rounded-3xl ${
                  theme === 'dark'
                    ? 'bg-white/10 backdrop-blur-xl border border-white/20'
                    : 'bg-white/60 backdrop-blur-xl border border-[#6eaad0]/30'
                } shadow-2xl hover:scale-105 transition-all duration-500`}>
                  <div className="flex items-start space-x-4">
                    <div className={`p-4 rounded-2xl ${
                      theme === 'dark'
                        ? 'bg-gradient-to-br from-[#61c4f1] to-[#6eaad0]'
                        : 'bg-gradient-to-br from-[#6eaad0] to-[#61c4f1]'
                    } shadow-lg`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
                        {item.title}
                      </h3>
                      {item.link ? (
                        <a href={item.link} className={`text-lg ${
                          theme === 'dark' ? 'text-[#61c4f1] hover:text-[#a4d3f1]' : 'text-[#307aa8] hover:text-[#6eaad0]'
                        } transition-colors`}>
                          {item.content}
                        </a>
                      ) : (
                        <p className={`text-lg ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
                          {item.content}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
  
              <div className={`p-8 rounded-3xl ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-[#307aa8] to-[#185d88]'
                  : 'bg-gradient-to-br from-[#6eaad0] to-[#61c4f1]'
              } shadow-2xl`}>
                <h3 className="text-2xl font-bold mb-4 text-white">Suivez-nous</h3>
                <div className="flex space-x-4">
                  {[Facebook, Instagram, Twitter].map((Icon, i) => (
                    <button key={i} className="p-4 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-300 transform hover:scale-110">
                      <Icon className="w-6 h-6 text-white" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default ContactPage;