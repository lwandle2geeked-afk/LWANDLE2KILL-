import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  User,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { ShippingAddress, Order } from '../../types';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    discountAmount,
    shippingFee,
    cartTotal,
    appliedPromo,
    formatPrice,
    placeOrder,
    setActiveTab,
  } = useApp();

  const [step, setStep] = useState<'details' | 'shipping' | 'payment' | 'success'>('details');
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Form states
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: 'Alex Vance',
    email: 'alex.vance@limitless.drop',
    phone: '+1 (555) 942-8821',
    addressLine1: '742 Evergreen Cyberway, Apt 4B',
    city: 'Los Angeles',
    state: 'CA',
    postalCode: '90013',
    country: 'United States',
  });

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('express');
  const [paymentMethod, setPaymentMethod] = useState<'apple_pay' | 'card' | 'klarna' | 'crypto'>('apple_pay');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('777');

  if (!isCheckoutOpen) return null;

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const order = placeOrder(address, paymentMethod.toUpperCase().replace('_', ' '));
      setCreatedOrder(order);
      setIsProcessing(false);
      setStep('success');

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00f0ff', '#a855f7', '#ec4899', '#ffffff'],
        });
      } catch {
        // Fallback
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xl animate-fadeIn flex flex-col justify-between">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 bg-[#08080d]/90 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-cyber font-black text-xs uppercase tracking-widest text-white">
            LIMITLESS ENCRYPTED CHECKOUT
          </span>
        </div>

        {step !== 'success' && (
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="max-w-lg mx-auto w-full px-4 py-4 space-y-6 pb-28">
        {/* Step Indicator */}
        {step !== 'success' && (
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-cyber font-bold">
            <div
              className={`p-2 rounded-xl border transition-all ${
                step === 'details'
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                  : 'bg-white/5 border-white/10 text-zinc-400'
              }`}
            >
              1. ADDRESS
            </div>
            <div
              className={`p-2 rounded-xl border transition-all ${
                step === 'shipping'
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                  : 'bg-white/5 border-white/10 text-zinc-400'
              }`}
            >
              2. DELIVERY
            </div>
            <div
              className={`p-2 rounded-xl border transition-all ${
                step === 'payment'
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                  : 'bg-white/5 border-white/10 text-zinc-400'
              }`}
            >
              3. PAYMENT
            </div>
          </div>
        )}

        {/* STEP 1: CUSTOMER & DELIVERY DETAILS */}
        {step === 'details' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-2xl bg-[#10111b] border border-white/10 space-y-3">
              <h2 className="font-cyber font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-400" /> CONTACT & CUSTOMER INFO
              </h2>

              <div className="space-y-2.5 text-xs font-tech">
                <div>
                  <label className="block text-zinc-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/15 focus:border-cyan-400 rounded-xl text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-zinc-400 mb-1">Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        value={address.email}
                        onChange={(e) => setAddress({ ...address, email: e.target.value })}
                        className="w-full px-3 py-2 bg-white/5 border border-white/15 focus:border-cyan-400 rounded-xl text-white focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/15 focus:border-cyan-400 rounded-xl text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#10111b] border border-white/10 space-y-3">
              <h2 className="font-cyber font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-pink-400" /> DELIVERY ADDRESS
              </h2>

              <div className="space-y-2.5 text-xs font-tech">
                <div>
                  <label className="block text-zinc-400 mb-1">Street Address</label>
                  <input
                    type="text"
                    value={address.addressLine1}
                    onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/15 focus:border-cyan-400 rounded-xl text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-zinc-400 mb-1">City</label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/15 focus:border-cyan-400 rounded-xl text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">State / Prov</label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/15 focus:border-cyan-400 rounded-xl text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">Postal Code</label>
                    <input
                      type="text"
                      value={address.postalCode}
                      onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/15 focus:border-cyan-400 rounded-xl text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Country</label>
                  <select
                    value={address.country}
                    onChange={(e) => setAddress({ ...address, country: e.target.value })}
                    className="w-full px-3 py-2 bg-[#12131e] border border-white/15 focus:border-cyan-400 rounded-xl text-white focus:outline-none"
                  >
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Japan">Japan (Tokyo Cyber Vault)</option>
                    <option value="Canada">Canada</option>
                    <option value="Germany">Germany</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep('shipping')}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-cyber font-black text-xs uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2"
            >
              <span>CONTINUE TO DELIVERY</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          </div>
        )}

        {/* STEP 2: SHIPPING SPEED */}
        {step === 'shipping' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-2xl bg-[#10111b] border border-white/10 space-y-3">
              <h2 className="font-cyber font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-4 h-4 text-cyan-400" /> SELECT SHIPPING SPEED
              </h2>

              <div className="space-y-2">
                <label
                  onClick={() => setShippingMethod('express')}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    shippingMethod === 'express'
                      ? 'bg-cyan-500/15 border-cyan-400'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border-2 border-cyan-400 flex items-center justify-center">
                      {shippingMethod === 'express' && <div className="w-2 h-2 rounded-full bg-cyan-400" />}
                    </div>
                    <div>
                      <span className="font-cyber font-bold text-xs text-white block">
                        CYBER EXPRESS (ORBITAL PRIORITY)
                      </span>
                      <span className="text-[11px] text-zinc-400 font-tech">
                        Estimated 2-3 Business Days • Full Live Tracking
                      </span>
                    </div>
                  </div>
                  <span className="font-cyber font-bold text-xs text-cyan-300">
                    {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
                  </span>
                </label>

                <label
                  onClick={() => setShippingMethod('standard')}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    shippingMethod === 'standard'
                      ? 'bg-cyan-500/15 border-cyan-400'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border-2 border-zinc-500 flex items-center justify-center">
                      {shippingMethod === 'standard' && <div className="w-2 h-2 rounded-full bg-cyan-400" />}
                    </div>
                    <div>
                      <span className="font-cyber font-bold text-xs text-white block">
                        STANDARD GROUND FREIGHT
                      </span>
                      <span className="text-[11px] text-zinc-400 font-tech">
                        Estimated 4-6 Business Days
                      </span>
                    </div>
                  </div>
                  <span className="font-cyber font-bold text-xs text-zinc-400">
                    FREE
                  </span>
                </label>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStep('details')}
                className="w-1/3 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-cyber font-bold text-zinc-300"
              >
                BACK
              </button>
              <button
                onClick={() => setStep('payment')}
                className="w-2/3 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-cyber font-black text-xs uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2"
              >
                <span>PROCEED TO PAYMENT</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PAYMENT & SUMMARY */}
        {step === 'payment' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Payment Method Selector */}
            <div className="p-4 rounded-2xl bg-[#10111b] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-cyber font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-cyan-400" /> PAYMENT METHOD
                </h2>
                <span className="text-[10px] text-emerald-400 font-tech font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3" /> TEST MODE ACTIVE
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`p-3 rounded-xl border text-left font-cyber font-bold text-xs transition-all ${
                    paymentMethod === 'apple_pay'
                      ? 'bg-white text-black border-white shadow-lg'
                      : 'bg-white/5 border-white/10 text-white'
                  }`}
                >
                   Apple Pay
                </button>

                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-left font-cyber font-bold text-xs transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-cyan-400 text-black border-cyan-400 shadow-lg'
                      : 'bg-white/5 border-white/10 text-white'
                  }`}
                >
                  💳 Credit Card
                </button>

                <button
                  onClick={() => setPaymentMethod('klarna')}
                  className={`p-3 rounded-xl border text-left font-cyber font-bold text-xs transition-all ${
                    paymentMethod === 'klarna'
                      ? 'bg-pink-500 text-white border-pink-500 shadow-lg'
                      : 'bg-white/5 border-white/10 text-white'
                  }`}
                >
                  💖 Klarna (4x)
                </button>

                <button
                  onClick={() => setPaymentMethod('crypto')}
                  className={`p-3 rounded-xl border text-left font-cyber font-bold text-xs transition-all ${
                    paymentMethod === 'crypto'
                      ? 'bg-purple-500 text-white border-purple-500 shadow-lg'
                      : 'bg-white/5 border-white/10 text-white'
                  }`}
                >
                  ⚡ CyberPay
                </button>
              </div>

              {/* Card Inputs if Card chosen */}
              {paymentMethod === 'card' && (
                <div className="space-y-2 pt-2 border-t border-white/10 text-xs font-tech">
                  <div>
                    <label className="block text-zinc-400 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-white font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-zinc-400 mb-1">Expiry</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 mb-1">CVC</label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Final Order Review Summary */}
            <div className="p-4 rounded-2xl bg-[#10111b] border border-white/10 space-y-2 text-xs font-tech">
              <h3 className="font-cyber font-bold text-xs text-zinc-300 uppercase tracking-wider">
                ORDER REVIEW ({cart.length} ITEMS)
              </h3>

              <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1 divide-y divide-white/5">
                {cart.map((item) => (
                  <div key={item.id} className="pt-1.5 flex justify-between items-center text-zinc-300">
                    <span className="truncate max-w-[200px]">
                      {item.product.name} ({item.selectedSize}) × {item.quantity}
                    </span>
                    <span className="font-cyber font-bold text-white">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-white/10 space-y-1 text-zinc-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartSubtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-pink-400">
                    <span>Discount ({appliedPromo})</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-white/10 text-sm font-bold text-white">
                  <span className="font-cyber">TOTAL AMOUNT</span>
                  <span className="font-cyber font-black text-base text-cyan-400">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setStep('shipping')}
                className="w-1/3 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-cyber font-bold text-zinc-300"
              >
                BACK
              </button>

              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-2/3 py-4 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-black font-cyber font-black text-xs uppercase tracking-wider transition-all active:scale-95 shadow-xl shadow-cyan-500/30 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span className="animate-pulse">ENCRYPTING ORDER...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-black" />
                    <span>PLACE TEST ORDER ({formatPrice(cartTotal)})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: ORDER CONFIRMED SUCCESS VIEW */}
        {step === 'success' && createdOrder && (
          <div className="text-center py-6 space-y-5 animate-fadeIn">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-cyber text-[10px] font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3 h-3" /> ORDER CONFIRMED
              </div>
              <h2 className="font-cyber font-black text-2xl text-white uppercase tracking-tight">
                WELCOME TO THE ARCHIVE.
              </h2>
              <p className="text-xs text-zinc-300 font-tech mt-1">
                Order <strong className="text-cyan-400 font-cyber">{createdOrder.id}</strong> has been received and queued for dispatch.
              </p>
            </div>

            {/* Order Card Overview */}
            <div className="p-4 rounded-2xl bg-[#10111b] border border-white/15 text-left text-xs font-tech space-y-3 shadow-xl">
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-zinc-400">Tracking Code</span>
                <span className="font-mono font-bold text-cyan-300">{createdOrder.trackingCode}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-zinc-400">Estimated Delivery</span>
                <span className="font-bold text-white">{createdOrder.estimatedDelivery}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-zinc-400">Ship To</span>
                <span className="font-medium text-white truncate max-w-[200px]">
                  {createdOrder.shippingAddress.fullName}, {createdOrder.shippingAddress.city}
                </span>
              </div>

              <div className="flex justify-between items-center font-bold text-sm pt-1 text-white">
                <span className="font-cyber">Total Paid</span>
                <span className="font-cyber text-cyan-400">{formatPrice(createdOrder.total)}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  setIsCheckoutOpen(false);
                  setActiveTab('account');
                }}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-cyber font-black text-xs uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-cyan-500/25"
              >
                VIEW ORDER IN MY ACCOUNT
              </button>

              <button
                onClick={() => {
                  setIsCheckoutOpen(false);
                  setActiveTab('home');
                }}
                className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 font-cyber font-bold text-xs uppercase tracking-wider"
              >
                BACK TO HOME
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
