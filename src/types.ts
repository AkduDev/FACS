export interface GalleryItem {
  id: string;
  url: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  category: string;
  categoryEn?: string;
  date: string;
  localImage?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  titleEn?: string;
  content: string;
  contentEn?: string;
  date: string;
  image?: string;
  localImage?: string;
  author: string;
  category: string;
  categoryEn?: string;
}

export interface EventItem {
  id: string;
  title: string;
  titleEn?: string;
  date: string;
  location: string;
  locationEn?: string;
  description: string;
  descriptionEn?: string;
  category: string;
  categoryEn?: string;
  image?: string;
  localImage?: string;
}

export interface Instructor {
  id: string;
  name: string;
  bio: string;
  bioEn?: string;
  level: string;
  levelEn?: string;
  certificationCode: string;
  photo: string;
  localPhoto?: string;
  experienceYears: number;
}

export interface Graduate {
  id: string;
  name: string;
  certificationCode: string;
  courseName: string;
  graduationDate: string;
  instructorName: string;
  level: '1-star' | '2-star' | '3-star' | 'divemaster' | 'instructor';
}
