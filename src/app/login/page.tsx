"use client";

import keycloak from "@/lib/keycloak";

export default function LoginPage() {
  const login = () => {
    keycloak.login({
      redirectUri: window.location.origin,
    });

    document.cookie = "kc_client_authenticated=true; path=/;";
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={login}
      >
        Connexion
      </button>
    </div>
  );
}


// "use client"
// import { useStore } from "@/store/useStore";
// import { LogIn } from "lucide-react";
// import { useState } from "react";

// const LoginPage = () => {
//     const { theme, setUser } = useStore();
//     const [email, setEmail] = useState<string>  ('');
//     const [password, setPassword] = useState<string>('');
  
//     const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
//       e.preventDefault();
//       setUser({ email, name: 'Client Demo', id: '1' });
//       alert('Connexion réussie!');
//     };
  
//     return (
//       <div className={`min-h-screen pt-32 pb-20 flex items-center justify-center ${
//         theme === 'dark' 
//           ? 'bg-gradient-to-br from-[#185d88] via-[#307aa8] to-[#185d88]' 
//           : 'bg-gradient-to-br from-[#b2d2e6] via-white to-[#a4d3f1]'
//       }`}>  
//         <div className={`max-w-md w-full mx-4 p-12 rounded-3xl ${
//           theme === 'dark'
//             ? 'bg-white/10 backdrop-blur-xl border border-white/20'
//             : 'bg-white/60 backdrop-blur-xl border border-[#6eaad0]/30'
//         } shadow-2xl`}>
//           <div className="text-center mb-8">
//             <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 ${
//               theme === 'dark'
//                 ? 'bg-gradient-to-br from-[#61c4f1] to-[#6eaad0]'
//                 : 'bg-gradient-to-br from-[#6eaad0] to-[#61c4f1]'
//             } shadow-xl`}>
//               <LogIn className="w-10 h-10 text-white" />
//             </div>
//             <h1 className={`text-4xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-[#185d88]'}`}>
//               Connexion
//             </h1>
//             <p className={`text-lg ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
//               Accédez à votre espace client
//             </p>
//           </div>
  
//           <form onSubmit={handleLogin} className="space-y-6">
//             <div>
//               <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
//                 Email
//               </label>
//               <input
//                 type="email"
//                 required
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className={`w-full px-6 py-4 rounded-xl transition-all duration-300 ${
//                   theme === 'dark'
//                     ? 'bg-white/10 border border-white/20 text-white placeholder-[#b2d2e6]/50 focus:bg-white/15 focus:border-[#61c4f1]'
//                     : 'bg-white/50 border border-[#6eaad0]/30 text-[#185d88] placeholder-[#6d89a3]/50 focus:bg-white focus:border-[#6eaad0]'
//                 } focus:outline-none focus:ring-2 focus:ring-[#61c4f1]/50`}
//                 placeholder="votre@email.com"
//               />
//             </div>
//             <div>
//               <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
//                 Mot de passe
//               </label>
//               <input
//                 type="password"
//                 required
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className={`w-full px-6 py-4 rounded-xl transition-all duration-300 ${
//                   theme === 'dark'
//                     ? 'bg-white/10 border border-white/20 text-white placeholder-[#b2d2e6]/50 focus:bg-white/15 focus:border-[#61c4f1]'
//                     : 'bg-white/50 border border-[#6eaad0]/30 text-[#185d88] placeholder-[#6d89a3]/50 focus:bg-white focus:border-[#6eaad0]'
//                 } focus:outline-none focus:ring-2 focus:ring-[#61c4f1]/50`}
//                 placeholder="••••••••"
//               />
//             </div>
//             <button type="submit" className={`w-full py-5 rounded-xl font-bold text-lg transition-all duration-300 ${
//               theme === 'dark'
//                 ? 'bg-gradient-to-r from-[#61c4f1] to-[#6eaad0] text-white hover:shadow-xl hover:shadow-[#61c4f1]/50'
//                 : 'bg-gradient-to-r from-[#6eaad0] to-[#61c4f1] text-white hover:shadow-xl hover:shadow-[#6eaad0]/50'
//             } transform hover:scale-105`}>
//               Se Connecter
//             </button>
//           </form>
  
//           <div className="mt-8 text-center">
//             <p className={`${theme === 'dark' ? 'text-[#b2d2e6]' : 'text-[#6d89a3]'}`}>
//               Pas encore de compte?{' '}
//               <button className={`font-bold ${
//                 theme === 'dark' ? 'text-[#61c4f1] hover:text-[#a4d3f1]' : 'text-[#307aa8] hover:text-[#6eaad0]'
//               } transition-colors`}>
//                 S&apos;inscrire
//               </button>
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   };
  
//   export default LoginPage; 