import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRightCircle,
  Calculator,
} from "lucide-react";

const AuthForm = () => {
  const [showCode, setShowCode] = useState(false);
  const [secretCode, setSecretCode] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (secretCode === "Imaneretraite") {
      // Store access in localStorage
      localStorage.setItem("secretCodeEntered", "true");
      toast.success("Accès autorisé ! Redirection...");
      // Redirect to processing page
      navigate("/processing");
    } else {
      toast.error("Code d'accès incorrect");
      setSecretCode("");
    }
  };

  return (
    <div className="space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-[#2fd0a7]/20 backdrop-blur-sm">
      <div className="relative">
        <div className="absolute -top-14 left-1/2 -translate-x-1/2">
          <div className="bg-gradient-to-br from-[#2fd0a7] via-[#26d4aa] to-[#1db584] w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6 hover:rotate-0 transition-all duration-300 group">
            <Calculator className="w-12 h-12 text-white transform group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>
      </div>

      <div className="space-y-2 text-center pt-10">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#2fd0a7] via-[#26d4aa] to-[#1db584] inline-block text-transparent bg-clip-text">
          Simulateur d'Économies Fiscales
        </h2>
        <p className="text-base text-zinc-600">
          Entrez le code d'accès pour calculer vos avantages fiscaux
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Secret Code Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-900">
            Code d'accès
          </label>
          <div className="relative group">
            <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 text-zinc-400 group-focus-within:text-[#26d4aa]" />
            <input
              type={showCode ? "text" : "password"}
              value={secretCode}
              onChange={(e) => setSecretCode(e.target.value)}
              className="w-full h-12 pl-12 pr-12 rounded-xl bg-white border-2 text-zinc-800 transition-all duration-200 outline-none font-mono placeholder-zinc-400 border-zinc-200 focus:border-[#26d4aa] focus:ring-2 focus:ring-[#26d4aa]/20 shadow-sm"
              placeholder="••••••••••••••••••••••••"
            />
            <button
              type="button"
              onClick={() => setShowCode(!showCode)}
              className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-200 text-zinc-400 hover:text-zinc-900"
            >
              {showCode ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={!secretCode}
          className="relative w-full h-12 bg-gradient-to-r from-[#2fd0a7] via-[#26d4aa] to-[#1db584] text-white rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#2fd0a7]/25 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 shadow-lg group"
        >
          <span className="text-base">Accéder au simulateur</span>
          <ArrowRightCircle className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
