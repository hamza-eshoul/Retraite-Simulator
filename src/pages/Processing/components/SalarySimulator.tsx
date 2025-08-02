import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calculator,
  ArrowLeft,
  Briefcase,
  GraduationCap,
  Download,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type PeriodType = "monthly" | "annual";

interface TaxBracket {
  min: number;
  max: number | null;
  rate: number;
  deduction: number;
}

const SalarySimulator = () => {
  const { profession } = useParams<{ profession: string }>();
  const navigate = useNavigate();
  const [salary, setSalary] = useState<string>("");
  const [contribution, setContribution] = useState<string>("");
  const [period, setPeriod] = useState<PeriodType>("monthly");
  const [results, setResults] = useState<any>(null);

  // Monthly tax brackets
  const monthlyBrackets: TaxBracket[] = [
    { min: 0, max: 3333, rate: 0, deduction: 0 },
    { min: 3334, max: 5000, rate: 0.1, deduction: 333.33 },
    { min: 5001, max: 6667, rate: 0.2, deduction: 833.33 },
    { min: 6668, max: 8333, rate: 0.3, deduction: 1500 },
    { min: 8334, max: 15000, rate: 0.34, deduction: 1833.33 },
    { min: 15001, max: null, rate: 0.37, deduction: 2283.33 },
  ];

  // Annual tax brackets
  const annualBrackets: TaxBracket[] = [
    { min: 0, max: 40000, rate: 0, deduction: 0 },
    { min: 40001, max: 60000, rate: 0.1, deduction: 4000 },
    { min: 60001, max: 80000, rate: 0.2, deduction: 10000 },
    { min: 80001, max: 100000, rate: 0.3, deduction: 18000 },
    { min: 100001, max: 180000, rate: 0.34, deduction: 22000 },
    { min: 180001, max: null, rate: 0.37, deduction: 27400 },
  ];

  const calculateTax = (income: number, brackets: TaxBracket[]): number => {
    for (const bracket of brackets) {
      if (
        income >= bracket.min &&
        (bracket.max === null || income <= bracket.max)
      ) {
        return Math.max(0, income * bracket.rate - bracket.deduction);
      }
    }
    return 0;
  };

  const getMaxContribution = (salaryAmount: number): number => {
    if (profession === "profession_liberale") {
      return salaryAmount * 0.1; // 10% limit
    }
    return salaryAmount * 0.5; // 50% limit
  };

  const handleCalculate = () => {
    const salaryNum = parseFloat(salary);
    const contributionNum = parseFloat(contribution);

    if (!salaryNum || !contributionNum) return;

    const actualPeriod =
      profession === "profession_liberale" ? "annual" : period;
    const brackets =
      actualPeriod === "monthly" ? monthlyBrackets : annualBrackets;
    const maxContribution = getMaxContribution(salaryNum);
    const effectiveContribution = Math.min(contributionNum, maxContribution);

    const normalTax = calculateTax(salaryNum, brackets);
    const newTaxableIncome = salaryNum - effectiveContribution;
    const newTax = calculateTax(newTaxableIncome, brackets);

    const periodSavings = normalTax - newTax;
    const monthlySavings =
      actualPeriod === "annual" ? periodSavings / 12 : periodSavings;
    const annualSavings =
      actualPeriod === "monthly" ? periodSavings * 12 : periodSavings;

    setResults({
      normalTax,
      newTax,
      periodSavings,
      monthlySavings,
      annualSavings,
      fiveYearSavings: annualSavings * 5,
      tenYearSavings: annualSavings * 10,
      fifteenYearSavings: annualSavings * 15,
      twentyYearSavings: annualSavings * 20,
      effectiveContribution,
      maxContribution,
      period: actualPeriod,
    });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("fr-MA").format(Math.round(amount)) + " DH";
  };

  const generatePDF = async () => {
    if (!results) return;

    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const currentDate = new Date().toLocaleDateString("fr-FR");
    const professionText =
      profession === "salarie" ? "Salarie" : "Profession Liberale";
    const incomeLabel =
      profession === "profession_liberale"
        ? "Revenu global imposable"
        : "Salaire net imposable";
    const limitPercent = profession === "profession_liberale" ? "10%" : "50%";

    let yPosition = 20;

    // Header
    doc.setFillColor(47, 208, 167);
    doc.rect(0, 0, pageWidth, 30, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("Simulation d'Economies Fiscales", pageWidth / 2, 15, {
      align: "center",
    });
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("Contrat de Retraite", pageWidth / 2, 22, { align: "center" });

    yPosition = 45;

    // Date
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(10);
    doc.text(`Genere le ${currentDate}`, pageWidth - 20, yPosition, {
      align: "right",
    });
    yPosition += 15;

    // Personal Information
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Informations Personnelles", 20, yPosition);
    yPosition += 10;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    const infoItems = [
      ["Statut Professionnel:", professionText],
      [incomeLabel + ":", formatCurrency(parseFloat(salary))],
      [
        `Cotisation ${profession === "profession_liberale" ? "annuelle" : results.period === "monthly" ? "mensuelle" : "annuelle"}:`,
        formatCurrency(results.effectiveContribution),
      ],
      [
        "Limite de deduction:",
        `${limitPercent} (${formatCurrency(results.maxContribution)})`,
      ],
    ];

    infoItems.forEach(([label, value], index) => {
      const x = index % 2 === 0 ? 20 : pageWidth / 2 + 10;
      const y = yPosition + Math.floor(index / 2) * 12;

      doc.setTextColor(100, 116, 139);
      doc.text(label, x, y);
      doc.setTextColor(51, 65, 85);
      doc.setFont("helvetica", "bold");
      doc.text(value, x, y + 5);
      doc.setFont("helvetica", "normal");
    });

    yPosition += 35;

    // Tax Comparison
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Comparaison Fiscale", 20, yPosition);
    yPosition += 15;

    const boxWidth = 50;
    const boxHeight = 25;
    const spacing = 10;

    // Current tax box
    doc.setFillColor(248, 250, 252);
    doc.rect(20, yPosition, boxWidth, boxHeight, "F");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(
      `Impot actuel ${results.period === "monthly" ? "mensuel" : "annuel"}`,
      22,
      yPosition + 8
    );
    doc.setFontSize(14);
    doc.setTextColor(51, 65, 85);
    doc.setFont("helvetica", "bold");
    doc.text(formatCurrency(results.normalTax), 22, yPosition + 18);

    // New tax box
    doc.setFillColor(236, 253, 245);
    doc.rect(20 + boxWidth + spacing, yPosition, boxWidth, boxHeight, "F");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.text("Avec contrat retraite", 22 + boxWidth + spacing, yPosition + 8);
    doc.setFontSize(14);
    doc.setTextColor(5, 150, 105);
    doc.setFont("helvetica", "bold");
    doc.text(
      formatCurrency(results.newTax),
      22 + boxWidth + spacing,
      yPosition + 18
    );

    yPosition += boxHeight + 15;

    // Highlight savings
    doc.setFillColor(209, 250, 229);
    doc.setDrawColor(16, 185, 129);
    doc.rect(20, yPosition, pageWidth - 40, 20, "FD");
    doc.setTextColor(5, 150, 105);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(
      `Economie ${results.period === "monthly" ? "mensuelle" : "annuelle"}: ${formatCurrency(results.periodSavings)}`,
      pageWidth / 2,
      yPosition + 12,
      { align: "center" }
    );

    yPosition += 35;

    // Savings Table
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Economies dans le Temps", 20, yPosition);
    yPosition += 10;

    // Table header
    doc.setFillColor(47, 208, 167);
    doc.rect(20, yPosition, pageWidth - 40, 10, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Periode", 25, yPosition + 7);
    doc.text("Economies Fiscales", pageWidth - 25, yPosition + 7, {
      align: "right",
    });
    yPosition += 10;

    const tableData = [
      ["Par mois", formatCurrency(results.monthlySavings)],
      ["Sur 1 annee", formatCurrency(results.annualSavings)],
      ["Sur 5 ans", formatCurrency(results.fiveYearSavings)],
      ["Sur 10 ans", formatCurrency(results.tenYearSavings)],
      ["Sur 15 ans", formatCurrency(results.fifteenYearSavings)],
      ["Sur 20 ans", formatCurrency(results.twentyYearSavings)],
    ];

    tableData.forEach(([period, amount], index) => {
      const rowY = yPosition + index * 8;

      if (index % 2 === 0) {
        doc.setFillColor(248, 250, 252);
        doc.rect(20, rowY, pageWidth - 40, 8, "F");
      }

      doc.setTextColor(51, 65, 85);
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(period, 25, rowY + 5.5);

      doc.setTextColor(5, 150, 105);
      doc.setFont("helvetica", "bold");
      doc.text(amount, pageWidth - 25, rowY + 5.5, { align: "right" });
    });

    yPosition += tableData.length * 8 + 15;

    // Note if needed
    if (results.effectiveContribution < parseFloat(contribution)) {
      doc.setFillColor(254, 243, 199);
      doc.setDrawColor(245, 158, 11);
      doc.rect(20, yPosition, pageWidth - 40, 15, "FD");
      doc.setTextColor(146, 64, 14);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const noteText = `Note: Votre cotisation est limitee a ${limitPercent} de votre ${profession === "profession_liberale" ? "revenu" : "salaire"} (${formatCurrency(results.maxContribution)}).`;
      doc.text(noteText, 25, yPosition + 8);
      yPosition += 20;
    }

    // Footer
    doc.setTextColor(148, 163, 184);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Simulateur d'Economies Fiscales - Contrat de Retraite",
      pageWidth / 2,
      pageHeight - 20,
      { align: "center" }
    );
    doc.text(
      "Cette simulation est fournie a titre indicatif.",
      pageWidth / 2,
      pageHeight - 15,
      { align: "center" }
    );
    doc.text(
      `Document genere le ${currentDate} via le simulateur en ligne`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );

    doc.save(
      `simulation-economies-fiscales-${currentDate.replace(/\//g, "-")}.pdf`
    );
  };

  const handleBack = () => {
    navigate("/processing");
  };

  const getProfessionDisplay = () => {
    if (profession === "salarie") {
      return {
        icon: <Briefcase className="w-5 h-5" />,
        text: "Salarié",
      };
    } else {
      return {
        icon: <GraduationCap className="w-4 h-4" />,
        text: "Profession Libérale",
      };
    }
  };

  const professionDisplay = getProfessionDisplay();

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-1 px-1 py-0.5 text-slate-400 hover:text-slate-600 transition-colors duration-200 mb-2 text-xs"
        >
          <ArrowLeft className="w-3 h-3" />
          Retour
        </button>

        {/* Profession Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#2fd0a7] via-[#26d4aa] to-[#1db584] text-white rounded-full text-sm font-medium">
            {professionDisplay.icon}
            {professionDisplay.text}
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#2fd0a7] via-[#26d4aa] to-[#1db584] rounded-xl mb-4 mx-auto">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#2fd0a7] via-[#26d4aa] to-[#1db584] inline-block text-transparent bg-clip-text">
            Calculateur d'Économies Fiscales
          </h2>
          <p className="text-slate-600 mt-2">
            Calculez vos avantages fiscaux avec un contrat de retraite
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Salary Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-800">
                {profession === "profession_liberale"
                  ? "Revenu global imposable"
                  : "Salaire net imposable"}
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder={
                    profession === "profession_liberale" ? "100000" : "50000"
                  }
                  className="flex-1 h-12 px-4 rounded-xl bg-white border-2 text-slate-800 transition-all duration-200 outline-none border-slate-200 focus:border-[#26d4aa] focus:ring-2 focus:ring-[#26d4aa]/20"
                />
                {profession === "salarie" && (
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value as PeriodType)}
                    className="h-12 px-4 rounded-xl bg-white border-2 text-slate-800 transition-all duration-200 outline-none border-slate-200 focus:border-[#26d4aa]"
                  >
                    <option value="monthly">Mensuel</option>
                    <option value="annual">Annuel</option>
                  </select>
                )}
                {profession === "profession_liberale" && (
                  <div className="h-12 px-4 rounded-xl bg-slate-100 border-2 border-slate-200 flex items-center text-slate-600 font-medium">
                    Annuel
                  </div>
                )}
              </div>
            </div>

            {/* Contribution Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-800">
                Cotisation{" "}
                {profession === "profession_liberale"
                  ? "annuelle"
                  : period === "monthly"
                    ? "mensuelle"
                    : "annuelle"}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={contribution}
                  onChange={(e) => setContribution(e.target.value)}
                  placeholder={
                    profession === "profession_liberale" ? "10000" : "1000"
                  }
                  className="w-full h-12 px-4 pr-12 rounded-xl bg-white border-2 text-slate-800 transition-all duration-200 outline-none border-slate-200 focus:border-[#26d4aa] focus:ring-2 focus:ring-[#26d4aa]/20"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                  DH
                </span>
              </div>
              {profession === "profession_liberale" && salary && (
                <p className="text-xs text-slate-500">
                  Maximum déductible:{" "}
                  {formatCurrency(getMaxContribution(parseFloat(salary) || 0))}{" "}
                  (10% du revenu)
                </p>
              )}
            </div>
          </div>

          {/* Calculate Button */}
          <div className="mt-6 text-center">
            <button
              onClick={handleCalculate}
              disabled={!salary || !contribution}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#2fd0a7] via-[#26d4aa] to-[#1db584] text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#2fd0a7]/25 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
            >
              <Calculator className="w-5 h-5" />
              Calculer les économies
            </button>
          </div>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-8">
            {/* Tax Comparison Summary */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-slate-800">
                  Résumé de vos économies fiscales
                </h3>
                <button
                  onClick={generatePDF}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#2fd0a7] to-[#1db584] text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-[#2fd0a7]/25 transform hover:-translate-y-0.5"
                >
                  <Download className="w-4 h-4" />
                  Télécharger PDF
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <div className="text-sm text-slate-600 mb-1">
                    Impôt actuel
                  </div>
                  <div className="text-2xl font-bold text-slate-800">
                    {formatCurrency(results.normalTax)}
                  </div>
                  <div className="text-xs text-slate-500">
                    {results.period === "monthly" ? "par mois" : "par an"}
                  </div>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-[#2fd0a7]/10 to-[#1db584]/5 rounded-xl border border-[#2fd0a7]/20">
                  <div className="text-sm text-slate-600 mb-1">
                    Avec contrat retraite
                  </div>
                  <div className="text-2xl font-bold text-[#1db584]">
                    {formatCurrency(results.newTax)}
                  </div>
                  <div className="text-xs text-slate-500">
                    {results.period === "monthly" ? "par mois" : "par an"}
                  </div>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="text-sm text-slate-600 mb-1">Économie</div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(results.periodSavings)}
                  </div>
                  <div className="text-xs text-slate-500">
                    {results.period === "monthly" ? "par mois" : "par an"}
                  </div>
                </div>
              </div>

              {/* Savings Table */}
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-[#2fd0a7] to-[#1db584] text-white">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold">
                        Période
                      </th>
                      <th className="text-right py-4 px-6 font-semibold">
                        Économies fiscales
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6 font-medium text-slate-800">
                        Par mois
                      </td>
                      <td className="py-4 px-6 text-right font-bold text-[#1db584]">
                        {formatCurrency(results.monthlySavings)}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6 font-medium text-slate-800">
                        Sur 1 année
                      </td>
                      <td className="py-4 px-6 text-right font-bold text-[#1db584]">
                        {formatCurrency(results.annualSavings)}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6 font-medium text-slate-800">
                        Sur 5 ans
                      </td>
                      <td className="py-4 px-6 text-right font-bold text-[#1db584]">
                        {formatCurrency(results.fiveYearSavings)}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6 font-medium text-slate-800">
                        Sur 10 ans
                      </td>
                      <td className="py-4 px-6 text-right font-bold text-[#1db584]">
                        {formatCurrency(results.tenYearSavings)}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6 font-medium text-slate-800">
                        Sur 15 ans
                      </td>
                      <td className="py-4 px-6 text-right font-bold text-[#1db584]">
                        {formatCurrency(results.fifteenYearSavings)}
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6 font-medium text-slate-800">
                        Sur 20 ans
                      </td>
                      <td className="py-4 px-6 text-right font-bold text-[#1db584]">
                        {formatCurrency(results.twentyYearSavings)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Chart Visualization */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
              <h3 className="text-xl font-bold text-slate-800 mb-6">
                Évolution de vos économies fiscales dans le temps
              </h3>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { periode: "1 an", economies: results.annualSavings },
                      { periode: "5 ans", economies: results.fiveYearSavings },
                      { periode: "10 ans", economies: results.tenYearSavings },
                      {
                        periode: "15 ans",
                        economies: results.fifteenYearSavings,
                      },
                      {
                        periode: "20 ans",
                        economies: results.twentyYearSavings,
                      },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="periode" stroke="#64748b" fontSize={12} />
                    <YAxis
                      stroke="#64748b"
                      fontSize={12}
                      tickFormatter={(value) => `${Math.round(value / 1000)}k`}
                    />
                    <Tooltip
                      formatter={(value) => [
                        formatCurrency(Number(value)),
                        "Économies",
                      ]}
                      labelStyle={{ color: "#334155" }}
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Bar
                      dataKey="economies"
                      fill="url(#gradient)"
                      radius={[4, 4, 0, 0]}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2fd0a7" />
                        <stop offset="100%" stopColor="#1db584" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Additional Info */}
            {results.effectiveContribution < parseFloat(contribution) && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> Votre cotisation est limitée à{" "}
                  {profession === "profession_liberale" ? "10%" : "50%"} de
                  votre{" "}
                  {profession === "profession_liberale" ? "revenu" : "salaire"}{" "}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SalarySimulator;
