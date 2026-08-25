import React, { useState } from 'react';
import { Heart, Plus, Star, Sparkles, Check, Zap } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { StockBadge } from './StockBadge';
import { getProductStockInfo } from '../utils/stock';

interface ProductCardProps {
  product: Product;
  variant?: 'grid' | 'horizontal' | 'compact' | 'editorial';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, variant = 'grid' }) => {
  const {
    openProductModal,
    isWishlisted,
    toggleWishlist,
    addToCart,
    formatPrice,
  } = useApp();

  const [isQuickAdding, setIsQuickAdding] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [isAddedAnimation, setIsAddedAnimation] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const favorited = isWishlisted(product.id);
  const stockInfo = getProductStockInfo(product);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.sizes.length > 1 && !isQuickAdding) {
      setIsQuickAdding(true);
      return;
    }

    addToCart(product, selectedSize, product.colors[0], 1);
    setIsAddedAnimation(true);
    setIsQuickAdding(false);
    setTimeout(() => setIsAddedAnimation(false), 1400);
  };

  const handleSelectSizeAndAdd = (e: React.MouseEvent, size: string) => {
    e.stopPropagation();
    setSelectedSize(size);
    addToCart(product, size, product.colors[0], 1);
    setIsAddedAnimation(true);
    setIsQuickAdding(false);
    setTimeout(() => setIsAddedAnimation(false), 1400);
  };

  if (variant === 'horizontal') {
    return (
      <div
        onClick={() => openProductModal(product)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative bg-gradient-to-r from-[#11121d] to-[#0c0d15] border border-white/10 hover:border-cyan-400/50 rounded-2xl p-3 flex gap-3.5 cursor-pointer transition-all duration-300 active:scale-[0.99] shadow-lg shadow-black/50 hover:shadow-cyan-950/30 overflow-hidden"
      >
        {/* Chrome Shimmer Sheen on Hover */}
        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${isHovered ? 'opacity-100 chrome-shimmer-sweep' : 'opacity-0'}`} />

        <div className="relative w-24 h-28 shrink-0 rounded-xl overflow-hidden bg-black/60 border border-white/10">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Badges on Horizontal Card */}
          <div className="absolute top-1.5 left-1.5 flex flex-col gap-1 z-10">
            {product.sourceBadge ? (
              <span className="bg-black/80 text-[7.5px] font-cyber font-bold px-1.5 py-0.5 rounded text-zinc-200 border border-white/20">
                {product.sourceBadge}
              </span>
            ) : product.isNew ? (
              <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-[8px] font-cyber font-bold px-1.5 py-0.5 rounded text-white shadow-md">
                NEW
              </span>
            ) : null}
            <StockBadge product={product} variant="card-badge" className="text-[8px] px-1 py-0.2" />
          </div>
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 z-10">
          <div>
            <div className="flex items-center justify-between gap-1">
              <span className="text-[9px] font-tech text-cyan-400 uppercase tracking-widest flex items-center gap-1">
                <span>✦</span> {product.category}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(product.id);
                }}
                className="p-1 text-zinc-400 hover:text-pink-400 transition-colors"
                aria-label="Wishlist"
              >
                <Heart
                  className={`w-4 h-4 transition-transform duration-200 ${
                    favorited ? 'text-pink-500 fill-pink-500 scale-110' : 'text-zinc-400'
                  }`}
                />
              </button>
            </div>

            <h3 className="font-syne font-bold text-sm text-white truncate mt-0.5 group-hover:text-cyan-300 transition-colors">
              {product.name}
            </h3>

            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-zinc-400">
              <div className="flex items-center text-amber-400">
                <Star className="w-3 h-3 fill-amber-400" />
                <span className="ml-0.5 font-bold">{product.rating}</span>
              </div>
              <span className="text-zinc-600">•</span>
              <StockBadge product={product} variant="inline" className="text-[9px]" />
            </div>
          </div>

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
            <div className="flex items-baseline gap-1.5">
              <span className="font-cyber font-black text-sm text-white">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-zinc-500 line-through font-tech">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <button
              onClick={handleQuickAdd}
              className={`px-3 py-1 text-xs font-cyber font-bold rounded-lg transition-all active:scale-95 flex items-center gap-1 ${
                isAddedAnimation
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
                  : 'bg-white/10 hover:bg-cyan-400 hover:text-black text-white'
              }`}
            >
              {isAddedAnimation ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              {isAddedAnimation ? 'ADDED' : 'ADD'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => openProductModal(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-[#0e0f17]/90 backdrop-blur-xl border border-white/10 hover:border-cyan-400/50 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-950/40 hover:-translate-y-1 active:scale-[0.98] flex flex-col justify-between"
    >
      {/* Chrome Specular Light Sweep on Hover */}
      <div className={`absolute inset-0 pointer-events-none z-30 transition-opacity duration-700 ${isHovered ? 'opacity-100 chrome-shimmer-sweep' : 'opacity-0'}`} />

      {/* Top Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#07080d]">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Ambient Dark Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0f17] via-transparent to-black/40 opacity-80 group-hover:opacity-50 transition-opacity duration-500" />

          {/* Editorial Stamp Top Left */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
            {product.sourceBadge ? (
              <span className={`text-[8.5px] font-cyber font-black tracking-wider px-2 py-0.5 rounded-md shadow-md backdrop-blur-md border ${
                product.brandSource === 'pinterest'
                  ? 'bg-rose-950/80 text-rose-300 border-rose-500/40 shadow-rose-500/20'
                  : product.brandSource === 'shein'
                  ? 'bg-amber-950/80 text-amber-300 border-amber-500/40 shadow-amber-500/20'
                  : product.brandSource === 'temu'
                  ? 'bg-orange-950/80 text-orange-300 border-orange-500/40 shadow-orange-500/20'
                  : product.brandSource === 'hellstar'
                  ? 'bg-red-950/80 text-red-300 border-red-500/40 shadow-red-500/20'
                  : product.brandSource === 'chrome_hearts'
                  ? 'bg-zinc-900/90 text-zinc-200 border-zinc-500/50 shadow-black/40'
                  : product.brandSource === 'stussy'
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 shadow-emerald-500/20'
                  : product.brandSource === 'balenciaga'
                  ? 'bg-purple-950/80 text-purple-300 border-purple-500/40 shadow-purple-500/20'
                  : product.brandSource === 'rick_owens'
                  ? 'bg-stone-900/90 text-stone-200 border-stone-600 shadow-black/50'
                  : product.brandSource === 'corteiz'
                  ? 'bg-lime-950/80 text-lime-300 border-lime-500/40 shadow-lime-500/20'
                  : product.brandSource === 'sp5der'
                  ? 'bg-fuchsia-950/80 text-fuchsia-300 border-fuchsia-500/40 shadow-fuchsia-500/20'
                  : 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40'
              }`}>
                {product.sourceBadge}
              </span>
            ) : product.isNew ? (
              <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[9px] font-cyber font-black tracking-wider px-2 py-0.5 rounded-md shadow-lg shadow-pink-500/30 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                NEW
              </span>
            ) : null}

            {/* Dynamic Stock Label Pill */}
            <StockBadge product={product} variant="card-badge" />

            {product.gsm && (
              <span className="bg-black/75 backdrop-blur-md text-zinc-300 text-[8px] font-tech font-bold px-1.5 py-0.5 rounded border border-white/10">
                {product.gsm}
              </span>
            )}
          </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-zinc-300 hover:text-pink-400 hover:border-pink-500/50 transition-all duration-200 active:scale-90"
          aria-label="Toggle favorite"
        >
          <Heart
            className={`w-4 h-4 transition-transform duration-200 ${
              favorited ? 'text-pink-500 fill-pink-500 scale-110' : 'text-zinc-300'
            }`}
          />
        </button>

        {/* Quick Size Select Overlay if active */}
        {isQuickAdding && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-0 bg-[#080910]/95 backdrop-blur-md z-20 p-3 flex flex-col justify-between animate-fadeIn"
          >
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2">
                <p className="text-[10px] font-cyber text-cyan-400 tracking-wider uppercase font-bold">
                  SELECT SIZE
                </p>
                <span className="text-[9px] font-tech text-zinc-400">
                  {stockInfo.isLowStock ? '⚡ LOW STOCK' : 'AVAILABLE'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 mt-1">
                {product.sizes.map((sz) => {
                  const sizeMeta = stockInfo.sizeStockMap[sz];
                  return (
                    <button
                      key={sz}
                      onClick={(e) => handleSelectSizeAndAdd(e, sz)}
                      className="py-2 px-1 text-xs font-cyber font-bold rounded-lg border border-white/15 hover:border-cyan-400 hover:bg-cyan-500/20 text-white transition-all active:scale-95 flex flex-col items-center justify-center"
                    >
                      <span>{sz}</span>
                      {sizeMeta && sizeMeta.status === 'low_stock' && (
                        <span className="text-[8px] text-amber-400 font-tech leading-tight font-normal">
                          {sizeMeta.count} left
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => setIsQuickAdding(false)}
              className="text-[10px] text-zinc-400 hover:text-white underline text-center py-1 font-tech"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-3 flex-1 flex flex-col justify-between relative z-10">
        <div>
          {/* Micro Editorial Header */}
          <div className="flex items-center justify-between text-[10px] font-tech text-zinc-400 mb-1">
            <span className="uppercase text-cyan-400/90 tracking-wider font-semibold">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-400 font-semibold">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{product.rating}</span>
            </div>
          </div>

          <h3 className="font-syne font-bold text-sm text-zinc-100 line-clamp-1 group-hover:text-cyan-300 transition-colors">
            {product.name}
          </h3>

          {/* Dynamic Stock Inline Indicator & Color swatch previews */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1.5">
              {product.colors.map((c, i) => (
                <span
                  key={i}
                  title={c.name}
                  className={`w-2.5 h-2.5 rounded-full border border-white/30 ${
                    c.isChrome ? 'ring-1 ring-cyan-400' : ''
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
              {product.colors.some((c) => c.isChrome) && (
                <span className="text-[8px] font-cyber font-bold text-cyan-300 ml-0.5 px-1 py-0.2 bg-cyan-950/60 rounded border border-cyan-500/30">
                  CHROME
                </span>
              )}
            </div>

            <StockBadge product={product} variant="inline" className="text-[9px]" />
          </div>
        </div>

        {/* Price & Action Button */}
        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/5">
          <div className="flex flex-col">
            <span className="font-cyber font-black text-sm text-white group-hover:text-chrome transition-all">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-[10px] text-zinc-500 line-through font-tech -mt-0.5">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            className={`px-3 py-1.5 rounded-xl font-cyber text-[10px] font-bold tracking-wider transition-all duration-200 flex items-center gap-1 active:scale-95 shadow-md ${
              isAddedAnimation
                ? 'bg-emerald-500 text-black shadow-emerald-500/40 scale-105'
                : 'bg-white/10 hover:bg-cyan-400 hover:text-black text-white hover:shadow-cyan-400/30 border border-white/15 hover:border-cyan-400'
            }`}
          >
            {isAddedAnimation ? (
              <>
                <Check className="w-3 h-3 text-black" />
                ADDED
              </>
            ) : (
              <>
                <Plus className="w-3 h-3" />
                ADD
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

