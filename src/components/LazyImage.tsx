import React, { useState, useRef, useEffect } from 'react';
import { ImageIcon } from 'lucide-react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  referrerPolicy?: React.ReferrerPolicy;
  showPlaceholder?: boolean;
}

export default function LazyImage({ 
  src, 
  alt, 
  fallbackSrc, 
  className = '', 
  showPlaceholder = true,
  ...props 
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  const displaySrc = hasError && fallbackSrc ? fallbackSrc : src;

  return (
    <div ref={imgRef} className={`relative overflow-hidden bg-marine-800/30 ${className}`}>
      {/* Placeholder */}
      {showPlaceholder && !isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-marine-800/30">
          <ImageIcon className="h-8 w-8 text-marine-600 animate-pulse" />
        </div>
      )}
      
      {/* Actual image */}
      {isInView && (
        <img
          src={displaySrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          {...props}
        />
      )}
    </div>
  );
}
