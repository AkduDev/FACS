import React, { useState, lazy, Suspense } from 'react';
import { GalleryItem, NewsItem, EventItem, Instructor, Graduate } from '../types';
import { LoginScreen, DashboardLayout, AdminTab } from './admin';

const GalleryTab = lazy(() => import('./admin/GalleryTab'));
const NewsTab = lazy(() => import('./admin/NewsTab'));
const EventsTab = lazy(() => import('./admin/EventsTab'));
const InstructorsTab = lazy(() => import('./admin/InstructorsTab'));
const GraduatesTab = lazy(() => import('./admin/GraduatesTab'));

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

function TabSkeleton() {
  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
      <div className="flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );
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
  const [activeTab, setActiveTab] = useState<AdminTab>('gallery');

  if (!isLoggedIn) {
    return (
      <LoginScreen
        onLogin={onLogin}
        onBack={() => window.location.hash = '#inicio'}
      />
    );
  }

  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'gallery':
        return <GalleryTab items={gallery} onItemsChange={setGallery} />;
      case 'news':
        return <NewsTab items={news} onItemsChange={setNews} />;
      case 'events':
        return <EventsTab items={events} onItemsChange={setEvents} />;
      case 'instructors':
        return <InstructorsTab items={instructors} onItemsChange={setInstructors} />;
      case 'graduates':
        return <GraduatesTab items={graduates} onItemsChange={setGraduates} />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout
      activeTab={activeTab}
      onTabChange={handleTabChange}
      onLogout={onLogout}
    >
      <Suspense fallback={<TabSkeleton />}>
        {renderTab()}
      </Suspense>
    </DashboardLayout>
  );
}
