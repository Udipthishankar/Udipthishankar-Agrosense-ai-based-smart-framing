import React from "react";
import { Sprout, ShieldAlert, CloudSun, BookOpen, ArrowRight, CheckCircle2, TrendingUp, ShieldCheck, Sparkles } from "lucide-react";

interface HomeOverviewProps {
  setActiveTab: (tab: string) => void;
}

export const HomeOverview: React.FC<HomeOverviewProps> = ({ setActiveTab }) => {
  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white p-8 md:p-12 shadow-xl border border-emerald-700/50">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-700/60 border border-emerald-500/40 text-emerald-200 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            AI-Powered Precision Farming
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Grow Smarter, <br className="hidden sm:inline" />
            <span className="text-emerald-300">Harvest Better</span>
          </h1>

          <p className="text-emerald-100/90 text-base sm:text-lg leading-relaxed max-w-2xl font-light">
            Your all-in-one digital farming partner. Get real-time crop recommendations tailored to your soil NPK & pH, detect leaf diseases early from phone photos, and access tailored weather alerts to protect your harvest.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              id="hero-crop-btn"
              onClick={() => setActiveTab("crop")}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-sm sm:text-base shadow-lg hover:shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <Sprout className="w-5 h-5" />
              <span>Run Crop Recommendation</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-disease-btn"
              onClick={() => setActiveTab("disease")}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base border border-white/20 backdrop-blur-sm transition-all"
            >
              <ShieldAlert className="w-5 h-5 text-emerald-300" />
              <span>Scan Leaf Health</span>
            </button>
          </div>
        </div>
      </section>

      {/* Farmer Benefits Metric Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Increase Yield",
            desc: "Predict optimal crops for your specific soil nutrients and season.",
            icon: TrendingUp,
            color: "text-emerald-700 bg-emerald-100",
          },
          {
            title: "Save Crops Early",
            desc: "Instant leaf diagnostic pathology and curative fungicide steps.",
            icon: ShieldCheck,
            color: "text-teal-700 bg-teal-100",
          },
          {
            title: "Weather Advisories",
            desc: "Rainfall, humidity & wind warnings for smart irrigation windows.",
            icon: CloudSun,
            color: "text-amber-700 bg-amber-100",
          },
          {
            title: "24/7 AI Assistance",
            desc: "Ask any farming or fertilizer query to your dedicated AI assistant.",
            icon: Sparkles,
            color: "text-blue-700 bg-blue-100",
          },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Core Tools Section */}
      <section className="space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-emerald-950">
            How AgroSense Helps in the Field
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Simple, data-driven tools engineered to make farming decisions effortless, accurate, and profitable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Crop AI */}
          <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                🌾
              </div>
              <h3 className="text-xl font-bold text-emerald-950">Smart Crop Recommendation</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Input your soil test details (Nitrogen, Phosphorus, Potassium, Soil pH, and Expected Rainfall) to calculate the crop with the highest yield potential.
              </p>
            </div>
            <button
              onClick={() => setActiveTab("crop")}
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-emerald-700 group-hover:text-emerald-800 hover:underline"
            >
              <span>Run Soil Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Disease Detection */}
          <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                🍃
              </div>
              <h3 className="text-xl font-bold text-emerald-950">Leaf Disease Scanner</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Noticing spots or chlorosis on crop leaves? Upload a snapshot to identify leaf rust, blights, or bacterial wilt with instant treatment guidance.
              </p>
            </div>
            <button
              onClick={() => setActiveTab("disease")}
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-emerald-700 group-hover:text-emerald-800 hover:underline"
            >
              <span>Upload Leaf Photo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3: Weather Intelligence */}
          <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                ☁️
              </div>
              <h3 className="text-xl font-bold text-emerald-950">Agricultural Weather</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Check hyper-local temperature, humidity, rainfall chances, and specialized farming advisories for irrigation, spraying, and harvest timings.
              </p>
            </div>
            <button
              onClick={() => setActiveTab("weather")}
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-emerald-700 group-hover:text-emerald-800 hover:underline"
            >
              <span>Check Local Forecast</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 3 Step Workflow */}
      <section className="bg-emerald-50/70 rounded-3xl p-8 md:p-10 border border-emerald-200/70 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-200/60 px-3 py-1 rounded-full">
            Quick Start Guide
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-emerald-950">
            3 Simple Steps for Farmers
          </h2>
          <p className="text-gray-600 text-sm">No complex technical jargon — fast, accurate insights for your farm.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm space-y-3 relative">
            <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-sm">
              1
            </div>
            <h4 className="font-bold text-gray-900 text-base">Enter Soil or Leaf Details</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Input test values from your soil health card or snap a high-resolution photo of a diseased crop leaf.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm space-y-3 relative">
            <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-sm">
              2
            </div>
            <h4 className="font-bold text-gray-900 text-base">Get Real-Time AI Analysis</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              The algorithm matches your parameters against agricultural data sets to evaluate confidence scores and treatments.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm space-y-3 relative">
            <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-sm">
              3
            </div>
            <h4 className="font-bold text-gray-900 text-base">Apply & Protect Harvest</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Execute recommended fertilizer split doses, spray schedules, and weather precautions to maximize yield.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
