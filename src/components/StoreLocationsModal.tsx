import React from 'react';
import { X, MapPin, Clock, Phone, Navigation, ShieldCheck, Check } from 'lucide-react';
import { STORE_LOCATIONS } from '../data/clothingStoreData';
import { StoreLocation } from '../types';
import { useApp } from '../context/AppContext';

interface StoreLocationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StoreLocationsModal: React.FC<StoreLocationsModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useApp();

  if (!isOpen) return null;

  const handleDirections = (store: StoreLocation) => {
    showToast({
      title: `${store.name}`,
      description: `Opening navigation coordinates: ${store.coordinates}`,
      type: 'info',
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col justify-between overflow-y-auto animate-fadeIn">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-[#080910]/95 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-cyan-400 font-cyber text-[10px] font-bold tracking-widest uppercase">
            <MapPin className="w-3.5 h-3.5" /> GLOBAL FLAGSHIPS
          </div>
          <h2 className="font-syne font-bold text-base text-white">
            Physical Vaults & Boutique Studios
          </h2>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Stores List */}
      <div className="max-w-xl mx-auto w-full px-4 py-4 space-y-5 pb-16">
        <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-400/30 text-xs text-cyan-200 font-tech flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Complimentary In-Store Pickup & Vault Try-Ons available at all flagships.</span>
        </div>

        {STORE_LOCATIONS.map((store) => (
          <div
            key={store.id}
            className="rounded-3xl overflow-hidden border border-white/15 bg-[#0e0f18] shadow-2xl shadow-cyan-950/20 space-y-3"
          >
            {/* Image Header */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
              <img
                src={store.image}
                alt={store.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0f18] via-transparent to-black/60" />

              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-cyan-500 text-black text-[9px] font-cyber font-black uppercase shadow-lg">
                  {store.city}
                </span>
                <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md border border-white/10 text-emerald-400 text-[8px] font-tech flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {store.status}
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="font-cyber font-black text-lg text-white uppercase tracking-tight">
                  {store.name}
                </h3>
                <span className="text-xs font-tech text-zinc-300">
                  {store.coordinates}
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="p-4 space-y-3 pt-0">
              <div className="space-y-1.5 text-xs text-zinc-300 font-tech">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{store.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                  <span>{store.hours}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{store.phone}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-white/10 flex items-center gap-2">
                <button
                  onClick={() => handleDirections(store)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-cyber font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-cyan-400/20"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  GET DIRECTIONS
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
