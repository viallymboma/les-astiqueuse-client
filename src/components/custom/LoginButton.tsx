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