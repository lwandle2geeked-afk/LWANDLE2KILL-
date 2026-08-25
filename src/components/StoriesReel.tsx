import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, ShoppingBag, Eye, Sparkles } from 'lucide-react';
import { ClothingStory, StorySlide, Product } from '../types';
import { CLOTHING_STORIES } from '../data/clothingStoreData';
import { PRODUCTS } from '../data/products';
import { useApp } from '../context/AppContext';

export const StoriesReel: React.FC = () => {
  const [activeStory, setActiveStory] = useState<ClothingStory | null>(null);
  const [viewedStoryIds, setViewedStoryIds] = useState<string[]>([]);

  const handleOpenStory = (story: ClothingStory) => {
    setActiveStory(story);
    if (!viewedStoryIds.includes(story.id)) {
      setViewedStoryIds((prev) => [...prev, story.id]);
    }
  };

  return (
    <>
      <div className="flex gap-3 overflow-x-auto no-scrollbar py-2 -mx-4 px-4">
        {CLOTHING_STORIES.map((story) => {
          const isViewed = viewedStoryIds.includes(story.id);
          return (
            <button
              key={story.id}
              onClick={() => handleOpenStory(story)}
              className="flex flex-col items-center gap-1.5 shrink-0 group active:scale-95 transition-transform"
            >
              {/* Outer gradient story ring */}
              <div
                className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full p-0.5 flex items-center justify-center transition-all ${
                  isViewed
                    ? 'border-2 border-white/20'
                    : 'bg-gradient-to-tr from-cyan-400 via-pink-500 to-amber-400 p-[2.5px] shadow-lg shadow-cyan-500/20 group-hover:scale-105'
                }`}
              >
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#08080d] bg-black">
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-[10px] font-syne font-bold text-zinc-300 group-hover:text-white max-w-[70px] truncate">
                  {story.title}
                </span>
                <span className="text-[8px] font-cyber text-cyan-400 font-bold uppercase tracking-wider">
                  {story.badge}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Full-Screen Interactive Story Modal */}
      {activeStory && (
        <StoryViewerModal
          story={activeStory}
          onClose={() => setActiveStory(null)}
          onNextStory={() => {
            const currentIndex = CLOTHING_STORIES.findIndex((s) => s.id === activeStory.id);
            if (currentIndex < CLOTHING_STORIES.length - 1) {
              setActiveStory(CLOTHING_STORIES[currentIndex + 1]);
            } else {
              setActiveStory(null);
            }
          }}
          onPrevStory={() => {
            const currentIndex = CLOTHING_STORIES.findIndex((s) => s.id === activeStory.id);
            if (currentIndex > 0) {
              setActiveStory(CLOTHING_STORIES[currentIndex - 1]);
            }
          }}
        />
      )}
    </>
  );
};

interface StoryViewerModalProps {
  story: ClothingStory;
  onClose: () => void;
  onNextStory: () => void;
  onPrevStory: () => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  story,
  onClose,
  onNextStory,
  onPrevStory,
}) => {
  const { openProductModal, addToCart, formatPrice } = useApp();
  const [slideIndex, setSlideIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentSlide: StorySlide = story.slides[slideIndex] || story.slides[0];
  const taggedProduct: Product | undefined = currentSlide.taggedProductId
    ? PRODUCTS.find((p) => p.id === currentSlide.taggedProductId)
    : undefined;

  // Slide auto-advance timer
  useEffect(() => {
    if (isPaused) return;

    const interval = 50; // tick every 50ms
    const step = 100 / (4000 / interval); // 4 seconds per slide

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (slideIndex < story.slides.length - 1) {
            setSlideIndex((s) => s + 1);
            return 0;
          } else {
            onNextStory();
            return 0;
          }
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [slideIndex, isPaused, story.slides.length, onNextStory]);

  const handleNextSlide = () => {
    if (slideIndex < story.slides.length - 1) {
      setSlideIndex((s) => s + 1);
      setProgress(0);
    } else {
      onNextStory();
    }
  };

  const handlePrevSlide = () => {
    if (slideIndex > 0) {
      setSlideIndex((s) => s - 1);
      setProgress(0);
    } else {
      onPrevStory();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center animate-fadeIn">
      {/* Centered Mobile Frame */}
      <div 
        className="relative w-full max-w-md h-full sm:h-[90vh] sm:rounded-3xl overflow-hidden bg-[#07080e] shadow-2xl flex flex-col justify-between"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Background Image */}
        <img
          src={currentSlide.image}
          alt={currentSlide.headline}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Ambient Dark Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/70 pointer-events-none" />

        {/* Top Header & Progress Bars */}
        <div className="relative z-20 p-4 space-y-3">
          {/* Progress Indicators */}
          <div className="flex gap-1.5">
            {story.slides.map((_, idx) => (
              <div key={idx} className="flex-1 h-1 bg-white/25 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-400 rounded-full transition-all duration-75"
                  style={{
                    width:
                      idx < slideIndex
                        ? '100%'
                        : idx === slideIndex
                        ? `${progress}%`
                        : '0%',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Author / Story Info Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={story.coverImage}
                alt=""
                className="w-8 h-8 rounded-full border border-cyan-400 object-cover"
              />
              <div>
                <span className="font-cyber font-bold text-xs text-white flex items-center gap-1.5">
                  {story.title}
                  <span className="text-[9px] text-cyan-300 font-tech">✦ VERIFIED DROP</span>
                </span>
                <span className="text-[9px] text-zinc-400 font-tech block">
                  Official LIMITLESS Studio
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tap Navigators (Left / Right Screen Hitboxes) */}
        <div className="absolute inset-0 z-10 flex">
          <div
            onClick={handlePrevSlide}
            className="w-1/3 h-full cursor-pointer"
            aria-label="Previous Slide"
          />
          <div
            onClick={handleNextSlide}
            className="w-2/3 h-full cursor-pointer"
            aria-label="Next Slide"
          />
        </div>

        {/* Bottom Content & Tagged Product Card */}
        <div className="relative z-20 p-4 space-y-3">
          {/* Slide Caption */}
          <div className="space-y-1">
            <h3 className="font-cyber font-black text-lg text-white tracking-tight uppercase drop-shadow-md">
              {currentSlide.headline}
            </h3>
            <p className="text-xs text-zinc-200 font-normal leading-relaxed drop-shadow-md">
              {currentSlide.subtext}
            </p>
          </div>

          {/* Tagged Product Sticky Sheet */}
          {taggedProduct && (
            <div 
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0b0d16]/90 backdrop-blur-xl border border-cyan-400/40 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-2xl shadow-cyan-950/60 animate-slideUp"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={taggedProduct.images[0]}
                  alt={taggedProduct.name}
                  className="w-12 h-14 object-cover rounded-xl border border-white/10 shrink-0"
                />
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-1 text-[8px] font-tech text-cyan-400 uppercase tracking-widest font-bold">
                    <Sparkles className="w-2.5 h-2.5" /> FEATURED GARMENT
                  </div>
                  <h4 className="font-syne font-bold text-xs text-white truncate">
                    {taggedProduct.name}
                  </h4>
                  <span className="font-cyber font-black text-xs text-cyan-300 block">
                    {formatPrice(taggedProduct.price)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => {
                    onClose();
                    openProductModal(taggedProduct);
                  }}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="View Item"
                >
                  <Eye className="w-4 h-4 text-cyan-400" />
                </button>
                <button
                  onClick={() => {
                    addToCart(
                      taggedProduct,
                      taggedProduct.sizes[0] || 'M',
                      taggedProduct.colors[0],
                      1
                    );
                  }}
                  className="py-2 px-3 rounded-xl bg-cyan-400 text-black font-cyber font-black text-[10px] tracking-wider uppercase hover:bg-cyan-300 transition-all flex items-center gap-1 shadow-md"
                >
                  <ShoppingBag className="w-3.5 h-3.5 fill-black" />
                  BAG
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
