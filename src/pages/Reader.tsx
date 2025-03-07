import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import ReaderToolbar from '@/components/ReaderToolbar';
import TableOfContents, { TocItem } from '@/components/TableOfContents';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Book } from '@/components/ebook-uploader/EbookUploader';
import ChapterContent from '@/components/reader/ChapterContent';
import ChapterNavigation from '@/components/reader/ChapterNavigation';
import useBookLoader from '@/hooks/useBookLoader';
import MobileToc from '@/components/reader/MobileToc';
import { Button } from '@/components/ui/button';
import BookEnhancer from '@/components/book-enhancer/BookEnhancer';

const Reader = () => {
  const { bookId, chapterId } = useParams<{ bookId: string; chapterId: string }>();
  const navigate = useNavigate();
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [tocVisible, setTocVisible] = useState(false);
  const [activeChapter, setActiveChapter] = useState<string | undefined>(chapterId);
  const [showEnhancer, setShowEnhancer] = useState(false);
  
  const { book, toc, updateBook } = useBookLoader(bookId, navigate);

  useEffect(() => {
    if (book && book.chapters.length > 0) {
      if (!activeChapter) {
        setActiveChapter(book.chapters[0].id);
      } else if (chapterId) {
        setActiveChapter(chapterId);
      }
    }
  }, [book, chapterId, activeChapter]);

  if (!book) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-medium mb-2">Loading...</h2>
          <p className="text-muted-foreground">If the book doesn't load, it might not exist.</p>
        </div>
      </div>
    );
  }

  const currentChapterIndex = book.chapters.findIndex(ch => ch.id === activeChapter);
  const currentChapter = book.chapters[currentChapterIndex];
  
  const handlePrevChapter = () => {
    if (currentChapterIndex > 0) {
      setActiveChapter(book.chapters[currentChapterIndex - 1].id);
      window.scrollTo(0, 0);
    }
  };

  const handleNextChapter = () => {
    if (currentChapterIndex < book.chapters.length - 1) {
      setActiveChapter(book.chapters[currentChapterIndex + 1].id);
      window.scrollTo(0, 0);
    } else {
      toast("You've reached the end of the book", {
        description: "That's all the content for now.",
        icon: "📚",
      });
    }
  };

  const handleToggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    document.documentElement.classList.toggle('dark');
  };

  const handleTocItemClick = (id: string) => {
    setActiveChapter(id);
    setTocVisible(false);
    window.scrollTo(0, 0);
  };

  const handleEnhancementComplete = (enhancedBook: Book) => {
    updateBook(enhancedBook);
    setShowEnhancer(false);
    toast.success("Book enhancement completed", {
      description: "Your book has been successfully enhanced and updated.",
    });
  };

  if (!currentChapter) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-medium mb-2">Chapter not found</h2>
          <p className="text-muted-foreground mb-4">The requested chapter could not be found.</p>
          <button 
            onClick={() => setActiveChapter(book.chapters[0].id)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Go to first chapter
          </button>
        </div>
      </div>
    );
  }

  if (showEnhancer) {
    return (
      <div className="min-h-screen pt-24 pb-24">
        <ReaderToolbar 
          title={book.title}
          onToggleToc={() => {}}
          onToggleTheme={handleToggleTheme}
          isDarkTheme={isDarkTheme}
        />
        <div className="container mx-auto">
          <div className="mb-4">
            <Button variant="outline" onClick={() => setShowEnhancer(false)}>
              Back to Reader
            </Button>
          </div>
          <BookEnhancer 
            book={book} 
            isOpen={true}
            onClose={() => setShowEnhancer(false)}
            onBookEnhanced={handleEnhancementComplete} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen pb-24", isDarkTheme ? "dark" : "")}>
      <ReaderToolbar 
        title={book.title}
        onToggleToc={() => setTocVisible(!tocVisible)}
        onToggleTheme={handleToggleTheme}
        isDarkTheme={isDarkTheme}
      />
      
      <div className="container mx-auto pt-24">
        <div className="flex flex-col md:flex-row">
          <div 
            className={cn(
              "fixed inset-y-0 left-0 z-40 w-64 pt-24 pb-4 transition-transform duration-300 transform md:translate-x-0 bg-card border-r",
              tocVisible ? "translate-x-0" : "-translate-x-full",
              "hidden md:block"
            )}
          >
            <div className="px-3 py-4 h-full overflow-y-auto">
              <h3 className="font-medium text-lg mb-3">Table of Contents</h3>
              {toc.map((item) => (
                <div 
                  key={item.id}
                  className={cn(
                    "toc-item flex justify-between items-center",
                    activeChapter === item.id && "active"
                  )}
                  onClick={() => handleTocItemClick(item.id)}
                >
                  <span>{item.title}</span>
                  {item.page && <span className="text-xs opacity-60">{item.page}</span>}
                </div>
              ))}
            </div>
          </div>

          {tocVisible && (
            <MobileToc 
              toc={toc} 
              activeChapter={activeChapter} 
              onItemClick={handleTocItemClick} 
              onClose={() => setTocVisible(false)} 
            />
          )}

          <main className={cn(
            "flex-1 transition-all duration-300", 
            tocVisible ? "md:ml-64" : "ml-0"
          )}>
            <div className="reader-page">
              <div className="animate-blur-in">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-3xl font-semibold">{currentChapter.title}</h1>
                  <Button onClick={() => setShowEnhancer(true)} variant="outline" size="sm">
                    Enhance Book
                  </Button>
                </div>
                
                <ChapterContent content={currentChapter.content} />
                
                <ChapterNavigation
                  onPrevChapter={handlePrevChapter}
                  onNextChapter={handleNextChapter}
                  hasPrevious={currentChapterIndex > 0}
                  hasNext={currentChapterIndex < book.chapters.length - 1}
                  currentChapter={currentChapterIndex + 1}
                  totalChapters={book.chapters.length}
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Reader;
