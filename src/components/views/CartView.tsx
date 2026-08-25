import React, { useState } from 'react';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Tag,
  Truck,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CartView: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartCount,
    shippingFee,
    freeShippingThreshold,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    discountAmount,
    cartTotal,
    formatPrice,
    setActiveTab,
    setIsCheckoutOpen,
    openProductModal,
  } = useApp();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  const progressToFreeShipping = Math.min(
    100,
    Math.round((cartSubtotal / freeShippingThreshold) * 100)
  );
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const result = applyPromoCode(promoInput);
    if (!result.success) {
      setPromoError(result.message);
    } else {
      setPromoError('');
      setPromoInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="px-4 py-16 text-center max-w-md mx-auto space-y-5">
        <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-zinc-500 shadow-2xl">
          <ShoppingBag className="w-10 h-10 text-cyan-400/60" />
        </div>

        <div>
          <h2 className="font-cyber font-black text-xl text-white uppercase tracking-wider">
            YOUR CART IS EMPTY
          </h2>
          <p className="text-xs text-zinc-400 font-tech mt-1 max-w-xs mx-auto">
            You haven&apos;t added any cyber streetwear to your archive bag yet.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('shop')}
          className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 text-black font-cyber font-black text-xs uppercase tracking-wider transition-all duration-200 hover:brightness-110 active:scale-95 shadow-lg shadow-cyan-500/25 inline-flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-black" />
          EXPLORE THE COLLECTION
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 pb-28 pt-2 max-w-lg mx-auto space-y-5">
      {/* 1. CART HEADER */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div>
          <h1 className="font-cyber font-black text-xl text-white uppercase tracking-tight">
            SHOPPING CART
          </h1>
          <p className="text-xs text-zinc-400 font-tech">
            {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cyber bag
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-zinc-500 hover:text-pink-400 font-tech transition-colors"
        >
          Clear all
        </button>
      </div>

      {/* 2. FREE SHIPPING PROGRESS BAR */}
      <div className="p-3.5 rounded-2xl bg-[#11121d] border border-white/10 space-y-2">
        <div className="flex items-center justify-between text-xs font-tech">
          <span className="text-zinc-300 flex items-center gap-1.5 font-semibold">
            <Truck className="w-4 h-4 text-cyan-400" />
            {amountNeededForFreeShipping === 0
              ? '🎉 UNLOCKED FREE EXPRESS CYBER SHIPPING!'
              : `Add ${formatPrice(amountNeededForFreeShipping)} more for FREE SHIPPING`}
          </span>
          <span className="font-cyber text-[10px] text-cyan-400 font-bold">
            {progressToFreeShipping}%
          </span>
        </div>
        {/* Progress rail */}
        <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${progressToFreeShipping}%` }}
          />
        </div>
      </div>

      {/* 3. CART ITEMS LIST */}
      <div className="space-y-3">
        {cart.map((item) => (
          <div
            key={item.id}
            className="group relative bg-[#10111b] border border-white/10 hover:border-cyan-400/40 rounded-2xl p-3 flex gap-3 transition-all shadow-md shadow-black/30"
          >
            {/* Thumbnail */}
            <div
              onClick={() => openProductModal(item.product)}
              className="relative w-20 h-24 shrink-0 rounded-xl overflow-hidden bg-black/60 border border-white/10 cursor-pointer"
            >
              <img
                src={item.product.images[0]}
                alt={item.product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>

            {/* Item Details */}
            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3
                    onClick={() => openProductModal(item.product)}
                    className="font-syne font-bold text-sm text-white truncate cursor-pointer hover:text-cyan-300 transition-colors"
                  >
                    {item.product.name}
                  </h3>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1 text-zinc-500 hover:text-pink-400 transition-colors rounded-lg hover:bg-white/5 shrink-0"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Size & Color tags */}
                <div className="flex items-center gap-2 mt-1 text-[11px] font-tech text-zinc-400">
                  <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10 font-cyber font-bold text-zinc-200">
                    SIZE: {item.selectedSize}
                  </span>
                  <span className="truncate max-w-[110px] text-zinc-400">
                    {item.selectedColor.name}
                  </span>
                </div>
              </div>

              {/* Quantity Controls & Price */}
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-0.5">
                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                    className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-7 text-center font-cyber font-bold text-xs text-white">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                    className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <div className="text-right">
                  <span className="font-cyber font-bold text-sm text-white">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                  {item.quantity > 1 && (
                    <span className="block text-[10px] text-zinc-500 font-tech">
                      {formatPrice(item.product.price)} each
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 4. PROMO CODE VOUCHER */}
      <div className="p-3.5 rounded-2xl bg-[#10111a] border border-white/10 space-y-2">
        <form onSubmit={handleApplyPromo} className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
            <input
              type="text"
              value={promoInput}
              onChange={(e) => {
                setPromoInput(e.target.value);
                setPromoError('');
              }}
              placeholder="Promo code (e.g. LIMITLESS20)"
              className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/15 focus:border-cyan-400 rounded-xl text-xs text-white uppercase placeholder:normal-case placeholder:text-zinc-500 font-tech focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-cyber font-bold text-xs rounded-xl transition-all"
          >
            APPLY
          </button>
        </form>

        {promoError && (
          <p className="text-[11px] text-pink-400 font-tech">{promoError}</p>
        )}

        {appliedPromo && (
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-cyan-400/10 border border-cyan-400/30 text-xs font-tech text-cyan-300">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Applied Code: <strong className="font-cyber">{appliedPromo}</strong> (-{formatPrice(discountAmount)})
            </span>
            <button onClick={removePromoCode} className="text-zinc-400 hover:text-white p-0.5">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* 5. ORDER BREAKDOWN SUMMARY */}
      <div className="p-4 rounded-2xl bg-[#10111a] border border-white/10 space-y-2.5 text-xs font-tech">
        <div className="flex justify-between text-zinc-400">
          <span>Subtotal</span>
          <span className="font-cyber text-white">{formatPrice(cartSubtotal)}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-pink-400">
            <span>Discount ({appliedPromo})</span>
            <span className="font-cyber">-{formatPrice(discountAmount)}</span>
          </div>
        )}

        <div className="flex justify-between text-zinc-400">
          <span>Estimated Shipping</span>
          <span className="font-cyber text-white">
            {shippingFee === 0 ? (
              <span className="text-emerald-400">FREE</span>
            ) : (
              formatPrice(shippingFee)
            )}
          </span>
        </div>

        <div className="flex justify-between items-baseline pt-2 border-t border-white/10 text-sm font-bold">
          <span className="text-white font-cyber">TOTAL</span>
          <span className="font-cyber font-black text-lg text-cyan-400">
            {formatPrice(cartTotal)}
          </span>
        </div>
      </div>

      {/* 6. CART ACTIONS */}
      <div className="space-y-2.5 pt-1">
        <button
          onClick={() => setIsCheckoutOpen(true)}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 hover:brightness-110 text-black font-cyber font-black text-sm uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2"
        >
          <span>CHECKOUT NOW</span>
          <ArrowRight className="w-4 h-4 text-black" />
        </button>

        <button
          onClick={() => setActiveTab('shop')}
          className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white font-cyber font-bold text-xs uppercase tracking-wider transition-all text-center block"
        >
          CONTINUE SHOPPING
        </button>
      </div>

      {/* Trust guarantees */}
      <div className="flex items-center justify-center gap-4 text-[10px] text-zinc-400 font-tech pt-2">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> 256-Bit Encrypted
        </span>
        <span className="flex items-center gap-1">
          <Truck className="w-3.5 h-3.5 text-pink-400" /> Fast Cyber Dispatch
        </span>
      </div>
    </div>
  );
};
