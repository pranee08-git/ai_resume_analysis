import { useEffect, useState } from "react";

declare const puter: any;

// Simple JWT decode function
function decodeJWT(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function useUserEmail() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await puter.auth.getUser();
        if (user?.username) {
          console.log("🔐 Logged in username:", user.username);
          setEmail(user.username);
          localStorage.setItem("userEmail", user.username); // optional persistence
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    }

    fetchUser();
  }, []);

  return email;
}
