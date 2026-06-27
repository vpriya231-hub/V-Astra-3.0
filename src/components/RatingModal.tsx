import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, X, Sparkles } from "lucide-react";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRate: () => void;
  appName?: string;
}

export default function RatingModal({ isOpen, onClose, onRate, appName = "V-Astra AI" }: RatingModalProps) {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [selectedStar, setSelectedStar] = useState<number | null>(null);

  const PLAY_STORE_URL = "market://details?id=com.vastraai.app";

  const handleStarClick = (starIndex: number) => {
    setSelectedStar(starIndex);
    // Trigger rating action
    setTimeout(() => {
      onRate();
      window.location.href = PLAY_STORE_URL;
    }, 200);
  };

  const handleRateNow = () => {
    onRate();
    window.location.href = PLAY_STORE_URL;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" id="rating-modal-overlay">
          {/* Backdrop Glassmorphism */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            id="rating-backdrop"
          />

          {/* Modal Container: Bottom sheet on mobile, centered card on desktop */}
          <motion.div
            initial={{ y: "100%", opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border-t sm:border border-slate-150 dark:border-slate-800/80 p-6 overflow-hidden z-10 font-sans"
            id="rating-modal-card"
          >
            {/* Google Play top drag bar aesthetic for bottom sheet on mobile */}
            <div className="block sm:hidden w-12 h-1 bg-slate-200 dark:bg-slate-700/60 rounded-full mx-auto mb-4" id="mobile-sheet-handle" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              aria-label="Close review"
              id="rating-close-button"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-center text-center mt-2" id="rating-content-body">
              {/* Brand App Icon (Modern High-availability styling) */}
              <div className="relative mb-4" id="app-logo-badge">
                {/* Outer ring */}
                <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 opacity-20 blur-sm" />
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-indigo-400 dark:from-indigo-950 dark:to-indigo-800 flex items-center justify-center border border-indigo-200/20 dark:border-indigo-500/30 shadow-md">
                  <Sparkles className="w-7 h-7 text-white" />
                  
                  {/* Google Play mini-badge overlay to look official */}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-slate-850 shadow border border-slate-100 dark:border-slate-800 flex items-center justify-center p-0.5">
                    <svg viewBox="0 0 24 24" className="w-full h-full text-indigo-600 dark:text-indigo-400" fill="currentColor">
                      <path d="M3 20.285V3.715c0-.986.736-1.571 1.554-1.571.267 0 .532.062.775.183l13.627 8.1c.64.38.948.917.948 1.573 0 .656-.308 1.193-.948 1.573L5.329 21.672c-.243.12-.508.183-.775.183-.818 0-1.554-.585-1.554-1.57zM16.634 12L5 5.093v13.814L16.634 12z"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Title and Subtitle */}
              <h2 className="text-lg font-semibold text-slate-850 dark:text-slate-100 tracking-tight" id="rating-title">
                Enjoying our app?
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 max-w-xs leading-normal" id="rating-subtitle">
                Tap a star to rate it on the Google Play Store. We value your feedback to make V-Astra even better!
              </p>

              {/* Five Star Widget (Highly interactive & custom styled) */}
              <div className="flex items-center justify-center gap-2 my-6" id="rating-stars-container">
                {[1, 2, 3, 4, 5].map((starIndex) => {
                  const isHighlighted = (hoveredStar !== null ? starIndex <= hoveredStar : false) || 
                                        (hoveredStar === null && selectedStar !== null ? starIndex <= selectedStar : false);
                  
                  return (
                    <motion.button
                      key={starIndex}
                      type="button"
                      onMouseEnter={() => setHoveredStar(starIndex)}
                      onMouseLeave={() => setHoveredStar(null)}
                      onClick={() => handleStarClick(starIndex)}
                      whileHover={{ scale: 1.18 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-lg"
                      title={`Rate ${starIndex} Stars`}
                      id={`star-${starIndex}`}
                    >
                      <Star
                        className={`w-9 h-9 transition-all duration-150 ${
                          isHighlighted 
                            ? "fill-amber-400 text-amber-400 filter drop-shadow-[0_0_4px_rgba(251,191,36,0.45)]" 
                            : "text-slate-200 dark:text-slate-700/80 fill-transparent"
                        }`}
                      />
                    </motion.button>
                  );
                })}
              </div>

              {/* Divider lines exactly like official Android Play review */}
              <div className="w-full h-px bg-slate-100 dark:bg-slate-800/60 mb-5" />

              {/* Bottom buttons row */}
              <div className="flex items-center justify-between w-full" id="rating-buttons-row">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all cursor-pointer font-sans"
                  id="rating-later-button"
                >
                  Later
                </button>

                <button
                  type="button"
                  onClick={handleRateNow}
                  className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-tr from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 active:scale-[0.98] shadow-sm hover:shadow shadow-indigo-500/20 transition-all cursor-pointer font-sans flex items-center gap-1.5"
                  id="rating-now-button"
                >
                  Rate Now
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
