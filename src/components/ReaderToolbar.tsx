
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Moon, 
  Sun, 
  Search, 
  Bookmark, 
  Settings, 
  Menu, 
  X 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReaderToolbarProps {
  title: string;
  onToggleToc: () => void;
  onToggleTheme: () => void;
  isDarkTheme: boolean;
  className?: string;
}

const ReaderToolbar = ({
  title,
  onToggleToc,
  onToggleTheme,
  isDarkTheme,
  className,
}: ReaderToolbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'py-2 bg-background/80 backdrop-blur-md shadow-sm' : 'py-4',
        className
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link 
            to="/" 
            className="mr-4 p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Go back to library"
          >
            <ArrowLeft size={20} />
          </Link>
          <h2 className="text-lg font-medium truncate max-w-[200px] sm:max-w-md">
            {title}
          </h2>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-1">
          <button 
            className="p-2 rounded-full hover:bg-muted transition-colors"
            onClick={onToggleToc}
            aria-label="Toggle table of contents"
          >
            <Menu size={20} />
          </button>
          <button 
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Search in document"
          >
            <Search size={20} />
          </button>
          <button 
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Add bookmark"
          >
            <Bookmark size={20} />
          </button>
          <button 
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Settings"
          >
            <Settings size={20} />
          </button>
          <button 
            className="p-2 rounded-full hover:bg-muted transition-colors"
            onClick={onToggleTheme}
            aria-label={isDarkTheme ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkTheme ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 rounded-full hover:bg-muted transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border animate-fade-in">
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-2">
            <button 
              className="flex items-center p-2 rounded-md hover:bg-muted transition-colors w-full text-left"
              onClick={() => {
                onToggleToc();
                setMenuOpen(false);
              }}
            >
              <Menu size={18} className="mr-3" />
              <span>Table of Contents</span>
            </button>
            <button 
              className="flex items-center p-2 rounded-md hover:bg-muted transition-colors w-full text-left"
            >
              <Search size={18} className="mr-3" />
              <span>Search</span>
            </button>
            <button 
              className="flex items-center p-2 rounded-md hover:bg-muted transition-colors w-full text-left"
            >
              <Bookmark size={18} className="mr-3" />
              <span>Bookmarks</span>
            </button>
            <button 
              className="flex items-center p-2 rounded-md hover:bg-muted transition-colors w-full text-left"
            >
              <Settings size={18} className="mr-3" />
              <span>Settings</span>
            </button>
            <button 
              className="flex items-center p-2 rounded-md hover:bg-muted transition-colors w-full text-left"
              onClick={() => {
                onToggleTheme();
                setMenuOpen(false);
              }}
            >
              {isDarkTheme ? (
                <>
                  <Sun size={18} className="mr-3" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon size={18} className="mr-3" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReaderToolbar;
