import React, { useRef, useEffect } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useScrollLock } from '../hooks/useScrollLock';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  lang: string;
  imageUrl?: string;
  imageAlt?: string;
  categoryBadge?: React.ReactNode;
  metadata?: React.ReactNode;
  footer?: React.ReactNode;
}

export default function DetailModal({
  isOpen,
  onClose,
  title,
  children,
  lang,
  imageUrl,
  imageAlt,
  categoryBadge,
  metadata,
  footer,
}: DetailModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    closeRef.current?.focus();
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-marine-950/96 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="bg-marine-900 rounded-2xl sm:rounded-3xl max-w-[92%] sm:max-w-2xl w-full max-h-[80vh] sm:max-h-[85vh] overflow-hidden shadow-2xl border border-marine-800 text-white relative flex flex-col"
          >
            {/* Close/Back button bar */}
            <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-marine-800/60 bg-marine-950/80 backdrop-blur-md z-20 shrink-0">
              <button
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-full bg-marine-900 hover:bg-cyan-600 text-white cursor-pointer transition-all text-xs font-semibold flex items-center space-x-1.5 border border-marine-800 shadow-md"
                title={lang === 'es' ? 'Volver' : 'Back'}
              >
                <ArrowLeft className="h-4 w-4" />
                <span>{lang === 'es' ? 'Atrás' : 'Back'}</span>
              </button>

              <span className="text-xs sm:text-sm font-bold tracking-widest text-cyan-400 uppercase font-display hidden sm:block">
                {title}
              </span>

              <button
                ref={closeRef}
                onClick={onClose}
                className="p-2 rounded-full bg-marine-900 hover:bg-cyan-600 text-white cursor-pointer transition-all border border-marine-800 shadow-md"
                aria-label={lang === 'es' ? 'Cerrar' : 'Close'}
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>

            {/* Main Body */}
            <div className="flex-1 overflow-y-auto flex flex-col">
              {imageUrl && (
                <div className="h-28 sm:h-auto sm:aspect-video w-full overflow-hidden bg-marine-950 relative shrink-0">
                  <img
                    src={imageUrl}
                    alt={imageAlt || title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {categoryBadge && (
                    <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-6">
                      {categoryBadge}
                    </div>
                  )}
                </div>
              )}

              <div className={`p-4 sm:p-8 flex-1 flex flex-col ${!imageUrl ? 'pt-6' : ''}`}>
                {metadata && (
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-marine-300 mb-3 sm:mb-5 shrink-0">
                    {metadata}
                  </div>
                )}

                {children}

                {footer && (
                  <div className="mt-auto pt-4 border-t border-marine-800/60 flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-xs text-marine-400 shrink-0">
                    {footer}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
