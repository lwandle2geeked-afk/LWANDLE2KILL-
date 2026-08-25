import React, { useState } from 'react';
import {
  User,
  Package,
  Heart,
  MapPin,
  Bell,
  Settings,
  HelpCircle,
  ChevronRight,
  Shield,
  Sparkles,
  Volume2,
  VolumeX,
  Plus,
  ExternalLink,
  MessageSquare,
  CheckCircle2,
  Truck,
  RotateCcw,
  Globe,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PRODUCTS } from '../../data/products';
import { ProductCard } from '../ProductCard';
import { CurrencySwitcherSection } from '../CurrencySwitcherSection';
import { ShippingAddress } from '../../types';

type AccountSubSection =
  | 'overview'
  | 'orders'
  | 'wishlist'
  | 'addresses'
  | 'notifications'
  | 'settings'
  | 'support';

export const AccountView: React.FC = () => {
  const {
    orders,
    wishlist,
    savedAddresses,
    addSavedAddress,
    formatPrice,
    soundEnabled,
    setSoundEnabled,
    currency,
    activeCurrencyInfo,
    userLocation,
    setActiveTab,
    showToast,
  } = useApp();

  const [activeSection, setActiveSection] = useState<AccountSubSection>('overview');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<string | null>(null);

  // New address modal state
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<ShippingAddress>({
    fullName: '',
    email: '',
    phone: '',
    addressLine1: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
  });

  // Support chat state
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'bot' | 'user'; text: string }>>([
    { sender: 'bot', text: 'CYBER BOT // LIMITLESS VIP CONCIERGE. How can we assist your drip today?' },
  ]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    const userText = chatMessage;
    setChatHistory((prev) => [...prev, { sender: 'user', text: userText }]);
    setChatMessage('');

    setTimeout(() => {
      let botReply = "All LIMITLESS garments are custom-crafted with ultra-heavyweight cottons. We've logged your inquiry and a concierge agent is reviewing!";
      const lower = userText.toLowerCase();
      if (lower.includes('size') || lower.includes('fit')) {
        botReply = "Our garments feature an oversized Y2K boxy drape. If you prefer a tailored fit, we recommend sizing down one size.";
      } else if (lower.includes('shipping') || lower.includes('track') || lower.includes('delivery')) {
        botReply = "Orders are dispatched within 24 hours via Cyber Express. You can track live orbital status directly in the My Orders tab.";
      } else if (lower.includes('return') || lower.includes('refund')) {
        botReply = "We offer a 30-day hassle-free return window on all unworn items with original LIMITLESS chrome tags intact.";
      }
      setChatHistory((prev) => [...prev, { sender: 'bot', text: botReply }]);
    }, 600);
  };

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.fullName || !newAddress.addressLine1) return;
    addSavedAddress(newAddress);
    setIsAddingAddress(false);
    setNewAddress({
      fullName: '',
      email: '',
      phone: '',
      addressLine1: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'United States',
    });
  };

  const wishlistedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="px-4 pb-28 pt-2 max-w-lg mx-auto space-y-5">
      {/* 1. VIP USER PROFILE CARD */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#181128] via-[#10111d] to-[#0a1829] border border-white/15 p-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            {/* User Avatar */}
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 p-[1px] shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-[#0d0f1a] rounded-[15px] flex items-center justify-center font-cyber font-black text-white text-lg">
                AV
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-syne font-black text-lg text-white">Alex Vance</h1>
                <span className="px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 text-[9px] font-cyber font-bold border border-cyan-400/40">
                  VIP LEVEL 3
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-tech">alex.vance@limitless.drop</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-tech text-zinc-400 block uppercase">CYBER VAULT COINS</span>
            <span className="font-cyber font-black text-sm text-cyan-400 flex items-center justify-end gap-1">
              <Sparkles className="w-3.5 h-3.5" /> 1,450 PTS
            </span>
          </div>
        </div>

        {/* Member Perk Bar */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-300 font-tech">
          <span className="flex items-center gap-1 text-pink-300">
            <Shield className="w-3.5 h-3.5" /> Cyber Drop Early Access Active
          </span>
          <span className="text-zinc-500 font-tech">Member since &apos;25</span>
        </div>
      </div>

      {/* 2. ACCOUNT NAVIGATION TABS / ACCORDION */}
      {activeSection !== 'overview' && (
        <button
          onClick={() => setActiveSection('overview')}
          className="text-xs font-cyber text-cyan-400 hover:underline flex items-center gap-1"
        >
          ← BACK TO ACCOUNT MENU
        </button>
      )}

      {/* OVERVIEW MENU */}
      {activeSection === 'overview' && (
        <div className="space-y-2.5">
          {/* My Orders */}
          <button
            onClick={() => setActiveSection('orders')}
            className="w-full p-4 rounded-2xl bg-[#10111b] hover:bg-white/5 border border-white/10 flex items-center justify-between transition-all active:scale-[0.99] group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-cyber font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                  MY ORDERS
                </h3>
                <p className="text-xs text-zinc-400 font-tech">
                  {orders.length} orders placed • View tracking & status
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white" />
          </button>

          {/* Saved Items / Wishlist */}
          <button
            onClick={() => setActiveSection('wishlist')}
            className="w-full p-4 rounded-2xl bg-[#10111b] hover:bg-white/5 border border-white/10 flex items-center justify-between transition-all active:scale-[0.99] group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
                <Heart className="w-5 h-5 fill-pink-500/30" />
              </div>
              <div>
                <h3 className="font-cyber font-bold text-sm text-white group-hover:text-pink-300 transition-colors">
                  SAVED ITEMS ({wishlist.length})
                </h3>
                <p className="text-xs text-zinc-400 font-tech">
                  Your favorited pieces & wishlist archive
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white" />
          </button>

          {/* Saved Addresses */}
          <button
            onClick={() => setActiveSection('addresses')}
            className="w-full p-4 rounded-2xl bg-[#10111b] hover:bg-white/5 border border-white/10 flex items-center justify-between transition-all active:scale-[0.99] group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-cyber font-bold text-sm text-white group-hover:text-purple-300 transition-colors">
                  SAVED ADDRESSES
                </h3>
                <p className="text-xs text-zinc-400 font-tech">
                  {savedAddresses.length} addresses on file
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white" />
          </button>

          {/* Notifications */}
          <button
            onClick={() => setActiveSection('notifications')}
            className="w-full p-4 rounded-2xl bg-[#10111b] hover:bg-white/5 border border-white/10 flex items-center justify-between transition-all active:scale-[0.99] group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-cyber font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                  NOTIFICATIONS & ALERTS
                </h3>
                <p className="text-xs text-zinc-400 font-tech">
                  Drop announcements & restock alerts
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white" />
          </button>

          {/* Settings */}
          <button
            onClick={() => setActiveSection('settings')}
            className="w-full p-4 rounded-2xl bg-[#10111b] hover:bg-white/5 border border-white/10 flex items-center justify-between transition-all active:scale-[0.99] group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-cyber font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                    CURRENCY & SETTINGS
                  </h3>
                  <span className="px-1.5 py-0.5 rounded bg-cyan-400/20 text-cyan-300 text-[9px] font-cyber font-bold">
                    {activeCurrencyInfo.flag} {activeCurrencyInfo.code} ({activeCurrencyInfo.symbol.trim()})
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-tech">
                  Global currency switcher, location auto-detect, sound FX
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white" />
          </button>

          {/* Help & Support */}
          <button
            onClick={() => setActiveSection('support')}
            className="w-full p-4 rounded-2xl bg-[#10111b] hover:bg-white/5 border border-white/10 flex items-center justify-between transition-all active:scale-[0.99] group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-cyber font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                  HELP & SUPPORT
                </h3>
                <p className="text-xs text-zinc-400 font-tech">
                  FAQ, Sizing guide, 24/7 VIP Cyber Concierge
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white" />
          </button>
        </div>
      )}

      {/* MY ORDERS SECTION */}
      {activeSection === 'orders' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h2 className="font-cyber font-bold text-base text-white uppercase tracking-wider">
              MY ORDERS ({orders.length})
            </h2>
          </div>

          {orders.map((order) => (
            <div
              key={order.id}
              className="p-4 rounded-2xl bg-[#10111b] border border-white/10 space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs font-tech">
                <div>
                  <span className="font-cyber font-bold text-white text-sm block">
                    {order.id}
                  </span>
                  <span className="text-zinc-400">{order.date}</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-cyan-400/15 text-cyan-300 border border-cyan-400/30 text-xs font-cyber font-bold">
                  {order.status}
                </span>
              </div>

              {/* Order Tracking Bar */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2 text-[11px] font-tech">
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="flex items-center gap-1 text-cyan-300">
                    <Truck className="w-3.5 h-3.5" /> {order.trackingCode}
                  </span>
                  <span>{order.estimatedDelivery}</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden flex">
                  <div className="w-2/3 h-full bg-cyan-400 rounded-full" />
                </div>
              </div>

              {/* Items in order */}
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs font-tech">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-14 object-cover rounded-lg border border-white/10"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="font-syne font-bold text-white block truncate">
                        {item.product.name}
                      </span>
                      <span className="text-zinc-400">
                        Size: {item.selectedSize} • Qty: {item.quantity}
                      </span>
                    </div>
                    <span className="font-cyber font-bold text-white">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs font-tech">
                <span className="text-zinc-400">Payment: {order.paymentMethod}</span>
                <span className="font-cyber font-bold text-sm text-cyan-400">
                  Total: {formatPrice(order.total)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SAVED ITEMS / WISHLIST */}
      {activeSection === 'wishlist' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h2 className="font-cyber font-bold text-base text-white uppercase tracking-wider">
              SAVED ITEMS ({wishlistedProducts.length})
            </h2>
          </div>

          {wishlistedProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {wishlistedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-4 rounded-2xl bg-[#10111b] border border-white/10 space-y-3">
              <Heart className="w-10 h-10 text-zinc-500 mx-auto" />
              <p className="font-cyber text-white font-bold text-sm">NO SAVED PIECES YET</p>
              <button
                onClick={() => setActiveTab('shop')}
                className="px-4 py-2 bg-cyan-400 text-black font-cyber font-bold text-xs rounded-xl"
              >
                BROWSE SHOP
              </button>
            </div>
          )}
        </div>
      )}

      {/* ADDRESSES SECTION */}
      {activeSection === 'addresses' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h2 className="font-cyber font-bold text-base text-white uppercase tracking-wider">
              SAVED ADDRESSES
            </h2>
            <button
              onClick={() => setIsAddingAddress(true)}
              className="px-3 py-1.5 rounded-xl bg-cyan-400 text-black font-cyber font-bold text-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> ADD NEW
            </button>
          </div>

          {savedAddresses.map((addr, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#10111b] border border-white/10 space-y-1.5 text-xs font-tech"
            >
              <div className="flex justify-between items-center font-bold text-sm text-white">
                <span>{addr.fullName}</span>
                {idx === 0 && (
                  <span className="px-2 py-0.5 rounded bg-white/10 text-zinc-300 text-[10px] font-cyber">
                    DEFAULT
                  </span>
                )}
              </div>
              <p className="text-zinc-300">{addr.addressLine1}</p>
              <p className="text-zinc-400">
                {addr.city}, {addr.state} {addr.postalCode} • {addr.country}
              </p>
              <p className="text-zinc-500">{addr.phone}</p>
            </div>
          ))}

          {isAddingAddress && (
            <form
              onSubmit={handleSaveNewAddress}
              className="p-4 rounded-2xl bg-[#12131e] border border-cyan-400/40 space-y-3 text-xs font-tech"
            >
              <h3 className="font-cyber font-bold text-white text-xs">NEW ADDRESS</h3>
              <input
                type="text"
                placeholder="Full Name"
                value={newAddress.fullName}
                onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white"
                required
              />
              <input
                type="text"
                placeholder="Street Address"
                value={newAddress.addressLine1}
                onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white"
                required
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Postal Code"
                  value={newAddress.postalCode}
                  onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white"
                  required
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingAddress(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-white/5 text-zinc-300 font-cyber font-bold text-xs"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-cyan-400 text-black font-cyber font-bold text-xs"
                >
                  SAVE ADDRESS
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* NOTIFICATIONS SECTION */}
      {activeSection === 'notifications' && (
        <div className="space-y-3 animate-fadeIn">
          <h2 className="font-cyber font-bold text-base text-white uppercase tracking-wider">
            NOTIFICATIONS & DROP LOGS
          </h2>

          <div className="p-3.5 rounded-2xl bg-[#10111b] border border-cyan-400/30 space-y-1">
            <div className="flex justify-between items-center text-xs font-cyber text-cyan-400">
              <span className="font-bold">⚡ SECRET DROP #04 IS LIVE</span>
              <span className="text-[10px] text-zinc-500 font-tech">2 hrs ago</span>
            </div>
            <p className="text-xs text-zinc-300 font-tech">
              The LIMITLESS Racing Jacket and Chrome Tee are now unlocked in strictly limited runs.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#10111b] border border-white/10 space-y-1">
            <div className="flex justify-between items-center text-xs font-cyber text-purple-400">
              <span className="font-bold">📦 ORDER #LM-83921 DISPATCHED</span>
              <span className="text-[10px] text-zinc-500 font-tech">Yesterday</span>
            </div>
            <p className="text-xs text-zinc-300 font-tech">
              Your parcel is in transit with Orbital Express. Estimated delivery tomorrow.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#10111b] border border-white/10 space-y-1">
            <div className="flex justify-between items-center text-xs font-cyber text-pink-400">
              <span className="font-bold">✨ VIP CONCIERGE BONUS</span>
              <span className="text-[10px] text-zinc-500 font-tech">3 days ago</span>
            </div>
            <p className="text-xs text-zinc-300 font-tech">
              You earned +350 Cyber Vault points from your recent streetwear order.
            </p>
          </div>
        </div>
      )}

      {/* SETTINGS SECTION */}
      {activeSection === 'settings' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h2 className="font-cyber font-bold text-base text-white uppercase tracking-wider">
              CURRENCY & APP PREFERENCES
            </h2>
          </div>

          {/* Global Currency Switcher & Location Intelligence */}
          <CurrencySwitcherSection />

          {/* Additional App Preferences */}
          <div className="p-4 rounded-2xl bg-[#10111b] border border-white/10 space-y-4 text-xs font-tech">
            <h4 className="font-cyber font-bold text-xs text-white uppercase tracking-wider">
              HARDWARE & AUDIO FX
            </h4>

            {/* Sound FX Toggle */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="font-bold text-white text-sm block">Cyber Audio Effects</span>
                <span className="text-zinc-400">Tactile haptic clicks, laser additions & chimes</span>
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`px-3 py-2 rounded-xl border flex items-center gap-1.5 font-cyber font-bold text-xs transition-all ${
                  soundEnabled
                    ? 'bg-cyan-400 text-black border-cyan-400 shadow-md shadow-cyan-400/20'
                    : 'bg-white/5 text-zinc-400 border-white/10 hover:text-white'
                }`}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                {soundEnabled ? 'ON' : 'MUTED'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HELP & SUPPORT SECTION */}
      {activeSection === 'support' && (
        <div className="space-y-4 animate-fadeIn">
          <h2 className="font-cyber font-bold text-base text-white uppercase tracking-wider">
            HELP & 24/7 CYBER CONCIERGE
          </h2>

          {/* Interactive Live Support Chat */}
          <div className="p-4 rounded-2xl bg-[#10111b] border border-white/10 space-y-3">
            <h3 className="font-cyber font-bold text-xs text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" /> LIVE VIP BOT CONCIERGE
            </h3>

            <div className="max-h-48 overflow-y-auto space-y-2 p-2 rounded-xl bg-black/40 border border-white/5 text-xs font-tech">
              {chatHistory.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl max-w-[85%] ${
                    item.sender === 'user'
                      ? 'ml-auto bg-cyan-500/20 text-cyan-100 border border-cyan-400/30'
                      : 'bg-white/5 text-zinc-200 border border-white/10'
                  }`}
                >
                  <p>{item.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChat} className="flex gap-2">
              <input
                type="text"
                placeholder="Ask about sizing, shipping, or returns..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="flex-1 px-3 py-2 bg-white/5 border border-white/15 focus:border-cyan-400 rounded-xl text-xs text-white placeholder:text-zinc-500 font-tech focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-cyber font-bold text-xs rounded-xl"
              >
                SEND
              </button>
            </form>
          </div>

          {/* FAQ Accordions */}
          <div className="space-y-2 text-xs font-tech">
            <div className="p-3.5 rounded-2xl bg-[#10111b] border border-white/10 space-y-1">
              <h4 className="font-bold text-white">How does LIMITLESS streetwear fit?</h4>
              <p className="text-zinc-400">
                All garments feature signature Y2K boxy cuts and heavyweight GSM fabrics. For standard drape stay true to size; for dramatic skater puddle stack, size up.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#10111b] border border-white/10 space-y-1">
              <h4 className="font-bold text-white">How fast is Cyber Express delivery?</h4>
              <p className="text-zinc-400">
                Orders dispatch in 24 hours. Express delivers in 2-3 business days with real-time orbital GPS tracking.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
