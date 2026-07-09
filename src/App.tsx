import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import AdminDashboard from './components/AdminDashboard';
import { GalleryItem, NewsItem, EventItem, Instructor, Graduate } from './types';
import { api } from './api';

export default function App() {
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => api.auth.isLoggedIn());

  const [gallery, setGalleryState] = useState<GalleryItem[]>([]);
  const [news, setNewsState] = useState<NewsItem[]>([]);
  const [events, setEventsState] = useState<EventItem[]>([]);
  const [instructors, setInstructorsState] = useState<Instructor[]>([]);
  const [graduates, setGraduatesState] = useState<Graduate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [galleryData, newsData, eventsData, instructorsData, graduatesData] = await Promise.all([
          api.gallery.getAll(),
          api.news.getAll(),
          api.events.getAll(),
          api.instructors.getAll(),
          api.graduates.getAll(),
        ]);
        setGalleryState(galleryData);
        setNewsState(newsData);
        setEventsState(eventsData);
        setInstructorsState(instructorsData);
        setGraduatesState(graduatesData);
      } catch (err) {
        console.error("Error fetching data from API:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const syncGallery = async (action: 'add' | 'update' | 'delete', item?: GalleryItem, id?: string) => {
    try {
      if (action === 'add' && item) {
        await api.gallery.create(item);
      } else if (action === 'update' && item) {
        await api.gallery.update(item.id, item);
      } else if (action === 'delete' && id) {
        await api.gallery.delete(id);
      }
    } catch (err) {
      console.error("Gallery sync error:", err);
    }
  };

  const syncNews = async (action: 'add' | 'update' | 'delete', item?: NewsItem, id?: string) => {
    try {
      if (action === 'add' && item) {
        await api.news.create(item);
      } else if (action === 'update' && item) {
        await api.news.update(item.id, item);
      } else if (action === 'delete' && id) {
        await api.news.delete(id);
      }
    } catch (err) {
      console.error("News sync error:", err);
    }
  };

  const syncEvents = async (action: 'add' | 'update' | 'delete', item?: EventItem, id?: string) => {
    try {
      if (action === 'add' && item) {
        await api.events.create(item);
      } else if (action === 'update' && item) {
        await api.events.update(item.id, item);
      } else if (action === 'delete' && id) {
        await api.events.delete(id);
      }
    } catch (err) {
      console.error("Events sync error:", err);
    }
  };

  const syncInstructors = async (action: 'add' | 'update' | 'delete', item?: Instructor, id?: string) => {
    try {
      if (action === 'add' && item) {
        await api.instructors.create(item);
      } else if (action === 'update' && item) {
        await api.instructors.update(item.id, item);
      } else if (action === 'delete' && id) {
        await api.instructors.delete(id);
      }
    } catch (err) {
      console.error("Instructors sync error:", err);
    }
  };

  const syncGraduates = async (action: 'add' | 'update' | 'delete', item?: Graduate, id?: string) => {
    try {
      if (action === 'add' && item) {
        await api.graduates.create(item);
      } else if (action === 'update' && item) {
        await api.graduates.update(item.id, item);
      } else if (action === 'delete' && id) {
        await api.graduates.delete(id);
      }
    } catch (err) {
      console.error("Graduates sync error:", err);
    }
  };

  const setGallery: React.Dispatch<React.SetStateAction<GalleryItem[]>> = (value) => {
    setGalleryState((prev) => {
      const next = typeof value === 'function' ? (value as Function)(prev) : value;
      if (next.length < prev.length) {
        const deleted = prev.find(p => !next.some(n => n.id === p.id));
        if (deleted) syncGallery('delete', undefined, deleted.id);
      } else if (next.length > prev.length) {
        const added = next.find(n => !prev.some(p => p.id === n.id));
        if (added) syncGallery('add', added);
      } else {
        const updated = next.find(n => {
          const p = prev.find(item => item.id === n.id);
          return p && JSON.stringify(p) !== JSON.stringify(n);
        });
        if (updated) syncGallery('update', updated);
      }
      return next;
    });
  };

  const setNews: React.Dispatch<React.SetStateAction<NewsItem[]>> = (value) => {
    setNewsState((prev) => {
      const next = typeof value === 'function' ? (value as Function)(prev) : value;
      if (next.length < prev.length) {
        const deleted = prev.find(p => !next.some(n => n.id === p.id));
        if (deleted) syncNews('delete', undefined, deleted.id);
      } else if (next.length > prev.length) {
        const added = next.find(n => !prev.some(p => p.id === n.id));
        if (added) syncNews('add', added);
      } else {
        const updated = next.find(n => {
          const p = prev.find(item => item.id === n.id);
          return p && JSON.stringify(p) !== JSON.stringify(n);
        });
        if (updated) syncNews('update', updated);
      }
      return next;
    });
  };

  const setEvents: React.Dispatch<React.SetStateAction<EventItem[]>> = (value) => {
    setEventsState((prev) => {
      const next = typeof value === 'function' ? (value as Function)(prev) : value;
      if (next.length < prev.length) {
        const deleted = prev.find(p => !next.some(n => n.id === p.id));
        if (deleted) syncEvents('delete', undefined, deleted.id);
      } else if (next.length > prev.length) {
        const added = next.find(n => !prev.some(p => p.id === n.id));
        if (added) syncEvents('add', added);
      } else {
        const updated = next.find(n => {
          const p = prev.find(item => item.id === n.id);
          return p && JSON.stringify(p) !== JSON.stringify(n);
        });
        if (updated) syncEvents('update', updated);
      }
      return next;
    });
  };

  const setInstructors: React.Dispatch<React.SetStateAction<Instructor[]>> = (value) => {
    setInstructorsState((prev) => {
      const next = typeof value === 'function' ? (value as Function)(prev) : value;
      if (next.length < prev.length) {
        const deleted = prev.find(p => !next.some(n => n.id === p.id));
        if (deleted) syncInstructors('delete', undefined, deleted.id);
      } else if (next.length > prev.length) {
        const added = next.find(n => !prev.some(p => p.id === n.id));
        if (added) syncInstructors('add', added);
      } else {
        const updated = next.find(n => {
          const p = prev.find(item => item.id === n.id);
          return p && JSON.stringify(p) !== JSON.stringify(n);
        });
        if (updated) syncInstructors('update', updated);
      }
      return next;
    });
  };

  const setGraduates: React.Dispatch<React.SetStateAction<Graduate[]>> = (value) => {
    setGraduatesState((prev) => {
      const next = typeof value === 'function' ? (value as Function)(prev) : value;
      if (next.length < prev.length) {
        const deleted = prev.find(p => !next.some(n => n.id === p.id));
        if (deleted) syncGraduates('delete', undefined, deleted.id);
      } else if (next.length > prev.length) {
        const added = next.find(n => !prev.some(p => p.id === n.id));
        if (added) syncGraduates('add', added);
      } else {
        const updated = next.find(n => {
          const p = prev.find(item => item.id === n.id);
          return p && JSON.stringify(p) !== JSON.stringify(n);
        });
        if (updated) syncGraduates('update', updated);
      }
      return next;
    });
  };

  const handleLogin = async (password: string): Promise<boolean> => {
    try {
      await api.auth.login('admin', password);
      setIsLoggedIn(true);
      return true;
    } catch {
      return false;
    }
  };

  const handleLogout = () => {
    api.auth.logout();
    setIsLoggedIn(false);
    setIsAdminMode(false);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [isAdminMode]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-marine-950 text-white flex flex-col items-center justify-center font-sans antialiased">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold tracking-widest text-cyan-400 uppercase animate-pulse font-display">
            FCAS: Cargando datos del servidor...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-marine-950 text-white font-sans antialiased selection:bg-marine-600 selection:text-white">
      <Navbar
        isAdminMode={isAdminMode}
        setIsAdminMode={setIsAdminMode}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
      <main>
        {isAdminMode ? (
          <AdminDashboard
            isLoggedIn={isLoggedIn}
            onLogin={handleLogin}
            onLogout={handleLogout}
            gallery={gallery}
            setGallery={setGallery}
            news={news}
            setNews={setNews}
            events={events}
            setEvents={setEvents}
            instructors={instructors}
            setInstructors={setInstructors}
            graduates={graduates}
            setGraduates={setGraduates}
          />
        ) : (
          <LandingPage
            gallery={gallery}
            news={news}
            events={events}
            instructors={instructors}
            graduates={graduates}
            setIsAdminMode={setIsAdminMode}
          />
        )}
      </main>
    </div>
  );
}
