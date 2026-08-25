import React from 'react';
import { Flame, Zap, CheckCircle2, AlertTriangle, Eye, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { getProductStockInfo } from '../utils/stock';

interface StockBadgeProps {
  product: Product;
  selectedSize?: string;
  variant?: 'card-badge' | 'inline' | 'detail-banner' | 'size-indicator' | 'scarcity-meter';
  className?: string;
}

export const StockBadge: React.FC<StockBadgeProps> = ({
  product,
  selectedSize,
  variant = 'card-badge',
  className = '',
}) => {
  const stock = getProductStockInfo(product, selectedSize);

  // 1. CARD BADGE (Image overlay for Product Cards)
  if (variant === 'card-badge') {
    if (stock.isSoldOut) {
      return (
        <span
          className={`px-2 py-0.5 rounded-md font-cyber font-bold text-[9px] uppercase tracking-wider bg-zinc-900/90 text-zinc-400 border border-zinc-700/60 backdrop-blur-md ${className}`}
        >
          SOLD OUT
        </span>
      );
    }

    if (stock.isLowStock) {
      return (
        <span
          className={`px-2 py-0.5 rounded-md font-cyber font-black text-[9px] uppercase tracking-wider bg-gradient-to-r from-amber-500/90 via-rose-500/90 to-amber-600/90 text-white border border-amber-400/50 shadow-lg shadow-amber-500/30 flex items-center gap-1 backdrop-blur-md animate-pulse ${className}`}
        >
          <Zap className="w-2.5 h-2.5 fill-white shrink-0" />
          {stock.badgeText}
        </span>
      );
    }

    // In Stock
    return (
      <span
        className={`px-2 py-0.5 rounded-md font-cyber font-bold text-[9px] uppercase tracking-wider bg-[#0c131a]/90 text-cyan-300 border border-cyan-500/40 shadow-sm backdrop-blur-md flex items-center gap-1 ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping opacity-75 inline-block shrink-0" />
        {stock.badgeText}
      </span>
    );
  }

  // 2. INLINE TEXT (Micro status in card meta or list views)
  if (variant === 'inline') {
    if (stock.isSoldOut) {
      return (
        <span className={`text-[10px] font-tech text-zinc-500 flex items-center gap-1 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 inline-block" />
          Sold Out
        </span>
      );
    }

    if (stock.isLowStock) {
      return (
        <span className={`text-[10px] font-tech text-amber-400 font-bold flex items-center gap-1 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse inline-block" />
          {stock.count <= 5 ? `Only ${stock.count} Left in Vault` : 'Low Stock Alert'}
        </span>
      );
    }

    return (
      <span className={`text-[10px] font-tech text-emerald-400 font-medium flex items-center gap-1 ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
        In Stock ({stock.count} units)
      </span>
    );
  }

  // 3. SIZE INDICATOR (Under or inside size buttons)
  if (variant === 'size-indicator') {
    const sizeInfo = selectedSize ? stock.sizeStockMap[selectedSize] : null;
    if (!sizeInfo) return null;

    if (sizeInfo.status === 'low_stock') {
      return (
        <span className={`text-[9px] font-tech text-amber-400 font-bold ${className}`}>
          {sizeInfo.count === 1 ? '1 LEFT' : `${sizeInfo.count} LEFT`}
        </span>
      );
    }

    return (
      <span className={`text-[9px] font-tech text-zinc-400 ${className}`}>
        IN STOCK
      </span>
    );
  }

  // 4. SCARCITY METER & PROGRESS GAUGE (for Product Detail Page)
  if (variant === 'scarcity-meter') {
    return (
      <div className={`space-y-1.5 ${className}`}>
        <div className="flex items-center justify-between text-[11px] font-tech">
          <div className="flex items-center gap-1.5 text-zinc-300">
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            <span className="font-cyber font-bold text-xs uppercase tracking-wider text-white">
              {stock.isLowStock ? 'LIMITED VAULT ALLOCATION' : 'VAULT INVENTORY STATUS'}
            </span>
          </div>
          <span className={`font-cyber font-bold text-[11px] ${stock.isLowStock ? 'text-amber-400' : 'text-cyan-400'}`}>
            {stock.isLowStock ? `${stock.count} PIECES REMAINING` : 'AVAILABLE FOR DISPATCH'}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden p-0.5 border border-white/10">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              stock.isLowStock
                ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-red-500 shadow-md shadow-rose-500/50 animate-pulse'
                : 'bg-gradient-to-r from-cyan-400 to-blue-500 shadow-md shadow-cyan-400/30'
            }`}
            style={{ width: `${Math.min(100, stock.claimedPercentage)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] text-zinc-400 font-tech pt-0.5">
          <span>
            {stock.claimedPercentage}% of drop allocation claimed
          </span>
          <span className="text-zinc-500">Fast 24h Vault Shipping</span>
        </div>
      </div>
    );
  }

  // 5. DETAIL BANNER (Comprehensive Luxury Urgency Banner on Product Detail Page)
  return (
    <div
      className={`rounded-2xl p-3.5 border transition-all ${
        stock.isLowStock
          ? 'bg-gradient-to-r from-[#201014] via-[#1a111a] to-[#161220] border-amber-500/40 shadow-lg shadow-amber-950/30'
          : 'bg-gradient-to-r from-[#0c141e] via-[#0e121b] to-[#121122] border-cyan-500/30 shadow-md'
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
              stock.isLowStock
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                : 'bg-cyan-500/15 border-cyan-500/40 text-cyan-400'
            }`}
          >
            {stock.isLowStock ? (
              <Zap className="w-4 h-4 fill-amber-400 animate-pulse" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span
                className={`font-cyber font-black text-xs uppercase tracking-wider ${
                  stock.isLowStock ? 'text-amber-300' : 'text-cyan-300'
                }`}
              >
                {stock.isLowStock ? '⚡ LOW STOCK WARNING' : '● IN STOCK & READY TO SHIP'}
              </span>
              <span
                className={`px-1.5 py-0.2 rounded text-[9px] font-tech font-bold uppercase ${
                  stock.isLowStock
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {stock.isLowStock ? `${stock.count} LEFT` : 'IN VAULT'}
              </span>
            </div>

            <p className="text-xs text-zinc-300 font-tech mt-0.5">
              {stock.isLowStock
                ? `High demand item — only ${stock.count} pieces remaining in ${
                    selectedSize ? `Size ${selectedSize}` : 'total'
                  }. Add now to avoid sellout.`
                : `Guaranteed authentic archive inventory. Ready for immediate dispatch within 24 hours.`}
            </p>
          </div>
        </div>
      </div>

      {/* Shopper Activity Live Ticker */}
      <div className="mt-2.5 pt-2.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] font-tech text-zinc-400">
        <div className="flex items-center gap-1.5 text-zinc-300">
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span>
            <strong className="text-white font-semibold">{stock.viewersCount} people</strong> viewing right now
          </span>
        </div>
        <div className="flex items-center gap-1 text-amber-400/90 text-[10px]">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>{stock.recentOrdersCount} orders placed in the last 6 hours</span>
        </div>
      </div>
    </div>
  );
};
