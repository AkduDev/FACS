import React, { useState, useEffect } from 'react';
import { Instructor } from '../types';
import { Award, Star, User, ArrowLeft, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useThemeLang } from '../ThemeLangContext';
import { getImageUrl } from '../utils/imageUtils';
import LazyImage from './LazyImage';

interface InstructorsSectionProps {
  instructors: Instructor[];
}

export default React.memo(function InstructorsSection({ instructors }: InstructorsSectionProps) {
  const [activeInstructor, setActiveInstructor] = useState<Instructor | null>(null);
  const { lang } = useThemeLang();

  const instBio = (inst: Instructor) => lang === 'en' && inst.bioEn ? inst.bioEn : inst.bio;
  const instLevel = (inst: Instructor) => lang === 'en' && inst.levelEn ? inst.levelEn : inst.level;

  useEffect(() => {
    if (activeInstructor !== null) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setActiveInstructor(null);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [activeInstructor]);

  return (
    <section id="instructores" className="py-24 bg-marine-950 text-white relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-marine-900 border border-marine-800 px-4 py-1.5 rounded-full mb-4">
            <Award className="h-4 w-4 text-cyan-400" />
            <span className="text-xs uppercase font-semibold tracking-wider text-cyan-300">
              {lang === 'es' ? 'Escuela de Instructores' : 'School of Instructors'}
            </span>
          </div>
          <h2 className="text-4xl font-display font-extrabold tracking-tight text-white bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent">
            {lang === 'es' ? 'Nuestros Instructores Certificados' : 'Our Certified Instructors'}
          </h2>
          <p className="mt-3 text-lg text-marine-200/90 leading-relaxed font-sans">
            {lang === 'es' 
              ? 'Conoce a los docentes oficiales acreditados ante la CMAS. Profesionales con décadas de experiencia dedicados a formar buceadores seguros y conscientes de la biodiversidad.' 
              : 'Meet the official instructors accredited by CMAS. Professionals with decades of experience dedicated to training safe and biodiversity-aware divers.'}
          </p>
        </div>

        {/* Instructors Grid */}
        {instructors.length === 0 ? (
          <div className="text-center py-20 bg-marine-900/40 border border-marine-800 rounded-3xl">
            <User className="h-12 w-12 text-marine-400 mx-auto mb-3" />
            <p className="text-marine-300 font-medium">
              {lang === 'es' ? 'No hay instructores listados por el momento.' : 'No instructors listed at the moment.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
            {instructors.map((inst) => (
              <div
                key={inst.id}
                className="group flex flex-col bento-card overflow-hidden cursor-pointer"
                onClick={() => setActiveInstructor(inst)}
              >
                {/* Photo & Badge header */}
                <div className="aspect-4/3 sm:aspect-square w-full bg-marine-950 overflow-hidden relative">
                  <LazyImage
                    src={getImageUrl(inst) || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'}
                    alt={inst.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-marine-950/80 via-marine-950/20 to-transparent" />
                  
                  {/* Years of Experience overlay */}
                  <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-marine-900/90 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl border border-marine-800 text-[9px] sm:text-xs font-semibold flex items-center space-x-1 backdrop-blur-sm">
                    <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-yellow-400 fill-yellow-400" />
                    <span>{inst.experienceYears} <span className="hidden xs:inline">{lang === 'es' ? 'años exp.' : 'yrs exp.'}</span><span className="inline xs:hidden">{lang === 'es' ? 'años' : 'yrs'}</span></span>
                  </div>
                </div>

                {/* Info and Bio */}
                <div className="p-3 sm:p-6 lg:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Level Label */}
                    <span className="text-[8px] sm:text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 block mb-1 sm:mb-2">
                      {instLevel(inst)}
                    </span>

                    {/* Name */}
                    <h3 className="font-display font-extrabold text-sm sm:text-2xl text-white leading-tight group-hover:text-cyan-300 transition-colors">
                      {inst.name}
                    </h3>

                    {/* Bio */}
                    <p className="mt-1.5 sm:mt-3.5 text-xs sm:text-base text-marine-200/80 leading-relaxed font-sans line-clamp-2 sm:line-clamp-none">
                      {instBio(inst)}
                    </p>
                  </div>

                  {/* Certification tag */}
                  <div className="mt-4 sm:mt-8 pt-2.5 sm:pt-5 border-t border-marine-800/40 flex items-center justify-between text-[10px] sm:text-xs">
                    <span className="text-marine-300 font-semibold uppercase tracking-wider text-[8px] sm:text-xs">
                      {lang === 'es' ? 'Licencia' : 'License'}
                    </span>
                    <span className="font-mono bg-marine-950 text-cyan-400 font-bold px-1.5 py-0.5 sm:px-2.5 sm:py-1.5 rounded sm:rounded-lg border border-marine-800 text-[9px] sm:text-xs">
                      {inst.certificationCode}
                    </span>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Modal Dialog for Instructor Detail */}
      <AnimatePresence>
        {activeInstructor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-marine-950/96 backdrop-blur-md">
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
                  onClick={() => setActiveInstructor(null)}
                  className="px-3.5 py-1.5 rounded-full bg-marine-900 hover:bg-cyan-600 text-white cursor-pointer transition-all text-xs font-semibold flex items-center space-x-1.5 border border-marine-800 shadow-md"
                  title={lang === 'es' ? 'Volver' : 'Back'}
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>{lang === 'es' ? 'Atrás' : 'Back'}</span>
                </button>
                
                <span className="text-xs sm:text-sm font-bold tracking-widest text-cyan-400 uppercase font-display hidden sm:block">
                  {lang === 'es' ? 'FICHA DEL INSTRUCTOR' : 'INSTRUCTOR PROFILE'}
                </span>

                <button
                  onClick={() => setActiveInstructor(null)}
                  className="p-2 rounded-full bg-marine-900 hover:bg-cyan-600 text-white cursor-pointer transition-all border border-marine-800 shadow-md"
                  title={lang === 'es' ? 'Cerrar' : 'Close'}
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>

              {/* Main Body */}
              <div className="flex-1 overflow-y-auto flex flex-col">
                {/* Photo Header */}
                <div className="h-28 sm:h-48 w-full overflow-hidden bg-marine-950 relative shrink-0">
                  <img
                    src={getImageUrl(activeInstructor) || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'}
                    alt={activeInstructor.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-marine-900 via-marine-900/40 to-transparent" />
                  <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-6">
                    <span className="text-[10px] sm:text-xs uppercase font-extrabold tracking-wider px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border bg-marine-900 border-marine-700/60 text-cyan-400 shadow-sm">
                      {instLevel(activeInstructor)}
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-8 flex-1 flex flex-col">
                  {/* Name */}
                  <h3 className="text-xl sm:text-3xl font-display font-extrabold text-white mb-2 sm:mb-4 leading-tight shrink-0">
                    {activeInstructor.name}
                  </h3>

                  {/* Quick stats */}
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-marine-300 mb-4 sm:mb-6 shrink-0">
                    <span className="flex items-center space-x-1.5">
                      <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                      <span>{activeInstructor.experienceYears} {lang === 'es' ? 'años de experiencia' : 'years of experience'}</span>
                    </span>
                    <span className="font-mono bg-marine-950 text-cyan-400 font-bold px-2 py-1 rounded border border-marine-800">
                      {activeInstructor.certificationCode}
                    </span>
                  </div>

                  {/* Full Bio */}
                  <div className="text-marine-200 space-y-3 sm:space-y-4 text-xs sm:text-sm sm:text-base leading-relaxed whitespace-pre-line font-sans flex-1 mb-6">
                    {instBio(activeInstructor) || (lang === 'es' ? 'Biografía no disponible.' : 'Biography not available.')}
                  </div>

                  {/* Footer */}
                  <div className="mt-auto pt-4 border-t border-marine-800/60 flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-xs text-marine-400 shrink-0">
                    <span>{lang === 'es' ? 'Instructor certificado por la FCAS' : 'Instructor certified by FCAS'}</span>
                    <span>ID: {activeInstructor.id}</span>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
});
