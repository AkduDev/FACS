import React from 'react';
import { LogOut, Image, FileText, Calendar, Users, GraduationCap, ChevronRight } from 'lucide-react';
import { DashboardLayoutProps, AdminTab } from './types';

const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
  { id: 'gallery', label: 'Galería Subacuática', icon: <Image className="h-4 w-4" /> },
  { id: 'news', label: 'Noticias y Boletines', icon: <FileText className="h-4 w-4" /> },
  { id: 'events', label: 'Eventos Destacados', icon: <Calendar className="h-4 w-4" /> },
  { id: 'instructors', label: 'Biografías Instructores', icon: <Users className="h-4 w-4" /> },
  { id: 'graduates', label: 'Registro de Graduados', icon: <GraduationCap className="h-4 w-4" /> },
];

export default function DashboardLayout({ activeTab, onTabChange, onLogout, children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-marine-950 pt-28 pb-16 font-sans admin-workspace text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard Title Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-gradient-to-r from-marine-950 to-marine-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-800/50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Panel Central
              </span>
              <span className="text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-800/50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Conectado
              </span>
            </div>
            <h1 className="text-3xl font-display font-extrabold text-white mt-2 tracking-tight">Administración de Contenido</h1>
            <p className="text-sm text-marine-200 mt-1">Gestión interna de registros, estadísticas y publicaciones oficiales.</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onLogout}
              className="bg-red-950/40 hover:bg-red-900 border border-red-800/50 text-red-300 px-4 py-2.5 rounded-2xl text-sm font-semibold flex items-center space-x-2 transition-all cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>

        {/* Workspace Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Side Menu Navigation */}
          <div className="lg:col-span-3 bg-white border border-gray-100 rounded-3xl p-4 shadow-sm flex flex-col sm:grid sm:grid-cols-2 lg:flex lg:flex-col space-y-1.5 sm:space-y-0 sm:gap-2 lg:space-y-1.5">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-4 py-2 sm:col-span-2 lg:col-span-1">Módulos de datos</h2>
            
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold flex items-center justify-between transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-marine-50 text-marine-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {tab.icon}
                  <span>{tab.label}</span>
                </div>
                <ChevronRight className={`h-4 w-4 ${activeTab === tab.id ? 'opacity-100' : 'opacity-0'}`} />
              </button>
            ))}
          </div>

          {/* Core Content */}
          <div className="lg:col-span-9 space-y-8">
            {children}
          </div>

        </div>

      </div>
    </div>
  );
}
