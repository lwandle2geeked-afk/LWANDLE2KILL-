import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, LayoutGrid, Rows, X, RotateCcw, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PRODUCTS, CATEGORIES } from '../../data/products';
import { BRAND_SOURCES, BRAND_LIST } from '../../data/brands';
import { ProductCard } from '../ProductCard';
import { CategoryType, Product } from '../../types';

type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'popular' | 'rating';

export const ShopView: React.FC = () => {
  const {
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    selectedBrandFilter,
    setSelectedBrandFilter,
    formatPrice,
  } = useApp();

  const [localSearch, setLocalSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'horizontal'>('grid');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Filter criteria
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(380);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [onlyLowStock, setOnlyLowStock] = useState<boolean>(false);
  const [onlyDiscounted, setOnlyDiscounted] = useState<boolean>(false);

  const allAvailableSizes = ['S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', 'ONE SIZE'];

  const toggleSizeFilter = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const resetAllFilters = () => {
    setSelectedCategoryFilter('all');
    setSelectedBrandFilter('all');
    setSelectedSizes([]);
    setMaxPrice(380);
    setOnlyInStock(false);
    setOnlyLowStock(false);
    setOnlyDiscounted(false);
    setLocalSearch('');
    setSortBy('newest');
  };

  const activeFilterCount =
    (selectedCategoryFilter !== 'all' ? 1 : 0) +
    (selectedBrandFilter !== 'all' ? 1 : 0) +
    selectedSizes.length +
    (maxPrice < 380 ? 1 : 0) +
    (onlyInStock ? 1 : 0) +
    (onlyLowStock ? 1 : 0) +
    (onlyDiscounted ? 1 : 0);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      // Category
      if (selectedCategoryFilter !== 'all' && item.category !== selectedCategoryFilter) {
        return false;
      }
      // Brand / Source
      if (selectedBrandFilter !== 'all') {
        if (item.brandSource !== selectedBrandFilter) {
          return false;
        }
      }
      // Search query
      if (localSearch.trim()) {
        const q = localSearch.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesCategory = item.category.toLowerCase().includes(q);
        const matchesBrand = item.brand ? item.brand.toLowerCase().includes(q) : false;
        const matchesBadge = item.sourceBadge ? item.sourceBadge.toLowerCase().includes(q) : false;
        const matchesTag = item.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesCategory && !matchesBrand && !matchesBadge && !matchesTag) {
          return false;
        }
      }
      // Price
      if (item.price > maxPrice) {
        return false;
      }
      // Sizes
      if (selectedSizes.length > 0) {
        const hasMatchingSize = item.sizes.some((sz) => selectedSizes.includes(sz));
        if (!hasMatchingSize) return false;
      }
      // In stock
      if (onlyInStock && item.stockStatus === 'sold_out') {
        return false;
      }
      // Low stock urgency filter
      if (onlyLowStock && item.stockStatus !== 'low_stock' && (item.stockCount ?? 10) > 6) {
        return false;
      }
      // Discounted
      if (onlyDiscounted && !item.originalPrice) {
        return false;
      }
      return true;
    }).sort((a: Product, b: Product) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'popular') return b.reviewCount - a.reviewCount;
      // 'newest'
      return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    });
  }, [
    selectedCategoryFilter,
    selectedBrandFilter,
    localSearch,
    maxPrice,
    selectedSizes,
    onlyInStock,
    onlyLowStock,
    onlyDiscounted,
    sortBy,
  ]);

  return (
    <div className="space-y-4 px-4 pb-16 pt-2">
      {/* 1. SHOP SEARCH & CONTROLS HEADER */}
      <div className="space-y-2.5">
        {/* Search input bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search tees, hoodies, denim, racing jackets..."
            className="w-full pl-10 pr-10 py-3 bg-[#11121c] border border-white/15 focus:border-cyan-400 rounded-2xl text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all font-tech"
          />
          {localSearch && (
            <button
              onClick={() => setLocalSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter Chips Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
          <button
            onClick={() => setSelectedCategoryFilter('all')}
            className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-cyber font-bold tracking-wider transition-all duration-200 active:scale-95 ${
              selectedCategoryFilter === 'all'
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-lg shadow-cyan-500/20'
                : 'bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10'
            }`}
          >
            ALL CATEGORIES
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryFilter(cat.id as CategoryType)}
              className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-cyber font-bold tracking-wider transition-all duration-200 active:scale-95 ${
                selectedCategoryFilter === cat.id
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-lg shadow-cyan-500/20'
                  : 'bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Brand & Platform Chips Bar (Pinterest, Shein, Temu, Brands) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 border-t border-white/5 pt-1.5">
          {BRAND_LIST.map((brand) => {
            const isSelected = selectedBrandFilter === brand.id;
            return (
              <button
                key={brand.id}
                onClick={() => setSelectedBrandFilter(brand.id)}
                className={`shrink-0 px-3 py-1 rounded-xl text-[11px] font-cyber font-bold tracking-wider transition-all duration-200 active:scale-95 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-cyan-400 text-black shadow-md shadow-cyan-400/25 border border-cyan-300'
                    : `${brand.color} ${brand.textColor} hover:brightness-125 border ${brand.borderColor}`
                }`}
              >
                <span>{brand.badge}</span>
              </button>
            );
          })}
        </div>

        {/* Toolbar: Filters, Sort, View Toggle */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/5">
          <div className="flex items-center gap-2">
            {/* Filter Drawer Trigger */}
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-cyber font-semibold flex items-center gap-1.5 transition-all active:scale-95 ${
                activeFilterCount > 0
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                  : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>FILTERS</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-cyan-400 text-black text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="relative flex items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                aria-label="Sort products by"
                className="appearance-none bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 text-xs font-tech font-semibold pl-2.5 pr-7 py-1.5 rounded-xl focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                <option value="newest" className="bg-[#12131e] text-white">Sort: Newest</option>
                <option value="popular" className="bg-[#12131e] text-white">Sort: Most Popular</option>
                <option value="price_asc" className="bg-[#12131e] text-white">Price: Low to High</option>
                <option value="price_desc" className="bg-[#12131e] text-white">Price: High to Low</option>
                <option value="rating" className="bg-[#12131e] text-white">Highest Rated</option>
              </select>
              <ArrowUpDown className="w-3 h-3 text-zinc-400 absolute right-2 pointer-events-none" />
            </div>
          </div>

          {/* Grid vs Horizontal list layout toggle */}
          <div className="flex items-center bg-white/5 p-0.5 rounded-xl border border-white/10">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-cyan-500/20 text-cyan-300' : 'text-zinc-400 hover:text-white'
              }`}
              aria-label="Grid layout"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('horizontal')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'horizontal' ? 'bg-cyan-500/20 text-cyan-300' : 'text-zinc-400 hover:text-white'
              }`}
              aria-label="List layout"
            >
              <Rows className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Tags */}
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap text-[11px] font-tech text-zinc-400 pt-1">
          <span className="text-zinc-500">Active:</span>
          {selectedCategoryFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-400/10 text-cyan-300 border border-cyan-400/30">
              {selectedCategoryFilter.toUpperCase()}
              <X
                className="w-3 h-3 cursor-pointer hover:text-white"
                onClick={() => setSelectedCategoryFilter('all')}
              />
            </span>
          )}
          {selectedSizes.map((sz) => (
            <span
              key={sz}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-400/10 text-purple-300 border border-purple-400/30"
            >
              Size: {sz}
              <X
                className="w-3 h-3 cursor-pointer hover:text-white"
                onClick={() => toggleSizeFilter(sz)}
              />
            </span>
          ))}
          {maxPrice < 300 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-pink-400/10 text-pink-300 border border-pink-400/30">
              Under {formatPrice(maxPrice)}
              <X
                className="w-3 h-3 cursor-pointer hover:text-white"
                onClick={() => setMaxPrice(300)}
              />
            </span>
          )}
          <button
            onClick={resetAllFilters}
            className="text-[11px] text-cyan-400 hover:underline flex items-center gap-0.5 ml-1"
          >
            <RotateCcw className="w-3 h-3" /> Clear All
          </button>
        </div>
      )}

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs text-zinc-400 font-tech">
        <span>
          Showing <strong className="text-white font-cyber">{filteredProducts.length}</strong> styles
        </span>
        {localSearch && <span>Search: &ldquo;{localSearch}&rdquo;</span>}
      </div>

      {/* 2. PRODUCT CATALOGUE GRID / LIST */}
      {filteredProducts.length > 0 ? (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-2 gap-3 sm:gap-4'
              : 'flex flex-col gap-3'
          }
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} variant={viewMode} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 rounded-3xl bg-[#11121c] border border-white/10">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-zinc-500 mb-4">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-cyber font-bold text-base text-white uppercase tracking-wider">
            NO CYBER PIECES FOUND
          </h3>
          <p className="text-xs text-zinc-400 font-tech mt-1 max-w-xs mx-auto">
            Try adjusting your search query, clearing size filters, or expanding the price range.
          </p>
          <button
            onClick={resetAllFilters}
            className="mt-5 px-5 py-2.5 rounded-xl bg-cyan-400 text-black font-cyber font-bold text-xs tracking-wider uppercase hover:bg-cyan-300 transition-all active:scale-95 shadow-lg shadow-cyan-400/20"
          >
            RESET ALL FILTERS
          </button>
        </div>
      )}

      {/* 3. FILTER MODAL / DRAWER */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-[#0f101a] border border-white/15 rounded-t-3xl sm:rounded-3xl p-5 max-h-[85vh] overflow-y-auto space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-cyber font-bold text-base text-white tracking-wider uppercase">
                  FILTER ARCHIVE
                </h3>
                <p className="text-xs text-zinc-400 font-tech">Refine by size, price and stock</p>
              </div>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Brand / Source Platform Filter */}
            <div>
              <span className="text-xs font-cyber font-bold text-white uppercase block mb-2">
                BRAND & PLATFORM
              </span>
              <div className="grid grid-cols-2 gap-2">
                {BRAND_LIST.map((brand) => {
                  const selected = selectedBrandFilter === brand.id;
                  return (
                    <button
                      key={brand.id}
                      onClick={() => setSelectedBrandFilter(brand.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-cyber font-bold transition-all text-left truncate flex items-center justify-between border ${
                        selected
                          ? 'bg-cyan-400 text-black border-cyan-300 shadow-md shadow-cyan-400/25'
                          : 'bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10'
                      }`}
                    >
                      <span className="truncate">{brand.shortName}</span>
                      {selected && <span className="text-[10px] font-bold">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-cyber font-bold text-white uppercase">MAX PRICE</span>
                <span className="text-xs font-cyber text-cyan-400 font-bold">{formatPrice(maxPrice)}</span>
              </div>
              <input
                type="range"
                min="30"
                max="380"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-tech mt-1">
                <span>{formatPrice(30)}</span>
                <span>{formatPrice(200)}</span>
                <span>{formatPrice(380)}</span>
              </div>
            </div>

            {/* Size Filter */}
            <div>
              <span className="text-xs font-cyber font-bold text-white uppercase block mb-2">
                SIZE
              </span>
              <div className="flex flex-wrap gap-2">
                {allAvailableSizes.map((size) => {
                  const selected = selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      onClick={() => toggleSizeFilter(size)}
                      className={`px-3 py-2 rounded-xl text-xs font-cyber font-bold transition-all ${
                        selected
                          ? 'bg-cyan-400 text-black shadow-md shadow-cyan-400/30'
                          : 'bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <label className="flex items-center justify-between cursor-pointer py-1">
                <div>
                  <span className="text-xs font-cyber text-zinc-200 block">IN STOCK ONLY</span>
                  <span className="text-[10px] text-zinc-500 font-tech">Exclude archived pieces</span>
                </div>
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="w-4 h-4 accent-cyan-400 rounded"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-1">
                <div>
                  <span className="text-xs font-cyber text-amber-300 block flex items-center gap-1">
                    ⚡ LOW STOCK ALERTS ONLY
                  </span>
                  <span className="text-[10px] text-zinc-500 font-tech">Items with ≤ 6 units remaining</span>
                </div>
                <input
                  type="checkbox"
                  checked={onlyLowStock}
                  onChange={(e) => setOnlyLowStock(e.target.checked)}
                  className="w-4 h-4 accent-amber-400 rounded"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-1">
                <div>
                  <span className="text-xs font-cyber text-zinc-200 block">SALE ITEMS ONLY</span>
                  <span className="text-[10px] text-zinc-500 font-tech">Items with markdown pricing</span>
                </div>
                <input
                  type="checkbox"
                  checked={onlyDiscounted}
                  onChange={(e) => setOnlyDiscounted(e.target.checked)}
                  className="w-4 h-4 accent-pink-500 rounded"
                />
              </label>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3 pt-3 border-t border-white/10">
              <button
                onClick={resetAllFilters}
                className="w-1/3 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-cyber font-bold text-zinc-300"
              >
                RESET
              </button>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black text-xs font-cyber font-black uppercase shadow-lg shadow-cyan-500/20"
              >
                APPLY ({filteredProducts.length} ITEMS)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
