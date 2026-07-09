import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import { GalleryItem, NewsItem, EventItem, Instructor, Graduate } from './types';
import { api } from './api';

const AdminDashboard = React.lazy(() => import('./components/AdminDashboard'));

function SectionSkeleton() {
  return (
    <div className="py-24 bg-marine-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

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
        const results = await Promise.allSettled([
          api.gallery.getAll(),
          api.news.getAll(),
          api.events.getAll(),
          api.instructors.getAll(),
          api.graduates.getAll(),
        ]);
        if (results[0].status === "fulfilled") setGalleryState(results[0].value);
        if (results[1].status === "fulfilled") setNewsState(results[1].value);
        if (results[2].status === "fulfilled") setEventsState(results[2].value);
        if (results[3].status === "fulfilled") setInstructorsState(results[3].value);
        if (results[4].status === "fulfilled") setGraduatesState(results[4].value);
      } catch (err) {
        console.error("Error fetching data from API:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const syncGallery = useCallback(async (action: 'add' | 'update' | 'delete', item?: GalleryItem, id?: string, file?: File) => {
    try {
      if (action === 'add' && item) await api.gallery.create(item, file);
      else if (action === 'update' && item) await api.gallery.update(item.id, item, file);
      else if (action === 'delete' && id) await api.gallery.delete(id);
    } catch (err) {
      console.error("Gallery sync error:", err);
    }
  }, []);

  const syncNews = useCallback(async (action: 'add' | 'update' | 'delete', item?: NewsItem, id?: string, file?: File) => {
    try {
      if (action === 'add' && item) await api.news.create(item, file);
      else if (action === 'update' && item) await api.news.update(item.id, item, file);
      else if (action === 'delete' && id) await api.news.delete(id);
    } catch (err) {
      console.error("News sync error:", err);
    }
  }, []);

  const syncEvents = useCallback(async (action: 'add' | 'update' | 'delete', item?: EventItem, id?: string, file?: File) => {
    try {
      if (action === 'add' && item) await api.events.create(item, file);
      else if (action === 'update' && item) await api.events.update(item.id, item, file);
      else if (action === 'delete' && id) await api.events.delete(id);
    } catch (err) {
      console.error("Events sync error:", err);
    }
  }, []);

  const syncInstructors = useCallback(async (action: 'add' | 'update' | 'delete', item?: Instructor, id?: string, file?: File) => {
    try {
      if (action === 'add' && item) await api.instructors.create(item, file);
      else if (action === 'update' && item) await api.instructors.update(item.id, item, file);
      else if (action === 'delete' && id) await api.instructors.delete(id);
    } catch (err) {
      console.error("Instructors sync error:", err);
    }
  }, []);

  const syncGraduates = useCallback(async (action: 'add' | 'update' | 'delete', item?: Graduate, id?: string) => {
    try {
      if (action === 'add' && item) await api.graduates.create(item);
      else if (action === 'update' && item) await api.graduates.update(item.id, item);
      else if (action === 'delete' && id) await api.graduates.delete(id);
    } catch (err) {
      console.error("Graduates sync error:", err);
    }
  }, []);

  type SyncableSetState<T> = {
    (action: React.SetStateAction<T>, file?: File): void;
  };

  const setGallery: SyncableSetState<GalleryItem[]> = useCallback((value, file?) => {
    setGalleryState((prev) => {
      const next = typeof value === 'function' ? (value as Function)(prev) : value;
      if (next.length < prev.length) {
        const deleted = prev.find(p => !next.some(n => n.id === p.id));
        if (deleted) syncGallery('delete', undefined, deleted.id);
      } else if (next.length > prev.length) {
        const added = next.find(n => !prev.some(p => p.id === n.id));
        if (added) syncGallery('add', added, undefined, file);
      } else {
        const updated = next.find(n => {
          const p = prev.find(item => item.id === n.id);
          return p && JSON.stringify(p) !== JSON.stringify(n);
        });
        if (updated) syncGallery('update', updated, undefined, file);
      }
      return next;
    });
  }, [syncGallery]);

  const setNews: SyncableSetState<NewsItem[]> = useCallback((value, file?) => {
    setNewsState((prev) => {
      const next = typeof value === 'function' ? (value as Function)(prev) : value;
      if (next.length < prev.length) {
        const deleted = prev.find(p => !next.some(n => n.id === p.id));
        if (deleted) syncNews('delete', undefined, deleted.id);
      } else if (next.length > prev.length) {
        const added = next.find(n => !prev.some(p => p.id === n.id));
        if (added) syncNews('add', added, undefined, file);
      } else {
        const updated = next.find(n => {
          const p = prev.find(item => item.id === n.id);
          return p && JSON.stringify(p) !== JSON.stringify(n);
        });
        if (updated) syncNews('update', updated, undefined, file);
      }
      return next;
    });
  }, [syncNews]);

  const setEvents: SyncableSetState<EventItem[]> = useCallback((value, file?) => {
    setEventsState((prev) => {
      const next = typeof value === 'function' ? (value as Function)(prev) : value;
      if (next.length < prev.length) {
        const deleted = prev.find(p => !next.some(n => n.id === p.id));
        if (deleted) syncEvents('delete', undefined, deleted.id);
      } else if (next.length > prev.length) {
        const added = next.find(n => !prev.some(p => p.id === n.id));
        if (added) syncEvents('add', added, undefined, file);
      } else {
        const updated = next.find(n => {
          const p = prev.find(item => item.id === n.id);
          return p && JSON.stringify(p) !== JSON.stringify(n);
        });
        if (updated) syncEvents('update', updated, undefined, file);
      }
      return next;
    });
  }, [syncEvents]);

  const setInstructors: SyncableSetState<Instructor[]> = useCallback((value, file?) => {
    setInstructorsState((prev) => {
      const next = typeof value === 'function' ? (value as Function)(prev) : value;
      if (next.length < prev.length) {
        const deleted = prev.find(p => !next.some(n => n.id === p.id));
        if (deleted) syncInstructors('delete', undefined, deleted.id);
      } else if (next.length > prev.length) {
        const added = next.find(n => !prev.some(p => p.id === n.id));
        if (added) syncInstructors('add', added, undefined, file);
      } else {
        const updated = next.find(n => {
          const p = prev.find(item => item.id === n.id);
          return p && JSON.stringify(p) !== JSON.stringify(n);
        });
        if (updated) syncInstructors('update', updated, undefined, file);
      }
      return next;
    });
  }, [syncInstructors]);

  const setGraduates: React.Dispatch<React.SetStateAction<Graduate[]>> = useCallback((value) => {
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
  }, [syncGraduates]);

  const handleLogin = useCallback(async (password: string): Promise<boolean> => {
    try {
      await api.auth.login('admin', password);
      setIsLoggedIn(true);
      return true;
    } catch {
      return false;
    }
  }, []);

  const handleLogout = useCallback(() => {
    api.auth.logout();
    setIsLoggedIn(false);
    setIsAdminMode(false);
  }, []);

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
          <Suspense fallback={<SectionSkeleton />}>
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
          </Suspense>
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
