import React, { useState, useMemo } from 'react';
import {
  Globe,
  MapPin,
  Sparkles,
  Check,
  Search,
  RefreshCw,
  Sliders,
  DollarSign,
  TrendingUp,
  Compass,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CURRENCIES, CURRENCY_LIST, TOP_CURRENCIES, CurrencyCode, CurrencyInfo } from '../data/currencies';

interface CurrencySwitcherSectionProps {
  compact?: boolean;
  onCurrencySelected?: (code: CurrencyCode) => void;
}

export const CurrencySwitcherSection: React.FC<CurrencySwitcherSectionProps> = ({
  compact = false,
  onCurrencySelected,
}) => {
  const {
    currency,
    setCurrency,
    activeCurrencyInfo,
    currencyMode,
    setCurrencyMode,
    userLocation,
    detectAndApplyLocationCurrency,
    showCurrencyCode,
    setShowCurrencyCode,
    formatPrice,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [isDetecting, setIsDetecting] = useState(false);
  const [previewAmountUSD, setPreviewAmountUSD] = useState<number>(120);

  const handleAutoDetect = async () => {
    setIsDetecting(true);
    try {
      await detectAndApplyLocationCurrency();
    } finally {
      setTimeout(() => {
        setIsDetecting(false);
      }, 600);
    }
  };

  const handleSelectCurrency = (code: CurrencyCode) => {
    setCurrency(code);
    if (onCurrencySelected) {
      onCurrencySelected(code);
    }
  };

  const regions = useMemo(() => {
    const list = Array.from(new Set(CURRENCY_LIST.map((c) => c.region)));
    return ['all', ...list];
  }, []);

  const filteredCurrencies = useMemo(() => {
    return CURRENCY_LIST.filter((curr) => {
      if (selectedRegion !== 'all' && curr.region !== selectedRegion) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesCode = curr.code.toLowerCase().includes(q);
        const matchesName = curr.name.toLowerCase().includes(q);
        const matchesRegion = curr.region.toLowerCase().includes(q);
        const matchesHub = curr.marketHub.toLowerCase().includes(q);
        const matchesSymbol = curr.symbol.toLowerCase().includes(q);
        return matchesCode || matchesName || matchesRegion || matchesHub || matchesSymbol;
      }
      return true;
    });
  }, [searchQuery, selectedRegion]);

  return (
    <div className="space-y-4">
      {/* 1. LOCATION DETECTION & ACTIVE CURRENCY BANNER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#121422] via-[#0d0e18] to-[#181128] border border-cyan-500/30 p-4 shadow-xl">
        {/* Glow accent */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-2xl shadow-inner shadow-cyan-500/20">
              {activeCurrencyInfo.flag}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-cyber font-black text-white text-base">
                  {activeCurrencyInfo.code} ({activeCurrencyInfo.symbol.trim()})
                </span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 text-[9px] font-cyber font-bold border border-cyan-400/40 uppercase">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-zinc-300 font-tech">
                {activeCurrencyInfo.name} • {activeCurrencyInfo.marketHub}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAutoDetect}
              disabled={isDetecting}
              className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 active:scale-95 border border-cyan-400/40 text-cyan-300 font-cyber font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-cyan-500/10"
              title="Detect location from browser timezone / GPS"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isDetecting ? 'animate-spin text-cyan-400' : ''}`} />
              {isDetecting ? 'DETECTING...' : 'AUTO-DETECT LOCATION'}
            </button>
          </div>
        </div>

        {/* Location metadata strip */}
        <div className="pt-3 flex flex-wrap items-center justify-between gap-2 text-xs font-tech text-zinc-400">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>
              Detected Region:{' '}
              <strong className="text-white font-medium">{userLocation.regionName}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-zinc-400">
              Exchange Rate:{' '}
              <strong className="text-cyan-300 font-cyber font-bold">
                $1.00 USD = {formatPrice(1, { showCode: true })}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* 2. MODE TOGGLE & QUICK CURRENCY SELECTOR */}
      <div className="p-3.5 rounded-2xl bg-[#0f101a] border border-white/10 space-y-3">
        <div className="flex items-center justify-between text-xs font-tech">
          <span className="font-cyber font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" /> TOP STREETWEAR MARKETS
          </span>
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setCurrencyMode('auto')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-cyber font-bold transition-all ${
                currencyMode === 'auto'
                  ? 'bg-cyan-400 text-black shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              AUTO ({userLocation.matchedCurrency})
            </button>
            <button
              onClick={() => setCurrencyMode('manual')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-cyber font-bold transition-all ${
                currencyMode === 'manual'
                  ? 'bg-cyan-400 text-black shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              MANUAL
            </button>
          </div>
        </div>

        {/* Quick select pills */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
          {TOP_CURRENCIES.map((code) => {
            const curr = CURRENCIES[code];
            const isSelected = currency === code;
            return (
              <button
                key={code}
                onClick={() => handleSelectCurrency(code)}
                className={`py-2 px-2 rounded-xl flex flex-col items-center justify-center gap-0.5 border transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-cyan-400 text-black border-cyan-300 shadow-lg shadow-cyan-400/20 font-bold'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-300 hover:text-white'
                }`}
              >
                <span className="text-base leading-none">{curr.flag}</span>
                <span className="text-[11px] font-cyber font-black">{curr.code}</span>
                <span className={`text-[9px] font-tech ${isSelected ? 'text-black/80' : 'text-zinc-400'}`}>
                  {curr.symbol.trim()}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. FULL SEARCH & BROWSER CATALOG */}
      <div className="p-4 rounded-2xl bg-[#0f101a] border border-white/10 space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <h3 className="font-cyber font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-cyan-400" /> GLOBAL CURRENCY SELECTOR
          </h3>

          {/* Search Box */}
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search currency, country, hub..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white/5 border border-white/10 focus:border-cyan-400 rounded-xl text-xs text-white placeholder:text-zinc-500 font-tech focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Region Filter Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-tech">
          {regions.map((reg) => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`px-3 py-1 rounded-xl text-[11px] font-tech whitespace-nowrap capitalize border transition-all ${
                selectedRegion === reg
                  ? 'bg-white/15 text-cyan-300 border-cyan-400/40 font-bold'
                  : 'bg-white/5 text-zinc-400 hover:text-white border-white/5'
              }`}
            >
              {reg === 'all' ? 'All Regions' : reg}
            </button>
          ))}
        </div>

        {/* Currencies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
          {filteredCurrencies.map((curr) => {
            const isSelected = currency === curr.code;
            return (
              <button
                key={curr.code}
                onClick={() => handleSelectCurrency(curr.code)}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all active:scale-[0.99] ${
                  isSelected
                    ? 'bg-cyan-500/15 border-cyan-400/60 shadow-md shadow-cyan-500/10'
                    : 'bg-[#141522] hover:bg-white/5 border-white/10'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl shrink-0">{curr.flag}</span>
                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="font-cyber font-bold text-xs text-white">
                        {curr.code} ({curr.symbol.trim()})
                      </span>
                      {curr.rate === 1.0 && (
                        <span className="text-[9px] px-1.5 py-0.2 bg-white/10 text-zinc-400 rounded font-tech">
                          BASE
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-400 font-tech truncate">{curr.name}</p>
                    <p className="text-[10px] text-cyan-300/80 font-tech truncate">
                      {curr.marketHub}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-2">
                  <div className="text-xs font-cyber font-bold text-white">
                    {formatPrice(previewAmountUSD, { customCurrency: curr.code })}
                  </div>
                  <span className="text-[9px] text-zinc-400 font-tech">for $120 item</span>
                  {isSelected && (
                    <div className="mt-1 flex items-center justify-end text-cyan-400">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. DISPLAY PREFERENCES & TOGGLES */}
      <div className="p-4 rounded-2xl bg-[#0f101a] border border-white/10 space-y-3 text-xs font-tech">
        <h4 className="font-cyber font-bold text-xs text-white uppercase tracking-wider">
          PRICING DISPLAY PREFERENCES
        </h4>

        {/* Currency Code Alongside Symbol Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div>
            <span className="font-bold text-white block">Append Currency Code</span>
            <span className="text-zinc-400">
              Display {formatPrice(120, { showCode: true })} instead of {formatPrice(120, { showCode: false })}
            </span>
          </div>
          <button
            onClick={() => setShowCurrencyCode(!showCurrencyCode)}
            className={`px-3 py-1.5 rounded-xl border font-cyber font-bold text-xs transition-all ${
              showCurrencyCode
                ? 'bg-cyan-400 text-black border-cyan-300'
                : 'bg-white/5 text-zinc-400 border-white/10 hover:text-white'
            }`}
          >
            {showCurrencyCode ? 'SHOWING CODE' : 'SYMBOL ONLY'}
          </button>
        </div>

        {/* Conversion preview bar */}
        <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-[11px] text-zinc-300">
          <span className="flex items-center gap-1 text-cyan-300">
            <TrendingUp className="w-3.5 h-3.5" /> Live Streetwear Market Peg
          </span>
          <span className="font-tech text-zinc-400">
            All checkouts automatically processed in {activeCurrencyInfo.code}
          </span>
        </div>
      </div>
    </div>
  );
};
