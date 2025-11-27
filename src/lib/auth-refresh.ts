import keycloak from "./keycloak";

export async function ensureFreshToken() {
  try {
    const refreshed = await keycloak.updateToken(60);

    if (refreshed) {
      localStorage.setItem("access_token", keycloak.token!);
      localStorage.setItem("refresh_token", keycloak.refreshToken!);
    }
  } catch (err) {
    console.error("Impossible de rafraîchir le token", err);
    keycloak.login();
  }
}


// // import keycloak from "./keycloak";

// import keycloak from "./keycloak";

// export async function ensureFreshToken() {
//   try {
//     const refreshed = await keycloak.updateToken(60); 
//     // rafraîchir si token expire dans moins de 60 sec

//     if (refreshed) {
//       localStorage.setItem("access_token", keycloak.token!);
//       localStorage.setItem("refresh_token", keycloak.refreshToken!);
//     }
//   } catch (err) {
//     console.error("Impossible de rafraîchir le token", err);
//     keycloak.login();
//   }
// }