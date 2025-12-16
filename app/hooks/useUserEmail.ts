import { useEffect, useState } from "react";

declare const puter: any;

export function useUserEmail() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await puter.auth.getUser();

        if (user && user.email) {
          console.log(`🔐 [${new Date().toISOString()}] Logged in user email:`, user.email);

          setEmail(user.email);
          localStorage.setItem("userEmail", user.email);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    }

    fetchUser();
  }, []);

  return email;
}
