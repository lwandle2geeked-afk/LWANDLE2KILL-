import React from 'react';
import { Search, ShoppingBag, Heart, Sparkles, RefreshCw, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const {
    cartCount,
    wishlist,
    setActiveTab,
    setIsSearchOpen,
    isRefreshing,
    handlePullRefresh,
    activeCurrencyInfo,
    setIsCurrencySwitcherOpen,
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-[#08080d]/90 backdrop-blur-xl border-b border-white/10 transition-colors">
      {/* Top Cyber Dropping Announcement Bar */}
      <div className="bg-gradient-to-r from-[#0066ff]/20 via-[#7928ca]/20 to-[#ec4899]/20 border-b border-white/5 px-3 py-1.5 flex items-center justify-between text-[11px] font-tech text-zinc-300 overflow-hidden">
        <div className="flex items-center gap-1.5 shrink-0 text-cyan-400 font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="font-cyber tracking-wider">DROP NIGHT</span>
        </div>
        <div className="truncate px-2 text-center text-zinc-300 font-medium">
          USE CODE <span className="text-white font-bold bg-white/10 px-1.5 py-0.5 rounded border border-white/20">LIMITLESS20</span> FOR 20% OFF
        </div>
        <button 
          onClick={handlePullRefresh}
          className="shrink-0 p-1 hover:text-cyan-400 text-zinc-400 transition-colors flex items-center gap-1"
          title="Pull to sync inventory"
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          <span className="hidden sm:inline text-[10px]">SYNC</span>
        </button>
      </div>

      {/* Main App Bar */}
      <div className="px-4 py-3 flex items-center justify-between gap-2 max-w-lg mx-auto">
        {/* Brand Logo */}
        <button
          onClick={() => setActiveTab('home')}
          className="group flex items-center gap-2 text-left focus:outline-none"
        >
          <div className="relative flex items-center justify-center">
            {/* Cyber metallic diamond icon */}
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-white via-zinc-400 to-zinc-800 p-[1px] shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-[#0d0e15] rounded-[7px] flex items-center justify-center font-cyber font-black text-white text-xs">
                ✦
              </div>
            </div>
          </div>
          <div>
            <div className="font-cyber font-black text-lg tracking-[0.2em] text-white flex items-center gap-1 group-hover:text-cyan-300 transition-colors">
              LIMITLESS
            </div>
            <p className="text-[8px] font-tech text-zinc-400 tracking-[0.25em] uppercase -mt-0.5">
              TOKYO • LA • LONDON
            </p>
          </div>
        </button>

        {/* Action Icons */}
        <div className="flex items-center gap-1.5">
          {/* Currency Switcher Quick Pill */}
          <button
            onClick={() => setIsCurrencySwitcherOpen(true)}
            className="h-10 px-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1.5 text-zinc-200 hover:text-cyan-300 transition-all active:scale-95 text-xs font-cyber font-bold"
            title={`Active Currency: ${activeCurrencyInfo.code} (${activeCurrencyInfo.symbol})`}
          >
            <span className="text-sm">{activeCurrencyInfo.flag}</span>
            <span className="text-[11px] text-cyan-300 font-cyber">{activeCurrencyInfo.code}</span>
          </button>

          {/* Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-cyan-400 transition-all active:scale-95"
            aria-label="Search clothing"
          >
            <Search className="w-4.5 h-4.5" />
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() => setActiveTab('account')}
            className="relative w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-pink-400 transition-all active:scale-95"
            aria-label="Saved items"
          >
            <Heart className="w-4.5 h-4.5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-pink-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center border-2 border-[#08080d]">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setActiveTab('cart')}
            className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 hover:from-cyan-500/30 hover:to-purple-600/30 border border-cyan-400/30 flex items-center justify-center text-white transition-all active:scale-95 shadow-lg shadow-cyan-500/10"
            aria-label="View shopping cart"
          >
            <ShoppingBag className="w-4.5 h-4.5 text-cyan-300" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-gradient-to-r from-cyan-400 to-blue-500 text-[10px] font-cyber font-bold text-black rounded-full flex items-center justify-center border-2 border-[#08080d] shadow-md shadow-cyan-500/50 animate-bounce">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
