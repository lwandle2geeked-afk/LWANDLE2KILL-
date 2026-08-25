import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Truck,
  RotateCcw,
  Flame,
  Layers,
  Clock,
  MapPin,
  Calendar,
  Compass,
  Check,
  Tag
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES, PRODUCTS } from '../../data/products';
import { BRAND_LIST, BRAND_SOURCES } from '../../data/brands';
import { ProductCard } from '../ProductCard';
import { CategoryType } from '../../types';
import { StoriesReel } from '../StoriesReel';
import { CommunityFitsSection } from '../CommunityFitsSection';
import { FitStudioModal } from '../FitStudioModal';
import { DropRadarModal } from '../DropRadarModal';
import { StoreLocationsModal } from '../StoreLocationsModal';

export const HomeView: React.FC = () => {
  const { setActiveTab, navigateToCategory, navigateToBrand } = useApp();

  const [isFitStudioOpen, setIsFitStudioOpen] = useState(false);
  const [isDropRadarOpen, setIsDropRadarOpen] = useState(false);
  const [isStoreLocationsOpen, setIsStoreLocationsOpen] = useState(false);

  // The 4 main featured products requested in prompt
  const featuredProducts = [
    PRODUCTS.find((p) => p.slug === 'limitless-chrome-tee') || PRODUCTS[0],
    PRODUCTS.find((p) => p.slug === 'oversized-y2k-hoodie') || PRODUCTS[1],
    PRODUCTS.find((p) => p.slug === 'baggy-y2k-denim') || PRODUCTS[2],
    PRODUCTS.find((p) => p.slug === 'limitless-racing-jacket') || PRODUCTS[3],
  ];

  // Just dropped new items
  const newArrivals = PRODUCTS.filter((p) => p.isNew).slice(0, 4);

  return (
    <div className="space-y-7 pb-16">
      {/* 1. CLOTHING STORE STORIES REEL */}
      <section className="px-4 pt-1">
        <StoriesReel />
      </section>

      {/* 2. HERO BANNER */}
      <section className="relative overflow-hidden rounded-3xl mx-3 border border-white/15 bg-[#0e0f18] shadow-2xl shadow-cyan-950/30">
        {/* Background Cyber Ambient Glow & Visual */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 via-[#131124] to-[#1c0d28] opacity-90" />
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-600/25 rounded-full blur-3xl pointer-events-none" />
        
        {/* Cyber grid lines */}
        <div className="absolute inset-0 cyber-grid-blue opacity-30 pointer-events-none" />

        <div className="relative z-10 px-5 pt-8 pb-7 text-center flex flex-col items-center">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-4 text-xs text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-cyber font-semibold tracking-wider text-[10px] text-cyan-300">
              Y2K DROP VOL. 04 • LIVE
            </span>
          </div>

          {/* Hero Main Heading */}
          <h1 className="font-cyber font-black text-2xl sm:text-3xl md:text-4xl text-white tracking-tight uppercase leading-tight">
            FASHION WITHOUT <br />
            <span className="text-chrome text-cyber-glow">LIMITS.</span>
          </h1>

          {/* Subtext */}
          <p className="mt-3 text-xs sm:text-sm text-zinc-300 font-normal max-w-xs sm:max-w-sm leading-relaxed">
            Y2K-inspired streetwear built for the ones who don't follow the rules.
          </p>

          {/* CTAs */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5 w-full max-w-xs">
            <button
              onClick={() => setActiveTab('shop')}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 text-black font-cyber font-black text-xs tracking-wider uppercase transition-all duration-300 hover:brightness-110 active:scale-95 shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 text-black fill-black" />
              SHOP NOW
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className="w-full py-3.5 px-6 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-cyber font-bold text-xs tracking-wider uppercase transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-pink-400" />
              NEW ARRIVALS
            </button>
          </div>

          {/* Quick Cyber Badges */}
          <div className="mt-7 pt-4 border-t border-white/10 w-full grid grid-cols-3 gap-2 text-center text-[10px] text-zinc-400 font-tech">
            <div className="flex flex-col items-center">
              <span className="text-white font-cyber font-bold text-xs">480 GSM</span>
              <span>Ultra Heavyweight</span>
            </div>
            <div className="flex flex-col items-center border-x border-white/10">
              <span className="text-cyan-400 font-cyber font-bold text-xs">CHROME</span>
              <span>Liquid Foil Prints</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-pink-400 font-cyber font-bold text-xs">WORLDWIDE</span>
              <span>Express Vault Delivery</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. STORE INTERACTIVE HUBS (Fit Studio, Drops Radar, Vault Stores) */}
      <section className="px-4 grid grid-cols-3 gap-2">
        <button
          onClick={() => setIsFitStudioOpen(true)}
          className="p-3 rounded-2xl bg-gradient-to-b from-[#161726] to-[#0c0d15] border border-cyan-400/30 hover:border-cyan-400 text-left transition-all duration-300 active:scale-95 shadow-lg flex flex-col justify-between group"
        >
          <div className="w-7 h-7 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 mb-2 group-hover:scale-110 transition-transform">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-cyber font-bold text-[10px] text-white block uppercase">
              FIT STUDIO
            </span>
            <span className="text-[8px] font-tech text-zinc-400 block mt-0.5">
              Outfit Builder
            </span>
          </div>
        </button>

        <button
          onClick={() => setIsDropRadarOpen(true)}
          className="p-3 rounded-2xl bg-gradient-to-b from-[#161726] to-[#0c0d15] border border-pink-500/30 hover:border-pink-400 text-left transition-all duration-300 active:scale-95 shadow-lg flex flex-col justify-between group"
        >
          <div className="w-7 h-7 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400 mb-2 group-hover:scale-110 transition-transform">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-cyber font-bold text-[10px] text-white block uppercase">
              DROPS RADAR
            </span>
            <span className="text-[8px] font-tech text-zinc-400 block mt-0.5">
              Raffles & Alerts
            </span>
          </div>
        </button>

        <button
          onClick={() => setIsStoreLocationsOpen(true)}
          className="p-3 rounded-2xl bg-gradient-to-b from-[#161726] to-[#0c0d15] border border-amber-500/30 hover:border-amber-400 text-left transition-all duration-300 active:scale-95 shadow-lg flex flex-col justify-between group"
        >
          <div className="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-2 group-hover:scale-110 transition-transform">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-cyber font-bold text-[10px] text-white block uppercase">
              FLAGSHIPS
            </span>
            <span className="text-[8px] font-tech text-zinc-400 block mt-0.5">
              Tokyo, London, NYC
            </span>
          </div>
        </button>
      </section>

      {/* 4. CATEGORY SECTION */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-cyber font-bold text-base text-white tracking-wide uppercase flex items-center gap-1.5">
              <span className="text-cyan-400">✦</span> CATEGORIES
            </h2>
            <p className="text-[11px] text-zinc-400 font-tech">Swipe to explore collections</p>
          </div>
          <button
            onClick={() => setActiveTab('shop')}
            className="text-xs font-cyber text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
          >
            VIEW ALL <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Horizontal Swipeable Category Cards */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 -mx-4 px-4 snap-x">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigateToCategory(cat.id as CategoryType)}
              className="snap-start shrink-0 w-36 sm:w-44 group relative rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-400/50 bg-[#12131e] text-left transition-all duration-300 active:scale-95 shadow-lg shadow-black/40"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-black/60">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0f18] via-black/40 to-transparent" />
                
                {/* Item count tag */}
                <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-[9px] font-cyber font-bold text-zinc-300 px-2 py-0.5 rounded-full border border-white/10">
                  {cat.itemCount} PIECES
                </span>

                {/* Category Name & Tagline */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5">
                  <h3 className="font-cyber font-black text-sm text-white tracking-wider group-hover:text-cyan-300 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[9px] text-zinc-400 font-tech truncate mt-0.5">
                    {cat.tagline}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 4.5. BRAND ARCHIVES & MARKETPLACES (Pinterest, SHEIN, Temu, Hellstar, Chrome Hearts, Stüssy, Balenciaga, Rick Owens, etc.) */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded bg-pink-500/10 text-pink-400 font-cyber text-[9px] font-bold tracking-wider border border-pink-500/30">
                MULTI-SOURCE CATALOG
              </span>
            </div>
            <h2 className="font-cyber font-bold text-base text-white tracking-wide uppercase mt-1 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-cyan-400" />
              <span>VIRAL BRANDS & MARKETPLACES</span>
            </h2>
            <p className="text-[11px] text-zinc-400 font-tech">Shop direct aesthetic drops from top platforms & archival houses</p>
          </div>
          <button
            onClick={() => setActiveTab('shop')}
            className="text-xs font-cyber text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors shrink-0"
          >
            VIEW ALL <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Brand horizontal scroller */}
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
          {BRAND_LIST.filter((b) => b.id !== 'all').map((brand) => (
            <button
              key={brand.id}
              onClick={() => navigateToBrand(brand.id)}
              className={`shrink-0 px-3.5 py-2.5 rounded-2xl border ${brand.borderColor} ${brand.color} hover:brightness-125 transition-all duration-200 active:scale-95 text-left flex flex-col justify-between min-w-[130px] group shadow-md shadow-black/30`}
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className={`text-xs font-cyber font-black ${brand.textColor} tracking-wider`}>
                  {brand.badge}
                </span>
                <span className="text-[9px] font-tech opacity-60 text-white">DROP</span>
              </div>
              <span className="text-[10px] text-zinc-400 font-tech line-clamp-1 group-hover:text-zinc-200 transition-colors">
                {brand.description}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 5. FEATURED SECTION: "THE LIMITLESS COLLECTION" */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-cyan-400/10 text-cyan-400 font-cyber text-[9px] font-bold tracking-wider border border-cyan-400/30">
                CORE LINE
              </span>
              <span className="flex items-center text-[10px] text-amber-400 font-tech">
                <Flame className="w-3 h-3 fill-amber-400 mr-1" /> HIGH DEMAND
              </span>
            </div>
            <h2 className="font-cyber font-black text-lg sm:text-xl text-white tracking-tight uppercase mt-1">
              THE LIMITLESS COLLECTION
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('shop')}
            className="text-xs font-cyber text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
          >
            SEE ALL <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* 2-Column Responsive Product Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. EDITORIAL STYLE INSPIRATION & LOOKBOOK BANNER */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-cyan-400 font-cyber text-[10px] font-bold tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              CURATED OUTFITS
            </div>
            <h2 className="font-editorial text-xl sm:text-2xl text-white tracking-tight italic mt-0.5">
              Style <span className="font-cyber not-italic font-black text-white text-lg sm:text-xl">INSPIRATION</span>
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('lookbook')}
            className="text-xs font-cyber text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
          >
            VIEW LOOKBOOK <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Featured Editorial Look Banner */}
        <div 
          onClick={() => setActiveTab('lookbook')}
          className="group relative rounded-3xl overflow-hidden border border-cyan-400/30 bg-[#0e0f18] cursor-pointer shadow-2xl hover:border-cyan-400 transition-all duration-500 active:scale-[0.99]"
        >
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1544022613-e87ce7526edb?auto=format&fit=crop&w=1200&q=85"
              alt="Editorial Look 01"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090a12] via-black/40 to-transparent" />
            <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />

            {/* Editorial Stamp */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-cyan-500 text-black text-[9px] font-cyber font-black tracking-wider uppercase shadow-lg">
                LOOK 01 • TOKYO
              </span>
              <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md border border-white/10 text-zinc-300 text-[8px] font-tech">
                4 PIECE BUNDLE
              </span>
            </div>

            {/* Bottom Content Info */}
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
              <div>
                <span className="text-[10px] font-tech text-cyan-400 tracking-wider uppercase">
                  ISSUE NO. 04 // EDITORIAL ARCHIVE
                </span>
                <h3 className="font-cyber font-black text-base sm:text-lg text-white tracking-wide uppercase group-hover:text-cyan-300 transition-colors">
                  THE CYBER MATRIX DRIFTER
                </h3>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-cyber font-bold text-white bg-white/10 group-hover:bg-cyan-500 group-hover:text-black px-3 py-1.5 rounded-xl border border-white/20 transition-all shrink-0">
                SHOP LOOK <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. COMMUNITY STREET SNAPS ("AS SEEN ON THE STREET") */}
      <CommunityFitsSection />

      {/* 8. NEW ARRIVALS: "JUST DROPPED." */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-pink-400 font-cyber text-[10px] font-bold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" /> VAULT UNLOCKED
            </div>
            <h2 className="font-cyber font-black text-lg sm:text-xl text-white tracking-tight uppercase mt-0.5">
              JUST DROPPED.
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('new')}
            className="text-xs font-cyber text-pink-400 hover:text-pink-300 flex items-center gap-1 transition-colors"
          >
            EXPLORE ALL <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 9. STORE GUARANTEE & ARCHIVE DIRECTIVE */}
      <section className="px-4">
        <div className="p-5 rounded-3xl bg-gradient-to-br from-[#121320] via-[#0d0e17] to-[#170e22] border border-white/15 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h3 className="font-cyber font-bold text-sm text-white uppercase tracking-wider">
              THE LIMITLESS STORE PROMISE
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-zinc-300 font-tech">
            <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white/5">
              <Truck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-syne">Express Global Vault</strong>
                <span>Air-freight shipping with real-time biometric GPS updates.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white/5">
              <RotateCcw className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-syne">30-Day Size Exchange</strong>
                <span>Instant prepaid return labels for rapid fit swaps.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white/5">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-syne">Hand-Numbered Drops</strong>
                <span>Every garment features woven serial authentication tags.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Modals */}
      <FitStudioModal
        isOpen={isFitStudioOpen}
        onClose={() => setIsFitStudioOpen(false)}
      />

      <DropRadarModal
        isOpen={isDropRadarOpen}
        onClose={() => setIsDropRadarOpen(false)}
      />

      <StoreLocationsModal
        isOpen={isStoreLocationsOpen}
        onClose={() => setIsStoreLocationsOpen(false)}
      />
    </div>
  );
};
