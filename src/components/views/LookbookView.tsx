import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ShoppingBag, 
  Eye, 
  Layers, 
  Camera, 
  MapPin, 
  Check, 
  Plus, 
  Share2, 
  Flame, 
  Maximize2, 
  Info,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LOOKBOOK_LOOKS } from '../../data/lookbook';
import { PRODUCTS } from '../../data/products';
import { LookbookLook, Product, LookbookHotspot } from '../../types';

export const LookbookView: React.FC = () => {
  const { openProductModal, addToCart, formatPrice, showToast, setActiveTab } = useApp();
  
  const [activeLookIndex, setActiveLookIndex] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<LookbookHotspot | null>(null);
  const [viewMode, setViewMode] = useState<'spread' | 'grid'>('spread');
  const [isAddingBundle, setIsAddingBundle] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);

  const currentLook: LookbookLook = LOOKBOOK_LOOKS[activeLookIndex] || LOOKBOOK_LOOKS[0];

  // Resolve full product objects for this look
  const lookProducts: Product[] = currentLook.productIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  // Initialize selected products when look changes
  React.useEffect(() => {
    setSelectedProductIds(currentLook.productIds);
    setActiveHotspot(null);
  }, [activeLookIndex, currentLook]);

  const activeHotspotProduct = activeHotspot
    ? PRODUCTS.find((p) => p.id === activeHotspot.productId)
    : null;

  // Calculate bundle total and discount
  const fullLookTotal = lookProducts.reduce((sum, p) => sum + p.price, 0);
  const bundleDiscountPercent = 15; // 15% discount for full look
  const discountedBundleTotal = fullLookTotal * (1 - bundleDiscountPercent / 100);

  const handleNextLook = () => {
    setActiveLookIndex((prev) => (prev + 1) % LOOKBOOK_LOOKS.length);
  };

  const handlePrevLook = () => {
    setActiveLookIndex((prev) => (prev - 1 + LOOKBOOK_LOOKS.length) % LOOKBOOK_LOOKS.length);
  };

  const handleToggleProductInBundle = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddBundleToCart = () => {
    setIsAddingBundle(true);
    
    // Add all selected products in the bundle to cart
    const selectedItems = lookProducts.filter((p) => selectedProductIds.includes(p.id));
    selectedItems.forEach((product) => {
      addToCart(product, product.sizes[0] || 'M', product.colors[0], 1);
    });

    showToast({
      title: 'FULL LOOK BUNDLED',
      description: `Added ${selectedItems.length} curated pieces to your cyber cart`,
      type: 'cart',
      image: currentLook.heroImage,
    });

    setTimeout(() => {
      setIsAddingBundle(false);
    }, 1200);
  };

  const handleShareLook = () => {
    setCopiedLink(true);
    showToast({
      title: 'EDITORIAL LOOK LINK COPIED',
      description: `${currentLook.title} ready to share`,
      type: 'info',
    });
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="pb-16 space-y-6">
      {/* 1. HIGH-FASHION EDITORIAL MASTHEAD */}
      <div className="px-4 pt-3">
        <div className="border-b border-white/15 pb-3">
          <div className="flex items-center justify-between text-[10px] font-tech text-zinc-400 tracking-widest uppercase">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              EDITORIAL ARCHIVE
            </span>
            <span>VOL. 04 // 2026</span>
          </div>

          <div className="flex items-end justify-between mt-2">
            <div>
              <h1 className="font-editorial text-2xl sm:text-3xl text-white tracking-tight italic">
                Style <span className="font-cyber not-italic font-black text-chrome tracking-normal text-xl sm:text-2xl">INSPIRATION</span>
              </h1>
              <p className="text-[11px] text-zinc-400 font-tech mt-0.5">
                Curated streetwear looks and styling directives
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setViewMode('spread')}
                className={`px-2.5 py-1 text-[10px] font-cyber font-bold rounded-lg transition-all ${
                  viewMode === 'spread'
                    ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                SPREAD
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-2.5 py-1 text-[10px] font-cyber font-bold rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                GRID
              </button>
            </div>
          </div>
        </div>

        {/* Look Switcher Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-3 -mx-4 px-4">
          {LOOKBOOK_LOOKS.map((look, idx) => {
            const isActive = idx === activeLookIndex;
            return (
              <button
                key={look.id}
                onClick={() => setActiveLookIndex(idx)}
                className={`shrink-0 px-3.5 py-2 rounded-xl text-left border transition-all duration-300 active:scale-95 flex items-center gap-2.5 ${
                  isActive
                    ? 'bg-white/15 border-cyan-400 text-white shadow-lg shadow-cyan-500/10'
                    : 'bg-[#10111a] border-white/10 text-zinc-400 hover:text-zinc-200 hover:border-white/20'
                }`}
              >
                <span className="font-cyber font-black text-xs text-cyan-400">
                  {look.lookNumber}
                </span>
                <div className="flex flex-col">
                  <span className="font-syne font-bold text-xs leading-none text-white">
                    {look.title.split(' ')[1] || look.title}
                  </span>
                  <span className="text-[9px] text-zinc-500 font-tech">
                    {look.productIds.length} PIECES
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {viewMode === 'grid' ? (
        /* GRID MODE: ALL LOOKS OVERVIEW */
        <div className="px-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {LOOKBOOK_LOOKS.map((look, index) => (
            <div
              key={look.id}
              onClick={() => {
                setActiveLookIndex(index);
                setViewMode('spread');
              }}
              className="group relative rounded-2xl overflow-hidden border border-white/15 bg-[#10111a] cursor-pointer hover:border-cyan-400/50 transition-all duration-300 shadow-xl"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-black">
                <img
                  src={look.heroImage}
                  alt={look.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b12] via-black/30 to-transparent opacity-90 group-hover:opacity-75 transition-opacity" />

                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="bg-cyan-500 text-black text-[10px] font-cyber font-black px-2 py-0.5 rounded shadow-md">
                    LOOK {look.lookNumber}
                  </span>
                  <span className="bg-black/60 backdrop-blur-md text-zinc-300 text-[9px] font-tech px-2 py-0.5 rounded border border-white/10">
                    {look.season}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="font-cyber font-black text-base text-white tracking-wide uppercase group-hover:text-cyan-300 transition-colors">
                    {look.title}
                  </h3>
                  <p className="text-[11px] text-zinc-300 font-tech line-clamp-1 mt-0.5">
                    {look.subtitle}
                  </p>
                  
                  <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/10 text-[10px] text-cyan-400 font-tech">
                    <span>{look.productIds.length} Linked Garments</span>
                    <span className="flex items-center gap-1 text-white font-cyber font-bold group-hover:translate-x-1 transition-transform">
                      VIEW SPREAD <ArrowRight className="w-3 h-3 text-cyan-400" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* SPREAD MODE: INTERACTIVE EDITORIAL LOOKBOOK */
        <div className="space-y-6">
          {/* Main Hero Editorial Image with Hotspots */}
          <div className="px-3">
            <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-[#090a10] shadow-2xl shadow-cyan-950/40">
              {/* Image Container */}
              <div className="relative aspect-[3/4] sm:aspect-[4/5] w-full overflow-hidden">
                <img
                  src={currentLook.heroImage}
                  alt={currentLook.title}
                  className="w-full h-full object-cover object-center"
                />

                {/* Cyber ambient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b12] via-transparent to-black/30 pointer-events-none" />
                <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />

                {/* Top Corner Metadata Badges */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md border border-white/15 text-[10px] font-cyber font-bold text-white shadow-lg">
                    <span className="text-cyan-400">✦</span> LOOK {currentLook.lookNumber}
                  </div>
                  <span className="text-[9px] font-tech text-zinc-300 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
                    {currentLook.season}
                  </span>
                </div>

                {/* Top Right Actions */}
                <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                  <button
                    onClick={handleShareLook}
                    className="w-8 h-8 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-zinc-300 hover:text-white flex items-center justify-center transition-all active:scale-90"
                    aria-label="Share Look"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* INTERACTIVE HOTSPOTS */}
                {currentLook.hotspots.map((hs) => {
                  const isSelected = activeHotspot?.id === hs.id;
                  const hotspotProduct = PRODUCTS.find((p) => p.id === hs.productId);

                  return (
                    <div
                      key={hs.id}
                      style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveHotspot(isSelected ? null : hs);
                        }}
                        className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 shadow-xl ${
                          isSelected
                            ? 'bg-cyan-400 text-black scale-110 ring-4 ring-cyan-400/40 shadow-cyan-400/60'
                            : 'bg-black/80 backdrop-blur-md border border-white/40 text-white hover:border-cyan-400 hover:scale-105'
                        }`}
                        aria-label={`Inspect ${hs.label}`}
                      >
                        {/* Radar Pulse Effect */}
                        {!isSelected && (
                          <span className="absolute inset-0 rounded-full bg-cyan-400/40 animate-ping" />
                        )}
                        <Plus className={`w-4 h-4 transition-transform duration-300 ${isSelected ? 'rotate-45' : ''}`} />
                      </button>

                      {/* Tooltip Tag */}
                      <span
                        className={`absolute top-full left-1/2 -translate-x-1/2 mt-1.5 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-[9px] font-cyber font-bold whitespace-nowrap border pointer-events-none transition-all duration-200 ${
                          isSelected
                            ? 'border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/30 opacity-100'
                            : 'border-white/10 text-zinc-300 opacity-90'
                        }`}
                      >
                        {hs.label}
                      </span>
                    </div>
                  );
                })}

                {/* Floating Hotspot Product Preview Card Overlay */}
                {activeHotspot && activeHotspotProduct && (
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-3 left-3 right-3 z-30 bg-[#0d0e17]/95 backdrop-blur-2xl border border-cyan-400/50 rounded-2xl p-3.5 shadow-2xl shadow-cyan-950/80 animate-fadeIn"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="text-[9px] font-tech text-cyan-400 uppercase tracking-widest font-bold">
                          {activeHotspot.itemType} • HOTSPOT FOCUS
                        </span>
                      </div>
                      <button
                        onClick={() => setActiveHotspot(null)}
                        className="text-zinc-400 hover:text-white text-xs px-1"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="flex gap-3">
                      <img
                        src={activeHotspotProduct.images[0]}
                        alt={activeHotspotProduct.name}
                        className="w-16 h-18 rounded-xl object-cover border border-white/10 shrink-0"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h4 className="font-syne font-bold text-sm text-white truncate">
                            {activeHotspotProduct.name}
                          </h4>
                          <span className="font-cyber font-black text-sm text-cyan-300 mt-0.5 block">
                            {formatPrice(activeHotspotProduct.price)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => openProductModal(activeHotspotProduct)}
                            className="flex-1 py-1.5 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-cyber font-bold text-[10px] tracking-wider transition-all flex items-center justify-center gap-1"
                          >
                            <Eye className="w-3 h-3 text-cyan-400" />
                            INSPECT
                          </button>
                          <button
                            onClick={() => {
                              addToCart(
                                activeHotspotProduct,
                                activeHotspotProduct.sizes[0] || 'M',
                                activeHotspotProduct.colors[0],
                                1
                              );
                              setActiveHotspot(null);
                            }}
                            className="flex-1 py-1.5 px-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-cyber font-black text-[10px] tracking-wider transition-all flex items-center justify-center gap-1 shadow-md shadow-cyan-500/20"
                          >
                            <Plus className="w-3 h-3" />
                            ADD PIECE
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom Overlay Title & Subtitle */}
                <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none">
                  <span className="text-[10px] font-tech text-cyan-400 tracking-widest uppercase">
                    {currentLook.subtitle}
                  </span>
                  <h2 className="font-cyber font-black text-xl sm:text-2xl text-white tracking-tight uppercase leading-tight drop-shadow-md">
                    {currentLook.title}
                  </h2>
                </div>
              </div>

              {/* Navigation Arrows for Looks */}
              <div className="p-3 bg-[#0d0e17] border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={handlePrevLook}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 font-cyber text-xs font-bold flex items-center gap-1 transition-all active:scale-95 border border-white/10"
                >
                  <ChevronLeft className="w-4 h-4 text-cyan-400" /> PREV LOOK
                </button>

                <div className="flex items-center gap-1.5">
                  {LOOKBOOK_LOOKS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveLookIndex(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === activeLookIndex
                          ? 'w-6 bg-cyan-400'
                          : 'w-1.5 bg-white/20 hover:bg-white/40'
                      }`}
                      aria-label={`Go to look ${i + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNextLook}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 font-cyber text-xs font-bold flex items-center gap-1 transition-all active:scale-95 border border-white/10"
                >
                  NEXT LOOK <ChevronRight className="w-4 h-4 text-cyan-400" />
                </button>
              </div>
            </div>
          </div>

          {/* 2. EDITORIAL STORY & METADATA SECTION */}
          <div className="mx-3 p-5 rounded-3xl bg-gradient-to-br from-[#121320] via-[#0d0e17] to-[#170e22] border border-white/15 space-y-4 shadow-xl">
            {/* Metadata tags */}
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-tech text-zinc-400">
              <span className="flex items-center gap-1 text-cyan-300 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-500/20">
                <MapPin className="w-3 h-3 text-cyan-400" /> {currentLook.location}
              </span>
              <span className="flex items-center gap-1 text-pink-300 bg-pink-950/50 px-2 py-0.5 rounded border border-pink-500/20">
                <Camera className="w-3 h-3 text-pink-400" /> Photo: {currentLook.photographer}
              </span>
            </div>

            {/* Editorial Story Text */}
            <div className="space-y-2">
              <h3 className="font-editorial text-xl text-white italic">
                The Editorial Narrative
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 font-normal leading-relaxed">
                {currentLook.editorialStory}
              </p>
            </div>

            {/* Pullquote */}
            <blockquote className="p-3 rounded-2xl bg-white/5 border-l-2 border-cyan-400 text-xs italic text-cyan-200 font-editorial">
              "{currentLook.curatorQuote}"
              <span className="block mt-1 font-tech not-italic text-[10px] text-zinc-400">
                — LIMITLESS Studio Tokyo Design Lead
              </span>
            </blockquote>

            {/* Styling Directives */}
            <div className="pt-2 border-t border-white/10 space-y-2">
              <h4 className="font-cyber font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-pink-400" /> STYLING DIRECTIVES
              </h4>
              <ul className="space-y-1.5 text-xs text-zinc-300 font-tech">
                {currentLook.stylingTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold font-cyber text-[10px] mt-0.5">0{idx + 1}</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 3. DETAIL PHOTOGRAPHY GALLERY */}
          {currentLook.detailImages.length > 0 && (
            <div className="px-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="font-cyber font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-cyan-400" /> DETAIL PHOTOGRAPHY
                </h3>
                <span className="text-[10px] font-tech text-zinc-500">Close-up textures</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {currentLook.detailImages.map((img, i) => (
                  <div
                    key={i}
                    className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-black/60 group cursor-pointer"
                  >
                    <img
                      src={img}
                      alt={`Detail shot ${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span className="absolute bottom-1.5 left-1.5 text-[8px] font-cyber text-zinc-300 bg-black/60 px-1 rounded">
                      FIG. {i + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. SHOP THE LOOK: COMPLETE OUTFIT BREAKDOWN & BUNDLE */}
          <div className="mx-3 p-4 sm:p-5 rounded-3xl bg-[#0c0d16] border border-cyan-400/30 space-y-4 shadow-2xl shadow-cyan-950/40 relative overflow-hidden">
            {/* Ambient Shimmer Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <div className="inline-flex items-center gap-1.5 text-cyan-400 font-cyber text-[9px] font-bold tracking-widest uppercase">
                  <Flame className="w-3 h-3 fill-cyan-400" /> BUNDLE & SAVE 15%
                </div>
                <h3 className="font-cyber font-black text-base text-white tracking-tight uppercase mt-0.5">
                  SHOP THIS LOOK
                </h3>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-zinc-400 font-tech block">Bundle Value</span>
                <div className="flex items-baseline gap-1.5 justify-end">
                  <span className="font-cyber font-black text-base text-cyan-300">
                    {formatPrice(discountedBundleTotal)}
                  </span>
                  <span className="text-xs text-zinc-500 line-through font-tech">
                    {formatPrice(fullLookTotal)}
                  </span>
                </div>
              </div>
            </div>

            {/* Individual Garment Breakdown Cards */}
            <div className="space-y-2.5">
              {lookProducts.map((product) => {
                const isSelected = selectedProductIds.includes(product.id);
                return (
                  <div
                    key={product.id}
                    onClick={() => handleToggleProductInBundle(product.id)}
                    className={`p-2.5 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-white/10 border-cyan-400/50 shadow-md shadow-cyan-950/30'
                        : 'bg-black/40 border-white/5 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Checkbox indicator */}
                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-all ${
                          isSelected
                            ? 'bg-cyan-500 border-cyan-400 text-black'
                            : 'border-white/20 bg-black/40'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>

                      {/* Thumbnail */}
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-12 h-14 object-cover rounded-xl border border-white/10 shrink-0"
                      />

                      {/* Info */}
                      <div className="min-w-0">
                        <span className="text-[9px] font-tech text-cyan-400 uppercase tracking-wider block">
                          {product.category}
                        </span>
                        <h4 className="font-syne font-bold text-xs text-white truncate">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-cyber font-bold text-xs text-zinc-200">
                            {formatPrice(product.price)}
                          </span>
                          <span className="text-[9px] text-zinc-500 font-tech">
                            Size: {product.sizes[0] || 'M'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openProductModal(product);
                      }}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white transition-colors shrink-0"
                      title="Inspect Product"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Add Bundle CTA Button */}
            <div className="pt-2">
              <button
                onClick={handleAddBundleToCart}
                disabled={selectedProductIds.length === 0}
                className={`w-full py-4 px-6 rounded-2xl font-cyber font-black text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-xl ${
                  isAddingBundle
                    ? 'bg-emerald-500 text-black shadow-emerald-500/40'
                    : 'bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 text-black hover:brightness-110 active:scale-95 shadow-cyan-500/30'
                }`}
              >
                {isAddingBundle ? (
                  <>
                    <Check className="w-4 h-4 text-black" />
                    ADDED {selectedProductIds.length} PIECES TO CART!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-black fill-black" />
                    ADD FULL LOOK TO CART ({selectedProductIds.length} PIECES • {formatPrice(discountedBundleTotal)})
                  </>
                )}
              </button>
              <p className="text-center text-[10px] text-zinc-400 font-tech mt-2">
                ⚡ Complimentary Express Vault Shipping Included
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
