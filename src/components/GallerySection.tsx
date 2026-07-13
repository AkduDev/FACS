import React, { useState, useEffect } from 'react';
import { GalleryItem } from '../types';
import { Camera, Eye, X, Calendar, ArrowLeft, ArrowRight, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useThemeLang } from '../ThemeLangContext';
import { getImageUrl } from '../utils/imageUtils';
import { formatShortDate, formatFullDate } from '../utils/dateUtils';
import LazyImage from './LazyImage';
import { GallerySkeleton } from './Skeleton';

interface GallerySectionProps {
  items: GalleryItem[];
  loading?: boolean;
}

export default React.memo(function GallerySection({ items, loading }: GallerySectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [activePhoto, setActivePhoto] = useState<number | null>(null);
  const { lang } = useThemeLang();

  const t = (es: string, en: string) => lang === 'es' ? es : en;
  const itemTitle = (item: GalleryItem) => lang === 'en' && item.titleEn ? item.titleEn : item.title;
  const itemDesc = (item: GalleryItem) => lang === 'en' && item.descriptionEn ? item.descriptionEn : item.description;
  const itemCategory = (item: GalleryItem) => lang === 'en' && item.categoryEn ? item.categoryEn : item.category;

  useEffect(() => {
    if (activePhoto !== null) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setActivePhoto(null);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [activePhoto]);

  const categories = [
    { id: 'todos', label: lang === 'es' ? 'Todos' : 'All' },
    { id: 'fauna', label: lang === 'es' ? 'Fauna Marina' : 'Marine Fauna' },
    { id: 'flora', label: lang === 'es' ? 'Flora y Coral' : 'Flora & Coral' },
    { id: 'naufragios', label: lang === 'es' ? 'Naufragios' : 'Shipwrecks' },
    { id: 'entrenamiento', label: lang === 'es' ? 'Entrenamiento' : 'Training' },
    { id: 'paisaje', label: lang === 'es' ? 'Paisajes' : 'Landscapes' },
  ];

  const filteredItems = selectedCategory === 'todos'
    ? items
    : items.filter(item => item.category === selectedCategory);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhoto === null) return;
    setActivePhoto((activePhoto + 1) % filteredItems.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhoto === null) return;
    setActivePhoto((activePhoto - 1 + filteredItems.length) % filteredItems.length);
  };

  return (
    <section id="galeria" className="py-24 scroll-mt-20 bg-gradient-to-b from-marine-950 to-marine-900 text-white relative overflow-hidden transition-colors duration-300">
      {/* Background decorations */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-marine-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-marine-800/40 border border-marine-700/50 px-4 py-1.5 rounded-full mb-4">
            <Camera className="h-4 w-4 text-cyan-300" />
            <span className="text-xs uppercase font-semibold tracking-wider text-cyan-200">
              {lang === 'es' ? 'Profundidades de Cuba' : 'Depths of Cuba'}
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight bg-gradient-to-r from-white via-marine-100 to-cyan-300 bg-clip-text text-transparent">
            {lang === 'es' ? 'Galería Fotográfica Submarina' : 'Underwater Photo Gallery'}
          </h2>
          <p className="mt-4 text-lg text-marine-200/90 leading-relaxed font-sans">
            {lang === 'es' 
              ? 'Explora las riquezas ecológicas y arqueológicas que custodian nuestras aguas territoriales, capturadas por nuestros buceadores e instructores federados.' 
              : 'Explore the ecological and archaeological riches guarding our territorial waters, captured by our federated divers and instructors.'}
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id);
                setActivePhoto(null);
              }}
              className={`px-5 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer min-h-[44px] ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-cyan-500 to-marine-500 text-white shadow-lg shadow-cyan-500/20 scale-105 border border-cyan-400/30'
                  : 'bg-marine-800/40 text-marine-200 hover:text-white hover:bg-marine-700/50 border border-marine-800'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <GallerySkeleton />
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-marine-900/40 border border-marine-800 rounded-3xl">
            <Compass className="h-12 w-12 text-marine-400 mx-auto mb-4 animate-spin" />
            <p className="text-marine-300 font-medium text-lg">
              {lang === 'es' ? 'No hay fotos registradas en esta categoría aún.' : 'No photos registered in this category yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layoutId={`gallery-card-${item.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                role="button"
                tabIndex={0}
                onClick={() => setActivePhoto(index)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActivePhoto(index); } }}
                className="group relative bg-marine-900/60 rounded-2xl overflow-hidden border border-marine-800 shadow-xl cursor-pointer hover:border-cyan-500/40 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-marine-950"
              >
                {/* Image Wrap */}
                <div className="relative aspect-4/3 overflow-hidden">
                  <LazyImage
                    src={getImageUrl(item) || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'}
                    alt={itemTitle(item)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-marine-950 via-marine-950/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                  
                  {/* Floating category badge */}
                  <span className="absolute top-2 left-2 sm:top-4 sm:left-4 text-[8px] sm:text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 sm:px-3 sm:py-1 bg-marine-950/90 text-cyan-300 border border-cyan-800/40 rounded-full backdrop-blur-sm">
                    {itemCategory(item) || item.category}
                  </span>

                  {/* Hover icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-cyan-500/95 p-2 sm:p-4 rounded-full text-white shadow-xl shadow-cyan-900/50 scale-75 group-hover:scale-100 transition-transform duration-300">
                      <Eye className="h-4 w-4 sm:h-6 sm:w-6" />
                    </div>
                  </div>
                </div>

                {/* Info block */}
                <div className="p-3 sm:p-6">
                  <h3 className="font-display font-bold text-sm sm:text-lg text-white group-hover:text-cyan-300 transition-colors duration-200 line-clamp-1">
                    {itemTitle(item)}
                  </h3>
                  <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-marine-200/80 line-clamp-1 sm:line-clamp-2 leading-relaxed">
                    {itemDesc(item)}
                  </p>
                  <div className="mt-2.5 sm:mt-4 pt-2.5 sm:pt-4 border-t border-marine-800/60 flex items-center justify-between text-[10px] sm:text-xs text-marine-400">
                    <span className="flex items-center space-x-1 sm:space-x-1.5">
                      <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      <span>{formatShortDate(item.date, lang)}</span>
                    </span>
                    <span className="text-cyan-400 font-medium group-hover:underline">
                      {lang === 'es' ? 'Ampliar →' : 'Zoom →'}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Lightbox / Immersive Carousel Modal */}
        <AnimatePresence>
          {activePhoto !== null && filteredItems[activePhoto] && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 pt-16 sm:pt-24 bg-marine-950/98 backdrop-blur-md" role="dialog" aria-modal="true" aria-label={lang === 'es' ? 'Galería de fotos' : 'Photo gallery'}>
              
              {/* Prev Button */}
              <button
                onClick={handlePrev}
                className="absolute left-4 sm:left-8 p-3.5 sm:p-4 rounded-full bg-marine-800/80 hover:bg-cyan-600 text-white transition-colors cursor-pointer z-10 min-h-[44px] min-w-[44px] flex items-center justify-center"
                title={lang === 'es' ? 'Anterior' : 'Previous'}
              >
                <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="absolute right-4 sm:right-8 p-3.5 sm:p-4 rounded-full bg-marine-800/80 hover:bg-cyan-600 text-white transition-colors cursor-pointer z-10 min-h-[44px] min-w-[44px] flex items-center justify-center"
                title={lang === 'es' ? 'Siguiente' : 'Next'}
              >
                <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>

              {/* Central Content */}
              <div className="max-w-2xl w-full flex flex-col items-center px-2">
                <motion.div
                  key={activePhoto}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                  className="bg-marine-900 rounded-2xl sm:rounded-3xl overflow-hidden border border-marine-800 shadow-2xl max-h-[85vh] flex flex-col w-full"
                >
                  {/* Top Bar with Back and Close button */}
                  <div className="flex items-center justify-between px-4 py-3 sm:px-6 border-b border-marine-800/60 bg-marine-950/80 backdrop-blur-md z-20 shrink-0">
                    <button
                      onClick={() => setActivePhoto(null)}
                      className="px-3.5 py-1.5 rounded-full bg-marine-900 hover:bg-cyan-600 text-white cursor-pointer transition-all text-xs font-semibold flex items-center space-x-1.5 border border-marine-800 shadow-md"
                      title={lang === 'es' ? 'Volver' : 'Back'}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>{lang === 'es' ? 'Atrás' : 'Back'}</span>
                    </button>
                    
                    <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase font-display hidden xs:block">
                      {lang === 'es' ? 'GALERÍA DE FOTOS' : 'PHOTO GALLERY'}
                    </span>

                    <button
                      onClick={() => setActivePhoto(null)}
                      className="p-2 rounded-full bg-marine-900 hover:bg-cyan-600 text-white cursor-pointer transition-all border border-marine-800 shadow-md"
                      title={lang === 'es' ? 'Cerrar' : 'Close'}
                    >
                      <X className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </div>

                  {/* Photo representation */}
                  <div className="relative overflow-hidden flex-1 bg-black flex items-center justify-center p-2">
                    <img
                      src={getImageUrl(filteredItems[activePhoto]) || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'}
                      alt={itemTitle(filteredItems[activePhoto])}
                      className="max-h-[30vh] xs:max-h-[35vh] sm:max-h-[45vh] w-auto max-w-full object-contain rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Caption & Metadata bar */}
                  <div className="p-4 sm:p-6 bg-gradient-to-b from-marine-900 to-marine-950 border-t border-marine-800/40">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2 sm:mb-3">
                      <span className="text-[9px] sm:text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 sm:px-3 sm:py-1 bg-cyan-950 text-cyan-400 border border-cyan-800/50 rounded-full">
                        {itemCategory(filteredItems[activePhoto]) || filteredItems[activePhoto].category}
                      </span>
                      <span className="text-[10px] sm:text-xs text-marine-400 flex items-center space-x-1 sm:space-x-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>
                          {lang === 'es' ? 'Registrado el' : 'Registered on'} {formatFullDate(filteredItems[activePhoto].date, lang)}
                        </span>
                      </span>
                    </div>

                    <h3 className="text-base sm:text-xl font-display font-bold text-white mb-1 sm:mb-2 leading-tight">
                      {itemTitle(filteredItems[activePhoto])}
                    </h3>
                    <p className="text-xs sm:text-sm text-marine-200 leading-relaxed line-clamp-3 sm:line-clamp-none">
                      {itemDesc(filteredItems[activePhoto])}
                    </p>
                  </div>
                </motion.div>

                {/* Counter indicator */}
                <div className="mt-3 sm:mt-4 text-[10px] sm:text-xs font-semibold tracking-widest text-marine-400 uppercase">
                  {lang === 'es' ? 'FOTO' : 'PHOTO'} {activePhoto + 1} {lang === 'es' ? 'DE' : 'OF'} {filteredItems.length}
                </div>
              </div>

            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
});
