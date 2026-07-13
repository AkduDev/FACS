import React, { useState, useMemo } from 'react';
import { Graduate } from '../types';
import { Search, UserCheck, ShieldAlert, Award, FileSpreadsheet, BadgeCheck, Filter } from 'lucide-react';
import { useThemeLang } from '../ThemeLangContext';
import { TableSkeleton } from './Skeleton';

interface GraduatesSectionProps {
  graduates: Graduate[];
  loading?: boolean;
}

export default React.memo(function GraduatesSection({ graduates, loading }: GraduatesSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const { lang, t } = useThemeLang();

  // Stats calculation (memoized)
  const totalCount = graduates.length;
  const divemastersCount = useMemo(() => graduates.filter(g => g.level === 'divemaster' || g.courseName.toLowerCase().includes('divemaster')).length, [graduates]);
  const instructorsCount = useMemo(() => graduates.filter(g => g.level === 'instructor' || g.courseName.toLowerCase().includes('instructor')).length, [graduates]);

  const filteredGraduates = graduates.filter((grad) => {
    const matchesSearch =
      grad.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grad.certificationCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grad.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grad.instructorName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterLevel === 'all' || grad.level === filterLevel;

    return matchesSearch && matchesFilter;
  });

  const getLevelBadge = (level: string) => {
    switch (level) {
      case '1-star':
        return <span className="bg-sky-950/60 text-sky-400 border border-sky-850/50 text-[11px] font-bold px-2.5 py-1 rounded-full">{lang === 'es' ? '1 Estrella CMAS' : '1 Star CMAS'}</span>;
      case '2-star':
        return <span className="bg-indigo-950/60 text-indigo-400 border border-indigo-850/50 text-[11px] font-bold px-2.5 py-1 rounded-full">{lang === 'es' ? '2 Estrellas CMAS' : '2 Stars CMAS'}</span>;
      case '3-star':
        return <span className="bg-purple-950/60 text-purple-400 border border-purple-850/50 text-[11px] font-bold px-2.5 py-1 rounded-full">{lang === 'es' ? '3 Estrellas CMAS' : '3 Stars CMAS'}</span>;
      case 'divemaster':
        return <span className="bg-amber-950/60 text-amber-400 border border-amber-850/50 text-[11px] font-extrabold px-2.5 py-1 rounded-full">Divemaster FCAS</span>;
      case 'instructor':
        return <span className="bg-red-950/60 text-red-400 border border-red-850/50 text-[11px] font-extrabold px-2.5 py-1 rounded-full">{lang === 'es' ? 'Instructor FCAS' : 'FCAS Instructor'}</span>;
      default:
        return <span className="bg-marine-900 text-marine-300 border border-marine-800 text-[11px] font-semibold px-2.5 py-1 rounded-full">{lang === 'es' ? 'Deportivo' : 'Sport'}</span>;
    }
  };

  return (
    <section id="graduados" className="py-24 scroll-mt-20 bg-gradient-to-b from-marine-900 to-marine-950 text-white relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-marine-900 border border-marine-800 px-4 py-1.5 rounded-full mb-4">
            <FileSpreadsheet className="h-4 w-4 text-cyan-400" />
            <span className="text-xs uppercase font-semibold tracking-wider text-cyan-300">
              {lang === 'es' ? 'Registro Nacional' : 'National Registry'}
            </span>
          </div>
          <h2 className="text-4xl font-display font-extrabold tracking-tight text-white bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent">
            {lang === 'es' ? 'Directorio de Graduados de Buceo' : 'Diving Graduates Directory'}
          </h2>
          <p className="mt-3 text-lg text-marine-200/90 leading-relaxed font-sans">
            {lang === 'es' 
              ? 'Verifica el estatus de las licencias y certificaciones oficiales de buceadores formados por instructores avalados por la federación en Cuba.' 
              : 'Verify the status of official licenses and certifications of divers trained by federation-approved instructors in Cuba.'}
          </p>
        </div>

        {/* Dynamic Statistics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          <div className="bg-marine-900/60 backdrop-blur-md rounded-2xl border border-marine-800/80 p-6 flex items-center space-x-4 shadow-xl">
            <div className="bg-marine-800/60 p-3 rounded-xl border border-marine-700/50">
              <Award className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-display font-black text-white">{totalCount}</span>
              <p className="text-xs text-marine-300 font-semibold uppercase tracking-wider">
                {lang === 'es' ? 'Total Certificados' : 'Total Certified'}
              </p>
            </div>
          </div>
          <div className="bg-marine-900/60 backdrop-blur-md rounded-2xl border border-marine-800/80 p-6 flex items-center space-x-4 shadow-xl">
            <div className="bg-amber-950/30 p-3 rounded-xl border border-amber-800/30">
              <BadgeCheck className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-display font-black text-amber-400">{divemastersCount}</span>
              <p className="text-xs text-marine-300 font-semibold uppercase tracking-wider">
                {lang === 'es' ? 'Guías / Divemasters' : 'Guides / Divemasters'}
              </p>
            </div>
          </div>
          <div className="bg-marine-900/60 backdrop-blur-md rounded-2xl border border-marine-800/80 p-6 flex items-center space-x-4 shadow-xl">
            <div className="bg-red-950/30 p-3 rounded-xl border border-red-800/30">
              <UserCheck className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-display font-black text-red-400">{instructorsCount}</span>
              <p className="text-xs text-marine-300 font-semibold uppercase tracking-wider">
                {lang === 'es' ? 'Instructores' : 'Instructors'}
              </p>
            </div>
          </div>
        </div>

        {/* Filters and Search Bar Container */}
        <div className="bg-marine-900/80 backdrop-blur-md border border-marine-800/80 rounded-3xl shadow-2xl p-6 mb-8 max-w-5xl mx-auto flex flex-col md:flex-row gap-4 items-center">
          
          {/* Search Box */}
          <div className="relative w-full md:flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-marine-400" />
            </div>
            <input
              type="text"
              placeholder={lang === 'es' ? 'Buscar graduado por nombre, código de licencia, instructor o curso...' : 'Search graduate by name, license code, instructor, or course...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-11 pr-4 py-3 bg-marine-950/60 border border-marine-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 font-sans text-white placeholder:text-marine-400"
            />
          </div>

          {/* Level Filter Dropdown */}
          <div className="flex items-center space-x-2 w-full md:w-auto shrink-0">
            <Filter className="h-4 w-4 text-marine-400" />
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="block w-full md:w-56 py-3 px-4 bg-marine-950 border border-marine-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white cursor-pointer"
            >
              <option value="all">{lang === 'es' ? 'Todos los niveles' : 'All Levels'}</option>
              <option value="1-star">{lang === 'es' ? '1 Estrella (Open Water)' : '1 Star (Open Water)'}</option>
              <option value="2-star">{lang === 'es' ? '2 Estrellas (Advanced)' : '2 Stars (Advanced)'}</option>
              <option value="3-star">{lang === 'es' ? '3 Estrellas (Rescue)' : '3 Stars (Rescue)'}</option>
              <option value="divemaster">Divemasters</option>
              <option value="instructor">{lang === 'es' ? 'Instructores' : 'Instructors'}</option>
            </select>
          </div>

        </div>

        {/* Directory Table View */}
        <div className="bg-marine-900/30 backdrop-blur-md rounded-3xl border border-marine-800/80 shadow-2xl overflow-hidden max-w-5xl mx-auto">
          {loading ? (
            <div className="p-6"><TableSkeleton /></div>
          ) : filteredGraduates.length === 0 ? (
            <div className="text-center py-24 px-6">
              <ShieldAlert className="h-14 w-14 text-amber-500 mx-auto mb-4" />
              <h3 className="text-xl font-display font-bold text-white">
                {lang === 'es' ? 'Buceador no verificado' : 'Diver not verified'}
              </h3>
              <p className="text-marine-300 text-sm mt-1 max-w-md mx-auto">
                {lang === 'es' 
                  ? 'No pudimos localizar ningún registro que coincida con los criterios de búsqueda. Asegúrese de que el código o nombre esté escrito correctamente.' 
                  : 'We could not locate any records matching the search criteria. Please ensure the code or name is written correctly.'}
              </p>
            </div>
          ) : (
            <div>
              {/* Desktop Table View (Visible on Medium screens and larger) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-marine-800/50">
                  <thead className="bg-marine-900/80">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-marine-300 uppercase tracking-widest">
                        {lang === 'es' ? 'Nombre Completo' : 'Full Name'}
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-marine-300 uppercase tracking-widest">
                        {lang === 'es' ? 'Nivel / Curso' : 'Level / Course'}
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-marine-300 uppercase tracking-widest">
                        {lang === 'es' ? 'Código Licencia' : 'License Code'}
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-marine-300 uppercase tracking-widest">
                        {lang === 'es' ? 'Fecha Graduación' : 'Graduation Date'}
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-marine-300 uppercase tracking-widest">
                        {lang === 'es' ? 'Instructor Certificador' : 'Certifying Instructor'}
                      </th>
                      <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-marine-300 uppercase tracking-widest">
                        {lang === 'es' ? 'Estatus' : 'Status'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-transparent divide-y divide-marine-800/30 text-sm">
                    {filteredGraduates.map((grad) => (
                      <tr key={grad.id} className="hover:bg-marine-800/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-bold text-white font-sans">{grad.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-marine-100 font-semibold">{grad.courseName}</span>
                            <span className="mt-1">{getLevelBadge(grad.level)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-mono text-xs bg-marine-950/80 px-2.5 py-1 rounded border border-marine-800 text-cyan-400 font-bold">
                            {grad.certificationCode}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-marine-300 font-mono text-xs">
                          {grad.graduationDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-marine-250 font-medium">
                          {grad.instructorName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5 animate-ping"></span>
                            {lang === 'es' ? 'Verificado' : 'Verified'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards View (Visible on Small screens only) */}
              <div className="block md:hidden divide-y divide-marine-800/40">
                {filteredGraduates.map((grad) => (
                  <div key={grad.id} className="p-3.5 hover:bg-marine-800/20 transition-all duration-200">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="font-bold text-white font-sans text-sm sm:text-base leading-snug">{grad.name}</h4>
                        <span className="text-[11px] sm:text-xs text-marine-300 font-medium">{grad.courseName}</span>
                      </div>
                      <span className="shrink-0 inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/30">
                        <span className="h-1.25 w-1.25 rounded-full bg-emerald-500 mr-1 animate-ping"></span>
                        {lang === 'es' ? 'Verificado' : 'Verified'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-3 gap-y-2 pt-2.5 border-t border-marine-800/20">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-marine-400 block tracking-wider">
                          {lang === 'es' ? 'Licencia' : 'License'}
                        </span>
                        <span className="font-mono text-[11px] sm:text-xs text-cyan-400 font-bold bg-marine-950/80 px-1.5 py-0.5 rounded border border-marine-800 inline-block mt-0.5">
                          {grad.certificationCode}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-marine-400 block tracking-wider">
                          {lang === 'es' ? 'Graduación' : 'Graduation'}
                        </span>
                        <span className="text-[11px] sm:text-xs text-marine-300 font-mono inline-block mt-1">{grad.graduationDate}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[9px] uppercase font-bold text-marine-400 block tracking-wider">
                          {lang === 'es' ? 'Instructor Certificador' : 'Certifying Instructor'}
                        </span>
                        <span className="text-[11px] sm:text-xs text-marine-200 font-medium inline-block mt-0.5">{grad.instructorName}</span>
                      </div>
                    </div>

                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {getLevelBadge(grad.level)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Table Footer */}
          <div className="bg-marine-950/60 px-6 py-4 border-t border-marine-800/60 text-xs text-marine-300 flex flex-col sm:flex-row justify-between items-center gap-2">
            <span>
              {lang === 'es' 
                ? 'Registros oficiales de la Federación Cubana de Actividades Subacuáticas.' 
                : 'Official records of the Cuban Federation of Underwater Activities.'}
            </span>
            <span>
              {lang === 'es' 
                ? `Mostrando ${filteredGraduates.length} de ${graduates.length} graduados registrados.` 
                : `Showing ${filteredGraduates.length} of ${graduates.length} registered graduates.`}
            </span>
          </div>

        </div>

      </div>
    </section>
  );
});
