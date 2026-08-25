import React, { useState } from 'react';
import { X, Sparkles, ShoppingBag, Check, RefreshCw, Layers, ArrowRight, Eye, ShieldCheck, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/products';
import { Product, ProductColor } from '../types';

interface FitStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FitStudioModal: React.FC<FitStudioModalProps> = ({ isOpen, onClose }) => {
  const { addToCart, formatPrice, showToast, openProductModal } = useApp();

  // Filter products by category for the 4 outfit slots
  const outerwearList = PRODUCTS.filter((p) => p.category === 'jackets');
  const topsList = PRODUCTS.filter((p) => p.category === 'tees' || p.category === 'hoodies');
  const bottomsList = PRODUCTS.filter((p) => p.category === 'denim');
  const accessoriesList = PRODUCTS.filter((p) => p.category === 'accessories');

  // Selected items in the active outfit builder
  const [selectedOuterwear, setSelectedOuterwear] = useState<Product>(outerwearList[0] || PRODUCTS[3]);
  const [selectedTop, setSelectedTop] = useState<Product>(topsList[0] || PRODUCTS[0]);
  const [selectedBottom, setSelectedBottom] = useState<Product>(bottomsList[0] || PRODUCTS[2]);
  const [selectedAccessory, setSelectedAccessory] = useState<Product>(accessoriesList[0] || PRODUCTS[8]);

  const [activeSlot, setActiveSlot] = useState<'outerwear' | 'top' | 'bottom' | 'accessory'>('top');
  const [isAddingFit, setIsAddingFit] = useState(false);

  if (!isOpen) return null;

  const currentOutfitItems = [selectedOuterwear, selectedTop, selectedBottom, selectedAccessory].filter(Boolean);
  const totalOutfitPrice = currentOutfitItems.reduce((acc, item) => acc + item.price, 0);
  const bundleDiscount = 0.15; // 15% off full customized fit
  const discountedFitPrice = totalOutfitPrice * (1 - bundleDiscount);

  const handleRandomizeFit = () => {
    const randomOuter = outerwearList[Math.floor(Math.random() * outerwearList.length)];
    const randomTop = topsList[Math.floor(Math.random() * topsList.length)];
    const randomBottom = bottomsList[Math.floor(Math.random() * bottomsList.length)];
    const randomAcc = accessoriesList[Math.floor(Math.random() * accessoriesList.length)];

    if (randomOuter) setSelectedOuterwear(randomOuter);
    if (randomTop) setSelectedTop(randomTop);
    if (randomBottom) setSelectedBottom(randomBottom);
    if (randomAcc) setSelectedAccessory(randomAcc);
  };

  const handleAddOutfitToCart = () => {
    setIsAddingFit(true);
    currentOutfitItems.forEach((product) => {
      addToCart(product, product.sizes[0] || 'M', product.colors[0], 1);
    });

    showToast({
      title: 'CUSTOM FIT ADDED TO BAG',
      description: `Added 4 pieces with 15% Studio Bundle Discount`,
      type: 'cart',
      image: selectedTop.images[0],
    });

    setTimeout(() => {
      setIsAddingFit(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex flex-col justify-between overflow-y-auto animate-fadeIn">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-[#080910]/95 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-cyan-400 font-cyber text-[10px] font-bold tracking-widest uppercase">
            <Layers className="w-3 h-3" /> FIT STUDIO // LAB 04
          </div>
          <h2 className="font-syne font-bold text-base text-white">
            Mix & Match Outfit Creator
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRandomizeFit}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white transition-colors flex items-center gap-1 text-[10px] font-cyber font-bold border border-white/10"
            title="Randomize Outfit"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">RANDOMIZE</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Studio Workspace */}
      <div className="max-w-xl mx-auto w-full px-4 py-4 space-y-6 pb-28">
        {/* Visual Outfit Stack Deck (Interactive Mannequin Canvas) */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#11121d] to-[#07080e] border border-cyan-400/30 p-4 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-3 text-[10px] font-tech text-zinc-400">
            <span className="flex items-center gap-1 text-cyan-400 font-cyber font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              LIVE OUTFIT COMPOSITOR
            </span>
            <span>4 GARMENTS SELECTED</span>
          </div>

          {/* 4-Layer Outfit Visual Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* Slot 1: Outerwear */}
            <div
              onClick={() => setActiveSlot('outerwear')}
              className={`relative rounded-2xl overflow-hidden border p-2 bg-black/40 cursor-pointer transition-all duration-300 ${
                activeSlot === 'outerwear'
                  ? 'border-cyan-400 ring-2 ring-cyan-400/30 scale-105 bg-white/5'
                  : 'border-white/10 hover:border-white/25'
              }`}
            >
              <span className="text-[9px] font-cyber font-bold text-cyan-400 uppercase block mb-1">
                OUTERWEAR
              </span>
              <div className="aspect-[3/4] rounded-xl overflow-hidden bg-black/60 mb-2">
                <img
                  src={selectedOuterwear.images[0]}
                  alt={selectedOuterwear.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-syne font-bold text-xs text-white truncate">
                {selectedOuterwear.name}
              </h4>
              <span className="font-cyber font-bold text-xs text-cyan-300 block mt-0.5">
                {formatPrice(selectedOuterwear.price)}
              </span>
            </div>

            {/* Slot 2: Top */}
            <div
              onClick={() => setActiveSlot('top')}
              className={`relative rounded-2xl overflow-hidden border p-2 bg-black/40 cursor-pointer transition-all duration-300 ${
                activeSlot === 'top'
                  ? 'border-cyan-400 ring-2 ring-cyan-400/30 scale-105 bg-white/5'
                  : 'border-white/10 hover:border-white/25'
              }`}
            >
              <span className="text-[9px] font-cyber font-bold text-cyan-400 uppercase block mb-1">
                TOP
              </span>
              <div className="aspect-[3/4] rounded-xl overflow-hidden bg-black/60 mb-2">
                <img
                  src={selectedTop.images[0]}
                  alt={selectedTop.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-syne font-bold text-xs text-white truncate">
                {selectedTop.name}
              </h4>
              <span className="font-cyber font-bold text-xs text-cyan-300 block mt-0.5">
                {formatPrice(selectedTop.price)}
              </span>
            </div>

            {/* Slot 3: Bottom */}
            <div
              onClick={() => setActiveSlot('bottom')}
              className={`relative rounded-2xl overflow-hidden border p-2 bg-black/40 cursor-pointer transition-all duration-300 ${
                activeSlot === 'bottom'
                  ? 'border-cyan-400 ring-2 ring-cyan-400/30 scale-105 bg-white/5'
                  : 'border-white/10 hover:border-white/25'
              }`}
            >
              <span className="text-[9px] font-cyber font-bold text-cyan-400 uppercase block mb-1">
                BOTTOMS
              </span>
              <div className="aspect-[3/4] rounded-xl overflow-hidden bg-black/60 mb-2">
                <img
                  src={selectedBottom.images[0]}
                  alt={selectedBottom.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-syne font-bold text-xs text-white truncate">
                {selectedBottom.name}
              </h4>
              <span className="font-cyber font-bold text-xs text-cyan-300 block mt-0.5">
                {formatPrice(selectedBottom.price)}
              </span>
            </div>

            {/* Slot 4: Accessory */}
            <div
              onClick={() => setActiveSlot('accessory')}
              className={`relative rounded-2xl overflow-hidden border p-2 bg-black/40 cursor-pointer transition-all duration-300 ${
                activeSlot === 'accessory'
                  ? 'border-cyan-400 ring-2 ring-cyan-400/30 scale-105 bg-white/5'
                  : 'border-white/10 hover:border-white/25'
              }`}
            >
              <span className="text-[9px] font-cyber font-bold text-cyan-400 uppercase block mb-1">
                ACCESSORY
              </span>
              <div className="aspect-[3/4] rounded-xl overflow-hidden bg-black/60 mb-2">
                <img
                  src={selectedAccessory.images[0]}
                  alt={selectedAccessory.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-syne font-bold text-xs text-white truncate">
                {selectedAccessory.name}
              </h4>
              <span className="font-cyber font-bold text-xs text-cyan-300 block mt-0.5">
                {formatPrice(selectedAccessory.price)}
              </span>
            </div>
          </div>
        </div>

        {/* Slot Selector Tray (Horizontal Picker for Active Category) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-cyber font-bold text-white uppercase tracking-wider">
              SWAP {activeSlot.toUpperCase()} ({
                activeSlot === 'outerwear'
                  ? outerwearList.length
                  : activeSlot === 'top'
                  ? topsList.length
                  : activeSlot === 'bottom'
                  ? bottomsList.length
                  : accessoriesList.length
              } OPTIONS)
            </span>
            <span className="text-[10px] font-tech text-cyan-400">
              Tap any item to equip
            </span>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
            {(activeSlot === 'outerwear'
              ? outerwearList
              : activeSlot === 'top'
              ? topsList
              : activeSlot === 'bottom'
              ? bottomsList
              : accessoriesList
            ).map((product) => {
              const isEquipped =
                (activeSlot === 'outerwear' && selectedOuterwear.id === product.id) ||
                (activeSlot === 'top' && selectedTop.id === product.id) ||
                (activeSlot === 'bottom' && selectedBottom.id === product.id) ||
                (activeSlot === 'accessory' && selectedAccessory.id === product.id);

              return (
                <button
                  key={product.id}
                  onClick={() => {
                    if (activeSlot === 'outerwear') setSelectedOuterwear(product);
                    if (activeSlot === 'top') setSelectedTop(product);
                    if (activeSlot === 'bottom') setSelectedBottom(product);
                    if (activeSlot === 'accessory') setSelectedAccessory(product);
                  }}
                  className={`shrink-0 w-32 rounded-2xl overflow-hidden border p-2 text-left transition-all active:scale-95 ${
                    isEquipped
                      ? 'bg-cyan-500/10 border-cyan-400 ring-2 ring-cyan-400/40 shadow-lg shadow-cyan-500/20'
                      : 'bg-[#10111a] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-black/60 mb-2">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {isEquipped && (
                      <div className="absolute top-1.5 right-1.5 bg-cyan-400 text-black p-0.5 rounded-full shadow-md">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  <h5 className="font-syne font-bold text-xs text-white truncate">
                    {product.name}
                  </h5>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-cyber font-bold text-xs text-cyan-300">
                      {formatPrice(product.price)}
                    </span>
                    {product.gsm && (
                      <span className="text-[8px] font-tech text-zinc-400">
                        {product.gsm}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pricing Summary Card */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-tech">
            <span>Items Subtotal (4 Pieces)</span>
            <span>{formatPrice(totalOutfitPrice)}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-emerald-400 font-tech">
            <span className="flex items-center gap-1 font-bold">
              <Sparkles className="w-3 h-3" /> Fit Studio Bundle Promo (15% Off)
            </span>
            <span>-{formatPrice(totalOutfitPrice * bundleDiscount)}</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <span className="font-cyber font-bold text-sm text-white uppercase">
              COMPLETE FIT TOTAL
            </span>
            <span className="font-cyber font-black text-lg text-cyan-300">
              {formatPrice(discountedFitPrice)}
            </span>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="sticky bottom-0 z-30 bg-[#0c0d16]/95 backdrop-blur-2xl border-t border-white/10 px-4 py-3 pb-safe">
        <div className="max-w-xl mx-auto flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[9px] text-zinc-400 font-tech">Studio Fit Price</span>
            <span className="font-cyber font-black text-base text-cyan-300">
              {formatPrice(discountedFitPrice)}
            </span>
          </div>

          <button
            onClick={handleAddOutfitToCart}
            disabled={isAddingFit}
            className="flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 text-black font-cyber font-black text-xs tracking-wider uppercase transition-all duration-300 hover:brightness-110 active:scale-95 shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2"
          >
            {isAddingFit ? (
              <>
                <Check className="w-4 h-4 text-black" />
                ADDING 4 PIECES...
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-black fill-black" />
                ADD COMPLETE FIT TO BAG (4 PIECES)
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
