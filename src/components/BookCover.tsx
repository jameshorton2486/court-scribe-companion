
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookCoverProps {
  id: string;
  title: string;
  author: string;
  coverImage?: string;
  description?: string;
  className?: string;
}

const BookCover = ({
  id,
  title,
  author,
  coverImage = '/placeholder.svg',
  description,
  className,
}: BookCoverProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={cn(
        'group relative overflow-hidden rounded-xl transition-all duration-300 ease-out',
        'hover:shadow-xl hover:-translate-y-1',
        'opacity-0 transform',
        isLoaded && 'animate-fade-up opacity-100',
        className
      )}
    >
      <div className="aspect-[2/3] bg-court-light-gray overflow-hidden rounded-xl">
        {coverImage && (
          <img
            src={coverImage}
            alt={title}
            className="h-full w-full object-cover transition-all duration-500 ease-out"
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
          />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-court-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 w-full p-4 text-white">
            <p className="text-xs uppercase tracking-wider mb-1 opacity-80">{author}</p>
            <h3 className="font-medium text-lg">{title}</h3>
            
            {description && (
              <p className="text-sm mt-2 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">{description}</p>
            )}
            
            <Link 
              to={`/reader/${id}`} 
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-white/90 hover:text-white transition-colors"
            >
              Read now <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCover;
