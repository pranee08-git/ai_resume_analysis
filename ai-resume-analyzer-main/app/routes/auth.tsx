import { usePuterStore } from "~/lib/puter";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

export const meta = () => [
  { title: "Resumind | Login" },
  {
    name: "description",
    content: "Log in to continue your job journey",
  },
];

const Auth = () => {
  const { isLoading, auth } = usePuterStore();
  const location = useLocation();
  const next = location.search.split("next=")[1] || "/";
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) navigate(next);
  }, [auth.isAuthenticated, next, navigate]);

  return (
    <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in-scale">
        <div className="gradient-border shadow-lg hover-lift hover-glow">
          <section className="flex flex-col gap-6 bg-white rounded-2xl p-8">

            {/* 🔹 HEADER WITH REACT LOGO */}
            <div className="flex flex-col items-center gap-3 text-center animate-fade-in-up">

              {/* React Logo */}
              <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center shadow-lg animate-fade-in-scale animate-delay-200">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/5377/5377269.png?utm_source=chatgpt.com"
                  alt="React Logo"
                  className="w-12 h-12 animate-spin-slow"
                />
              </div>

              {/* App Name */}
              <div className="text-4xl font-bold text-gradient animate-fade-in-up animate-delay-300">
                RESUMIND
              </div>

              <p className="text-gray-600 text-sm animate-fade-in-up animate-delay-400">
                Log in to continue your job journey
              </p>
            </div>

            {/* 🔹 LOGIN BUTTON */}
            {!auth.isAuthenticated && (
              <button
                onClick={() => auth.signIn()}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-all duration-300 hover-lift hover-glow"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2 animate-pulse">
                    <span className="animate-spin">⌛</span>
                    Processing...
                  </span>
                ) : (
                  "Log in to Puter"
                )}
              </button>
            )}

            {/* 🔹 LOGOUT BUTTON */}
            {auth.isAuthenticated && (
              <button
                onClick={auth.signOut}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 hover-lift"
              >
                Log Out
              </button>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default Auth;
