import React, { useState } from 'react';
import { Instructor } from '../types';
import { Award, Star, User } from 'lucide-react';
import { useThemeLang } from '../ThemeLangContext';
import { getImageUrl } from '../utils/imageUtils';
import LazyImage from './LazyImage';
import DetailModal from './DetailModal';
import { GallerySkeleton } from './Skeleton';

interface InstructorsSectionProps {
  instructors: Instructor[];
  loading?: boolean;
}

export default React.memo(function InstructorsSection({ instructors, loading }: InstructorsSectionProps) {
  const [activeInstructor, setActiveInstructor] = useState<Instructor | null>(null);
  const { lang } = useThemeLang();

  const instBio = (inst: Instructor) => lang === 'en' && inst.bioEn ? inst.bioEn : inst.bio;
  const instLevel = (inst: Instructor) => lang === 'en' && inst.levelEn ? inst.levelEn : inst.level;

  return (
    <section id="instructores" className="py-24 scroll-mt-20 bg-marine-950 text-white relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

        {loading ? (
          <GallerySkeleton />
        ) : instructors.length === 0 ? (
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
                role="button"
                tabIndex={0}
                onClick={() => setActiveInstructor(inst)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveInstructor(inst); } }}
                className="group flex flex-col bento-card overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-marine-950"
              >
                <div className="aspect-4/3 sm:aspect-square w-full bg-marine-950 overflow-hidden relative">
                  <LazyImage
                    src={getImageUrl(inst) || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'}
                    alt={inst.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-marine-950/80 via-marine-950/20 to-transparent" />
                  <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-marine-900/90 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl border border-marine-800 text-[9px] sm:text-xs font-semibold flex items-center space-x-1 backdrop-blur-sm">
                    <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-yellow-400 fill-yellow-400" />
                    <span>{inst.experienceYears} <span className="hidden xs:inline">{lang === 'es' ? 'años exp.' : 'yrs exp.'}</span><span className="inline xs:hidden">{lang === 'es' ? 'años' : 'yrs'}</span></span>
                  </div>
                </div>

                <div className="p-3 sm:p-6 lg:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[8px] sm:text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 block mb-1 sm:mb-2">
                      {instLevel(inst)}
                    </span>
                    <h3 className="font-display font-extrabold text-sm sm:text-2xl text-white leading-tight group-hover:text-cyan-300 transition-colors">
                      {inst.name}
                    </h3>
                    <p className="mt-1.5 sm:mt-3.5 text-xs sm:text-base text-marine-200/80 leading-relaxed font-sans line-clamp-2 sm:line-clamp-none">
                      {instBio(inst)}
                    </p>
                  </div>
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

      <DetailModal
        isOpen={!!activeInstructor}
        onClose={() => setActiveInstructor(null)}
        title={lang === 'es' ? 'FICHA DEL INSTRUCTOR' : 'INSTRUCTOR PROFILE'}
        lang={lang}
        imageUrl={activeInstructor ? getImageUrl(activeInstructor) || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80' : undefined}
        imageAlt={activeInstructor ? activeInstructor.name : undefined}
        categoryBadge={activeInstructor ? (
          <span className="text-[10px] sm:text-xs uppercase font-extrabold tracking-wider px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border bg-marine-900 border-marine-700/60 text-cyan-400 shadow-sm">
            {instLevel(activeInstructor)}
          </span>
        ) : undefined}
        metadata={activeInstructor ? (
          <>
            <span className="flex items-center space-x-1.5">
              <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
              <span>{activeInstructor.experienceYears} {lang === 'es' ? 'años de experiencia' : 'years of experience'}</span>
            </span>
            <span className="font-mono bg-marine-950 text-cyan-400 font-bold px-2 py-1 rounded border border-marine-800">
              {activeInstructor.certificationCode}
            </span>
          </>
        ) : undefined}
        footer={activeInstructor ? (
          <>
            <span>{lang === 'es' ? 'Instructor certificado por la FCAS' : 'Instructor certified by FCAS'}</span>
            <span>ID: {activeInstructor.id}</span>
          </>
        ) : undefined}
      >
        <h3 className="text-xl sm:text-3xl font-display font-extrabold text-white mb-2 sm:mb-4 leading-tight shrink-0">
          {activeInstructor ? activeInstructor.name : ''}
        </h3>
        <div className="text-marine-200 space-y-3 sm:space-y-4 text-xs sm:text-sm sm:text-base leading-relaxed whitespace-pre-line font-sans flex-1 mb-6">
          {activeInstructor ? (instBio(activeInstructor) || (lang === 'es' ? 'Biografía no disponible.' : 'Biography not available.')) : ''}
        </div>
      </DetailModal>
    </section>
  );
});
