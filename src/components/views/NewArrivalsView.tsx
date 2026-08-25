import React, { useState, useEffect } from 'react';
import { Sparkles, Timer, Bell, ShieldCheck, Flame } from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { ProductCard } from '../ProductCard';
import { useApp } from '../../context/AppContext';

export const NewArrivalsView: React.FC = () => {
  const { showToast } = useApp();
  const [subscribed, setSubscribed] = useState(false);

  // Simulated live drop countdown timer
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 14,
    minutes: 42,
    seconds: 19,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { ...prev, days: Math.max(0, prev.days - 1), hours: 23, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const newItems = PRODUCTS.filter((p) => p.isNew || p.isFeatured);

  const handleNotifyDrop = () => {
    setSubscribed(true);
    showToast({
      title: 'DROP ALERTS ENABLED',
      description: 'You will receive 15-min early access to Drop #05',
      type: 'success',
    });
  };

  return (
    <div className="space-y-6 px-4 pb-16 pt-2">
      {/* 1. COUNTDOWN & DROP HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1b0d26] via-[#10111e] to-[#081528] border border-pink-500/30 p-6 shadow-2xl shadow-pink-950/20">
        <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 text-[10px] font-cyber font-bold tracking-widest uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            EXCLUSIVE LAUNCH
          </div>

          <h1 className="font-cyber font-black text-2xl sm:text-3xl text-white tracking-tight uppercase">
            JUST DROPPED.
          </h1>

          <p className="mt-2 text-xs text-zinc-300 font-tech max-w-xs">
            Limited numbered quantities. Hand-distressed chrome streetwear engineered for the Y2K digital aesthetic.
          </p>

          {/* Cyber Countdown Box */}
          <div className="mt-5 p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/15 w-full max-w-xs">
            <div className="flex items-center justify-center gap-1.5 text-zinc-400 text-[10px] font-cyber font-bold uppercase mb-2">
              <Timer className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>NEXT SECRET DROP #05 IN:</span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-white/5 rounded-xl p-1.5 border border-white/10">
                <span className="font-cyber font-black text-lg text-white block">
                  {String(timeLeft.days).padStart(2, '0')}
                </span>
                <span className="text-[8px] font-tech text-zinc-500 uppercase">DAYS</span>
              </div>
              <div className="bg-white/5 rounded-xl p-1.5 border border-white/10">
                <span className="font-cyber font-black text-lg text-cyan-400 block">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[8px] font-tech text-zinc-500 uppercase">HOURS</span>
              </div>
              <div className="bg-white/5 rounded-xl p-1.5 border border-white/10">
                <span className="font-cyber font-black text-lg text-pink-400 block">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[8px] font-tech text-zinc-500 uppercase">MINS</span>
              </div>
              <div className="bg-white/5 rounded-xl p-1.5 border border-white/10">
                <span className="font-cyber font-black text-lg text-white block">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[8px] font-tech text-zinc-500 uppercase">SECS</span>
              </div>
            </div>

            <button
              onClick={handleNotifyDrop}
              className={`mt-3 w-full py-2.5 rounded-xl text-xs font-cyber font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
                subscribed
                  ? 'bg-emerald-500 text-black'
                  : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:brightness-110 text-white shadow-lg shadow-pink-500/20'
              }`}
            >
              {subscribed ? (
                <>
                  <ShieldCheck className="w-4 h-4" /> VIP PASS ACTIVE
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4" /> GET EARLY ACCESS ALERT
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. LATEST ARRIVALS GRID */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-cyber font-bold text-base text-white tracking-wide uppercase flex items-center gap-2">
            <Flame className="w-4 h-4 text-pink-400 fill-pink-400" />
            LATEST DROPS & ARCHIVES
          </h2>
          <span className="text-xs font-tech text-zinc-400">{newItems.length} styles live</span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {newItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};
