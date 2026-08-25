import React from 'react';
import { X, Globe, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CurrencySwitcherSection } from './CurrencySwitcherSection';

export const GlobalCurrencyModal: React.FC = () => {
  const { isCurrencySwitcherOpen, setIsCurrencySwitcherOpen } = useApp();

  if (!isCurrencySwitcherOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-3xl bg-[#0a0b12] border border-white/15 shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="sticky top-0 z-10 bg-[#0d0e17]/95 backdrop-blur-md px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-cyber font-bold text-sm text-white uppercase tracking-wider">
                CURRENCY & REGION
              </h2>
              <p className="text-[11px] text-zinc-400 font-tech">
                Switch billing currencies & auto-detect location
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCurrencySwitcherOpen(false)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 no-scrollbar">
          <CurrencySwitcherSection
            onCurrencySelected={() => {
              // Optionally keep open or close
            }}
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#0d0e17] flex justify-end">
          <button
            onClick={() => setIsCurrencySwitcherOpen(false)}
            className="w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-cyber font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-cyan-400/20"
          >
            DONE
          </button>
        </div>
      </div>
    </div>
  );
};
