import React, { useState } from 'react';
import { X, Ruler, Check, Sparkles, ArrowRight, User } from 'lucide-react';
import { Product } from '../types';

interface FitQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSelectRecommendedSize: (size: string) => void;
}

export const FitQuizModal: React.FC<FitQuizModalProps> = ({
  isOpen,
  onClose,
  product,
  onSelectRecommendedSize,
}) => {
  const [heightFeet, setHeightFeet] = useState('5');
  const [heightInches, setHeightInches] = useState('10');
  const [weightLbs, setWeightLbs] = useState('165');
  const [preferredFit, setPreferredFit] = useState<'slim' | 'regular' | 'oversized' | 'boxy'>('oversized');
  const [calculatedSize, setCalculatedSize] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const totalInches = parseInt(heightFeet) * 12 + parseInt(heightInches);
    const weight = parseInt(weightLbs);

    // Dynamic Sizing Matrix
    let baseSize = 'M';
    if (weight < 140 || totalInches < 67) {
      baseSize = 'S';
    } else if (weight >= 140 && weight <= 175) {
      baseSize = 'M';
    } else if (weight > 175 && weight <= 205) {
      baseSize = 'L';
    } else if (weight > 205) {
      baseSize = 'XL';
    }

    // Adjust based on preferred fit
    if (preferredFit === 'oversized' || preferredFit === 'boxy') {
      if (baseSize === 'S') baseSize = 'M';
      else if (baseSize === 'M') baseSize = 'L';
      else if (baseSize === 'L') baseSize = 'XL';
      else if (baseSize === 'XL') baseSize = 'XXL';
    } else if (preferredFit === 'slim') {
      if (baseSize === 'L') baseSize = 'M';
      else if (baseSize === 'M') baseSize = 'S';
    }

    setCalculatedSize(baseSize);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#0e0f18] border border-cyan-400/40 rounded-3xl max-w-md w-full p-5 sm:p-6 space-y-5 shadow-2xl shadow-cyan-950/60 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-cyan-400 font-cyber text-[10px] font-bold tracking-widest uppercase">
            <Ruler className="w-3.5 h-3.5" /> FIT & SIZING CALCULATOR
          </div>
          <h3 className="font-syne font-black text-xl text-white">
            Find Your Perfect Size
          </h3>
          <p className="text-xs text-zinc-400 font-tech">
            {product ? `Tailored for ${product.name}` : 'Calculated against LIMITLESS tailoring standards'}
          </p>
        </div>

        {!calculatedSize ? (
          <form onSubmit={handleCalculate} className="space-y-4">
            {/* Height Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-cyber font-bold text-white uppercase block">
                Your Height
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={heightFeet}
                  onChange={(e) => setHeightFeet(e.target.value)}
                  className="w-full py-2.5 px-3 bg-[#141522] border border-white/15 focus:border-cyan-400 rounded-xl text-xs text-white focus:outline-none font-tech"
                >
                  <option value="5">5 Feet</option>
                  <option value="6">6 Feet</option>
                  <option value="7">7 Feet</option>
                </select>
                <select
                  value={heightInches}
                  onChange={(e) => setHeightInches(e.target.value)}
                  className="w-full py-2.5 px-3 bg-[#141522] border border-white/15 focus:border-cyan-400 rounded-xl text-xs text-white focus:outline-none font-tech"
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((inch) => (
                    <option key={inch} value={inch}>
                      {inch} Inches
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Weight Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-cyber font-bold text-white uppercase block">
                Your Weight (lbs)
              </label>
              <input
                type="number"
                value={weightLbs}
                onChange={(e) => setWeightLbs(e.target.value)}
                min="90"
                max="350"
                className="w-full py-2.5 px-3 bg-[#141522] border border-white/15 focus:border-cyan-400 rounded-xl text-xs text-white focus:outline-none font-tech"
                placeholder="e.g. 165"
                required
              />
            </div>

            {/* Preferred Fit Silhouette */}
            <div className="space-y-1.5">
              <label className="text-xs font-cyber font-bold text-white uppercase block">
                Preferred Fit Silhouette
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'slim', label: 'Slim / Fitted', desc: 'True to body' },
                  { id: 'regular', label: 'Regular', desc: 'Standard drape' },
                  { id: 'boxy', label: 'Boxy Y2K', desc: 'Wide chest, cropped hem' },
                  { id: 'oversized', label: 'Oversized', desc: 'Baggy streetwear drop' },
                ].map((fit) => (
                  <button
                    type="button"
                    key={fit.id}
                    onClick={() => setPreferredFit(fit.id as any)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      preferredFit === fit.id
                        ? 'bg-cyan-500/10 border-cyan-400 text-white shadow-md'
                        : 'bg-white/5 border-white/10 text-zinc-400 hover:border-white/20'
                    }`}
                  >
                    <span className="font-cyber font-bold text-xs text-white block">
                      {fit.label}
                    </span>
                    <span className="text-[9px] font-tech text-zinc-400 block mt-0.5">
                      {fit.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-cyber font-black text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              CALCULATE MY SIZE
            </button>
          </form>
        ) : (
          /* Results Screen */
          <div className="space-y-4 text-center animate-scaleUp">
            <div className="p-6 rounded-2xl bg-gradient-to-b from-cyan-500/15 to-transparent border border-cyan-400/40 space-y-2">
              <span className="text-[10px] font-cyber text-cyan-400 font-bold uppercase tracking-widest block">
                RECOMMENDED TAILORING
              </span>
              <div className="font-cyber font-black text-4xl text-white text-cyber-glow">
                SIZE {calculatedSize}
              </div>
              <p className="text-xs text-zinc-300 font-normal max-w-xs mx-auto pt-1">
                Based on your profile ({heightFeet}'{heightInches}", {weightLbs} lbs, {preferredFit} fit), Size {calculatedSize} provides the exact signature drape.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setCalculatedSize(null)}
                className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 font-cyber font-bold text-xs border border-white/10 transition-colors"
              >
                RECALCULATE
              </button>
              <button
                onClick={() => {
                  onSelectRecommendedSize(calculatedSize);
                  onClose();
                }}
                className="flex-1 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-cyber font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-cyan-500/20 flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                SELECT SIZE {calculatedSize}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
