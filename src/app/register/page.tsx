"use client"
import { useState } from "react";
import { useStore } from "@/store/useStore";
import { UserPlus } from "lucide-react";

const RegisterPage = () => {
    const { theme } = useStore();
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  
    const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (formData.password !== formData.confirmPassword) {
        alert('Les mots de passe ne correspondent pas!');
        return;
      }
      alert('Inscription réussie! Vous pouvez maintenant vous connecter.');
    };
  
    return (
      <div className={`min-h-screen pt-32 pb-20 flex items-center justify-center ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-[#185d88] via-[#307aa8] to-[#185d88]' 
          : 'bg-gradient-to-br from-[#b2d2e6] via-white to-[#a4d3f1]'
      }`}>
        <div className={`max-w-md w-full mx-4 p-12 rounded-3xl ${
          theme === 'dark'
            ? 'bg-white/10 backdrop-blur-xl border border-white/20'
            : 'bg-white/60 backdrop-blur-xl border border-[#6eaad0]/30'
        } shadow-2xl`}>
          <div className="text-center mb-8">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-[#61c4f1] to-[#6eaad0]'
                : 'bg-gradient-to-br from-[#6eaad0] to-[#61c4f1]'
            } shadow-xl`}>
              <UserPlus className="w-10 h-10 text-white" />
            </div>
            <h1 className={`text-4xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
              Inscription
            </h1>
            <p className={`text-lg ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
              Créez votre compte client
            </p>
          </div>
  
          <form onSubmit={handleRegister} className="space-y-6">
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
                placeholder="votre@email.com"
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
                Mot de passe
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className={`w-full px-6 py-4 rounded-xl transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-white/10 border border-white/20 text-white placeholder-[#b2d2e6]/50 focus:bg-white/15 focus:border-[#61c4f1]'
                    : 'bg-white/50 border border-[#6eaad0]/30 text-[#185d88] placeholder-[#6d89a3]/50 focus:bg-white focus:border-[#6eaad0]'
                } focus:outline-none focus:ring-2 focus:ring-[#61c4f1]/50`}
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className={`w-full px-6 py-4 rounded-xl transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-white/10 border border-white/20 text-white placeholder-[#b2d2e6]/50 focus:bg-white/15 focus:border-[#61c4f1]'
                    : 'bg-white/50 border border-[#6eaad0]/30 text-[#185d88] placeholder-[#6d89a3]/50 focus:bg-white focus:border-[#6eaad0]'
                } focus:outline-none focus:ring-2 focus:ring-[#61c4f1]/50`}
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className={`w-full py-5 rounded-xl font-bold text-lg transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-[#61c4f1] to-[#6eaad0] text-white hover:shadow-xl hover:shadow-[#61c4f1]/50'
                : 'bg-gradient-to-r from-[#6eaad0] to-[#61c4f1] text-white hover:shadow-xl hover:shadow-[#6eaad0]/50'
            } transform hover:scale-105`}>
              Créer mon compte
            </button>
          </form>
  
          <div className="mt-8 text-center">
            <p className={`${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
              Déjà un compte?{' '}
              <button className={`font-bold ${
                theme === 'dark' ? 'text-[#61c4f1] hover:text-[#a4d3f1]' : 'text-[#307aa8] hover:text-[#6eaad0]'
              } transition-colors`}>
                Se connecter
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  };

  export default RegisterPage;