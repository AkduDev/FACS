import React, { useState, useEffect, useCallback, Suspense, useRef } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import { ToastProvider } from './components/Toast';
import { GalleryItem, NewsItem, EventItem, Instructor, Graduate } from './types';
import { api } from './api';
import { detectSyncOperation, shallowEqual } from './utils/syncUtils';

const AdminDashboard = React.lazy(() => import('./components/AdminDashboard'));

function SectionSkeleton() {
  return (
    <div className="py-24 bg-marine-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

type SyncableSetter<T> = (value: React.SetStateAction<T[]>, file?: File) => void;

function useSyncedState<T extends { id: string }>(
  initialState: T[],
  syncFn: (action: 'add' | 'update' | 'delete', item?: T, id?: string, file?: File) => Promise<void>,
  hasChanges?: (prev: T, next: T) => boolean
): [T[], SyncableSetter<T>, (data: T[]) => void] {
  const [state, setState] = useState<T[]>(initialState);
  const stateRef = useRef(state);
  stateRef.current = state;
  const isInitialLoadRef = useRef(true);

  const setSynced: SyncableSetter<T> = useCallback((value, file?) => {
    setState(prev => {
      const next = typeof value === 'function' ? (value as (prev: T[]) => T[])(prev) : value;
      
      // Saltar sincronización durante la carga inicial
      if (isInitialLoadRef.current) {
        return next;
      }

      const operation = detectSyncOperation(prev, next, hasChanges);
      if (operation) {
        if (operation.action === 'delete' && operation.id) {
          syncFn('delete', undefined, operation.id);
        } else if (operation.action === 'add' && operation.item) {
          syncFn('add', operation.item, undefined, file);
        } else if (operation.action === 'update' && operation.item) {
          syncFn('update', operation.item, undefined, file);
        }
      }
      return next;
    });
  }, [syncFn, hasChanges]);

  // Función para cargar datos iniciales sin sincronizar
  const loadData = useCallback((data: T[]) => {
    isInitialLoadRef.current = true;
    setState(data);
    // Permitir sincronización después del siguiente render
    requestAnimationFrame(() => {
      isInitialLoadRef.current = false;
    });
  }, []);

  return [state, setSynced, loadData] as [T[], SyncableSetter<T>, (data: T[]) => void];
}

export default function App() {
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => api.auth.isLoggedIn());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [gallery, setGallery, loadGallery] = useSyncedState<GalleryItem>(
    [],
    useCallback(async (action, item, id, file) => {
      try {
        if (action === 'add' && item) await api.gallery.create(item, file);
        else if (action === 'update' && item) await api.gallery.update(item.id, item, file);
        else if (action === 'delete' && id) await api.gallery.delete(id);
      } catch (err) {
        console.error("Gallery sync error:", err);
      }
    }, [])
  );

  const [news, setNews, loadNews] = useSyncedState<NewsItem>(
    [],
    useCallback(async (action, item, id, file) => {
      try {
        if (action === 'add' && item) await api.news.create(item, file);
        else if (action === 'update' && item) await api.news.update(item.id, item, file);
        else if (action === 'delete' && id) await api.news.delete(id);
      } catch (err) {
        console.error("News sync error:", err);
      }
    }, [])
  );

  const [events, setEvents, loadEvents] = useSyncedState<EventItem>(
    [],
    useCallback(async (action, item, id, file) => {
      try {
        if (action === 'add' && item) await api.events.create(item, file);
        else if (action === 'update' && item) await api.events.update(item.id, item, file);
        else if (action === 'delete' && id) await api.events.delete(id);
      } catch (err) {
        console.error("Events sync error:", err);
      }
    }, [])
  );

  const [instructors, setInstructors, loadInstructors] = useSyncedState<Instructor>(
    [],
    useCallback(async (action, item, id, file) => {
      try {
        if (action === 'add' && item) await api.instructors.create(item, file);
        else if (action === 'update' && item) await api.instructors.update(item.id, item, file);
        else if (action === 'delete' && id) await api.instructors.delete(id);
      } catch (err) {
        console.error("Instructors sync error:", err);
      }
    }, [])
  );

  const [graduates, setGraduates, loadGraduates] = useSyncedState<Graduate>(
    [],
    useCallback(async (action, item, id) => {
      try {
        if (action === 'add' && item) await api.graduates.create(item);
        else if (action === 'update' && item) await api.graduates.update(item.id, item);
        else if (action === 'delete' && id) await api.graduates.delete(id);
      } catch (err) {
        console.error("Graduates sync error:", err);
      }
    }, [])
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await Promise.allSettled([
          api.gallery.getAll(1, 100),
          api.news.getAll(1, 100),
          api.events.getAll(1, 100),
          api.instructors.getAll(1, 100),
          api.graduates.getAll(1, 100),
        ]);
        if (results[0].status === "fulfilled") loadGallery(results[0].value.data);
        if (results[1].status === "fulfilled") loadNews(results[1].value.data);
        if (results[2].status === "fulfilled") loadEvents(results[2].value.data);
        if (results[3].status === "fulfilled") loadInstructors(results[3].value.data);
        if (results[4].status === "fulfilled") loadGraduates(results[4].value.data);
      } catch (err) {
        console.error("Error fetching data from API:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

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
    <ToastProvider>
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
    </ToastProvider>
  );
}
