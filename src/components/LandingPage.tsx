import React from 'react';
import { GalleryItem, NewsItem, EventItem, Instructor, Graduate } from '../types';
import GallerySection from './GallerySection';
import NewsSection from './NewsSection';
import EventsSection from './EventsSection';
import InstructorsSection from './InstructorsSection';
import GraduatesSection from './GraduatesSection';
import { Compass, ChevronDown, Award, Droplet, Star, Shield, Mail, MapPin, Phone } from 'lucide-react';
import { motion } from 'motion/react';
import fcasLogo from '../assets/images/fcas_logo_v2_1783530295569.jpg';
import { useThemeLang } from '../ThemeLangContext';

interface LandingPageProps {
  gallery: GalleryItem[];
  news: NewsItem[];
  events: EventItem[];
  instructors: Instructor[];
  graduates: Graduate[];
  setIsAdminMode: (mode: boolean) => void;
}

export default function LandingPage({
  gallery,
  news,
  events,
  instructors,
  graduates,
  setIsAdminMode
}: LandingPageProps) {
  const { lang, t } = useThemeLang();

  return (
    <div className="bg-marine-950 min-h-screen transition-colors duration-300">
      
      {/* 1. HERO SECTION */}
      <section id="inicio" className="relative h-screen flex items-center justify-center bg-gradient-to-b from-marine-950 via-marine-900 to-marine-950 text-white overflow-hidden">
        
        {/* Ambient video replacement background */}
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&fit=crop&w=1920&q=80"
            alt="Deep Sea Scuba"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-marine-950 via-marine-950/40 to-marine-950" />
        </div>

        {/* Floating particles background accent */}
        <div className="absolute inset-0 z-1 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-400/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-marine-500/15 rounded-full blur-3xl" />
        </div>

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-cyan-950/80 border border-cyan-800/40 px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm shadow-lg shadow-cyan-950/20"
          >
            <Compass className="h-4 w-4 text-cyan-300 animate-spin" />
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-200">
              {t.appSub}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl sm:text-7xl lg:text-8xl font-display font-extrabold tracking-tight leading-none bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent"
          >
            {lang === 'es' ? 'Explora Cuba Subacuática' : 'Explore Subaquatic Cuba'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-6 text-lg sm:text-2xl text-marine-100 max-w-3xl leading-relaxed font-sans"
          >
            {t.heroSub}
          </motion.p>

          {/* Call to Actions */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <a
              href="#galeria"
              className="bg-gradient-to-r from-cyan-500 to-marine-600 hover:from-cyan-400 hover:to-marine-500 text-white font-bold text-base px-8 py-4 rounded-2xl shadow-xl shadow-cyan-950/40 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>{t.navGallery}</span>
              <span>→</span>
            </a>
            <a
              href="#graduados"
              className="bg-marine-900/60 hover:bg-marine-800/80 border border-marine-700/60 text-marine-100 hover:text-white font-bold text-base px-8 py-4 rounded-2xl shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center space-x-2 backdrop-blur-sm"
            >
              <span>{t.heroBtnGraduates}</span>
            </a>
          </motion.div>

        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
          <span className="text-[10px] text-marine-300 uppercase tracking-widest font-semibold mb-2">
            {lang === 'es' ? 'Desplazar' : 'Scroll'}
          </span>
          <ChevronDown className="h-5 w-5 text-cyan-400 animate-bounce" />
        </div>

      </section>

      {/* 2. FEDERATION MISSION & INFO */}
      <section className="py-24 bg-marine-950 text-white relative transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Column: Visual representation */}
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-72 h-72 bg-cyan-900/20 rounded-3xl blur-3xl pointer-events-none" />
              <div className="relative rounded-3xl overflow-hidden border border-marine-800/60 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80"
                  alt="Diver exploring reef"
                  className="w-full object-cover aspect-4/3"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  width={800}
                  height={600}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-marine-950/60 to-transparent" />
                
                {/* Floating data badge */}
                <div className="absolute bottom-6 left-6 right-6 bg-marine-900/95 backdrop-blur-md rounded-2xl p-5 border border-marine-800/80 shadow-2xl">
                  <div className="flex items-center space-x-3">
                    <div className="bg-marine-800/60 p-2.5 rounded-xl border border-marine-700/50">
                      <Award className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div>
                      <span className="text-sm font-extrabold uppercase text-cyan-400 block">
                        {lang === 'es' ? 'Afiliación Internacional' : 'International Affiliation'}
                      </span>
                      <span className="text-xs text-marine-200/80 font-semibold">
                        {lang === 'es' 
                          ? 'Miembro Oficial CMAS (Confederación Mundial de Actividades Subacuáticas)' 
                          : 'Official Member of CMAS (World Confederation of Underwater Activities)'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Mission Text details */}
            <div>
              <div className="inline-flex items-center space-x-2 bg-marine-900/80 border border-marine-800 px-4 py-1.5 rounded-full mb-4">
                <Shield className="h-4 w-4 text-cyan-400" />
                <span className="text-xs uppercase font-semibold tracking-wider text-cyan-300">
                  {lang === 'es' ? '¿Quiénes Somos?' : 'Who We Are'}
                </span>
              </div>
              
              <h2 className="text-4xl font-display font-extrabold tracking-tight text-white leading-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent">
                {lang === 'es' ? 'Gobernanza y Pasión por el Patrimonio Azul de Cuba' : 'Governance & Passion for Cuba\'s Blue Heritage'}
              </h2>
              
              <p className="mt-6 text-lg text-marine-200/90 leading-relaxed font-sans">
                {t.missionDesc}
              </p>

              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3.5 bg-marine-900/40 p-4 rounded-2xl border border-marine-800/50">
                  <div className="bg-marine-800/60 p-2 rounded-xl shrink-0 border border-marine-700/40">
                    <Droplet className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">{t.ecoTitle}</h4>
                    <p className="text-sm text-marine-300 mt-1">{t.ecoDesc}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5 bg-marine-900/40 p-4 rounded-2xl border border-marine-800/50">
                  <div className="bg-marine-800/60 p-2 rounded-xl shrink-0 border border-marine-700/40">
                    <Star className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">{t.certTitle}</h4>
                    <p className="text-sm text-marine-300 mt-1">{t.certDesc}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. FAMOUS SPOTS COMPONENT GRID */}
      <section className="py-24 bg-gradient-to-b from-marine-950 via-marine-900 to-marine-950 text-white relative transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-extrabold tracking-widest text-cyan-400 block mb-3">
              {lang === 'es' ? 'Zonas Predilectas de Inmersión' : 'Favorite Diving Sites'}
            </span>
            <h2 className="text-4xl font-display font-extrabold text-white bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent">
              {t.destinationsTitle}
            </h2>
            <p className="text-marine-200/90 text-base mt-2">
              {t.destinationsSub}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
            {/* Spot 1 */}
            <div className="bento-card overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
                alt="María la Gorda"
                className="w-full aspect-video object-cover"
                referrerPolicy="no-referrer"
                loading="lazy"
                width={800}
                height={450}
              />
              <div className="p-3.5 sm:p-6">
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-cyan-400">Pinar del Río</span>
                <h3 className="font-display font-extrabold text-sm sm:text-xl text-white mt-1">{t.mariaLaGordaTitle}</h3>
                <p className="text-xs sm:text-sm text-marine-200/80 mt-1 sm:mt-2 leading-relaxed line-clamp-3 sm:line-clamp-none">
                  {t.mariaLaGordaDesc}
                </p>
              </div>
            </div>

            {/* Spot 2 */}
            <div className="bento-card overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=800&q=80"
                alt="Jardines de la Reina"
                className="w-full aspect-video object-cover"
                referrerPolicy="no-referrer"
                loading="lazy"
                width={800}
                height={450}
              />
              <div className="p-3.5 sm:p-6">
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-cyan-400">Ciego de Ávila / Camagüey</span>
                <h3 className="font-display font-extrabold text-sm sm:text-xl text-white mt-1">{t.jardinesTitle}</h3>
                <p className="text-xs sm:text-sm text-marine-200/80 mt-1 sm:mt-2 leading-relaxed line-clamp-3 sm:line-clamp-none">
                  {t.jardinesDesc}
                </p>
              </div>
            </div>

            {/* Spot 3 */}
            <div className="bento-card overflow-hidden col-span-2 md:col-span-1">
              <img
                src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80"
                alt="Bahía de Cochinos"
                className="w-full aspect-video object-cover"
                referrerPolicy="no-referrer"
                loading="lazy"
                width={800}
                height={450}
              />
              <div className="p-3.5 sm:p-6">
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-cyan-400">Matanzas</span>
                <h3 className="font-display font-extrabold text-sm sm:text-xl text-white mt-1">{t.bahiaCochinosTitle}</h3>
                <p className="text-xs sm:text-sm text-marine-200/80 mt-1 sm:mt-2 leading-relaxed line-clamp-3 sm:line-clamp-none">
                  {t.bahiaCochinosDesc}
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. DYNAMIC SUBSECTIONS CONNECTED TO STATE */}
      <GallerySection items={gallery} />
      <NewsSection news={news} />
      <EventsSection events={events} />
      <InstructorsSection instructors={instructors} />
      <GraduatesSection graduates={graduates} />

      {/* 5. FOOTER COMPONENT */}
      <footer className="bg-marine-950 text-white pt-20 pb-10 border-t border-marine-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-marine-800">
            
            {/* Column 1: Identity */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="relative w-10 h-10 bg-white rounded-full overflow-hidden border border-marine-700 p-0.5 flex items-center justify-center">
                  <img
                    src={fcasLogo}
                    alt="Logo FCAS"
                    className="w-full h-full object-contain rounded-full"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="font-display font-black text-2xl tracking-tight bg-gradient-to-r from-cyan-300 to-white bg-clip-text text-transparent">FCAS CUBA</span>
              </div>
              <p className="text-sm text-marine-200 leading-relaxed max-w-sm">
                {t.footerDesc}
              </p>
            </div>

            {/* Column 2: Navigation Links */}
            <div className="md:col-span-3 space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-cyan-400">
                {lang === 'es' ? 'Navegación' : 'Navigation'}
              </h4>
              <ul className="space-y-2.5 text-sm text-marine-200">
                <li><a href="#inicio" className="hover:text-white transition-all">{t.navHome}</a></li>
                <li><a href="#galeria" className="hover:text-white transition-all">{t.navGallery}</a></li>
                <li><a href="#noticias" className="hover:text-white transition-all">{t.navNews}</a></li>
                <li><a href="#eventos" className="hover:text-white transition-all">{t.navEvents}</a></li>
                <li><a href="#instructores" className="hover:text-white transition-all">{t.navInstructors}</a></li>
                <li><a href="#graduados" className="hover:text-white transition-all">{t.navGraduates}</a></li>
              </ul>
            </div>

            {/* Column 3: Contact */}
            <div className="md:col-span-4 space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-cyan-400">
                {lang === 'es' ? 'Contacto' : 'Contact'}
              </h4>
              <ul className="space-y-3.5 text-sm text-marine-200">
                <li className="flex items-center space-x-2.5">
                  <MapPin className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span>{lang === 'es' ? 'Sede Nacional FCAS, Vedado, La Habana, Cuba' : 'FCAS National Headquarters, Vedado, Havana, Cuba'}</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Mail className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span>fcas2024@gmail.com</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Phone className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span>+53 52864139</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Copyright Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-marine-400">
            <span>&copy; {new Date().getFullYear()} {lang === 'es' ? 'Federación Cubana de Actividades Subacuáticas. Todos los derechos reservados.' : 'Cuban Federation of Underwater Activities. All rights reserved.'}</span>
            <div className="flex space-x-4">
              <button
                onClick={() => setIsAdminMode(true)}
                className="hover:text-cyan-300 font-bold uppercase tracking-wider"
              >
                {t.adminPanel}
              </button>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
