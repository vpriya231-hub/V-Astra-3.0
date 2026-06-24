import React, { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, ArrowRight, User } from "lucide-react";

interface OnboardingProps {
  onComplete: (name: string) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please share your name with us to proceed.");
      return;
    }
    if (name.length > 30) {
      setError("Please keep your name under 30 characters.");
      return;
    }
    onComplete(name.trim());
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-50/50">
      {/* Soft Pastel Ambient Radial Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-100/40 blur-[120px] animate-float" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-rose-100/30 blur-[130px] animate-float-delayed" />
      <div className="absolute top-[40%] right-[20%] w-[350px] h-[350px] rounded-full bg-violet-100/30 blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-8 md:p-10 bg-white rounded-3xl shadow-xl shadow-slate-100/80 border border-slate-100 mx-4"
        id="onboarding-card"
      >
        <div className="flex flex-col items-center text-center">
          {/* Logo Brand */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-16 h-16 rounded-2xl bg-slate-950 flex items-center justify-center text-white shadow-lg shadow-slate-950/20 mb-6"
          >
            <Sparkles className="w-8 h-8 text-indigo-200" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-display text-3xl font-semibold tracking-tight text-slate-900 mb-2"
          >
            V-Astra AI
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-500 text-sm max-w-xs mb-8"
          >
            A high-end neural companion designed to elevate your creative workflows and daily tasks.
          </motion.p>

          <form onSubmit={handleSubmit} className="w-full space-y-5" id="onboarding-form">
            <div className="relative">
              <label 
                htmlFor="username-input" 
                className="block text-left text-xs font-medium text-slate-500 mb-2 font-sans uppercase tracking-wider"
              >
                What should we call you?
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="username-input"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError("");
                  }}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-900 placeholder:text-slate-400 font-sans text-base focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent focus:bg-white transition-all duration-300"
                  maxLength={40}
                  autoFocus
                />
              </div>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-rose-500 font-medium mt-2 text-left"
                  id="onboarding-error"
                >
                  {error}
                </motion.p>
              )}
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full bg-slate-950 hover:bg-slate-900 text-white font-sans font-medium py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 group shadow-lg shadow-slate-950/10 cursor-pointer transition-all duration-300"
              id="onboarding-submit-btn"
            >
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
