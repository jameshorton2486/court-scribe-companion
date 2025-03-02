
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  BookMarked, 
  Bookmark, 
  Search, 
  Menu, 
  X, 
  ChevronRight,
  ArrowRight 
} from 'lucide-react';
import BookCover from '@/components/BookCover';
import { cn } from '@/lib/utils';

// Sample books data (for now we only have one book)
const sampleBooks = [
  {
    id: 'court-scribe-companion',
    title: 'The Court Reporter\'s Scribe Companion',
    author: 'Legal Transcription Experts',
    coverImage: '/lovable-uploads/0d8f7807-5e78-4ec9-abc0-dadb9dcfaade.png',
    description: 'A comprehensive guide to legal transcription techniques, formatting standards, and best practices for court reporters and legal transcriptionists.',
    featured: true
  }
];

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const filteredBooks = sampleBooks.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredBook = sampleBooks.find(book => book.featured);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200 backdrop-blur-sm",
        scrollPosition > 20 ? "bg-background/80 shadow-sm" : "bg-transparent"
      )}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-2">
              <BookMarked className="h-6 w-6 text-court-purple" />
              <span className="font-medium text-lg">Court Scribe</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-sm font-medium hover:text-court-purple transition-colors">
                Home
              </Link>
              <Link to="/reader/court-scribe-companion" className="text-sm font-medium hover:text-court-purple transition-colors">
                Library
              </Link>
              <Link to="/" className="text-sm font-medium hover:text-court-purple transition-colors">
                Resources
              </Link>
              <Link to="/" className="text-sm font-medium hover:text-court-purple transition-colors">
                About
              </Link>
            </nav>

            {/* Search Bar */}
            <div className="hidden md:flex items-center relative">
              <Search className="h-4 w-4 absolute left-3 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search books..."
                className="pl-9 pr-4 py-2 text-sm bg-muted rounded-full w-64 focus:outline-none focus:ring-1 focus:ring-court-purple"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-md hover:bg-muted text-foreground"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-card animate-fade-in">
            <div className="container mx-auto px-4 py-3 space-y-3">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-2.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search books..."
                  className="pl-9 pr-4 py-2 text-sm bg-muted rounded-md w-full focus:outline-none focus:ring-1 focus:ring-court-purple"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Link to="/" className="block px-3 py-2 rounded-md hover:bg-muted transition-colors">
                Home
              </Link>
              <Link to="/reader/court-scribe-companion" className="block px-3 py-2 rounded-md hover:bg-muted transition-colors">
                Library
              </Link>
              <Link to="/" className="block px-3 py-2 rounded-md hover:bg-muted transition-colors">
                Resources
              </Link>
              <Link to="/" className="block px-3 py-2 rounded-md hover:bg-muted transition-colors">
                About
              </Link>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 bg-court-dark/5 z-0"></div>
          <div 
            className={cn(
              "container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 sm:pt-24 sm:pb-32 relative z-10",
              "opacity-0 transform",
              isLoaded && "animate-fade-up opacity-100"
            )}
          >
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-court-dark tracking-tight">
                Professional E-Books for Court Reporters
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                Enhance your legal transcription skills with comprehensive guides, templates, and best practices tailored for court reporting professionals.
              </p>
              <div className="mt-10">
                <Link
                  to="/reader/court-scribe-companion"
                  className="inline-flex items-center px-6 py-3 bg-court-purple text-white rounded-full text-base font-medium shadow-md hover:bg-court-purple/90 transition-colors"
                >
                  Start Reading Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Book */}
        {featuredBook && (
          <section className="py-16 bg-gradient-to-b from-court-light-gray to-white">
            <div 
              className={cn(
                "container mx-auto px-4 sm:px-6 lg:px-8",
                "opacity-0",
                isLoaded && "animate-fade-up opacity-100 delay-100"
              )}
            >
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center gap-8 lg:gap-16">
                  <div className="w-full md:w-2/5 lg:w-1/3">
                    <BookCover
                      id={featuredBook.id}
                      title={featuredBook.title}
                      author={featuredBook.author}
                      coverImage={featuredBook.coverImage}
                      className="mx-auto md:mx-0 max-w-xs"
                    />
                  </div>
                  <div className="w-full md:w-3/5 lg:w-2/3 space-y-4">
                    <div className="inline-flex items-center px-3 py-1 bg-court-light-purple text-court-purple rounded-full text-sm">
                      <BookMarked className="h-3.5 w-3.5 mr-1.5" />
                      Featured E-Book
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-medium">{featuredBook.title}</h2>
                    <p className="text-lg text-muted-foreground">{featuredBook.description}</p>
                    <div className="pt-4">
                      <Link
                        to={`/reader/${featuredBook.id}`}
                        className="inline-flex items-center px-5 py-2.5 border-2 border-court-purple text-court-purple rounded-lg text-base font-medium hover:bg-court-purple hover:text-white transition-colors"
                      >
                        Read Now <ChevronRight className="ml-1 h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Features Section */}
        <section className="py-16 sm:py-24">
          <div 
            className={cn(
              "container mx-auto px-4 sm:px-6 lg:px-8",
              "opacity-0",
              isLoaded && "animate-fade-up opacity-100 delay-200"
            )}
          >
            <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
              <h2 className="text-3xl font-semibold">Premium Court Reporting Resources</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Unlock professional resources designed specifically for legal transcription and court reporting excellence.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card shadow-sm rounded-xl p-6 transition-all hover:shadow-md">
                <div className="rounded-full bg-court-light-purple w-12 h-12 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-court-purple" />
                </div>
                <h3 className="text-xl font-medium mb-2">Comprehensive Guides</h3>
                <p className="text-muted-foreground">
                  Detailed guides covering all aspects of legal transcription, from formatting standards to accuracy best practices.
                </p>
              </div>
              
              <div className="bg-card shadow-sm rounded-xl p-6 transition-all hover:shadow-md">
                <div className="rounded-full bg-court-light-purple w-12 h-12 flex items-center justify-center mb-4">
                  <Bookmark className="h-6 w-6 text-court-purple" />
                </div>
                <h3 className="text-xl font-medium mb-2">Interactive Resources</h3>
                <p className="text-muted-foreground">
                  Decision trees, practice exercises, and interactive elements to enhance learning and improve skills.
                </p>
              </div>
              
              <div className="bg-card shadow-sm rounded-xl p-6 transition-all hover:shadow-md">
                <div className="rounded-full bg-court-light-purple w-12 h-12 flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-court-purple" />
                </div>
                <h3 className="text-xl font-medium mb-2">Searchable Content</h3>
                <p className="text-muted-foreground">
                  Easily find specific guidelines, rules, or examples with powerful search functionality across all e-books.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-court-purple text-white">
          <div 
            className={cn(
              "container mx-auto px-4 sm:px-6 lg:px-8 text-center",
              "opacity-0",
              isLoaded && "animate-fade-up opacity-100 delay-300"
            )}
          >
            <h2 className="text-3xl font-medium">Ready to elevate your court reporting skills?</h2>
            <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
              Our comprehensive e-books provide the knowledge and tools you need to excel in legal transcription.
            </p>
            <div className="mt-8">
              <Link
                to="/reader/court-scribe-companion"
                className="inline-flex items-center px-6 py-3 bg-white text-court-purple rounded-full text-base font-medium shadow-md hover:bg-white/90 transition-colors"
              >
                Start Reading Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-court-dark text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center space-x-2 mb-4">
                <BookMarked className="h-6 w-6 text-white" />
                <span className="font-medium text-lg">Court Scribe</span>
              </div>
              <p className="text-white/70 max-w-md">
                Professional e-books and resources for court reporters and legal transcription experts.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-medium mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><Link to="/" className="text-white/70 hover:text-white transition-colors">E-Books</Link></li>
                  <li><Link to="/" className="text-white/70 hover:text-white transition-colors">Templates</Link></li>
                  <li><Link to="/" className="text-white/70 hover:text-white transition-colors">Guides</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-4">About</h3>
                <ul className="space-y-2">
                  <li><Link to="/" className="text-white/70 hover:text-white transition-colors">Company</Link></li>
                  <li><Link to="/" className="text-white/70 hover:text-white transition-colors">Team</Link></li>
                  <li><Link to="/" className="text-white/70 hover:text-white transition-colors">Contact</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li><Link to="/" className="text-white/70 hover:text-white transition-colors">Privacy Policy</Link></li>
                  <li><Link to="/" className="text-white/70 hover:text-white transition-colors">Terms of Service</Link></li>
                  <li><Link to="/" className="text-white/70 hover:text-white transition-colors">Copyright</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/10 text-center md:text-left text-white/50 text-sm">
            <p>© {new Date().getFullYear()} Court Scribe. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
