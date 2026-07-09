import React from 'react';
import { EventItem } from '../types';
import { MapPin, Compass } from 'lucide-react';
import { useThemeLang } from '../ThemeLangContext';
import { getImageUrl } from '../utils/imageUtils';

interface EventsSectionProps {
  events: EventItem[];
}

export default React.memo(function EventsSection({ events }: EventsSectionProps) {
  const { lang } = useThemeLang();

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

  const formatDate = (dateString: string) => {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const monthNum = parseInt(parts[1], 10);
      const day = parts[2];
      const monthsEs = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const months = lang === 'es' ? monthsEs : monthsEn;
      return {
        day,
        month: months[monthNum - 1] || (lang === 'es' ? 'Mes' : 'Month'),
        year
      };
    }
    return { day: '00', month: lang === 'es' ? 'Mes' : 'Month', year: '2026' };
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
            {events.map((event, index) => {
              const { day, month, year } = formatDate(event.date);
              return (
                <div
                  key={event.id}
                  className="flex flex-col sm:flex-row bg-marine-900/40 hover:bg-marine-800/50 rounded-3xl border border-marine-800/80 hover:border-cyan-500/30 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-cyan-950/20 p-3.5 sm:p-5 gap-3 sm:gap-6"
                >
                  {/* Calendar Widget */}
                  <div className="flex sm:flex-col items-center sm:justify-center justify-between bg-gradient-to-br from-cyan-600 to-marine-700 rounded-2xl px-4 py-2 sm:p-4 w-full sm:w-28 sm:h-28 text-center shrink-0 shadow-md">
                    <div className="flex items-baseline space-x-2 sm:block">
                      <span className="text-2xl sm:text-4xl font-display font-black tracking-tight text-white">
                        {day}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-widest text-cyan-100 block sm:mt-1">
                        {month}
                      </span>
                    </div>
                    <span className="text-[10px] text-cyan-200 block">
                      {year}
                    </span>
                  </div>

                  {/* Text Details */}
                  <div className="flex-1 flex flex-col justify-between">
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
                      <a
                        href="#inicio"
                        className="text-[10px] sm:text-xs font-bold text-cyan-300 hover:text-white flex items-center space-x-1 cursor-pointer shrink-0"
                      >
                        <span>{lang === 'es' ? 'Más info' : 'More info'}</span>
                        <span>→</span>
                      </a>
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
    </section>
  );
});
