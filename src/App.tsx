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
  fetchFn: () => Promise<T[]>,
  hasChanges?: (prev: T, next: T) => boolean
): [T[], SyncableSetter<T>] {
  const [state, setState] = useState<T[]>(initialState);
  const isInitialLoadRef = useRef(true);
  const isSyncingRef = useRef(false);

  const refreshFromServer = useCallback(async () => {
    try {
      const data = await fetchFn();
      setState(data);
    } catch (err) {
      console.error("Error refreshing from server:", err);
    }
  }, [fetchFn]);

  const setSynced: SyncableSetter<T> = useCallback((value, file?) => {
    setState(prev => {
      const next = typeof value === 'function' ? (value as (prev: T[]) => T[])(prev) : value;

      if (isInitialLoadRef.current) {
        return next;
      }

      const operation = detectSyncOperation(prev, next, hasChanges);
      if (operation && !isSyncingRef.current) {
        isSyncingRef.current = true;
        syncFn(
          operation.action,
          operation.item,
          operation.id,
          file
        ).finally(() => {
          isSyncingRef.current = false;
          // Re-fetch from server after mutation to stay in sync
          refreshFromServer();
        });
      }
      return next;
    });
  }, [syncFn, hasChanges, refreshFromServer]);

  return [state, setSynced];
}

export default function App() {
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => api.auth.isLoggedIn());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchGallery = useCallback(async (): Promise<GalleryItem[]> => {
    const res = await api.gallery.getAll(1, 100);
    return res.data;
  }, []);

  const fetchNews = useCallback(async (): Promise<NewsItem[]> => {
    const res = await api.news.getAll(1, 100);
    return res.data;
  }, []);

  const fetchEvents = useCallback(async (): Promise<EventItem[]> => {
    const res = await api.events.getAll(1, 100);
    return res.data;
  }, []);

  const fetchInstructors = useCallback(async (): Promise<Instructor[]> => {
    const res = await api.instructors.getAll(1, 100);
    return res.data;
  }, []);

  const fetchGraduates = useCallback(async (): Promise<Graduate[]> => {
    const res = await api.graduates.getAll(1, 100);
    return res.data;
  }, []);

  const [gallery, setGallery] = useSyncedState<GalleryItem>(
    [],
    useCallback(async (action, item, id, file) => {
      if (action === 'add' && item) await api.gallery.create(item, file);
      else if (action === 'update' && item) await api.gallery.update(item.id, item, file);
      else if (action === 'delete' && id) await api.gallery.delete(id);
    }, []),
    fetchGallery
  );

  const [news, setNews] = useSyncedState<NewsItem>(
    [],
    useCallback(async (action, item, id, file) => {
      if (action === 'add' && item) await api.news.create(item, file);
      else if (action === 'update' && item) await api.news.update(item.id, item, file);
      else if (action === 'delete' && id) await api.news.delete(id);
    }, []),
    fetchNews
  );

  const [events, setEvents] = useSyncedState<EventItem>(
    [],
    useCallback(async (action, item, id, file) => {
      if (action === 'add' && item) await api.events.create(item, file);
      else if (action === 'update' && item) await api.events.update(item.id, item, file);
      else if (action === 'delete' && id) await api.events.delete(id);
    }, []),
    fetchEvents
  );

  const [instructors, setInstructors] = useSyncedState<Instructor>(
    [],
    useCallback(async (action, item, id, file) => {
      if (action === 'add' && item) await api.instructors.create(item, file);
      else if (action === 'update' && item) await api.instructors.update(item.id, item, file);
      else if (action === 'delete' && id) await api.instructors.delete(id);
    }, []),
    fetchInstructors
  );

  const [graduates, setGraduates] = useSyncedState<Graduate>(
    [],
    useCallback(async (action, item, id) => {
      if (action === 'add' && item) await api.graduates.create(item);
      else if (action === 'update' && item) await api.graduates.update(item.id, item);
      else if (action === 'delete' && id) await api.graduates.delete(id);
    }, []),
    fetchGraduates
  );

  // Initial data load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await Promise.allSettled([
          fetchGallery(),
          fetchNews(),
          fetchEvents(),
          fetchInstructors(),
          fetchGraduates(),
        ]);
        if (results[0].status === "fulfilled") setGallery(results[0].value);
        if (results[1].status === "fulfilled") setNews(results[1].value);
        if (results[2].status === "fulfilled") setEvents(results[2].value);
        if (results[3].status === "fulfilled") setInstructors(results[3].value);
        if (results[4].status === "fulfilled") setGraduates(results[4].value);
      } catch (err) {
        console.error("Error fetching data from API:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Polling: refresh data every 30s to reflect changes from other sessions
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const results = await Promise.allSettled([
          fetchGallery(),
          fetchNews(),
          fetchEvents(),
          fetchInstructors(),
          fetchGraduates(),
        ]);
        if (results[0].status === "fulfilled") setGallery(results[0].value);
        if (results[1].status === "fulfilled") setNews(results[1].value);
        if (results[2].status === "fulfilled") setEvents(results[2].value);
        if (results[3].status === "fulfilled") setInstructors(results[3].value);
        if (results[4].status === "fulfilled") setGraduates(results[4].value);
      } catch {
        // Silent fail for polling — user won't notice
      }
    }, 30_000);
    return () => clearInterval(interval);
  }, [fetchGallery, fetchNews, fetchEvents, fetchInstructors, fetchGraduates]);

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
