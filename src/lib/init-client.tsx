"use client";

import { useEffect, useState } from "react";
import keycloak from "@/lib/keycloak";
import { setupKeycloakEvents } from "@/lib/keycloak-events";

export default function AuthClientInit() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    setupKeycloakEvents();

    keycloak
      .init({
        onLoad: "check-sso",
        silentCheckSsoRedirectUri:
          typeof window !== "undefined"
            ? window.location.origin + "/silent-check-sso.html"
            : "",
        pkceMethod: "S256",
      })
      .then(() => setInitialized(true));
  }, []);

  if (!initialized) return null;
  return null;
}
