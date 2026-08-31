import React, { useState } from "react";
import { MessageSquareText, Send, CheckCircle2, Shield, Cpu, Sparkles, HelpCircle } from "lucide-react";

export const AboutSection: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setName("");
      setEmail("");
      setMessage("");
    }, 1000);
  };

  const faqs = [
    {
      q: "How does AgroSense calculate crop recommendations?",
      a: "AgroSense uses multi-parameter agronomic matching based on soil macronutrients (Nitrogen, Phosphorus, Potassium), soil pH, ambient temperature, humidity, and expected rainfall against scientific crop growth bands for 10+ core crops.",
    },
    {
      q: "How accurate is the leaf disease detection tool?",
      a: "The disease engine identifies characteristic visual patterns of common agricultural blights, rusts, mildews, and bacterial wilts with 85-98% diagnostic confidence, paired with recommended organic and chemical curative sprays.",
    },
    {
      q: "Can I use AgroSense for different soil types?",
      a: "Yes! Whether you farm in heavy black cotton soil, alluvial river plains, sandy loam, or red soil, you can enter your exact soil health card metrics or choose quick regional presets.",
    },
    {
      q: "What future features are coming to AgroSense?",
      a: "Future updates will include regional Indian language voice synthesis, satellite vegetation index (NDVI) mapping, and automated smart drip irrigation valve integrations.",
    },
  ];

  return (
    <div className="space-y-12 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
          <MessageSquareText className="w-3.5 h-3.5" />
          Mission & Technology
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-emerald-950">About AgroSense AI</h2>
        <p className="text-gray-600 text-sm max-w-xl mx-auto">
          Empowering growers with modern agricultural artificial intelligence, data analytics, and real-time field advisory.
        </p>
      </div>

      {/* Mission & Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl font-bold">
            🌱
          </div>
          <h3 className="text-xl font-bold text-emerald-950">Our Mission</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            AgroSense bridges the gap between traditional generational farming knowledge and contemporary AI. We aim to maximize crop yields, eliminate preventable crop loss from plant diseases, and optimize fertilizer inputs to foster sustainable agriculture.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center text-xl font-bold">
            ⚡
          </div>
          <h3 className="text-xl font-bold text-emerald-950">Core Capabilities</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Multi-variable crop suitability matching algorithms</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Multimodal visual plant disease diagnosis & treatments</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Localized meteorological tracking & spray scheduling</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Persistent farmer field records & 24/7 AI chat assistance</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-emerald-50/60 rounded-3xl p-6 sm:p-8 border border-emerald-200/80 space-y-6">
        <div className="flex items-center gap-2 text-emerald-950 font-bold text-lg">
          <HelpCircle className="w-5 h-5 text-emerald-700" />
          <span>Frequently Asked Questions</span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-100 space-y-2">
              <h4 className="font-bold text-gray-900 text-sm">{faq.q}</h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-6">
        <div className="space-y-1">
          <h3 className="font-bold text-lg text-emerald-950">Farmer Support & Feedback</h3>
          <p className="text-xs text-gray-500">
            Have questions about field diagnostics or suggestions for AgroSense? Send us a message below.
          </p>
        </div>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-2 text-emerald-900">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-base">Message Sent Successfully!</h4>
            <p className="text-xs text-emerald-700">
              Thank you for contacting Team AgroSense. Our agricultural advisory team will review your query.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. farmer@example.com"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Message / Question</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can AgroSense assist your farming operations?"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-sm transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
