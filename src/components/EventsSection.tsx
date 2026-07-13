import React, { useState, useEffect } from 'react';
import { EventItem } from '../types';
import { MapPin, Compass, Calendar, ArrowLeft, X, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useThemeLang } from '../ThemeLangContext';
import { getImageUrl } from '../utils/imageUtils';

interface EventsSectionProps {
  events: EventItem[];
}

export default React.memo(function EventsSection({ events }: EventsSectionProps) {
  const [activeEvent, setActiveEvent] = useState<EventItem | null>(null);
  const { lang } = useThemeLang();

  useEffect(() => {
    if (activeEvent !== null) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setActiveEvent(null);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [activeEvent]);

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'competicion':
        return <span className="bg-blue-900/60 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full border border-blue-700/40">{lang === 'es' ? 'Competencia' : 'Competition'}</span>;
      case 'limpieza':
        return <span className="bg-emerald-900/60 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-700/40">{lang === 'es' ? 'Ecológico' : 'Ecological'}</span>;
      case 'curso':
        return <span className="bg-purple-900/60 text-purple-300 text-xs font-semibold px-3 py-1 rounded-full border border-purple-700/40">{lang === 'es' ? 'Curso / Taller' : 'Course / Workshop'}</span>;
      case 'reunion':
        return <span className="bg-amber-900/60 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full border border-amber-700/40">{lang === 'es' ? 'Reunión' : 'Meeting'}</span>;
      default:
        return <span className="bg-gray-800 text-gray-300 text-xs font-semibold px-3 py-1 rounded-full">{cat}</span>;
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'competicion': return lang === 'es' ? 'Competencia' : 'Competition';
      case 'limpieza': return lang === 'es' ? 'Ecológico' : 'Ecological';
      case 'curso': return lang === 'es' ? 'Curso / Taller' : 'Course / Workshop';
      case 'reunion': return lang === 'es' ? 'Reunión' : 'Meeting';
      default: return cat;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const monthNum = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear().toString();
    const monthsEs = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const months = lang === 'es' ? monthsEs : monthsEn;
    return {
      day,
      month: months[monthNum - 1] || (lang === 'es' ? 'Mes' : 'Month'),
      year
    };
  };

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getUTCDate();
    const monthNum = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();
    const monthsEs = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const monthsEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const months = lang === 'es' ? monthsEs : monthsEn;
    return `${day} de ${months[monthNum - 1]} de ${year}`;
  };

  return (
    <section id="eventos" className="py-24 bg-gradient-to-b from-marine-900 to-marine-950 text-white relative overflow-hidden transition-colors duration-300">
      {/* Absolute graphic layout lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-marine-800/60 via-transparent to-marine-800/20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-marine-800/40 border border-marine-700/50 px-4 py-1.5 rounded-full mb-4">
            <Compass className="h-4 w-4 text-cyan-300 animate-spin" />
            <span className="text-xs uppercase font-semibold tracking-wider text-cyan-200">
              {lang === 'es' ? 'Próximas Jornadas' : 'Upcoming Events'}
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight bg-gradient-to-r from-white via-marine-100 to-cyan-300 bg-clip-text text-transparent">
            {lang === 'es' ? 'Eventos y Actividades Destacadas' : 'Featured Events & Activities'}
          </h2>
          <p className="mt-4 text-lg text-marine-200 leading-relaxed font-sans">
            {lang === 'es' 
              ? 'Inscríbete y participa en nuestros próximos talleres oficiales, limpiezas de fondos marinos, censos ecológicos y competiciones organizadas.' 
              : 'Sign up and participate in our upcoming official workshops, seabed cleanups, ecological censuses, and organized competitions.'}
          </p>
        </div>

        {/* Timeline Event List */}
        {events.length === 0 ? (
          <div className="text-center py-20 bg-marine-900/40 border border-marine-800 rounded-3xl">
            <p className="text-marine-300 font-medium">
              {lang === 'es' ? 'No hay eventos oficiales programados por ahora.' : 'No official events scheduled for now.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 relative">
            {events.map((event) => {
              const { day, month, year } = formatDate(event.date);
              return (
                <div
                  key={event.id}
                  className="flex flex-col sm:flex-row bg-marine-900/40 hover:bg-marine-800/50 rounded-3xl border border-marine-800/80 hover:border-cyan-500/30 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-cyan-950/20 p-3.5 sm:p-5 gap-3 sm:gap-6"
                >
                  {/* Calendar Widget */}
                  <div className="flex sm:flex-col items-center sm:justify-center justify-center bg-gradient-to-br from-cyan-600 to-marine-700 rounded-2xl px-4 py-3 sm:p-4 w-full sm:w-auto sm:min-w-28 text-center shrink-0 shadow-md overflow-hidden">
                    <span className="text-sm sm:text-base font-display font-bold text-white whitespace-nowrap">
                      {day}, {month} {year}
                    </span>
                  </div>

                  {/* Text Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      {/* Meta Tags */}
                      <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                        {getCategoryBadge(event.category)}
                        <span className="text-xs text-marine-300 flex items-center space-x-1">
                          <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                          <span className="truncate max-w-[150px]">{event.location}</span>
                        </span>
                      </div>

                      {/* Event Title */}
                      <h3 className="text-base sm:text-xl font-display font-extrabold text-white hover:text-cyan-300 transition-colors">
                        {event.title}
                      </h3>

                      {/* Event Description */}
                      <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-marine-200 leading-relaxed line-clamp-2 sm:line-clamp-3">
                        {event.description}
                      </p>
                    </div>

                    {/* Action Button/Link */}
                    <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-marine-800/60 flex items-center justify-between">
                      <span className="text-[10px] sm:text-xs text-marine-400 truncate max-w-[160px] sm:max-w-none">
                        {lang === 'es' ? 'Inscripciones a través de tu centro provincial FCAS' : 'Registrations through your local provincial FCAS center'}
                      </span>
                      <button
                        onClick={() => setActiveEvent(event)}
                        className="text-[10px] sm:text-xs font-bold text-cyan-300 hover:text-white flex items-center space-x-1 cursor-pointer shrink-0"
                      >
                        <span>{lang === 'es' ? 'Más info' : 'More info'}</span>
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Banner */}
        <div className="mt-16 text-center bg-gradient-to-r from-marine-950 to-marine-900 border border-marine-800 rounded-3xl p-8 max-w-4xl mx-auto shadow-xl">
          <h3 className="text-xl font-display font-bold text-white mb-2">
            {lang === 'es' ? '¿Quieres organizar un evento ecológico en tu provincia?' : 'Want to organize an ecological event in your province?'}
          </h3>
          <p className="text-sm text-marine-200/90 max-w-2xl mx-auto mb-4">
            {lang === 'es' 
              ? 'Si perteneces a un centro de buceo nacional o eres instructor de la federación y quieres lanzar una campaña de monitoreo, comunícate con la dirección nacional.' 
              : 'If you belong to a national diving center or are a federation instructor and want to launch a monitoring campaign, please contact the national directorate.'}
          </p>
          <a
            href="mailto:fcas-cuba@fcas.cu"
            className="inline-flex items-center justify-center bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm px-6 py-2.5 rounded-xl tracking-wide transition-all"
          >
            {lang === 'es' ? 'Contactar Comité Nacional' : 'Contact National Committee'}
          </a>
        </div>

      </div>

      {/* Modal Dialog for Event Detail */}
      <AnimatePresence>
        {activeEvent && (
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
                  onClick={() => setActiveEvent(null)}
                  className="px-3.5 py-1.5 rounded-full bg-marine-900 hover:bg-cyan-600 text-white cursor-pointer transition-all text-xs font-semibold flex items-center space-x-1.5 border border-marine-800 shadow-md"
                  title={lang === 'es' ? 'Volver' : 'Back'}
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>{lang === 'es' ? 'Atrás' : 'Back'}</span>
                </button>
                
                <span className="text-xs sm:text-sm font-bold tracking-widest text-cyan-400 uppercase font-display hidden sm:block">
                  {lang === 'es' ? 'DETALLES DEL EVENTO' : 'EVENT DETAILS'}
                </span>

                <button
                  onClick={() => setActiveEvent(null)}
                  className="p-2 rounded-full bg-marine-900 hover:bg-cyan-600 text-white cursor-pointer transition-all border border-marine-800 shadow-md"
                  title={lang === 'es' ? 'Cerrar' : 'Close'}
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>

              {/* Main Body */}
              <div className="flex-1 overflow-y-auto flex flex-col">
                {/* Image Header if available */}
                {getImageUrl(activeEvent) && (
                  <div className="h-28 sm:h-auto sm:aspect-video w-full overflow-hidden bg-marine-950 relative shrink-0">
                    <img
                      src={getImageUrl(activeEvent)}
                      alt={activeEvent.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-6">
                      <span className="text-[10px] sm:text-xs uppercase font-extrabold tracking-wider px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border bg-marine-900 border-marine-700/60 text-cyan-400 shadow-sm">
                        {getCategoryLabel(activeEvent.category)}
                      </span>
                    </div>
                  </div>
                )}

                <div className={`p-4 sm:p-8 flex-1 flex flex-col ${!getImageUrl(activeEvent) ? 'pt-6' : ''}`}>
                  {/* Metadata line */}
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-marine-300 mb-3 sm:mb-5 shrink-0">
                    <span className="flex items-center space-x-1.5">
                      <Calendar className="h-3.5 w-3.5 text-cyan-400" />
                      <span>{formatFullDate(activeEvent.date)}</span>
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                      <span>{activeEvent.location}</span>
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <Tag className="h-3.5 w-3.5 text-cyan-400" />
                      <span>{getCategoryLabel(activeEvent.category)}</span>
                    </span>
                  </div>

                  {/* Main Title */}
                  <h3 className="text-lg sm:text-3xl font-display font-extrabold text-white mb-3 sm:mb-6 leading-tight shrink-0">
                    {activeEvent.title}
                  </h3>

                  {/* Full Description */}
                  <div className="text-marine-200 space-y-3 sm:space-y-4 text-xs sm:text-sm sm:text-base leading-relaxed whitespace-pre-line font-sans flex-1 mb-6">
                    {activeEvent.description || (lang === 'es' ? 'Sin descripción disponible.' : 'No description available.')}
                  </div>

                  {/* Registration info */}
                  <div className="mt-auto pt-4 border-t border-marine-800/60 flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-xs text-marine-400 shrink-0">
                    <span>{lang === 'es' ? 'Inscripciones a través de tu centro provincial FCAS' : 'Registrations through your local provincial FCAS center'}</span>
                    <span>{lang === 'es' ? 'ID' : 'ID'}: {activeEvent.id}</span>
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
