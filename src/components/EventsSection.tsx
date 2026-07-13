import React, { useState } from 'react';
import { EventItem } from '../types';
import { MapPin, Compass, Calendar, Tag } from 'lucide-react';
import { useThemeLang } from '../ThemeLangContext';
import { getImageUrl } from '../utils/imageUtils';
import { formatCalendarDate, formatFullDate } from '../utils/dateUtils';
import DetailModal from './DetailModal';
import { CardSkeleton } from './Skeleton';

interface EventsSectionProps {
  events: EventItem[];
  loading?: boolean;
}

export default React.memo(function EventsSection({ events, loading }: EventsSectionProps) {
  const [activeEvent, setActiveEvent] = useState<EventItem | null>(null);
  const { lang } = useThemeLang();

  const itemTitle = (item: EventItem) => lang === 'en' && item.titleEn ? item.titleEn : item.title;
  const itemDesc = (item: EventItem) => lang === 'en' && item.descriptionEn ? item.descriptionEn : item.description;
  const itemLocation = (item: EventItem) => lang === 'en' && item.locationEn ? item.locationEn : item.location;
  const itemCategory = (item: EventItem) => lang === 'en' && item.categoryEn ? item.categoryEn : item.category;

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

  return (
    <section id="eventos" className="py-24 scroll-mt-20 bg-gradient-to-b from-marine-900 to-marine-950 text-white relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-marine-800/60 via-transparent to-marine-800/20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
            {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 bg-marine-900/40 border border-marine-800 rounded-3xl">
            <p className="text-marine-300 font-medium">
              {lang === 'es' ? 'No hay eventos oficiales programados por ahora.' : 'No official events scheduled for now.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 relative">
            {events.map((event) => {
              const { day, month, year } = formatCalendarDate(event.date);
              return (
                <div
                  key={event.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setActiveEvent(event)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveEvent(event); } }}
                  className="flex flex-col sm:flex-row bg-marine-900/40 hover:bg-marine-800/50 rounded-3xl border border-marine-800/80 hover:border-cyan-500/30 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-cyan-950/20 p-3.5 sm:p-5 gap-3 sm:gap-6 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-marine-950 cursor-pointer"
                >
                  <div className="flex sm:flex-col items-center sm:justify-center justify-center bg-gradient-to-br from-cyan-600 to-marine-700 rounded-2xl px-4 py-3 sm:p-4 w-full sm:w-auto sm:min-w-28 text-center shrink-0 shadow-md overflow-hidden">
                    <span className="text-sm sm:text-base font-display font-bold text-white whitespace-nowrap">
                      {day}, {month(lang)} {year}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                        {getCategoryBadge(event.category)}
                        <span className="text-xs text-marine-300 flex items-center space-x-1">
                          <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                          <span className="truncate max-w-[150px]">{itemLocation(event)}</span>
                        </span>
                      </div>
                      <h3 className="text-base sm:text-xl font-display font-extrabold text-white hover:text-cyan-300 transition-colors">
                        {itemTitle(event)}
                      </h3>
                      <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-marine-200 leading-relaxed line-clamp-2 sm:line-clamp-3">
                        {itemDesc(event)}
                      </p>
                    </div>

                    <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-marine-800/60 flex items-center justify-between">
                      <span className="text-[10px] sm:text-xs text-marine-400 truncate max-w-[160px] sm:max-w-none">
                        {lang === 'es' ? 'Inscripciones a través de tu centro provincial FCAS' : 'Registrations through your local provincial FCAS center'}
                      </span>
                      <span className="text-[10px] sm:text-xs font-bold text-cyan-300 hover:text-white flex items-center space-x-1 shrink-0">
                        <span>{lang === 'es' ? 'Más info' : 'More info'}</span>
                        <span>→</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

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
            href="mailto:fcas2024@gmail.com"
            className="inline-flex items-center justify-center bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm px-6 py-2.5 rounded-xl tracking-wide transition-all"
          >
            {lang === 'es' ? 'Contactar Comité Nacional' : 'Contact National Committee'}
          </a>
        </div>
      </div>

      <DetailModal
        isOpen={!!activeEvent}
        onClose={() => setActiveEvent(null)}
        title={lang === 'es' ? 'DETALLES DEL EVENTO' : 'EVENT DETAILS'}
        lang={lang}
        imageUrl={activeEvent ? getImageUrl(activeEvent) : undefined}
        imageAlt={activeEvent ? activeEvent.title : undefined}
        categoryBadge={activeEvent ? getCategoryBadge(activeEvent.category) : undefined}
        metadata={activeEvent ? (
          <>
            <span className="flex items-center space-x-1.5">
              <Calendar className="h-3.5 w-3.5 text-cyan-400" />
              <span>{formatFullDate(activeEvent.date, lang)}</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <MapPin className="h-3.5 w-3.5 text-cyan-400" />
              <span>{itemLocation(activeEvent)}</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Tag className="h-3.5 w-3.5 text-cyan-400" />
              <span>{itemCategory(activeEvent)}</span>
            </span>
          </>
        ) : undefined}
        footer={activeEvent ? (
          <>
            <span>{lang === 'es' ? 'Inscripciones a través de tu centro provincial FCAS' : 'Registrations through your local provincial FCAS center'}</span>
            <span>{lang === 'es' ? 'ID' : 'ID'}: {activeEvent.id}</span>
          </>
        ) : undefined}
      >
        <h3 className="text-lg sm:text-3xl font-display font-extrabold text-white mb-3 sm:mb-6 leading-tight shrink-0">
          {activeEvent ? itemTitle(activeEvent) : ''}
        </h3>
        <div className="text-marine-200 space-y-3 sm:space-y-4 text-xs sm:text-sm sm:text-base leading-relaxed whitespace-pre-line font-sans flex-1 mb-6">
          {activeEvent ? (itemDesc(activeEvent) || (lang === 'es' ? 'Sin descripción disponible.' : 'No description available.')) : ''}
        </div>
      </DetailModal>
    </section>
  );
});
