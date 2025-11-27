# Intégration Keycloak + Next.js (Frontend Only)

Ce document explique **uniquement la partie frontend Next.js**, sans
configuration backend ou Keycloak, pour offrir une expérience
utilisateur optimale incluant : - authentification déclenchée **au clic
sur un bouton** - récupération du token et du refresh token -
utilisation automatique du refresh token lorsque l'access token expire -
ajout du JWT dans chaque requête API via un intercepteur - extraction
des rôles et informations utilisateur

------------------------------------------------------------------------

# 1. Installation des dépendances

``` bash
npm install keycloak-js axios
```

------------------------------------------------------------------------

# 2. Initialisation de Keycloak dans Next.js

Créer un fichier :\
`/lib/keycloak.ts`

``` ts
import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "https://www.dev.lesastiqueuses.fr/sso",
  realm: "lesastiqueuses",
  clientId: "app-client",
});

export default keycloak;
```

------------------------------------------------------------------------

# 3. Authentification déclenchée au clic

Créer un bouton login qui **initie la redirection vers Keycloak
seulement quand l'utilisateur clique**.

``` tsx
import keycloak from "@/lib/keycloak";

export default function LoginButton() {
  const login = () => {
    keycloak.init({
      onLoad: "login-required",
      pkceMethod: "S256",
    });
  };

  return <button onClick={login}>Connexion</button>;
}
```

------------------------------------------------------------------------

# 4. Stockage des tokens (access + refresh)

Après authentification, Keycloak fournit :

-   `token` → Access Token (expire rapidement)
-   `refreshToken` → Token utilisé pour obtenir un nouveau access token

Configurer les événements Keycloak :\
Créer `/lib/keycloak-events.ts`

``` ts
import keycloak from "./keycloak";

export function setupKeycloakEvents() {
  keycloak.onAuthSuccess = () => {
    localStorage.setItem("access_token", keycloak.token!);
    localStorage.setItem("refresh_token", keycloak.refreshToken!);
  };

  keycloak.onAuthRefreshSuccess = () => {
    localStorage.setItem("access_token", keycloak.token!);
    localStorage.setItem("refresh_token", keycloak.refreshToken!);
  };
}
```

Dans `_app.tsx` :

``` tsx
import { setupKeycloakEvents } from "@/lib/keycloak-events";

useEffect(() => {
  setupKeycloakEvents();
}, []);
```

------------------------------------------------------------------------

# 5. Mise en place du refresh token automatique

Keycloak possède une méthode :\
**`updateToken(minValidity)`**

Elle permet de rafraîchir l'access token avant expiration.

Créer `/lib/auth-refresh.ts` :

``` ts
import keycloak from "./keycloak";

export async function ensureFreshToken() {
  try {
    const refreshed = await keycloak.updateToken(60); 
    // rafraîchir si token expire dans moins de 60 sec

    if (refreshed) {
      localStorage.setItem("access_token", keycloak.token!);
      localStorage.setItem("refresh_token", keycloak.refreshToken!);
    }
  } catch (err) {
    console.error("Impossible de rafraîchir le token", err);
    keycloak.login();
  }
}
```

------------------------------------------------------------------------

# 6. Intercepteur Axios pour ajouter le JWT + Rafraîchissement auto

Créer `/lib/api.ts` :

``` ts
import axios from "axios";
import keycloak from "./keycloak";
import { ensureFreshToken } from "./auth-refresh";

const api = axios.create({
  baseURL: "https://www.dev.lesastiqueuses.fr/api",
});

// Intercepteur → ajoute token + rafraîchit si nécessaire
api.interceptors.request.use(async (config) => {
  await ensureFreshToken();

  if (keycloak.token) {
    config.headers.Authorization = `Bearer ${keycloak.token}`;
  }

  return config;
});

export default api;
```

➡ Grâce à cet intercepteur : - le token est rafraîchi automatiquement\
- chaque requête inclut toujours un token valide\
- l'utilisateur ne sera **jamais redirigé vers Keycloak tant que son
refresh token est valide**

------------------------------------------------------------------------

# 7. Extraction des informations utilisateur (rôles, email, nom...)

Keycloak fournit ces infos via `tokenParsed`.

Créer `/lib/user-info.ts` :

``` ts
import keycloak from "./keycloak";

export function getUserInfo() {
  if (!keycloak.authenticated) return null;

  return {
    username: keycloak.tokenParsed?.preferred_username,
    email: keycloak.tokenParsed?.email,
    firstname: keycloak.tokenParsed?.given_name,
    lastname: keycloak.tokenParsed?.family_name,
    roles: keycloak.tokenParsed?.realm_access?.roles || [],
  };
}
```

Exemple d'utilisation :

``` tsx
const user = getUserInfo();

console.log("Utilisateur :", user);
```

------------------------------------------------------------------------

# 8. Déconnexion

``` ts
keycloak.logout({
  redirectUri: "https://www.dev.lesastiqueuses.fr",
});
```

------------------------------------------------------------------------

# 9. Résumé du fonctionnement

  Fonctionnalité                        Pris en charge
  ------------------------------------- ----------------
  Login manuel au clic                  ✔
  Récupération access + refresh token   ✔
  Rafraîchissement automatique          ✔
  Ajout du JWT sur chaque requête       ✔
  Extraction des données utilisateur    ✔
  Déconnexion                           ✔

------------------------------------------------------------------------

# 10. Expérience utilisateur finale

1.  L'utilisateur clique sur **Connexion**\
2.  Redirection vers Keycloak\
3.  Retour dans Next.js avec tokens stockés\
4.  Les requêtes API incluent toujours un token valide\
5.  Le refresh token assure une session longue sans reconnecter
    l'utilisateur
