
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, FileCode, Github, Home, Menu, Terminal, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const MainNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-primary/90 text-primary-foreground fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <BookOpen className="h-6 w-6 mr-2" />
              <span className="font-bold text-lg">Book Processor</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/70 transition-colors"
              >
                <div className="flex items-center">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </div>
              </Link>
              <a 
                href="https://github.com/microsoft/BookProcessor" 
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/70 transition-colors"
              >
                <div className="flex items-center">
                  <Github className="h-4 w-4 mr-2" />
                  Repository
                </div>
              </a>
              <a 
                href="https://docs.python.org/3/library/tkinter.html" 
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/70 transition-colors"
              >
                <div className="flex items-center">
                  <FileCode className="h-4 w-4 mr-2" />
                  Documentation
                </div>
              </a>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="text-primary-foreground hover:bg-primary/70"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={cn(
        "md:hidden bg-primary/95 transition-all duration-200 ease-in-out overflow-hidden",
        isOpen ? "max-h-60" : "max-h-0"
      )}>
        <div className="px-2 py-3 space-y-1">
          <Link 
            to="/" 
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/70 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <div className="flex items-center">
              <Home className="h-4 w-4 mr-2" />
              Home
            </div>
          </Link>
          <a 
            href="https://github.com/microsoft/BookProcessor" 
            target="_blank"
            rel="noopener noreferrer"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/70 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <div className="flex items-center">
              <Github className="h-4 w-4 mr-2" />
              Repository
            </div>
          </a>
          <a 
            href="https://docs.python.org/3/library/tkinter.html" 
            target="_blank"
            rel="noopener noreferrer"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/70 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <div className="flex items-center">
              <FileCode className="h-4 w-4 mr-2" />
              Documentation
            </div>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default MainNavigation;
