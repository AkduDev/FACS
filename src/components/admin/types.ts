import React from 'react';
import { GalleryItem, NewsItem, EventItem, Instructor, Graduate } from '../../types';

export type AdminTab = 'gallery' | 'news' | 'events' | 'instructors' | 'graduates';

export interface DashboardLayoutProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export interface TabComponentProps<T> {
  items: T[];
  onItemsChange: React.Dispatch<React.SetStateAction<T[]>>;
}

export interface LoginScreenProps {
  onLogin: (password: string) => Promise<boolean>;
  onBack: () => void;
}

export interface ImageUploaderProps {
  onUploadComplete: (url: string) => void;
  onUploadError?: (error: string) => void;
  onClear?: () => void;
  label: string;
  uploadLabel?: string;
  initialPreview?: string;
}
