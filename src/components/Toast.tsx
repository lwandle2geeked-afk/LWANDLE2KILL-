import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Info, ShoppingBag, Heart, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed top-14 left-0 right-0 z-50 pointer-events-none flex flex-col items-center gap-2 px-4 max-w-md mx-auto">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="pointer-events-auto w-full bg-[#12131c]/95 backdrop-blur-xl border border-white/15 rounded-2xl p-3.5 shadow-2xl shadow-cyan-950/40 flex items-center justify-between gap-3 text-sm text-zinc-100"
          >
            <div className="flex items-center gap-3 min-w-0">
              {toast.image ? (
                <img
                  src={toast.image}
                  alt="Product preview"
                  className="w-10 h-10 object-cover rounded-lg border border-white/10 shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  {toast.type === 'cart' && <ShoppingBag className="w-5 h-5 text-cyan-400" />}
                  {toast.type === 'wishlist' && <Heart className="w-5 h-5 text-pink-400 fill-pink-400" />}
                  {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  {toast.type === 'info' && <Info className="w-5 h-5 text-purple-400" />}
                  {!toast.type && <Info className="w-5 h-5 text-zinc-400" />}
                </div>
              )}

              <div className="min-w-0">
                <p className="font-cyber text-xs uppercase tracking-wider font-bold text-white truncate">
                  {toast.title}
                </p>
                {toast.description && (
                  <p className="text-xs text-zinc-400 truncate mt-0.5">{toast.description}</p>
                )}
              </div>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
