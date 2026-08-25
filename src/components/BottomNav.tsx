import React from 'react';
import { Home, ShoppingBag, Sparkles, ShoppingCart, User, Layers } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TabType } from '../types';

interface NavItem {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  isSpecial?: boolean;
}

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, cartCount } = useApp();

  const navItems: NavItem[] = [
    { id: 'home', label: 'HOME', icon: Home },
    { id: 'shop', label: 'SHOP', icon: ShoppingBag },
    { id: 'lookbook', label: 'LOOKS', icon: Layers },
    { id: 'new', label: 'NEW', icon: Sparkles, isSpecial: true },
    { id: 'cart', label: 'CART', icon: ShoppingCart, badge: cartCount },
    { id: 'account', label: 'ACCOUNT', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0c0d14]/95 backdrop-blur-2xl border-t border-white/10 px-1 py-1.5 pb-safe">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition-all duration-200 active:scale-90 group ${
                isActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {/* Active glow background */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/15 via-purple-500/10 to-transparent rounded-xl border border-cyan-400/25 shadow-lg shadow-cyan-500/20" />
              )}

              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive
                      ? item.isSpecial
                        ? 'text-pink-400 scale-110'
                        : 'text-cyan-400 scale-110'
                      : item.isSpecial
                      ? 'text-pink-400/80 group-hover:scale-105'
                      : 'group-hover:scale-105'
                  }`}
                />

                {/* Badge for Cart or Special Drops */}
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-4.5 h-4.5 px-1 bg-gradient-to-r from-cyan-400 to-blue-500 text-[9px] font-cyber font-bold text-black rounded-full flex items-center justify-center border-2 border-[#0c0d14] animate-cart-bounce">
                    {item.badge}
                  </span>
                )}

                {item.id === 'new' && !isActive && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full animate-ping" />
                )}
              </div>

              <span
                className={`text-[8.5px] font-cyber tracking-wider mt-1 transition-all ${
                  isActive ? 'font-bold text-cyan-300' : 'font-medium'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

