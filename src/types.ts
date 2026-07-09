export interface GalleryItem {
  id: string;
  url: string;
  title: string;
  description: string;
  category: 'fauna' | 'flora' | 'naufragios' | 'entrenamiento' | 'paisaje';
  date: string;
  localImage?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  image?: string;
  localImage?: string;
  author: string;
  category: 'conservacion' | 'federacion' | 'seguridad' | 'exploracion';
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  category: 'competicion' | 'limpieza' | 'curso' | 'reunion';
  image?: string;
  localImage?: string;
}

export interface Instructor {
  id: string;
  name: string;
  bio: string;
  level: string; // e.g., CMAS * Instructor, Instructor de Especialidad
  certificationCode: string;
  photo: string;
  localPhoto?: string;
  experienceYears: number;
}

export interface Graduate {
  id: string;
  name: string;
  certificationCode: string;
  courseName: string; // e.g., Open Water Diver, Advanced, Rescue, Divemaster
  graduationDate: string;
  instructorName: string;
  level: '1-star' | '2-star' | '3-star' | 'divemaster' | 'instructor';
}
