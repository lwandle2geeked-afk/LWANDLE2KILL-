import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Smartphone, Maximize2 } from 'lucide-react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { ToastContainer } from './Toast';
import { HomeView } from './views/HomeView';
import { ShopView } from './views/ShopView';
import { LookbookView } from './views/LookbookView';
import { NewArrivalsView } from './views/NewArrivalsView';
import { CartView } from './views/CartView';
import { AccountView } from './views/AccountView';
import { ProductDetailModal } from './views/ProductDetailModal';
import { SearchModal } from './views/SearchModal';
import { CheckoutModal } from './views/CheckoutModal';
import { GlobalCurrencyModal } from './GlobalCurrencyModal';
import { useApp } from '../context/AppContext';

export const MobileFrame: React.FC = () => {
  const { activeTab } = useApp();
  const [currentTime, setCurrentTime] = useState('9:41');
  const [deviceFrameMode, setDeviceFrameMode] = useState<boolean>(false);

  // Update mock status bar time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const isPm = hours >= 12;
      hours = hours % 12 || 12;
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#060609] text-zinc-100 flex flex-col items-center justify-start sm:py-4">
      {/* Desktop Helper Bar with Viewport Mode Toggle */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-md px-3 py-1.5 mb-2 bg-white/5 border border-white/10 rounded-xl text-[11px] font-tech text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="font-cyber font-bold text-white">LIMITLESS MOBILE APP</span>
        </div>
        <button
          onClick={() => setDeviceFrameMode(!deviceFrameMode)}
          className="hover:text-white flex items-center gap-1 transition-colors px-2 py-0.5 rounded bg-white/5 hover:bg-white/10"
          title="Toggle phone chassis mockup"
        >
          {deviceFrameMode ? (
            <>
              <Maximize2 className="w-3 h-3" /> Standard View
            </>
          ) : (
            <>
              <Smartphone className="w-3 h-3" /> Phone Frame
            </>
          )}
        </button>
      </div>

      {/* Main Container */}
      <div
        className={`w-full max-w-md bg-[#08080d] min-h-screen flex flex-col relative overflow-hidden transition-all duration-300 ${
          deviceFrameMode
            ? 'sm:rounded-[44px] sm:border-[8px] sm:border-[#1a1b26] sm:shadow-2xl sm:shadow-cyan-950/40 sm:min-h-[860px]'
            : 'sm:border-x sm:border-white/10'
        }`}
      >
        {/* iOS-Style Status Bar */}
        <div className="sticky top-0 z-50 bg-[#08080d] px-6 pt-3 pb-1 flex items-center justify-between text-xs font-semibold text-zinc-300 select-none">
          <span className="font-cyber text-[11px] font-bold text-white tracking-tight">
            {currentTime}
          </span>

          {/* Dynamic Island Pill */}
          <div className="w-24 h-4 bg-black rounded-full border border-white/10 flex items-center justify-center gap-1.5 px-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[7px] font-cyber text-zinc-400 uppercase tracking-widest">LIMITLESS</span>
          </div>

          <div className="flex items-center gap-1.5 text-zinc-300">
            <span className="text-[10px] font-cyber font-bold text-cyan-400">5G</span>
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 text-emerald-400 fill-emerald-400" />
          </div>
        </div>

        {/* Global Floating Toast Notifications */}
        <ToastContainer />

        {/* App Header */}
        <Header />

        {/* Dynamic Views based on activeTab */}
        <main className="flex-1 overflow-x-hidden">
          {activeTab === 'home' && <HomeView />}
          {activeTab === 'shop' && <ShopView />}
          {activeTab === 'lookbook' && <LookbookView />}
          {activeTab === 'new' && <NewArrivalsView />}
          {activeTab === 'cart' && <CartView />}
          {activeTab === 'account' && <AccountView />}
        </main>

        {/* Global Bottom Navigation */}
        <BottomNav />

        {/* Modals & Overlays */}
        <ProductDetailModal />
        <SearchModal />
        <CheckoutModal />
        <GlobalCurrencyModal />
      </div>
    </div>
  );
};
