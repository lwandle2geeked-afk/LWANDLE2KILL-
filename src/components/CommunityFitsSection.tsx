import React, { useState } from 'react';
import { Heart, Sparkles, ShoppingBag, Eye, Camera, Check, MapPin, Plus, Share2 } from 'lucide-react';
import { COMMUNITY_FITS } from '../data/clothingStoreData';
import { PRODUCTS } from '../data/products';
import { useApp } from '../context/AppContext';
import { CommunityFit } from '../types';

export const CommunityFitsSection: React.FC = () => {
  const { openProductModal, addToCart, formatPrice, showToast } = useApp();
  const [fits, setFits] = useState<CommunityFit[]>(COMMUNITY_FITS);
  const [likedFitIds, setLikedFitIds] = useState<string[]>([]);
  const [activeFitModal, setActiveFitModal] = useState<CommunityFit | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Upload fit simulation state
  const [uploadHandle, setUploadHandle] = useState('@');
  const [uploadCity, setUploadCity] = useState('');
  const [uploadNotes, setUploadNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggleLike = (fitId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isCurrentlyLiked = likedFitIds.includes(fitId);

    setLikedFitIds((prev) =>
      isCurrentlyLiked ? prev.filter((id) => id !== fitId) : [...prev, fitId]
    );

    setFits((prev) =>
      prev.map((fit) => {
        if (fit.id === fitId) {
          return {
            ...fit,
            likesCount: isCurrentlyLiked ? fit.likesCount - 1 : fit.likesCount + 1,
          };
        }
        return fit;
      })
    );
  };

  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newFit: CommunityFit = {
        id: `fit-${Date.now()}`,
        userHandle: uploadHandle.startsWith('@') ? uploadHandle : `@${uploadHandle}`,
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        userCity: uploadCity || 'Tokyo, Japan',
        image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=85',
        modelMeasurements: {
          height: "5'11\" (180 cm)",
          weight: '160 lbs',
          sizeWorn: 'Size L (Oversized)',
          fitType: 'Streetwear Stack',
        },
        stylingNotes: uploadNotes || 'Styled with LIMITLESS archive vault pieces.',
        taggedProductIds: ['lm-01', 'lm-03'],
        likesCount: 1,
      };

      setFits([newFit, ...fits]);
      setIsSubmitting(false);
      setIsUploadModalOpen(false);
      setUploadHandle('@');
      setUploadCity('');
      setUploadNotes('');

      showToast({
        title: 'FIT SUBMITTED FOR REVIEW',
        description: 'Your street snap is now featured on the community feed!',
        type: 'success',
      });
    }, 800);
  };

  return (
    <section className="px-4 space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 text-cyan-400 font-cyber text-[10px] font-bold tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            STREET SNAPS
          </div>
          <h2 className="font-editorial text-xl sm:text-2xl text-white tracking-tight italic mt-0.5">
            As Seen <span className="font-cyber not-italic font-black text-white text-lg sm:text-xl">ON THE STREET</span>
          </h2>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-cyber text-[10px] font-bold tracking-wider uppercase transition-all active:scale-95 flex items-center gap-1.5"
        >
          <Camera className="w-3 h-3 text-cyan-400" />
          TAG YOUR FIT
        </button>
      </div>

      {/* Street Snaps Grid */}
      <div className="grid grid-cols-2 gap-3">
        {fits.map((fit) => {
          const isLiked = likedFitIds.includes(fit.id);
          const firstTaggedProduct = PRODUCTS.find((p) => p.id === fit.taggedProductIds[0]);

          return (
            <div
              key={fit.id}
              onClick={() => setActiveFitModal(fit)}
              className="group relative rounded-2xl overflow-hidden border border-white/10 bg-[#0e0f17] cursor-pointer hover:border-cyan-400/50 transition-all duration-300 shadow-xl"
            >
              {/* Image Container */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-black">
                <img
                  src={fit.image}
                  alt={fit.userHandle}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />

                {/* Top Badge: User City */}
                <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 text-[9px] font-tech text-zinc-300">
                  <MapPin className="w-2.5 h-2.5 text-cyan-400" />
                  <span className="truncate max-w-[80px]">{fit.userCity.split(',')[0]}</span>
                </div>

                {/* Top Right: Heart Like Button */}
                <button
                  onClick={(e) => handleToggleLike(fit.id, e)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:text-pink-400 transition-all active:scale-90"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      isLiked ? 'text-pink-500 fill-pink-500' : 'text-zinc-300'
                    }`}
                  />
                </button>

                {/* Bottom Overlay: Handle & Tagged Garment */}
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="flex items-center gap-1.5 mb-1">
                    <img
                      src={fit.userAvatar}
                      alt=""
                      className="w-4 h-4 rounded-full border border-cyan-400 object-cover"
                    />
                    <span className="text-[10px] font-cyber font-bold text-white truncate">
                      {fit.userHandle}
                    </span>
                  </div>

                  <span className="text-[9px] font-tech text-zinc-300 block bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10 truncate">
                    {fit.modelMeasurements.sizeWorn}
                  </span>

                  {firstTaggedProduct && (
                    <div className="mt-1.5 pt-1.5 border-t border-white/10 flex items-center justify-between text-[9px] font-cyber font-bold text-cyan-300">
                      <span className="truncate max-w-[90px]">{firstTaggedProduct.name}</span>
                      <span className="text-white">{formatPrice(firstTaggedProduct.price)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Street Snap Detail Modal */}
      {activeFitModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#0e0f18] border border-cyan-400/40 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl space-y-4 max-h-[90vh] flex flex-col justify-between">
            {/* Modal Image Header */}
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-black">
              <img
                src={activeFitModal.image}
                alt={activeFitModal.userHandle}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0f18] via-transparent to-black/60 pointer-events-none" />

              {/* Close button */}
              <button
                onClick={() => setActiveFitModal(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 backdrop-blur-md text-white flex items-center justify-center border border-white/20 hover:bg-white/20 transition-colors"
              >
                ✕
              </button>

              {/* User info on image */}
              <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/15">
                <img
                  src={activeFitModal.userAvatar}
                  alt=""
                  className="w-6 h-6 rounded-full border border-cyan-400 object-cover"
                />
                <div>
                  <span className="font-cyber font-bold text-xs text-white block leading-none">
                    {activeFitModal.userHandle}
                  </span>
                  <span className="text-[9px] text-zinc-400 font-tech">
                    {activeFitModal.userCity}
                  </span>
                </div>
              </div>

              {/* Bottom specs overlay */}
              <div className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl bg-black/80 backdrop-blur-md border border-white/10 space-y-1">
                <div className="grid grid-cols-2 gap-2 text-[10px] font-tech text-zinc-300">
                  <div>
                    <span className="text-zinc-500 block text-[8px]">HEIGHT / WEIGHT</span>
                    {activeFitModal.modelMeasurements.height} • {activeFitModal.modelMeasurements.weight}
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[8px]">SIZE & SILHOUETTE</span>
                    {activeFitModal.modelMeasurements.sizeWorn}
                  </div>
                </div>
                <p className="text-xs text-zinc-200 font-normal italic pt-1 border-t border-white/10">
                  "{activeFitModal.stylingNotes}"
                </p>
              </div>
            </div>

            {/* Tagged Products to Shop */}
            <div className="p-4 space-y-3 overflow-y-auto">
              <span className="text-[10px] font-cyber font-bold text-cyan-400 uppercase tracking-wider block">
                PIECES IN THIS FIT ({activeFitModal.taggedProductIds.length})
              </span>

              <div className="space-y-2">
                {activeFitModal.taggedProductIds.map((id) => {
                  const product = PRODUCTS.find((p) => p.id === id);
                  if (!product) return null;

                  return (
                    <div
                      key={product.id}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-14 object-cover rounded-lg border border-white/10 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-syne font-bold text-xs text-white truncate">
                            {product.name}
                          </h4>
                          <span className="font-cyber font-bold text-xs text-cyan-300 block mt-0.5">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            setActiveFitModal(null);
                            openProductModal(product);
                          }}
                          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            addToCart(
                              product,
                              product.sizes[0] || 'M',
                              product.colors[0],
                              1
                            );
                          }}
                          className="py-1.5 px-3 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-cyber font-bold text-[10px] tracking-wider uppercase transition-colors flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> ADD
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tag Your Fit Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#0e0f18] border border-cyan-400/40 rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 text-cyan-400 font-cyber text-[10px] font-bold tracking-widest uppercase">
                <Camera className="w-3 h-3" /> COMMUNITY VAULT UPLOAD
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <h3 className="font-syne font-black text-lg text-white">
              Submit Your Street Snap
            </h3>

            <form onSubmit={handleSimulateUpload} className="space-y-3">
              <div>
                <label className="text-[10px] font-cyber text-zinc-300 uppercase block mb-1">
                  Your Instagram / Social Handle
                </label>
                <input
                  type="text"
                  value={uploadHandle}
                  onChange={(e) => setUploadHandle(e.target.value)}
                  className="w-full py-2.5 px-3 bg-[#141522] border border-white/15 focus:border-cyan-400 rounded-xl text-xs text-white focus:outline-none font-tech"
                  placeholder="@yourname"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-cyber text-zinc-300 uppercase block mb-1">
                  City / Location
                </label>
                <input
                  type="text"
                  value={uploadCity}
                  onChange={(e) => setUploadCity(e.target.value)}
                  className="w-full py-2.5 px-3 bg-[#141522] border border-white/15 focus:border-cyan-400 rounded-xl text-xs text-white focus:outline-none font-tech"
                  placeholder="e.g. London, UK or Tokyo, JP"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-cyber text-zinc-300 uppercase block mb-1">
                  Styling Notes & Fit Description
                </label>
                <textarea
                  value={uploadNotes}
                  onChange={(e) => setUploadNotes(e.target.value)}
                  rows={2}
                  className="w-full py-2 px-3 bg-[#141522] border border-white/15 focus:border-cyan-400 rounded-xl text-xs text-white focus:outline-none font-tech"
                  placeholder="How did you style this piece? What size are you wearing?"
                />
              </div>

              <div className="p-3 rounded-xl border border-dashed border-cyan-400/40 bg-cyan-950/20 text-center text-xs text-cyan-300 font-tech">
                📸 Photo auto-selected from device library
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-cyber font-black text-xs uppercase tracking-wider transition-all hover:brightness-110 active:scale-95 shadow-lg shadow-cyan-500/20"
              >
                {isSubmitting ? 'UPLOADING TO VAULT...' : 'POST STREET SNAP'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
