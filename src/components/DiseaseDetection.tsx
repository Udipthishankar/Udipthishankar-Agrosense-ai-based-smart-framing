import React, { useState, useRef } from "react";
import { ShieldAlert, UploadCloud, Camera, CheckCircle2, AlertTriangle, Sparkles, RefreshCw, Info } from "lucide-react";
import { DiseaseDetectionResult } from "../types";

export const DiseaseDetection: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<DiseaseDetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Curated sample leaves for 1-click testing
  const sampleLeafScenarios = [
    {
      name: "Wheat Leaf Rust",
      type: "leaf_rust",
      color: "bg-amber-100 text-amber-900 border-amber-300",
      svgIcon: "🍂",
      base64Svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23dcedc8"/><path d="M50,220 C100,50 300,50 350,220 C250,260 150,260 50,220 Z" fill="%23689f38"/><circle cx="150" cy="140" r="14" fill="%23d84315"/><circle cx="190" cy="120" r="12" fill="%23d84315"/><circle cx="230" cy="150" r="16" fill="%23d84315"/><circle cx="270" cy="130" r="10" fill="%23d84315"/><text x="200" y="270" font-family="sans-serif" font-size="16" font-weight="bold" fill="%2333691e" text-anchor="middle">Simulated Sample: Leaf Rust Pustules</text></svg>`,
    },
    {
      name: "Powdery Mildew on Cucurbit",
      type: "powdery_mildew",
      color: "bg-gray-100 text-gray-800 border-gray-300",
      svgIcon: "🌾",
      base64Svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23e8f5e9"/><path d="M80,240 C120,60 280,60 320,240 C220,270 180,270 80,240 Z" fill="%23558b2f"/><ellipse cx="160" cy="150" rx="35" ry="20" fill="%23ffffff" opacity="0.85"/><ellipse cx="230" cy="130" rx="40" ry="25" fill="%23ffffff" opacity="0.85"/><text x="200" y="270" font-family="sans-serif" font-size="16" font-weight="bold" fill="%2333691e" text-anchor="middle">Simulated Sample: White Powdery Fungal Coating</text></svg>`,
    },
    {
      name: "Tomato Late Blight",
      type: "late_blight",
      color: "bg-red-100 text-red-900 border-red-300",
      svgIcon: "🍅",
      base64Svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f1f8e9"/><path d="M60,200 C110,40 290,40 340,200 C240,250 160,250 60,200 Z" fill="%2343a047"/><path d="M120,120 Q160,90 200,130 Q160,180 120,120 Z" fill="%233e2723"/><path d="M220,140 Q260,110 290,160 Q240,190 220,140 Z" fill="%233e2723"/><text x="200" y="270" font-family="sans-serif" font-size="16" font-weight="bold" fill="%232e7d32" text-anchor="middle">Simulated Sample: Dark Water-Soaked Blight Lesions</text></svg>`,
    },
    {
      name: "Healthy Green Leaf",
      type: "healthy",
      color: "bg-emerald-100 text-emerald-900 border-emerald-300",
      svgIcon: "🍃",
      base64Svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f1f8e9"/><path d="M60,220 C100,30 300,30 340,220 C240,260 160,260 60,220 Z" fill="%232e7d32"/><path d="M200,50 L200,240" stroke="%23aed581" stroke-width="4"/><text x="200" y="270" font-family="sans-serif" font-size="16" font-weight="bold" fill="%231b5e20" text-anchor="middle">Simulated Sample: Vibrant Healthy Chlorophyll Foliage</text></svg>`,
    },
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const b64 = reader.result as string;
      setSelectedImage(b64);
      runDetection(b64, file);
    };
    reader.readAsDataURL(file);
  };

  const handleSampleClick = (sample: (typeof sampleLeafScenarios)[0]) => {
    setSelectedImage(sample.base64Svg);
    runDetection(sample.base64Svg);
  };

  const runDetection = async (base64Img: string, fileObj?: File) => {
    setAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      let res: Response;

      if (fileObj) {
        const formData = new FormData();
        formData.append("image", fileObj);
        res = await fetch("/api/disease/detect", {
          method: "POST",
          body: formData,
        });
      } else {
        res = await fetch("/api/disease/detect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64Img }),
        });
      }

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data: DiseaseDetectionResult = await res.json();
      setResult(data);
    } catch (err: unknown) {
      console.error("Disease detection error:", err);
      const message = err instanceof Error ? err.message : "Failed to analyze leaf";
      setError(message);
    } finally {
      setAnalyzing(false);
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "High":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">High Risk</span>;
      case "Medium":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">Moderate</span>;
      case "Low":
      case "Low to Medium":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-200">Mild Issue</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Healthy</span>;
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
          <ShieldAlert className="w-3.5 h-3.5" />
          AI Plant Pathology Diagnostic
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-emerald-950">
          Leaf Disease Detection & Treatment Guide
        </h2>
        <p className="text-gray-600 text-sm max-w-xl mx-auto">
          Snap or upload a photo of a crop leaf showing lesions, pustules, or spots. AgroSense analyzes the disease and outlines organic & chemical curative protocols.
        </p>
      </div>

      {/* Preset Sample Leaf Testing Cards */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-emerald-100 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
          <Info className="w-3.5 h-3.5 text-emerald-600" />
          <span>Quick Test with Sample Crop Scenarios:</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {sampleLeafScenarios.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSampleClick(sample)}
              className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all hover:scale-102 flex items-center gap-2 ${sample.color}`}
            >
              <span className="text-lg">{sample.svgIcon}</span>
              <span className="font-semibold truncate">{sample.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Upload Column */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-6">
          <h3 className="font-bold text-lg text-emerald-950 flex items-center gap-2 border-b border-emerald-100 pb-3">
            <span>🍃</span> Crop Leaf Photo
          </h3>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />

          {/* Drag & Drop Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[260px] ${
              selectedImage
                ? "border-emerald-400 bg-emerald-50/30"
                : "border-gray-300 hover:border-emerald-500 hover:bg-emerald-50/20"
            }`}
          >
            {selectedImage ? (
              <div className="space-y-4 w-full flex flex-col items-center">
                <img
                  src={selectedImage}
                  alt="Selected Leaf"
                  className="max-h-56 max-w-full rounded-2xl object-contain shadow-md border border-gray-200"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-sm"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Choose Another Photo</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-2xl shadow-inner">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-sm text-gray-800">
                    Click to browse or drag & drop leaf photo
                  </p>
                  <p className="text-xs text-gray-400">Supports JPG, PNG, WebP up to 10MB</p>
                </div>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm">
                    <Camera className="w-3.5 h-3.5" />
                    <span>Upload Leaf Image</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-100 text-xs text-emerald-900 space-y-1">
            <p className="font-semibold flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-emerald-700" />
              Tip for Best Diagnosis:
            </p>
            <p className="text-gray-600">
              Capture clear, well-lit close-ups of both affected discolored patches and healthy surrounding margins for accurate symptom classification.
            </p>
          </div>
        </div>

        {/* Diagnosis Results Column */}
        <div className="lg:col-span-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-4 text-sm flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Detection Error</p>
                <p className="text-xs text-red-700">{error}</p>
              </div>
            </div>
          )}

          {analyzing ? (
            <div className="bg-white rounded-3xl p-12 border border-emerald-200 text-center space-y-4 flex flex-col items-center justify-center min-h-[360px] shadow-sm">
              <div className="w-14 h-14 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin" />
              <div className="space-y-1">
                <h4 className="font-bold text-gray-900 text-base">Analyzing Plant Pathology...</h4>
                <p className="text-xs text-gray-500 max-w-xs">
                  Inspecting lesion patterns, fungal spore signatures, chlorosis, and leaf margins.
                </p>
              </div>
            </div>
          ) : result ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/60 shadow-lg space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Result Header */}
              <div className="flex items-start justify-between border-b border-emerald-100 pb-4">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block">
                    Diagnostic Diagnosis
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-950">
                    {result.disease}
                  </h3>
                </div>
                <div>{getSeverityBadge(result.severity)}</div>
              </div>

              {/* Confidence & Source Info */}
              <div className="flex items-center justify-between bg-emerald-50/60 px-4 py-2.5 rounded-xl border border-emerald-100 text-xs">
                <span className="text-gray-600 font-medium">Diagnostic Confidence</span>
                <span className="font-bold text-emerald-800 text-sm">
                  {(result.confidence * 100).toFixed(1)}%
                </span>
              </div>

              {/* Symptoms / Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Pathology Symptoms & Characteristics
                </h4>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs text-gray-800 leading-relaxed">
                  {result.description}
                </div>
              </div>

              {/* Treatment Protocol */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Recommended Treatment & Control Protocol
                </h4>
                <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200 text-xs text-emerald-950 leading-relaxed font-medium">
                  {result.treatment}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-dashed border-emerald-200 text-center space-y-4 flex flex-col items-center justify-center min-h-[320px]">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-3xl">
                🍃
              </div>
              <div className="space-y-1 max-w-sm">
                <h4 className="font-bold text-gray-800 text-base">No Leaf Image Loaded</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Upload a crop photo on the left or click any sample preset above to see the AI diagnosis in action.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
