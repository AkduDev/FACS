import React, { useState } from 'react';
import { GalleryItem, NewsItem, EventItem, Instructor, Graduate } from '../types';
import {
  ShieldAlert, Lock, Compass, Plus, Trash2, Edit2, Check, X,
  Image, FileText, Calendar, Users, GraduationCap, LogOut, ChevronRight, Upload
} from 'lucide-react';
import fcasLogo from '../assets/images/fcas_logo_v2_1783530295569.jpg';
import FileUpload from './FileUpload';
import { getImageUrl } from '../utils/imageUtils';

interface AdminDashboardProps {
  isLoggedIn: boolean;
  onLogin: (password: string) => Promise<boolean>;
  onLogout: () => void;
  gallery: GalleryItem[];
  setGallery: React.Dispatch<React.SetStateAction<GalleryItem[]>>;
  news: NewsItem[];
  setNews: React.Dispatch<React.SetStateAction<NewsItem[]>>;
  events: EventItem[];
  setEvents: React.Dispatch<React.SetStateAction<EventItem[]>>;
  instructors: Instructor[];
  setInstructors: React.Dispatch<React.SetStateAction<Instructor[]>>;
  graduates: Graduate[];
  setGraduates: React.Dispatch<React.SetStateAction<Graduate[]>>;
}

export default function AdminDashboard({
  isLoggedIn,
  onLogin,
  onLogout,
  gallery,
  setGallery,
  news,
  setNews,
  events,
  setEvents,
  instructors,
  setInstructors,
  graduates,
  setGraduates
}: AdminDashboardProps) {
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'gallery' | 'news' | 'events' | 'instructors' | 'graduates'>('gallery');

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);

  // Gallery Form State
  const [galleryForm, setGalleryForm] = useState<Omit<GalleryItem, 'id'>>({
    url: '',
    title: '',
    description: '',
    category: 'fauna',
    date: new Date().toISOString().split('T')[0],
    localImage: ''
  });

  // News Form State
  const [newsForm, setNewsForm] = useState<Omit<NewsItem, 'id'>>({
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    image: '',
    localImage: '',
    author: 'Administrador FCAS',
    category: 'federacion'
  });

  // Events Form State
  const [eventsForm, setEventsForm] = useState<Omit<EventItem, 'id'>>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    description: '',
    category: 'curso',
    image: '',
    localImage: ''
  });

  // Instructors Form State
  const [instructorForm, setInstructorForm] = useState<Omit<Instructor, 'id'>>({
    name: '',
    bio: '',
    level: '',
    certificationCode: '',
    photo: '',
    localPhoto: '',
    experienceYears: 5
  });

  // Graduates Form State
  const [graduateForm, setGraduateForm] = useState<Omit<Graduate, 'id'>>({
    name: '',
    certificationCode: '',
    courseName: 'Open Water Diver (1 Estrella)',
    graduationDate: new Date().toISOString().split('T')[0],
    instructorName: '',
    level: '1-star'
  });

  // File upload states
  const [galleryFile, setGalleryFile] = useState<File | null>(null);
  const [newsFile, setNewsFile] = useState<File | null>(null);
  const [eventsFile, setEventsFile] = useState<File | null>(null);
  const [instructorFile, setInstructorFile] = useState<File | null>(null);

  // Image source mode (url or upload)
  const [galleryImageMode, setGalleryImageMode] = useState<'url' | 'upload'>('url');
  const [newsImageMode, setNewsImageMode] = useState<'url' | 'upload'>('url');
  const [eventsImageMode, setEventsImageMode] = useState<'url' | 'upload'>('url');
  const [instructorImageMode, setInstructorImageMode] = useState<'url' | 'upload'>('url');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onLogin(password);
    if (!success) {
      setLoginError('Contraseña incorrecta. Use: fcas2026');
    } else {
      setLoginError('');
      setPassword('');
    }
  };

  const generateId = () => Math.random().toString(36).substring(2, 9);

  // Reset forms helper
  const resetForms = () => {
    setEditingId(null);
    setGalleryForm({
      url: '',
      title: '',
      description: '',
      category: 'fauna',
      date: new Date().toISOString().split('T')[0],
      localImage: ''
    });
    setNewsForm({
      title: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
      image: '',
      localImage: '',
      author: 'Administrador FCAS',
      category: 'federacion'
    });
    setEventsForm({
      title: '',
      date: new Date().toISOString().split('T')[0],
      location: '',
      description: '',
      category: 'curso',
      image: '',
      localImage: ''
    });
    setInstructorForm({
      name: '',
      bio: '',
      level: '',
      certificationCode: '',
      photo: '',
      localPhoto: '',
      experienceYears: 5
    });
    setGraduateForm({
      name: '',
      certificationCode: '',
      courseName: 'Open Water Diver (1 Estrella)',
      graduationDate: new Date().toISOString().split('T')[0],
      instructorName: '',
      level: '1-star'
    });
    // Reset file states
    setGalleryFile(null);
    setNewsFile(null);
    setEventsFile(null);
    setInstructorFile(null);
    setGalleryImageMode('url');
    setNewsImageMode('url');
    setEventsImageMode('url');
    setInstructorImageMode('url');
  };

  // -------------- Gallery Handlers --------------
  const saveGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.title) {
      alert('Por favor complete los campos obligatorios.');
      return;
    }

    // Validar que tenga URL o archivo
    if (galleryImageMode === 'url' && !galleryForm.url) {
      alert('Por favor ingrese una URL de imagen o suba un archivo.');
      return;
    }
    if (galleryImageMode === 'upload' && !galleryFile && !editingId) {
      alert('Por favor suba una imagen.');
      return;
    }

    try {
      if (editingId) {
        // Update existing item
        setGallery(prev => prev.map(item => item.id === editingId ? { ...item, ...galleryForm } : item));
      } else {
        // Create new item
        const newItem: GalleryItem = {
          id: 'g_' + generateId(),
          ...galleryForm
        };
        setGallery(prev => [newItem, ...prev]);
      }
      resetForms();
    } catch (error) {
      console.error('Error saving gallery item:', error);
      alert('Error al guardar. Por favor intente de nuevo.');
    }
  };

  const startEditGallery = (item: GalleryItem) => {
    setEditingId(item.id);
    setGalleryForm({
      url: item.url,
      title: item.title,
      description: item.description,
      category: item.category,
      date: item.date,
      localImage: item.localImage
    });
    if (item.localImage) {
      setGalleryImageMode('upload');
    } else {
      setGalleryImageMode('url');
    }
  };

  const deleteGalleryItem = (id: string) => {
    if (confirm('¿Está seguro de eliminar esta foto?')) {
      setGallery(prev => prev.filter(item => item.id !== id));
    }
  };

  // -------------- News Handlers --------------
  const saveNewsItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsForm.title || !newsForm.content) {
      alert('Por favor complete los campos obligatorios.');
      return;
    }

    if (editingId) {
      setNews(prev => prev.map(item => item.id === editingId ? { ...item, ...newsForm } : item));
    } else {
      const newItem: NewsItem = {
        id: 'n_' + generateId(),
        ...newsForm
      };
      setNews(prev => [newItem, ...prev]);
    }
    resetForms();
  };

  const startEditNews = (item: NewsItem) => {
    setEditingId(item.id);
    setNewsForm({
      title: item.title,
      content: item.content,
      date: item.date,
      image: item.image || '',
      localImage: item.localImage || '',
      author: item.author,
      category: item.category
    });
    if (item.localImage) {
      setNewsImageMode('upload');
    } else {
      setNewsImageMode('url');
    }
  };

  const deleteNewsItem = (id: string) => {
    if (confirm('¿Está seguro de eliminar esta noticia?')) {
      setNews(prev => prev.filter(item => item.id !== id));
    }
  };

  // -------------- Events Handlers --------------
  const saveEventItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventsForm.title || !eventsForm.location) {
      alert('Por favor complete los campos obligatorios.');
      return;
    }

    if (editingId) {
      setEvents(prev => prev.map(item => item.id === editingId ? { ...item, ...eventsForm } : item));
    } else {
      const newItem: EventItem = {
        id: 'e_' + generateId(),
        ...eventsForm
      };
      setEvents(prev => [newItem, ...prev]);
    }
    resetForms();
  };

  const startEditEvent = (item: EventItem) => {
    setEditingId(item.id);
    setEventsForm({
      title: item.title,
      date: item.date,
      location: item.location,
      description: item.description,
      category: item.category,
      image: item.image || '',
      localImage: item.localImage || ''
    });
    if (item.localImage) {
      setEventsImageMode('upload');
    } else {
      setEventsImageMode('url');
    }
  };

  const deleteEventItem = (id: string) => {
    if (confirm('¿Está seguro de eliminar este evento?')) {
      setEvents(prev => prev.filter(item => item.id !== id));
    }
  };

  // -------------- Instructors Handlers --------------
  const saveInstructor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!instructorForm.name || !instructorForm.certificationCode) {
      alert('Por favor complete los campos obligatorios.');
      return;
    }

    // Set default beautiful photo if none is provided
    const photoToSave = instructorForm.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';

    if (editingId) {
      setInstructors(prev => prev.map(item => item.id === editingId ? { ...item, ...instructorForm, photo: photoToSave } : item));
    } else {
      const newItem: Instructor = {
        id: 'i_' + generateId(),
        ...instructorForm,
        photo: photoToSave
      };
      setInstructors(prev => [newItem, ...prev]);
    }
    resetForms();
  };

  const startEditInstructor = (item: Instructor) => {
    setEditingId(item.id);
    setInstructorForm({
      name: item.name,
      bio: item.bio,
      level: item.level,
      certificationCode: item.certificationCode,
      photo: item.photo,
      localPhoto: item.localPhoto || '',
      experienceYears: item.experienceYears
    });
    if (item.localPhoto) {
      setInstructorImageMode('upload');
    } else {
      setInstructorImageMode('url');
    }
  };

  const deleteInstructor = (id: string) => {
    if (confirm('¿Está seguro de eliminar este instructor?')) {
      setInstructors(prev => prev.filter(item => item.id !== id));
    }
  };

  // -------------- Graduates Handlers --------------
  const saveGraduate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!graduateForm.name || !graduateForm.certificationCode || !graduateForm.instructorName) {
      alert('Por favor complete los campos obligatorios.');
      return;
    }

    if (editingId) {
      setGraduates(prev => prev.map(item => item.id === editingId ? { ...item, ...graduateForm } : item));
    } else {
      const newItem: Graduate = {
        id: 'g_' + generateId(),
        ...graduateForm
      };
      setGraduates(prev => [newItem, ...prev]);
    }
    resetForms();
  };

  const startEditGraduate = (item: Graduate) => {
    setEditingId(item.id);
    setGraduateForm({
      name: item.name,
      certificationCode: item.certificationCode,
      courseName: item.courseName,
      graduationDate: item.graduationDate,
      instructorName: item.instructorName,
      level: item.level
    });
  };

  const deleteGraduate = (id: string) => {
    if (confirm('¿Está seguro de eliminar este graduado?')) {
      setGraduates(prev => prev.filter(item => item.id !== id));
    }
  };


  // If the user is NOT logged in, show the login screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-marine-950 flex flex-col justify-center items-center px-4 relative overflow-hidden">
        
        {/* Background ocean graphics */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-marine-800/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-marine-900 border border-marine-800 rounded-3xl p-8 shadow-2xl relative z-10">
          <div className="text-center mb-8">
            <div className="relative mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center mb-5 shadow-2xl p-1 border-2 border-cyan-400">
              <img
                src={fcasLogo}
                alt="Logo FCAS"
                className="w-full h-full object-contain rounded-full"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-1 -right-1 bg-red-600 p-1.5 rounded-full shadow-lg border border-marine-900">
                <Lock className="h-3 w-3 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-display font-extrabold text-white tracking-tight">Acceso Administrativo</h1>
            <p className="text-xs text-marine-300 uppercase font-bold tracking-widest mt-2">Federación de Actividades Subacuáticas</p>
            <p className="text-sm text-marine-200 mt-4 leading-relaxed">
              Inicie sesión para editar y gestionar el catálogo de graduados, galería, instructores y noticias de la web de la FCAS.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-marine-300 uppercase tracking-widest mb-2">
                Contraseña de Administrador
              </label>
              <input
                type="password"
                placeholder="Introduzca la clave oficial..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-marine-950 text-white px-4 py-3 border border-marine-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 font-sans"
              />
              <p className="text-[11px] text-marine-400 mt-2">
                Clave predeterminada de prueba: <strong className="text-cyan-400">fcas2026</strong>
              </p>
            </div>

            {loginError && (
              <div className="bg-red-950/40 border border-red-800 text-red-400 text-xs px-4 py-3 rounded-xl flex items-center space-x-2">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-marine-500 hover:from-cyan-400 hover:to-marine-400 text-white py-3 px-4 rounded-2xl text-sm font-bold shadow-lg shadow-cyan-900/30 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <a
            href="#inicio"
            onClick={(e) => {
              // We'll let standard App.tsx handle navigating back
              window.location.hash = '#inicio';
            }}
            className="text-sm font-semibold text-marine-300 hover:text-white transition-all flex items-center space-x-1.5"
          >
            <span>← Volver a la página de inicio</span>
          </a>
        </div>

      </div>
    );
  }

  // If logged in, show the full admin dashboard workspace
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
            
            <button
              onClick={() => { setActiveTab('gallery'); resetForms(); }}
              className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'gallery'
                  ? 'bg-marine-50 text-marine-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Image className="h-4 w-4" />
                <span>Galería Subacuática</span>
              </div>
              <ChevronRight className={`h-4 w-4 ${activeTab === 'gallery' ? 'opacity-100' : 'opacity-0'}`} />
            </button>

            <button
              onClick={() => { setActiveTab('news'); resetForms(); }}
              className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'news'
                  ? 'bg-marine-50 text-marine-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <FileText className="h-4 w-4" />
                <span>Noticias y Boletines</span>
              </div>
              <ChevronRight className={`h-4 w-4 ${activeTab === 'news' ? 'opacity-100' : 'opacity-0'}`} />
            </button>

            <button
              onClick={() => { setActiveTab('events'); resetForms(); }}
              className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'events'
                  ? 'bg-marine-50 text-marine-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4" />
                <span>Eventos Destacados</span>
              </div>
              <ChevronRight className={`h-4 w-4 ${activeTab === 'events' ? 'opacity-100' : 'opacity-0'}`} />
            </button>

            <button
              onClick={() => { setActiveTab('instructors'); resetForms(); }}
              className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'instructors'
                  ? 'bg-marine-50 text-marine-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Users className="h-4 w-4" />
                <span>Biografías Instructores</span>
              </div>
              <ChevronRight className={`h-4 w-4 ${activeTab === 'instructors' ? 'opacity-100' : 'opacity-0'}`} />
            </button>

            <button
              onClick={() => { setActiveTab('graduates'); resetForms(); }}
              className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'graduates'
                  ? 'bg-marine-50 text-marine-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <GraduationCap className="h-4 w-4" />
                <span>Registro de Graduados</span>
              </div>
              <ChevronRight className={`h-4 w-4 ${activeTab === 'graduates' ? 'opacity-100' : 'opacity-0'}`} />
            </button>
          </div>

          {/* Core Content Form & Table Workspace */}
          <div className="lg:col-span-9 space-y-8">
            
            {/* 1. GALLERY TAB WORKSPACE */}
            {activeTab === 'gallery' && (
              <div className="space-y-8">
                {/* Addition / Edit Form */}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">
                  <h3 className="text-xl font-display font-extrabold text-marine-950 mb-6 flex items-center space-x-2">
                    <Plus className="h-5 w-5 text-cyan-600" />
                    <span>{editingId ? 'Editar Foto en Galería' : 'Añadir Nueva Foto a la Galería'}</span>
                  </h3>

                  <form onSubmit={saveGalleryItem} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Imagen de la Galería</label>
                      
                      {/* Image source mode toggle */}
                      <div className="flex gap-2 mb-4">
                        <button
                          type="button"
                          onClick={() => setGalleryImageMode('url')}
                          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                            galleryImageMode === 'url'
                              ? 'bg-cyan-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          Usar URL
                        </button>
                        <button
                          type="button"
                          onClick={() => setGalleryImageMode('upload')}
                          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                            galleryImageMode === 'upload'
                              ? 'bg-cyan-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          Subir Archivo
                        </button>
                      </div>

                      {galleryImageMode === 'url' ? (
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/..."
                          value={galleryForm.url}
                          onChange={(e) => setGalleryForm({ ...galleryForm, url: e.target.value })}
                          className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                      ) : (
                        <FileUpload
                          onUploadComplete={(url) => {
                            setGalleryForm({ ...galleryForm, url, localImage: url });
                            setGalleryFile(null);
                          }}
                          onUploadError={(error) => alert(error)}
                          label="Subir imagen de galería"
                        />
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Título de la Imagen (Obligatorio)</label>
                      <input
                        type="text"
                        placeholder="ej. Coral Negro en María la Gorda"
                        value={galleryForm.title}
                        onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Categoría</label>
                      <select
                        value={galleryForm.category}
                        onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value as any })}
                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                        <option value="fauna">Fauna Marina</option>
                        <option value="flora">Flora y Coral</option>
                        <option value="naufragios">Naufragios</option>
                        <option value="entrenamiento">Entrenamiento</option>
                        <option value="paisaje">Paisajes</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Descripción Detallada</label>
                      <textarea
                        rows={3}
                        placeholder="Describa el espécimen, el lugar o la historia detrás de la fotografía..."
                        value={galleryForm.description}
                        onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Fecha del Registro</label>
                      <input
                        type="date"
                        value={galleryForm.date}
                        onChange={(e) => setGalleryForm({ ...galleryForm, date: e.target.value })}
                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>

                    <div className="md:col-span-2 flex justify-end space-x-3 pt-4 border-t border-gray-100">
                      {editingId && (
                        <button
                          type="button"
                          onClick={resetForms}
                          className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 cursor-pointer"
                        >
                          Cancelar Edición
                        </button>
                      )}
                      <button
                        type="submit"
                        className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all cursor-pointer"
                      >
                        {editingId ? 'Actualizar Foto' : 'Guardar en Galería'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Listing Grid */}
                <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-6 py-4 border-b border-gray-100">Lista de fotos actuales</h3>
                  <div className="divide-y divide-gray-100">
                    {gallery.map(item => (
                      <div key={item.id} className="p-4 sm:p-6 flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <img
                            src={getImageUrl(item) || item.url}
                            alt={item.title}
                            className="w-16 h-16 object-cover rounded-xl border border-gray-100 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 bg-gray-100 border border-gray-200 rounded text-gray-600">
                              {item.category}
                            </span>
                            <h4 className="font-bold text-gray-950 mt-1 text-sm">{item.title}</h4>
                            <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{item.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => startEditGallery(item)}
                            className="p-2 rounded-xl bg-gray-50 hover:bg-cyan-50 text-gray-500 hover:text-cyan-600 border border-gray-100 cursor-pointer transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteGalleryItem(item.id)}
                            className="p-2 rounded-xl bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-600 border border-gray-100 cursor-pointer transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. NEWS TAB WORKSPACE */}
            {activeTab === 'news' && (
              <div className="space-y-8">
                {/* Add/Edit Form */}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">
                  <h3 className="text-xl font-display font-extrabold text-marine-950 mb-6 flex items-center space-x-2">
                    <Plus className="h-5 w-5 text-cyan-600" />
                    <span>{editingId ? 'Editar Comunicado / Noticia' : 'Crear Nueva Noticia o Comunicado'}</span>
                  </h3>

                  <form onSubmit={saveNewsItem} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Título del Comunicado (Obligatorio)</label>
                      <input
                        type="text"
                        placeholder="ej. Expedición científica reporta reaparición de corales cuerno de ciervo..."
                        value={newsForm.title}
                        onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Autor / Comité Emisor</label>
                      <input
                        type="text"
                        value={newsForm.author}
                        onChange={(e) => setNewsForm({ ...newsForm, author: e.target.value })}
                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Categoría</label>
                      <select
                        value={newsForm.category}
                        onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value as any })}
                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                        <option value="conservacion">Conservación</option>
                        <option value="federacion">Federativo / Institucional</option>
                        <option value="seguridad">Seguridad y Normas</option>
                        <option value="exploracion">Exploración y Ciencia</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Imagen Ilustrativa</label>
                      
                      {/* Image source mode toggle */}
                      <div className="flex gap-2 mb-4">
                        <button
                          type="button"
                          onClick={() => setNewsImageMode('url')}
                          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                            newsImageMode === 'url'
                              ? 'bg-cyan-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          Usar URL
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewsImageMode('upload')}
                          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                            newsImageMode === 'upload'
                              ? 'bg-cyan-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          Subir Archivo
                        </button>
                      </div>

                      {newsImageMode === 'url' ? (
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/..."
                          value={newsForm.image}
                          onChange={(e) => setNewsForm({ ...newsForm, image: e.target.value })}
                          className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                      ) : (
                        <FileUpload
                          onUploadComplete={(url) => {
                            setNewsForm({ ...newsForm, image: url, localImage: url });
                            setNewsFile(null);
                          }}
                          onUploadError={(error) => alert(error)}
                          label="Subir imagen de noticia"
                        />
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Contenido Completo de la Noticia</label>
                      <textarea
                        rows={6}
                        placeholder="Escriba los párrafos de la noticia..."
                        value={newsForm.content}
                        onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Fecha Publicación</label>
                      <input
                        type="date"
                        value={newsForm.date}
                        onChange={(e) => setNewsForm({ ...newsForm, date: e.target.value })}
                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>

                    <div className="md:col-span-2 flex justify-end space-x-3 pt-4 border-t border-gray-100">
                      {editingId && (
                        <button
                          type="button"
                          onClick={resetForms}
                          className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 cursor-pointer"
                        >
                          Cancelar Edición
                        </button>
                      )}
                      <button
                        type="submit"
                        className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all cursor-pointer"
                      >
                        {editingId ? 'Actualizar Noticia' : 'Publicar Noticia'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* News Table Listing */}
                <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-6 py-4 border-b border-gray-100">Lista de noticias actuales</h3>
                  <div className="divide-y divide-gray-100">
                    {news.map(item => (
                      <div key={item.id} className="p-4 sm:p-6 flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap hover:bg-gray-50 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 bg-gray-100 border border-gray-200 rounded text-gray-600">
                              {item.category}
                            </span>
                            <span className="text-xs text-gray-400 font-mono">{item.date}</span>
                          </div>
                          <h4 className="font-bold text-gray-950 mt-1 text-sm">{item.title}</h4>
                          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{item.content}</p>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0">
                          <button
                            onClick={() => startEditNews(item)}
                            className="p-2 rounded-xl bg-gray-50 hover:bg-cyan-50 text-gray-500 hover:text-cyan-600 border border-gray-100 cursor-pointer transition-colors"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteNewsItem(item.id)}
                            className="p-2 rounded-xl bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-600 border border-gray-100 cursor-pointer transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 3. EVENTS TAB WORKSPACE */}
            {activeTab === 'events' && (
              <div className="space-y-8">
                {/* Add/Edit Form */}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">
                  <h3 className="text-xl font-display font-extrabold text-marine-950 mb-6 flex items-center space-x-2">
                    <Plus className="h-5 w-5 text-cyan-600" />
                    <span>{editingId ? 'Editar Evento' : 'Crear Nuevo Evento'}</span>
                  </h3>

                  <form onSubmit={saveEventItem} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nombre del Evento (Obligatorio)</label>
                      <input
                        type="text"
                        placeholder="ej. Campaña de Limpieza del Naufragio de Varadero"
                        value={eventsForm.title}
                        onChange={(e) => setEventsForm({ ...eventsForm, title: e.target.value })}
                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Fecha del Evento</label>
                      <input
                        type="date"
                        value={eventsForm.date}
                        onChange={(e) => setEventsForm({ ...eventsForm, date: e.target.value })}
                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Lugar / Ubicación (Obligatorio)</label>
                      <input
                        type="text"
                        placeholder="ej. Varadero, Matanzas"
                        value={eventsForm.location}
                        onChange={(e) => setEventsForm({ ...eventsForm, location: e.target.value })}
                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Categoría</label>
                      <select
                        value={eventsForm.category}
                        onChange={(e) => setEventsForm({ ...eventsForm, category: e.target.value as any })}
                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                        <option value="competicion">Competencia / Torneo</option>
                        <option value="limpieza">Limpieza de Fondos / Ecológico</option>
                        <option value="curso">Curso o Taller Especial</option>
                        <option value="reunion">Reunión o Asamblea</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Imagen de Portada</label>
                      
                      {/* Image source mode toggle */}
                      <div className="flex gap-2 mb-4">
                        <button
                          type="button"
                          onClick={() => setEventsImageMode('url')}
                          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                            eventsImageMode === 'url'
                              ? 'bg-cyan-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          Usar URL
                        </button>
                        <button
                          type="button"
                          onClick={() => setEventsImageMode('upload')}
                          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                            eventsImageMode === 'upload'
                              ? 'bg-cyan-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          Subir Archivo
                        </button>
                      </div>

                      {eventsImageMode === 'url' ? (
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/..."
                          value={eventsForm.image}
                          onChange={(e) => setEventsForm({ ...eventsForm, image: e.target.value })}
                          className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                      ) : (
                        <FileUpload
                          onUploadComplete={(url) => {
                            setEventsForm({ ...eventsForm, image: url, localImage: url });
                            setEventsFile(null);
                          }}
                          onUploadError={(error) => alert(error)}
                          label="Subir imagen de evento"
                        />
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Descripción Detallada e Instrucciones</label>
                      <textarea
                        rows={3}
                        placeholder="Detalle los requisitos mínimos de buceo, puntos de encuentro, equipos necesarios..."
                        value={eventsForm.description}
                        onChange={(e) => setEventsForm({ ...eventsForm, description: e.target.value })}
                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>

                    <div className="md:col-span-2 flex justify-end space-x-3 pt-4 border-t border-gray-100">
                      {editingId && (
                        <button
                          type="button"
                          onClick={resetForms}
                          className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 cursor-pointer"
                        >
                          Cancelar Edición
                        </button>
                      )}
                      <button
                        type="submit"
                        className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all cursor-pointer"
                      >
                        {editingId ? 'Actualizar Evento' : 'Crear Evento'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Events Table List */}
                <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-6 py-4 border-b border-gray-100">Eventos Programados</h3>
                  <div className="divide-y divide-gray-100">
                    {events.map(item => (
                      <div key={item.id} className="p-4 sm:p-6 flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap hover:bg-gray-50 transition-colors">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 bg-gray-100 border border-gray-200 rounded text-gray-600">
                              {item.category}
                            </span>
                            <span className="text-xs text-gray-450 font-semibold">{item.location}</span>
                          </div>
                          <h4 className="font-bold text-gray-950 mt-1 text-sm">{item.title}</h4>
                          <span className="text-xs font-mono text-cyan-600 font-bold">{item.date}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => startEditEvent(item)}
                            className="p-2 rounded-xl bg-gray-50 hover:bg-cyan-50 text-gray-500 hover:text-cyan-600 border border-gray-100 cursor-pointer transition-colors"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteEventItem(item.id)}
                            className="p-2 rounded-xl bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-600 border border-gray-100 cursor-pointer transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 4. INSTRUCTORS TAB WORKSPACE */}
            {activeTab === 'instructors' && (
              <div className="space-y-8">
                {/* Add/Edit Form */}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">
                  <h3 className="text-xl font-display font-extrabold text-marine-950 mb-6 flex items-center space-x-2">
                    <Plus className="h-5 w-5 text-cyan-600" />
                    <span>{editingId ? 'Editar Biografía de Instructor' : 'Inscribir Nuevo Instructor Certificado'}</span>
                  </h3>

                  <form onSubmit={saveInstructor} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nombre y Apellidos (Obligatorio)</label>
                      <input
                        type="text"
                        placeholder="ej. Dra. Mayra González"
                        value={instructorForm.name}
                        onChange={(e) => setInstructorForm({ ...instructorForm, name: e.target.value })}
                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Código de Certificación CMAS (Obligatorio)</label>
                      <input
                        type="text"
                        placeholder="ej. CUB-INST-115"
                        value={instructorForm.certificationCode}
                        onChange={(e) => setInstructorForm({ ...instructorForm, certificationCode: e.target.value })}
                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nivel Técnico (ej. Instructor 2 Estrellas)</label>
                      <input
                        type="text"
                        placeholder="ej. Instructor de Especialidades Técnicas"
                        value={instructorForm.level}
                        onChange={(e) => setInstructorForm({ ...instructorForm, level: e.target.value })}
                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Años de Experiencia Activa</label>
                      <input
                        type="number"
                        value={instructorForm.experienceYears}
                        onChange={(e) => setInstructorForm({ ...instructorForm, experienceYears: parseInt(e.target.value, 10) || 0 })}
                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Foto de Perfil</label>
                      
                      {/* Image source mode toggle */}
                      <div className="flex gap-2 mb-4">
                        <button
                          type="button"
                          onClick={() => setInstructorImageMode('url')}
                          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                            instructorImageMode === 'url'
                              ? 'bg-cyan-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          Usar URL
                        </button>
                        <button
                          type="button"
                          onClick={() => setInstructorImageMode('upload')}
                          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                            instructorImageMode === 'upload'
                              ? 'bg-cyan-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          Subir Archivo
                        </button>
                      </div>

                      {instructorImageMode === 'url' ? (
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/..."
                          value={instructorForm.photo}
                          onChange={(e) => setInstructorForm({ ...instructorForm, photo: e.target.value })}
                          className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                      ) : (
                        <FileUpload
                          onUploadComplete={(url) => {
                            setInstructorForm({ ...instructorForm, photo: url, localPhoto: url });
                            setInstructorFile(null);
                          }}
                          onUploadError={(error) => alert(error)}
                          label="Subir foto de instructor"
                        />
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Biografía Profesional y Especialidades</label>
                      <textarea
                        rows={3}
                        placeholder="Escriba un resumen de su trayectoria, cantidad de inmersiones guiadas, títulos especiales, etc."
                        value={instructorForm.bio}
                        onChange={(e) => setInstructorForm({ ...instructorForm, bio: e.target.value })}
                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>

                    <div className="md:col-span-2 flex justify-end space-x-3 pt-4 border-t border-gray-100">
                      {editingId && (
                        <button
                          type="button"
                          onClick={resetForms}
                          className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 cursor-pointer"
                        >
                          Cancelar Edición
                        </button>
                      )}
                      <button
                        type="submit"
                        className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all cursor-pointer"
                      >
                        {editingId ? 'Actualizar Biografía' : 'Guardar Instructor'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Listing of Instructors */}
                <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-6 py-4 border-b border-gray-100">Instructores Registrados</h3>
                  <div className="divide-y divide-gray-100">
                    {instructors.map(item => (
                      <div key={item.id} className="p-4 sm:p-6 flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <img
                            src={getImageUrl(item) || item.photo}
                            alt={item.name}
                            className="w-12 h-12 rounded-full object-cover border border-gray-150 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <h4 className="font-bold text-gray-950 text-sm">{item.name}</h4>
                            <p className="text-xs text-gray-500">{item.level} • {item.experienceYears} años de servicio</p>
                            <span className="text-[10px] font-mono text-cyan-600 font-bold bg-cyan-50 border border-cyan-100 px-2 py-0.5 rounded mt-1 inline-block">
                              {item.certificationCode}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => startEditInstructor(item)}
                            className="p-2 rounded-xl bg-gray-50 hover:bg-cyan-50 text-gray-500 hover:text-cyan-600 border border-gray-100 cursor-pointer transition-colors"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteInstructor(item.id)}
                            className="p-2 rounded-xl bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-600 border border-gray-100 cursor-pointer transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 5. GRADUATES TAB WORKSPACE */}
            {activeTab === 'graduates' && (
              <div className="space-y-8">
                {/* Add/Edit Form */}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">
                  <h3 className="text-xl font-display font-extrabold text-marine-950 mb-6 flex items-center space-x-2">
                    <Plus className="h-5 w-5 text-cyan-600" />
                    <span>{editingId ? 'Editar Datos de Graduado' : 'Registrar Nuevo Graduado (Diver)'}</span>
                  </h3>

                  <form onSubmit={saveGraduate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nombre Completo del Alumno (Obligatorio)</label>
                      <input
                        type="text"
                        placeholder="ej. Ernesto Pérez Alonso"
                        value={graduateForm.name}
                        onChange={(e) => setGraduateForm({ ...graduateForm, name: e.target.value })}
                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Código de Licencia FCAS (Obligatorio)</label>
                      <input
                        type="text"
                        placeholder="ej. FCAS-OW-2026-004"
                        value={graduateForm.certificationCode}
                        onChange={(e) => setGraduateForm({ ...graduateForm, certificationCode: e.target.value })}
                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Denominación del Curso / Certificación</label>
                      <input
                        type="text"
                        placeholder="ej. Open Water Diver (1 Estrella)"
                        value={graduateForm.courseName}
                        onChange={(e) => setGraduateForm({ ...graduateForm, courseName: e.target.value })}
                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Categoría Técnica</label>
                      <select
                        value={graduateForm.level}
                        onChange={(e) => setGraduateForm({ ...graduateForm, level: e.target.value as any })}
                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                        <option value="1-star">1 Estrella (Iniciación/Open Water)</option>
                        <option value="2-star">2 Estrellas (Avanzado)</option>
                        <option value="3-star">3 Estrellas (Rescate)</option>
                        <option value="divemaster">Divemaster (Guía)</option>
                        <option value="instructor">Instructor de Buceo</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Instructor Certificador (Obligatorio)</label>
                      <input
                        type="text"
                        placeholder="ej. Alejandro 'El Capi' Silva"
                        value={graduateForm.instructorName}
                        onChange={(e) => setGraduateForm({ ...graduateForm, instructorName: e.target.value })}
                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Fecha de Graduación</label>
                      <input
                        type="date"
                        value={graduateForm.graduationDate}
                        onChange={(e) => setGraduateForm({ ...graduateForm, graduationDate: e.target.value })}
                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>

                    <div className="md:col-span-2 flex justify-end space-x-3 pt-4 border-t border-gray-100">
                      {editingId && (
                        <button
                          type="button"
                          onClick={resetForms}
                          className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 cursor-pointer"
                        >
                          Cancelar Edición
                        </button>
                      )}
                      <button
                        type="submit"
                        className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all cursor-pointer"
                      >
                        {editingId ? 'Actualizar Alumno' : 'Registrar Alumno'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Directory Graduates Table */}
                <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-6 py-4 border-b border-gray-100">Graduados Registrados</h3>
                  <div className="divide-y divide-gray-100">
                    {graduates.map(item => (
                      <div key={item.id} className="p-4 sm:p-6 flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap hover:bg-gray-50 transition-colors">
                        <div>
                          <h4 className="font-bold text-gray-950 text-sm">{item.name}</h4>
                          <p className="text-xs text-gray-500">Curso: {item.courseName} • Instructor: {item.instructorName}</p>
                          <div className="flex items-center space-x-2 mt-1.5">
                            <span className="text-[10px] font-mono text-cyan-600 font-bold bg-cyan-50 border border-cyan-100 px-2 py-0.5 rounded">
                              {item.certificationCode}
                            </span>
                            <span className="text-[10px] text-gray-400 font-semibold uppercase">{item.level}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => startEditGraduate(item)}
                            className="p-2 rounded-xl bg-gray-50 hover:bg-cyan-50 text-gray-500 hover:text-cyan-600 border border-gray-100 cursor-pointer transition-colors"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteGraduate(item.id)}
                            className="p-2 rounded-xl bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-600 border border-gray-100 cursor-pointer transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
