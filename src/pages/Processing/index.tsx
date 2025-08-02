import { useState } from "react";
import { Briefcase, GraduationCap, ArrowRight, Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";

type ProfessionType = "profession_liberale" | "salarie";

const Processing = () => {
  const navigate = useNavigate();
  const [selectedProfession, setSelectedProfession] =
    useState<ProfessionType>("salarie");

  const handleProfessionSelect = (profession: ProfessionType) => {
    setSelectedProfession(profession);
  };

  const handleContinue = () => {
    navigate("/simulator/" + selectedProfession);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#2fd0a7] via-[#26d4aa] to-[#1db584] rounded-2xl mb-6 shadow-lg mx-auto">
            <Calculator className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#2fd0a7] via-[#26d4aa] to-[#1db584] inline-block text-transparent bg-clip-text mb-4">
            Simulateur d'Économies Fiscales
          </h1>
          <p className="text-xl text-slate-700 max-w-2xl mx-auto">
            Choisissez votre statut professionnel pour calculer vos avantages
            fiscaux avec un contrat de retraite
          </p>
        </div>

        {/* Profession Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Salarié - First/Left Position & Default Selected */}
          <div
            onClick={() => handleProfessionSelect("salarie")}
            className={`cursor-pointer transition-all duration-300 transform hover:-translate-y-1 rounded-2xl ${
              selectedProfession === "salarie"
                ? "ring-3 ring-[#26d4aa] shadow-xl shadow-[#2fd0a7]/20"
                : "hover:shadow-lg"
            }`}
          >
            <div className="bg-white rounded-2xl p-8 border-2 border-slate-200 h-full">
              <div className="flex justify-center mb-6">
                <div
                  className={`w-16 h-16 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                    selectedProfession === "salarie"
                      ? "bg-gradient-to-br from-[#2fd0a7] via-[#26d4aa] to-[#1db584]"
                      : "bg-slate-100"
                  }`}
                >
                  <Briefcase
                    className={`w-8 h-8 ${
                      selectedProfession === "salarie"
                        ? "text-white"
                        : "text-slate-600"
                    }`}
                  />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-slate-800 mb-4 text-center">
                Salarié
              </h3>

              <div className="space-y-4 text-sm text-slate-600">
                <div className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">✅</span>
                  <div>
                    <span className="font-semibold text-slate-800">
                      Salariés :
                    </span>
                    <p className="mt-1 leading-relaxed">
                      Possibilité de déduire jusqu'à 50 % du salaire net
                      imposable, à condition de remplir deux critères lors de la
                      liquidation du contrat :
                    </p>
                    <ul className="mt-2 ml-4 space-y-1">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#26d4aa] mt-2"></div>
                        <span>Avoir au moins 45 ans,</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#26d4aa] mt-2"></div>
                        <span>
                          Avoir une ancienneté de contrat de 8 ans minimum.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Warning Section */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
                  <p className="text-sm text-red-700">
                    <span className="font-medium">Important :</span> Si les deux
                    conditions ne sont pas respectées, une retenue à la source
                    non-libératoire de 15% sera appliquée.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Profession Libérale - Second/Right Position */}
          <div
            onClick={() => handleProfessionSelect("profession_liberale")}
            className={`cursor-pointer transition-all duration-300 transform hover:-translate-y-1 rounded-2xl ${
              selectedProfession === "profession_liberale"
                ? "ring-3 ring-[#26d4aa] shadow-xl shadow-[#2fd0a7]/20"
                : "hover:shadow-lg"
            }`}
          >
            <div className="bg-white rounded-2xl p-8 border-2 border-slate-200 h-full">
              <div className="flex justify-center mb-6">
                <div
                  className={`w-16 h-16 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                    selectedProfession === "profession_liberale"
                      ? "bg-gradient-to-br from-[#2fd0a7] via-[#26d4aa] to-[#1db584]"
                      : "bg-slate-100"
                  }`}
                >
                  <GraduationCap
                    className={`w-8 h-8 ${
                      selectedProfession === "profession_liberale"
                        ? "text-white"
                        : "text-slate-600"
                    }`}
                  />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-slate-800 mb-4 text-center">
                Profession Libérale
              </h3>

              <div className="space-y-4 text-sm text-slate-600">
                <div className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">✅</span>
                  <div>
                    <span className="font-semibold text-slate-800">
                      Professions libérales :
                    </span>
                    <p className="mt-1 leading-relaxed">
                      Elles peuvent déduire jusqu'à 10 % de leur revenu global
                      imposable au titre des cotisations versées sur un contrat
                      de retraite, à condition de remplir deux critères en cas
                      de rachat :
                    </p>
                    <ul className="mt-2 ml-4 space-y-1">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#26d4aa] mt-2"></div>
                        <span>Avoir au moins 45 ans,</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#26d4aa] mt-2"></div>
                        <span>
                          Avoir une ancienneté de contrat de 8 ans minimum.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Warning Section */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
                  <p className="text-sm text-red-700">
                    <span className="font-medium">Important :</span> Si les deux
                    conditions ne sont pas respectées, une retenue à la source
                    non-libératoire de 15% sera appliquée.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={handleContinue}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#2fd0a7] via-[#26d4aa] to-[#1db584] text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#2fd0a7]/25 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span className="text-lg">
              Continuer avec{" "}
              {selectedProfession === "salarie"
                ? "Salarié"
                : "Profession Libérale"}
            </span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Processing;
