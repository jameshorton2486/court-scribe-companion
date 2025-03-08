
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ChapterContent from '@/components/reader/ChapterContent';
import ChapterNavigation from '@/components/reader/ChapterNavigation';
import SyncStatus from '@/components/reader/SyncStatus';
import { toast } from 'sonner';
import { useReader } from '@/contexts/ReaderContext';
import { cn } from '@/lib/utils';
import { BookOpen, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const ReaderMainContent: React.FC = () => {
  const navigate = useNavigate();
  const { 
    book, 
    activeChapter, 
    tocVisible, 
    setActiveChapter, 
    setShowEnhancer,
    error
  } = useReader();

  // Show error state if there's an error loading the book
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
        <AlertCircle className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-medium mb-2">Error Loading Book</h2>
        <p className="text-muted-foreground mb-6 text-center max-w-md">
          {error instanceof Error ? error.message : 'There was a problem loading the book'}
        </p>
        <Button onClick={() => navigate('/')} variant="default">
          Return to Home
        </Button>
      </div>
    );
  }

  // Loading state when book is being fetched
  if (!book) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-pulse mb-4">
          <BookOpen size={48} className="opacity-30" />
        </div>
        <h2 className="text-2xl font-medium mb-2">Loading...</h2>
        <p className="text-muted-foreground">If the book doesn't load, it might not exist.</p>
      </div>
    );
  }

  const currentChapterIndex = book.chapters.findIndex(ch => ch.id === activeChapter);
  const currentChapter = book.chapters[currentChapterIndex];

  const handlePrevChapter = () => {
    try {
      if (currentChapterIndex > 0) {
        setActiveChapter(book.chapters[currentChapterIndex - 1].id);
        window.scrollTo(0, 0);
      }
    } catch (err) {
      console.error('Error navigating to previous chapter:', err);
      toast.error('Navigation error', {
        description: 'Failed to navigate to the previous chapter'
      });
    }
  };

  const handleNextChapter = () => {
    try {
      if (currentChapterIndex < book.chapters.length - 1) {
        setActiveChapter(book.chapters[currentChapterIndex + 1].id);
        window.scrollTo(0, 0);
      } else {
        toast("You've reached the end of the book", {
          description: "That's all the content for now.",
          icon: "📚",
        });
      }
    } catch (err) {
      console.error('Error navigating to next chapter:', err);
      toast.error('Navigation error', {
        description: 'Failed to navigate to the next chapter'
      });
    }
  };

  // If the specified chapter doesn't exist
  if (!currentChapter) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
        <AlertCircle className="h-16 w-16 text-amber-500 mb-4" />
        <h2 className="text-2xl font-medium mb-2">Chapter Not Found</h2>
        <p className="text-muted-foreground mb-6">The requested chapter could not be found.</p>
        <Button 
          onClick={() => setActiveChapter(book.chapters[0].id)}
          variant="default"
        >
          Go to first chapter
        </Button>
      </div>
    );
  }

  return (
    <main className={cn(
      "flex-1 transition-all duration-300", 
      tocVisible ? "md:ml-64" : "ml-0"
    )}>
      <div className="reader-page">
        <div className="animate-blur-in">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <h1 className="text-2xl sm:text-3xl font-semibold">{currentChapter.title}</h1>
            <div className="flex flex-wrap items-center gap-2">
              {book.id !== 'court-scribe-companion' && <SyncStatus />}
              <Button onClick={() => setShowEnhancer(true)} variant="outline" size="sm">
                Enhance Book
              </Button>
            </div>
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
  );
};

// For backward compatibility
const ReaderContent = ReaderMainContent;
export default ReaderContent;
