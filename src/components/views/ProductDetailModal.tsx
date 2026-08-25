import React, { useState, useEffect } from 'react';
import {
  X,
  Heart,
  Star,
  ShoppingBag,
  Zap,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Minus,
  Plus,
  Ruler,
  Eye,
  Flame,
  Check,
  Layers,
  ThumbsUp,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PRODUCTS } from '../../data/products';
import { ProductCard } from '../ProductCard';
import { ProductColor, Product } from '../../types';
import { FitQuizModal } from '../FitQuizModal';
import { StockBadge } from '../StockBadge';
import { getProductStockInfo } from '../../utils/stock';

interface ProductDetailModalProps {
  onClose?: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = () => {
  const {
    selectedProduct,
    closeProductModal,
    addToCart,
    isWishlisted,
    toggleWishlist,
    formatPrice,
    setIsCheckoutOpen,
    openProductModal,
    showToast,
  } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTabSection, setActiveTabSection] = useState<'details' | 'shipping' | 'fit' | 'reviews'>('details');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isFitQuizOpen, setIsFitQuizOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Synchronize initial selections when product changes
  useEffect(() => {
    if (selectedProduct) {
      setSelectedSize(selectedProduct.sizes[0] || 'M');
      setSelectedColor(selectedProduct.colors[0] || null);
      setActiveImageIndex(0);
      setQuantity(1);
    }
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  const currentColor: ProductColor = selectedColor || selectedProduct.colors[0] || { name: 'Standard', hex: '#ffffff' };
  const favorited = isWishlisted(selectedProduct.id);
  const stockInfo = getProductStockInfo(selectedProduct, selectedSize);

  // Complementary pieces for "Complete The Fit"
  const complementaryProducts: Product[] = PRODUCTS.filter(
    (p) => p.id !== selectedProduct.id && (p.category !== selectedProduct.category)
  ).slice(0, 3);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(selectedProduct, selectedSize, currentColor, quantity);
    setTimeout(() => setIsAdding(false), 800);
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, selectedSize, currentColor, quantity);
    closeProductModal();
    setIsCheckoutOpen(true);
  };

  // Mock customer reviews tailored to clothing store standards
  const mockReviews = [
    {
      id: 'rev-1',
      author: 'Kaito S.',
      verified: true,
      rating: 5,
      fitReview: 'True to Size / Perfectly Boxy',
      date: '2 days ago',
      text: 'The weight on this is absurd. Thick 480 GSM fabric that holds its structure. Sleeves drape just over the knuckles.',
      sizePurchased: 'Size L (6\'0" / 175 lbs)',
    },
    {
      id: 'rev-2',
      author: 'Marcus V.',
      verified: true,
      rating: 5,
      fitReview: 'Slightly Oversized',
      date: '1 week ago',
      text: 'Foil print does not crack or peel after multiple cold washes. High-end luxury craftsmanship without the $600 designer markup.',
      sizePurchased: 'Size M (5\'10" / 160 lbs)',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-2xl animate-fadeIn flex flex-col justify-between">
      {/* Top Floating App Bar */}
      <div className="sticky top-0 z-20 bg-[#08080d]/95 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <button
          onClick={closeProductModal}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors active:scale-95 flex items-center gap-1 text-xs font-cyber"
        >
          <X className="w-4 h-4" />
          <span>CLOSE</span>
        </button>

        <span className="font-cyber font-bold text-xs uppercase tracking-widest text-zinc-400 truncate max-w-[180px]">
          {selectedProduct.category} // {selectedProduct.slug}
        </span>

        <button
          onClick={() => toggleWishlist(selectedProduct.id)}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-pink-400 transition-colors active:scale-95"
          aria-label="Wishlist"
        >
          <Heart
            className={`w-4 h-4 ${
              favorited ? 'text-pink-500 fill-pink-500' : 'text-zinc-300'
            }`}
          />
        </button>
      </div>

      <div className="max-w-xl mx-auto w-full px-4 py-4 space-y-6 pb-32">
        {/* 1. IMAGE CAROUSEL / GALLERY */}
        <div className="relative rounded-3xl overflow-hidden bg-[#0e0f17] border border-white/10 aspect-[4/5] shadow-2xl">
          <img
            src={selectedProduct.images[activeImageIndex] || selectedProduct.images[0]}
            alt={selectedProduct.name}
            className="w-full h-full object-cover transition-all duration-300"
          />

          {/* Ambient Cyber Glare */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* Badges on top */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {selectedProduct.isNew && (
              <span className="bg-pink-500 text-white text-[10px] font-cyber font-black tracking-wider px-2.5 py-1 rounded-md shadow-lg shadow-pink-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> JUST DROPPED
              </span>
            )}
            {selectedProduct.stockStatus === 'low_stock' && (
              <span className="bg-amber-500 text-black text-[10px] font-cyber font-black tracking-wider px-2.5 py-1 rounded-md shadow-lg">
                ONLY {selectedProduct.stockCount} LEFT IN ARCHIVE
              </span>
            )}
            {selectedProduct.gsm && (
              <span className="bg-black/80 backdrop-blur-md text-cyan-300 text-[10px] font-tech font-bold px-2.5 py-1 rounded-md border border-cyan-400/30">
                {selectedProduct.gsm}
              </span>
            )}
          </div>

          {/* Live Shopper Demand Tag */}
          <div className="absolute top-3 right-3 z-10 bg-black/75 backdrop-blur-md border border-white/15 px-2.5 py-1 rounded-md text-[9px] font-tech text-amber-400 flex items-center gap-1.5 shadow-md">
            <Flame className="w-3 h-3 fill-amber-400 animate-pulse" />
            <span>18 shoppers viewing</span>
          </div>

          {/* Image thumbnails indicator if multiple images */}
          {selectedProduct.images.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2 z-10">
              {selectedProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-12 h-14 rounded-lg overflow-hidden border-2 transition-all shadow-md ${
                    activeImageIndex === idx
                      ? 'border-cyan-400 scale-105 shadow-cyan-500/40'
                      : 'border-white/30 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2. PRODUCT HEADER INFO */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {selectedProduct.sourceBadge ? (
                <span className={`text-[10px] font-cyber font-black tracking-wider px-2.5 py-1 rounded-md border ${
                  selectedProduct.brandSource === 'pinterest'
                    ? 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                    : selectedProduct.brandSource === 'shein'
                    ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                    : selectedProduct.brandSource === 'temu'
                    ? 'bg-orange-950/80 text-orange-300 border-orange-500/40'
                    : selectedProduct.brandSource === 'hellstar'
                    ? 'bg-red-950/80 text-red-300 border-red-500/40'
                    : selectedProduct.brandSource === 'chrome_hearts'
                    ? 'bg-zinc-900/90 text-zinc-200 border-zinc-500/50'
                    : selectedProduct.brandSource === 'stussy'
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                    : selectedProduct.brandSource === 'balenciaga'
                    ? 'bg-purple-950/80 text-purple-300 border-purple-500/40'
                    : selectedProduct.brandSource === 'rick_owens'
                    ? 'bg-stone-900/90 text-stone-200 border-stone-600'
                    : selectedProduct.brandSource === 'corteiz'
                    ? 'bg-lime-950/80 text-lime-300 border-lime-500/40'
                    : selectedProduct.brandSource === 'sp5der'
                    ? 'bg-fuchsia-950/80 text-fuchsia-300 border-fuchsia-500/40'
                    : 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40'
                }`}>
                  {selectedProduct.sourceBadge}
                </span>
              ) : null}
              <span className="text-xs font-cyber text-cyan-400 font-bold uppercase tracking-wider">
                {selectedProduct.brand || 'LIMITLESS ARCHIVE'} • {selectedProduct.category}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-amber-400 font-tech">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="font-bold">{selectedProduct.rating}</span>
              <span className="text-zinc-500">({selectedProduct.reviewCount} reviews)</span>
            </div>
          </div>

          <h1 className="font-syne font-black text-2xl sm:text-3xl text-white tracking-tight leading-tight">
            {selectedProduct.name}
          </h1>

          {/* Price Box */}
          <div className="flex items-baseline gap-3">
            <span className="font-cyber font-black text-2xl text-white">
              {formatPrice(selectedProduct.price)}
            </span>
            {selectedProduct.originalPrice && (
              <>
                <span className="text-base text-zinc-500 line-through font-tech">
                  {formatPrice(selectedProduct.originalPrice)}
                </span>
                <span className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-cyber font-bold">
                  SAVE {formatPrice(selectedProduct.originalPrice - selectedProduct.price)}
                </span>
              </>
            )}
          </div>

          {/* Dynamic Stock Availability & Urgency Banner */}
          <StockBadge
            product={selectedProduct}
            selectedSize={selectedSize}
            variant="detail-banner"
            className="my-2"
          />

          {/* Real-time Vault Inventory Scarcity Progress Meter */}
          <StockBadge
            product={selectedProduct}
            selectedSize={selectedSize}
            variant="scarcity-meter"
            className="my-2"
          />

          {/* Short description */}
          <p className="text-xs sm:text-sm text-zinc-300 font-normal leading-relaxed pt-1">
            {selectedProduct.description}
          </p>

          {/* Model Measurements Callout Banner (SSENSE / Zara Style) */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs text-zinc-300 font-tech">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                <strong>Model is 6'1" (185 cm)</strong> wearing size <strong>L</strong> for boxy drape.
              </span>
            </div>
            <button
              onClick={() => setIsFitQuizOpen(true)}
              className="text-cyan-400 hover:text-cyan-300 font-cyber font-bold text-[10px] underline whitespace-nowrap ml-2"
            >
              FIND MY SIZE
            </button>
          </div>
        </div>

        {/* 3. COLOR SELECTOR */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-cyber font-bold text-white uppercase">COLOR FINISH</span>
            <span className="text-xs font-tech text-cyan-300 font-medium">{currentColor.name}</span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {selectedProduct.colors.map((color, i) => {
              const isSelected = currentColor.name === color.name;
              return (
                <button
                  key={i}
                  onClick={() => setSelectedColor(color)}
                  className={`group px-3 py-2 rounded-xl border flex items-center gap-2 transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-white/10 border-cyan-400 shadow-md shadow-cyan-500/20'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-inner"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span
                    className={`text-xs font-tech font-semibold ${
                      isSelected ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'
                    }`}
                  >
                    {color.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. SIZE SELECTOR WITH FIT ADVISOR */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-cyber font-bold text-white uppercase">SELECT SIZE</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFitQuizOpen(true)}
                className="text-xs font-tech text-pink-400 hover:text-pink-300 flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" /> Fit Quiz
              </button>
              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-xs font-tech text-cyan-400 hover:text-cyan-300 flex items-center gap-1 underline"
              >
                <Ruler className="w-3 h-3" /> Size Guide
              </button>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {selectedProduct.sizes.map((sz) => {
              const isSelected = selectedSize === sz;
              const sizeStock = stockInfo.sizeStockMap[sz];
              const isSizeLow = sizeStock && sizeStock.status === 'low_stock';
              return (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`py-2.5 px-1 rounded-xl font-cyber text-xs font-bold transition-all active:scale-95 flex flex-col items-center justify-center gap-0.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-lg shadow-cyan-500/30'
                      : 'bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/25'
                  }`}
                >
                  <span className="leading-tight">{sz}</span>
                  {sizeStock && (
                    <span
                      className={`text-[8px] font-tech font-bold uppercase ${
                        isSelected
                          ? 'text-black/80'
                          : isSizeLow
                          ? 'text-amber-400'
                          : 'text-zinc-400'
                      }`}
                    >
                      {sizeStock.count === 1
                        ? '1 LEFT'
                        : isSizeLow
                        ? `${sizeStock.count} LEFT`
                        : 'IN STOCK'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. QUANTITY SELECTOR */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <span className="text-xs font-cyber font-bold text-white uppercase">QUANTITY</span>
          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-10 text-center font-cyber font-bold text-sm text-white">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => Math.min(10, q + 1))}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 6. INFORMATION TABS (Fabric Details, Fit Distribution, Shipping, Reviews) */}
        <div className="pt-2 border-t border-white/10 space-y-3">
          <div className="flex border-b border-white/10 gap-3 sm:gap-4 text-xs font-cyber font-bold overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTabSection('details')}
              className={`pb-2 whitespace-nowrap transition-colors relative ${
                activeTabSection === 'details' ? 'text-cyan-400' : 'text-zinc-400 hover:text-white'
              }`}
            >
              SPECIFICATIONS
              {activeTabSection === 'details' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />
              )}
            </button>
            <button
              onClick={() => setActiveTabSection('fit')}
              className={`pb-2 whitespace-nowrap transition-colors relative ${
                activeTabSection === 'fit' ? 'text-cyan-400' : 'text-zinc-400 hover:text-white'
              }`}
            >
              FIT RATING
              {activeTabSection === 'fit' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />
              )}
            </button>
            <button
              onClick={() => setActiveTabSection('reviews')}
              className={`pb-2 whitespace-nowrap transition-colors relative ${
                activeTabSection === 'reviews' ? 'text-cyan-400' : 'text-zinc-400 hover:text-white'
              }`}
            >
              REVIEWS ({selectedProduct.reviewCount})
              {activeTabSection === 'reviews' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />
              )}
            </button>
            <button
              onClick={() => setActiveTabSection('shipping')}
              className={`pb-2 whitespace-nowrap transition-colors relative ${
                activeTabSection === 'shipping' ? 'text-cyan-400' : 'text-zinc-400 hover:text-white'
              }`}
            >
              SHIPPING & VAULT
              {activeTabSection === 'shipping' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />
              )}
            </button>
          </div>

          {/* Tab Content 1: Details */}
          {activeTabSection === 'details' && (
            <div className="space-y-3 text-xs text-zinc-300 font-tech">
              <ul className="space-y-1.5 list-disc list-inside">
                {selectedProduct.details.map((dt, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {dt}
                  </li>
                ))}
              </ul>
              <div className="pt-2 text-[11px] text-zinc-400 border-t border-white/5">
                ✦ Pre-shrunk cotton yarn to prevent shrinkage on cold machine wash.
              </div>
            </div>
          )}

          {/* Tab Content 2: Fit Rating Gauge */}
          {activeTabSection === 'fit' && (
            <div className="space-y-3 text-xs text-zinc-300 font-tech">
              <div>
                <span className="font-cyber font-bold text-white uppercase text-xs block mb-1">
                  FIT PROFILE: {selectedProduct.fit}
                </span>
                <p className="text-zinc-400">
                  Custom engineered pattern with dropped shoulder seams and relaxed body drape.
                </p>
              </div>

              {/* Fit Distribution Bar */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[10px] text-zinc-400">
                  <span>Runs Small (5%)</span>
                  <span className="text-cyan-300 font-bold">True to Size (82%)</span>
                  <span>Runs Large (13%)</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden flex">
                  <div className="h-full bg-zinc-600" style={{ width: '5%' }} />
                  <div className="h-full bg-cyan-400" style={{ width: '82%' }} />
                  <div className="h-full bg-zinc-600" style={{ width: '13%' }} />
                </div>
              </div>
            </div>
          )}

          {/* Tab Content 3: Customer Reviews */}
          {activeTabSection === 'reviews' && (
            <div className="space-y-3">
              {mockReviews.map((rev) => (
                <div key={rev.id} className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-cyber font-bold text-xs text-white">{rev.author}</span>
                      {rev.verified && (
                        <span className="text-[9px] text-emerald-400 font-tech bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          ✓ Verified Buyer
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-zinc-500 font-tech">{rev.date}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-amber-400">
                    <div className="flex">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] text-cyan-300 font-tech">{rev.fitReview}</span>
                  </div>

                  <p className="text-xs text-zinc-300 font-normal">{rev.text}</p>
                  <span className="text-[9px] text-zinc-500 font-tech block">{rev.sizePurchased}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tab Content 4: Shipping */}
          {activeTabSection === 'shipping' && (
            <div className="space-y-2 text-xs text-zinc-300 font-tech">
              <div className="flex items-center gap-2 text-zinc-200">
                <Truck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Express Worldwide Shipping with DHL / FedEx tracking.</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-200">
                <RotateCcw className="w-4 h-4 text-pink-400 shrink-0" />
                <span>30-Day Hassle-Free Returns & Vault Size Exchanges.</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-200">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>100% Guaranteed Authenticity with RFID Security Tag.</span>
              </div>
            </div>
          )}
        </div>

        {/* 7. COMPLETE THE FIT / PAIRS WELL WITH */}
        {complementaryProducts.length > 0 && (
          <div className="pt-3 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-cyber font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" /> COMPLETE THE FIT
              </span>
              <span className="text-[10px] text-zinc-500 font-tech">Curated pairings</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {complementaryProducts.map((comp) => (
                <div
                  key={comp.id}
                  onClick={() => openProductModal(comp)}
                  className="p-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-all group"
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-black/60 mb-1.5">
                    <img
                      src={comp.images[0]}
                      alt={comp.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h5 className="font-syne font-bold text-[10px] text-white truncate">
                    {comp.name}
                  </h5>
                  <span className="font-cyber font-bold text-[10px] text-cyan-300 block">
                    {formatPrice(comp.price)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* STICKY BOTTOM ADD TO BAG BAR */}
      <div className="sticky bottom-0 z-30 bg-[#0c0d16]/95 backdrop-blur-2xl border-t border-white/10 px-4 py-3 pb-safe">
        <div className="max-w-xl mx-auto flex items-center gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-[9px] text-zinc-400 font-tech">
              <span>Size {selectedSize} • {currentColor.name}</span>
              {stockInfo.isLowStock ? (
                <span className="text-amber-400 font-bold flex items-center gap-0.5">
                  <Zap className="w-2.5 h-2.5 fill-amber-400" /> Only {stockInfo.count} left
                </span>
              ) : (
                <span className="text-cyan-400 flex items-center gap-0.5">
                  ● In Stock
                </span>
              )}
            </div>
            <span className="font-cyber font-black text-base text-white">
              {formatPrice(selectedProduct.price * quantity)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 text-black font-cyber font-black text-xs tracking-wider uppercase transition-all duration-300 hover:brightness-110 active:scale-95 shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2"
          >
            {isAdding ? (
              <>
                <Check className="w-4 h-4 text-black" />
                ADDED TO BAG!
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-black fill-black" />
                ADD TO BAG
              </>
            )}
          </button>
        </div>
      </div>

      {/* Interactive Fit Quiz Modal */}
      <FitQuizModal
        isOpen={isFitQuizOpen}
        onClose={() => setIsFitQuizOpen(false)}
        product={selectedProduct}
        onSelectRecommendedSize={(sz) => setSelectedSize(sz)}
      />

      {/* Size Guide Simple Modal */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#11121d] border border-white/20 rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-cyber font-bold text-sm text-white">GARMENT SIZING MATRIX</h3>
              <button
                onClick={() => setIsSizeGuideOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="text-xs text-zinc-300 font-tech space-y-2">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/15 text-cyan-300 text-[10px] font-cyber">
                    <th className="py-1">SIZE</th>
                    <th className="py-1">CHEST</th>
                    <th className="py-1">LENGTH</th>
                    <th className="py-1">SLEEVE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="py-1.5 font-bold text-white">S</td>
                    <td className="py-1.5">44"</td>
                    <td className="py-1.5">27"</td>
                    <td className="py-1.5">34"</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 font-bold text-white">M</td>
                    <td className="py-1.5">48"</td>
                    <td className="py-1.5">28"</td>
                    <td className="py-1.5">35"</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 font-bold text-white">L</td>
                    <td className="py-1.5">52"</td>
                    <td className="py-1.5">29"</td>
                    <td className="py-1.5">36"</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 font-bold text-white">XL</td>
                    <td className="py-1.5">56"</td>
                    <td className="py-1.5">30"</td>
                    <td className="py-1.5">37"</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-cyber text-xs font-bold transition-colors"
            >
              GOT IT
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
