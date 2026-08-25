import React, { useState, useMemo } from 'react';
import { Search, X, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PRODUCTS } from '../../data/products';
import { ProductCard } from '../ProductCard';
import { Product } from '../../types';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const trendingSearches = [
    'pinterest',
    'shein',
    'temu',
    'hellstar',
    'chrome hearts',
    'stussy',
    'balenciaga',
    'rick owens',
    'corteiz',
    'sp5der',
    'hoodie',
    'baggy denim',
  ];

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const q = searchTerm.toLowerCase().trim();
    return PRODUCTS.filter((item: Product) => {
      return (
        item.name.toLowerCase().includes(q) ||
        (item.brand && item.brand.toLowerCase().includes(q)) ||
        (item.brandSource && item.brandSource.toLowerCase().includes(q)) ||
        (item.sourceBadge && item.sourceBadge.toLowerCase().includes(q)) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [searchTerm]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-xl animate-fadeIn flex flex-col justify-between">
      {/* Top Bar with Search Input */}
      <div className="sticky top-0 z-20 bg-[#08080d]/95 backdrop-blur-md border-b border-white/10 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search 'hoodie', 'denim', 'chrome tee'..."
              className="w-full pl-10 pr-10 py-3 bg-[#12131f] border border-white/20 focus:border-cyan-400 rounded-2xl text-xs sm:text-sm text-white placeholder:text-zinc-500 font-tech focus:outline-none focus:ring-1 focus:ring-cyan-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-xs font-cyber font-bold text-zinc-400 hover:text-white py-2"
          >
            CANCEL
          </button>
        </div>
      </div>

      {/* Content Body */}
      <div className="max-w-lg mx-auto w-full px-4 py-4 space-y-6 pb-28 flex-1">
        {/* If no search term entered: show Trending searches & Quick Tags */}
        {!searchTerm.trim() ? (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-cyber text-cyan-400 font-bold uppercase tracking-wider mb-3">
                <TrendingUp className="w-4 h-4" />
                <span>TRENDING SEARCHES</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchTerm(term)}
                    className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-cyan-500/20 hover:border-cyan-400/50 border border-white/10 text-xs font-tech font-semibold text-zinc-300 hover:text-cyan-300 transition-all active:scale-95 flex items-center gap-1.5"
                  >
                    <span>{term}</span>
                    <ArrowRight className="w-3 h-3 opacity-50" />
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Drops Carousel Teaser */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-cyber text-pink-400 font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-4 h-4" />
                <span>MOST WANTED STREETWEAR</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {PRODUCTS.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Search Results Display */
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-zinc-400 font-tech">
              <span>
                Found <strong className="text-white font-cyber">{searchResults.length}</strong> styles matching &ldquo;{searchTerm}&rdquo;
              </span>
            </div>

            {searchResults.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {searchResults.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 px-4 rounded-3xl bg-[#11121c] border border-white/10 space-y-3">
                <Search className="w-10 h-10 text-zinc-600 mx-auto" />
                <h3 className="font-cyber font-bold text-sm text-white uppercase">
                  NO RESULTS FOR &ldquo;{searchTerm}&rdquo;
                </h3>
                <p className="text-xs text-zinc-400 font-tech max-w-xs mx-auto">
                  Try searching for &quot;hoodie&quot;, &quot;denim&quot;, &quot;chrome tee&quot;, or &quot;jacket&quot;.
                </p>
                <div className="flex justify-center gap-2 pt-2">
                  {['hoodie', 'denim', 'chrome tee', 'jacket'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setSearchTerm(t)}
                      className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-tech text-cyan-300"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
