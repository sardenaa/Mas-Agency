/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, X, Ticket, ArrowRight, Sparkles, Bell } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastItemProps {
  key?: string | number;
  toast: ToastMessage;
  onDismiss: (id: string) => void;
  onAction?: (idVoucher?: string) => void;
}

function ToastCard({ toast, onDismiss, onAction }: ToastItemProps) {
  const { id, title, message, idVoucher, tourTitle, type } = toast;
  const duration = 6000; // 6 seconds before dismissing

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  const getThemeClasses = () => {
    switch (type) {
      case 'success':
        return {
          border: 'border-emerald-500/20 hover:border-emerald-500/50',
          glow: 'bg-emerald-500/10',
          iconColor: 'text-emerald-400',
          badgeColor: 'bg-emerald-950/60 border-emerald-500/20 text-emerald-400',
          progressBar: 'bg-gradient-to-r from-emerald-500 to-green-400',
        };
      case 'info':
        return {
          border: 'border-amber-500/20 hover:border-amber-500/50',
          glow: 'bg-amber-500/10',
          iconColor: 'text-amber-400',
          badgeColor: 'bg-amber-950/60 border-amber-500/20 text-amber-400',
          progressBar: 'bg-gradient-to-r from-amber-500 to-amber-300',
        };
      default:
        return {
          border: 'border-slate-800 hover:border-slate-705',
          glow: 'bg-slate-500/5',
          iconColor: 'text-slate-400',
          badgeColor: 'bg-slate-905 border-slate-800 text-slate-400',
          progressBar: 'bg-slate-600',
        };
    }
  };

  const theme = getThemeClasses();

  return (
    <motion.div
      id={`toast-card-${id}`}
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
      whileHover={{ y: -2, scale: 1.015 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={`group relative w-[360px] bg-slate-950/95 backdrop-blur-md rounded-2xl border ${theme.border} p-4 text-left shadow-2xl shadow-emerald-950/20 overflow-hidden transition-all duration-300`}
    >
      {/* Dynamic background glow */}
      <div className={`absolute top-0 left-0 w-24 h-24 ${theme.glow} rounded-full blur-2xl opacity-60 pointer-events-none`} />

      <div className="flex gap-3">
        {/* Animated Icon Container */}
        <div className="shrink-0 flex items-start pt-1">
          <div className="relative">
            <motion.div
              initial={{ scale: 0.7 }}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1.8 }}
              className="absolute -inset-0.5 rounded-full bg-emerald-500/10 blur opacity-60"
            />
            {type === 'success' ? (
              <CheckCircle2 className={`w-5 h-5 ${theme.iconColor} relative z-10`} />
            ) : (
              <Bell className={`w-5 h-5 ${theme.iconColor} relative z-10`} />
            )}
          </div>
        </div>

        {/* Content info */}
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="font-display font-black text-sm text-white tracking-tight">
              {title}
            </span>
            {type === 'success' && (
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
            )}
          </div>
          
          <p className="font-sans text-xs text-slate-400 leading-relaxed mb-2.5">
            {message}
          </p>

          {/* Quick Stats Block */}
          {(idVoucher || tourTitle) && (
            <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-900/80 mb-3 space-y-1.5">
              {tourTitle && (
                <div className="flex items-center gap-1.5 text-[10.5px] text-slate-300 font-semibold truncate">
                  <Ticket className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{tourTitle}</span>
                </div>
              )}
              {idVoucher && (
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest font-extrabold">
                    Allocation ID
                  </span>
                  <span className="font-mono text-[9.5px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/15 px-1.5 py-0.5 rounded">
                    {idVoucher}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Action Button */}
          {onAction && idVoucher && (
            <button
              onClick={() => onAction(idVoucher)}
              className="inline-flex items-center gap-1.5 text-[10px] font-display font-black uppercase text-emerald-400 hover:text-emerald-300 tracking-wider group/btn cursor-pointer transition-colors"
            >
              <span>Scroll to Voucher</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
            </button>
          )}
        </div>

        {/* Close button */}
        <div className="shrink-0 flex items-start">
          <button
            onClick={() => onDismiss(id)}
            className="p-1 rounded-lg border border-slate-900 bg-slate-950 hover:bg-slate-900 text-slate-500 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress Bar timer animation */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-slate-900/85">
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
          className={`h-full ${theme.progressBar}`}
        />
      </div>
    </motion.div>
  );
}

interface ToastNotificationProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
  onAction?: (idVoucher?: string) => void;
}

export default function ToastNotification({
  toasts,
  onDismiss,
  onAction,
}: ToastNotificationProps) {
  return (
    <div className="fixed bottom-6 right-6 z-55 flex flex-col gap-3 max-w-sm w-full px-4 sm:px-0 pointer-events-none select-none">
      <div className="flex flex-col gap-3 items-end pointer-events-auto w-full">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <ToastCard
              key={toast.id}
              toast={toast}
              onDismiss={onDismiss}
              onAction={onAction}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
