import React, { useState, useEffect } from 'react';
import { NewsItem } from '../types';
import { BookOpen, Calendar, User, ArrowUpRight, X, AlertCircle, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useThemeLang } from '../ThemeLangContext';
import { getImageUrl } from '../utils/imageUtils';
import LazyImage from './LazyImage';

interface NewsSectionProps {
  news: NewsItem[];
}

export default React.memo(function NewsSection({ news }: NewsSectionProps) {
  const [activeArticle, setActiveArticle] = useState<NewsItem | null>(null);
  const { lang, t } = useThemeLang();

  const itemTitle = (item: NewsItem) => lang === 'en' && item.titleEn ? item.titleEn : item.title;
  const itemContent = (item: NewsItem) => lang === 'en' && item.contentEn ? item.contentEn : item.content;
  const itemCategory = (item: NewsItem) => lang === 'en' && item.categoryEn ? item.categoryEn : item.category;

  useEffect(() => {
    if (activeArticle !== null) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setActiveArticle(null);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [activeArticle]);

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'conservacion': return 'bg-emerald-950/80 text-emerald-400 border-emerald-800/40';
      case 'federacion': return 'bg-cyan-950/80 text-cyan-400 border-cyan-800/40';
      case 'seguridad': return 'bg-amber-950/80 text-amber-400 border-amber-800/40';
      case 'exploracion': return 'bg-purple-950/80 text-purple-400 border-purple-800/40';
      default: return 'bg-marine-950 text-marine-300 border-marine-800';
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'conservacion': return lang === 'es' ? 'Conservación' : 'Conservation';
      case 'federacion': return lang === 'es' ? 'Federativo' : 'Federative';
      case 'seguridad': return lang === 'es' ? 'Seguridad' : 'Safety';
      case 'exploracion': return lang === 'es' ? 'Exploración' : 'Exploration';
      default: return cat;
    }
  };

  return (
    <section id="noticias" className="py-24 bg-marine-950 text-white relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-marine-900 border border-marine-800 px-4 py-1.5 rounded-full mb-4">
              <BookOpen className="h-4 w-4 text-cyan-400" />
              <span className="text-xs uppercase font-semibold tracking-wider text-cyan-300">
                {lang === 'es' ? 'Boletines y Actualidad' : 'Bulletins & News'}
              </span>
            </div>
            <h2 className="text-4xl font-display font-extrabold tracking-tight text-white bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent">
              {lang === 'es' ? 'Noticias y Comunicados Oficiales' : 'News & Official Statements'}
            </h2>
            <p className="mt-3 text-lg text-marine-200/90 leading-relaxed font-sans">
              {lang === 'es' 
                ? 'Mantente informado de las últimas resoluciones, hallazgos, campañas ecológicas y logros del buceo deportivo y científico cubano.' 
                : 'Stay informed of the latest resolutions, findings, ecological campaigns, and achievements of Cuban sports and scientific diving.'}
            </p>
          </div>
        </div>

        {/* News Grid */}
        {news.length === 0 ? (
          <div className="text-center py-20 bg-marine-900/40 border border-marine-800 rounded-3xl">
            <AlertCircle className="h-12 w-12 text-marine-400 mx-auto mb-3" />
            <p className="text-marine-300 font-medium text-lg">
              {lang === 'es' ? 'No hay comunicados cargados actualmente.' : 'No announcements posted currently.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
            {news.map((item, index) => (
              <article
                key={item.id}
                className="group flex flex-col bento-card overflow-hidden cursor-pointer"
                onClick={() => setActiveArticle(item)}
              >
                {/* Photo Header */}
                {getImageUrl(item) && (
                  <div className="aspect-video w-full overflow-hidden bg-marine-950 relative">
                    <LazyImage
                      src={getImageUrl(item)}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-marine-950/60 to-transparent" />
                  </div>
                )}

                {/* Body Content */}
                <div className="p-3 sm:p-6 flex-1 flex flex-col">
                  {/* Category & Date */}
                  <div className="flex items-center justify-between mb-2.5 sm:mb-4">
                      <span className={`text-[8px] sm:text-[10px] uppercase font-extrabold tracking-wider px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full border ${getCategoryColor(item.category)}`}>
                      {itemCategory(item)}
                    </span>
                    <span className="text-[9px] sm:text-xs text-marine-300 flex items-center space-x-1">
                      <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      <span>{item.date}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-extrabold text-sm sm:text-xl text-white group-hover:text-cyan-400 transition-colors duration-200 leading-tight line-clamp-2">
                    {itemTitle(item)}
                  </h3>

                  {/* Snippet */}
                  <p className="mt-1.5 sm:mt-3 text-xs sm:text-sm text-marine-200/80 line-clamp-2 sm:line-clamp-3 leading-relaxed flex-1">
                    {itemContent(item)}
                  </p>

                  {/* Card Footer */}
                  <div className="mt-4 sm:mt-6 pt-3 sm:pt-5 border-t border-marine-800/40 flex items-center justify-between text-[10px] sm:text-xs">
                    <span className="text-marine-300 flex items-center space-x-1 sm:space-x-1.5 font-medium">
                      <User className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-cyan-500" />
                      <span className="truncate max-w-[60px] sm:max-w-none">{item.author}</span>
                    </span>
                    <span className="text-cyan-400 font-bold flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                      <span>{lang === 'es' ? 'Leer' : 'Read'}</span>
                      <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Modal Dialog for Article Detail */}
        <AnimatePresence>
          {activeArticle && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-marine-950/96 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25 }}
                className="bg-marine-900 rounded-2xl sm:rounded-3xl max-w-[92%] xs:max-w-[85%] sm:max-w-3xl w-full max-h-[80vh] sm:max-h-[85vh] overflow-hidden shadow-2xl border border-marine-800 text-white relative flex flex-col"
              >
                {/* Close/Back button bar (Always visible at the top) */}
                <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-marine-800/60 bg-marine-950/80 backdrop-blur-md z-20 shrink-0">
                  <button
                    onClick={() => setActiveArticle(null)}
                    className="px-3.5 py-1.5 rounded-full bg-marine-900 hover:bg-cyan-600 text-white cursor-pointer transition-all text-xs font-semibold flex items-center space-x-1.5 border border-marine-800 shadow-md"
                    title={lang === 'es' ? 'Volver' : 'Back'}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>{lang === 'es' ? 'Atrás' : 'Back'}</span>
                  </button>
                  
                  <span className="text-xs sm:text-sm font-bold tracking-widest text-cyan-400 uppercase font-display hidden xs:block">
                    {lang === 'es' ? 'SALA DE LECTURA FCAS' : 'FCAS READING ROOM'}
                  </span>

                  <button
                    onClick={() => setActiveArticle(null)}
                    className="p-2 rounded-full bg-marine-900 hover:bg-cyan-600 text-white cursor-pointer transition-all border border-marine-800 shadow-md"
                    title={lang === 'es' ? 'Cerrar' : 'Close'}
                  >
                    <X className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>

                {/* Main Body */}
                <div className="flex-1 overflow-y-auto flex flex-col">
                  {/* Image Header inside modal if available */}
                  {getImageUrl(activeArticle) && (
                    <div className="h-28 xs:h-36 sm:h-auto sm:aspect-video w-full overflow-hidden bg-marine-950 relative shrink-0">
                      <img
                        src={getImageUrl(activeArticle)}
                        alt={activeArticle.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-6">
                        <span className={`text-[8px] sm:text-[10px] uppercase font-extrabold tracking-wider px-2 py-1 sm:px-3 sm:py-1.5 rounded-full border bg-marine-900 border-marine-700/60 text-cyan-400 shadow-sm`}>
                          {itemCategory(activeArticle)}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className={`p-4 sm:p-8 flex-1 flex flex-col ${!getImageUrl(activeArticle) ? 'pt-6' : ''}`}>
                    {/* Metadata line */}
                    <div className="flex items-center space-x-3 sm:space-x-4 text-[10px] sm:text-xs text-marine-300 mb-2.5 sm:mb-4 shrink-0">
                      <span className="flex items-center space-x-1 sm:space-x-1.5">
                        <Calendar className="h-3.5 w-3.5 text-cyan-400" />
                        <span>{lang === 'es' ? 'Publicado el' : 'Published on'} {activeArticle.date}</span>
                      </span>
                      <span className="flex items-center space-x-1 sm:space-x-1.5">
                        <User className="h-3.5 w-3.5 text-cyan-400" />
                        <span>{lang === 'es' ? 'Por' : 'By'} {activeArticle.author}</span>
                      </span>
                    </div>

                    {/* Main Title */}
                    <h3 className="text-lg sm:text-3xl font-display font-extrabold text-white mb-3 sm:mb-6 leading-tight shrink-0">
                      {itemTitle(activeArticle)}
                    </h3>

                    {/* Full Text Content */}
                    <div className="text-marine-200 space-y-3 sm:space-y-4 text-xs xs:text-sm sm:text-base leading-relaxed whitespace-pre-line font-sans flex-1 mb-6">
                      {itemContent(activeArticle)}
                    </div>

                    {/* Footer disclaimer */}
                    <div className="mt-auto pt-4 border-t border-marine-800/60 flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-xs text-marine-400 shrink-0">
                      <span>{t.appSub}</span>
                      <span>{lang === 'es' ? 'Registro Oficial ID' : 'Official Record ID'}: {activeArticle.id}</span>
                    </div>
                  </div>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
});
