import React, { useState } from 'react';
import { X, Flame, Bell, BellRing, Clock, ShieldCheck, Ticket, Check, Sparkles } from 'lucide-react';
import { UPCOMING_DROPS } from '../data/clothingStoreData';
import { UpcomingDrop } from '../types';
import { useApp } from '../context/AppContext';

interface DropRadarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DropRadarModal: React.FC<DropRadarModalProps> = ({ isOpen, onClose }) => {
  const { showToast, formatPrice } = useApp();
  const [reminders, setReminders] = useState<string[]>([]);
  const [enteredRaffles, setEnteredRaffles] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleToggleReminder = (dropId: string, title: string) => {
    const isSet = reminders.includes(dropId);
    if (isSet) {
      setReminders((prev) => prev.filter((id) => id !== dropId));
      showToast({
        title: 'REMINDER CANCELLED',
        description: `Alert removed for ${title}`,
        type: 'info',
      });
    } else {
      setReminders((prev) => [...prev, dropId]);
      showToast({
        title: 'DROP REMINDER ARMED',
        description: `We'll alert you 15 minutes before ${title} drops!`,
        type: 'success',
      });
    }
  };

  const handleEnterRaffle = (dropId: string, title: string) => {
    if (!enteredRaffles.includes(dropId)) {
      setEnteredRaffles((prev) => [...prev, dropId]);
      showToast({
        title: 'RAFFLE TICKET SECURED',
        description: `Entry confirmed for ${title}. Results drawn on release day.`,
        type: 'success',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col justify-between overflow-y-auto animate-fadeIn">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-[#080910]/95 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-cyan-400 font-cyber text-[10px] font-bold tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            RELEASE RADAR // CALENDAR
          </div>
          <h2 className="font-syne font-bold text-base text-white">
            Upcoming Archive Drops & Raffles
          </h2>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Drops Content */}
      <div className="max-w-xl mx-auto w-full px-4 py-4 space-y-5 pb-16">
        {UPCOMING_DROPS.map((drop) => {
          const isReminderArmed = reminders.includes(drop.id);
          const isRaffleEntered = enteredRaffles.includes(drop.id);

          return (
            <div
              key={drop.id}
              className="rounded-3xl overflow-hidden border border-white/15 bg-[#0e0f18] shadow-2xl shadow-cyan-950/20 relative group"
            >
              {/* Drop Image & Header */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
                <img
                  src={drop.image}
                  alt={drop.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0f18] via-black/40 to-transparent" />

                {/* Badges on Drop Image */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  <span className="px-2.5 py-1 rounded-md bg-cyan-500 text-black text-[9px] font-cyber font-black uppercase shadow-lg">
                    {drop.collection}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md border border-white/10 text-zinc-300 text-[8px] font-tech">
                    {drop.editionLimit}
                  </span>
                </div>

                {/* Countdown target */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-cyan-400/40 text-cyan-300 text-xs font-cyber font-bold">
                  <Clock className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  DROPS IN ~{drop.countdownTargetHours} HOURS ({drop.releaseDate})
                </div>
              </div>

              {/* Body Info */}
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-cyber font-black text-base text-white tracking-wide uppercase leading-tight">
                      {drop.title}
                    </h3>
                    {drop.gsm && (
                      <span className="text-[10px] font-tech text-cyan-400 mt-0.5 block">
                        Fabric: {drop.gsm}
                      </span>
                    )}
                  </div>
                  <span className="font-cyber font-black text-base text-white">
                    {formatPrice(drop.price)}
                  </span>
                </div>

                <p className="text-xs text-zinc-300 font-normal leading-relaxed">
                  {drop.description}
                </p>

                {/* Action Buttons: Raffle vs Alert */}
                <div className="pt-2 border-t border-white/10 flex items-center gap-2">
                  {drop.isRaffle ? (
                    <button
                      onClick={() => handleEnterRaffle(drop.id, drop.title)}
                      className={`flex-1 py-3 px-4 rounded-xl font-cyber font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                        isRaffleEntered
                          ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                          : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:brightness-110 active:scale-95 shadow-lg shadow-pink-500/20'
                      }`}
                    >
                      {isRaffleEntered ? (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" />
                          RAFFLE ENTRY CONFIRMED
                        </>
                      ) : (
                        <>
                          <Ticket className="w-4 h-4" />
                          ENTER FREE MEMBERS RAFFLE
                        </>
                      )}
                    </button>
                  ) : null}

                  <button
                    onClick={() => handleToggleReminder(drop.id, drop.title)}
                    className={`py-3 px-4 rounded-xl font-cyber font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 border ${
                      isReminderArmed
                        ? 'bg-cyan-400 text-black border-cyan-400 shadow-md shadow-cyan-400/30'
                        : 'bg-white/5 hover:bg-white/15 text-white border-white/15'
                    } ${drop.isRaffle ? 'shrink-0' : 'flex-1'}`}
                  >
                    {isReminderArmed ? (
                      <>
                        <BellRing className="w-4 h-4 text-black" />
                        ALERT SET
                      </>
                    ) : (
                      <>
                        <Bell className="w-4 h-4 text-cyan-400" />
                        NOTIFY ME
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
