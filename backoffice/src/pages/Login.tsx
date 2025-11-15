import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { login } from "../store/slices/authSlice";
import { Button } from "../components/UI/Button";
import { Eye, EyeOff } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Création de l'objet Audio pour le son d'erreur
const alertSound = new Audio("/assets/sounds/error.mp3");

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await dispatch(login({ email, password }));

    console.log("Résultat de l'action de connexion:", result);

    if (login.fulfilled.match(result)) {
      navigate("/");
    } else {
      // --- Son d'alerte ---
      alertSound.currentTime = 0;
      alertSound.play().catch((e) =>
        console.warn("Erreur de lecture du son :", e)
      );

      // --- Toast d'erreur ---
     const message = (result.payload as { message?: string })?.message || "Échec de connexion. Vérifiez vos identifiants !";

     window.alert(message);
     
      toast.error(message, {
        position: "top-center",
        autoClose: 2000, 
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  };

  return (
    <>
      <div className="min-h-screen bg-cover bg-center flex items-center justify-center relative">
        <div
          className="absolute inset-0 z-0"
          style={{
            WebkitMaskImage: "url('/assets/images/background.png')",
            maskImage: "url('/assets/images/background.png')",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
            WebkitMaskSize: "cover",
            maskSize: "cover",
            backgroundColor: "#00cc00",
            opacity: 1,
          }}
        ></div>

        <div className="bg-white/95 dark:bg-gray-900/90 shadow-2xl rounded-2xl overflow-hidden w-full max-w-5xl flex flex-col md:flex-row backdrop-blur-sm">
          {/* ---- SECTION GAUCHE ---- */}
          <div className="hidden md:flex md:w-2/3 bg-gray-100 dark:bg-gray-800 items-center justify-center p-8">
            <img
              src="/assets/images/illustration.png"
              alt="illustration"
              className="w-4/5 h-auto object-contain"
            />
          </div>

          {/* ---- SECTION DROITE ---- */}
          <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-[#00cc00] tracking-wide">
                RentAdmin
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Connectez-vous à votre espace administrateur
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Boîte d'erreur classique */}
              {error && (
                <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00cc00] focus:border-[#00cc00] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder=""
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Mot de passe
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00cc00] focus:border-[#00cc00] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder=""
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Bouton de connexion */}
              <Button
                type="submit"
                loading={loading}
                className="w-full bg-[#00cc00] hover:bg-[#00a800] text-white py-2 rounded-md font-semibold transition-all duration-300"
                size="lg"
              >
                Se connecter
              </Button>
            </form>
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
};
