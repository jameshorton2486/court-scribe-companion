
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ChapterContent from '@/components/reader/ChapterContent';
import ChapterNavigation from '@/components/reader/ChapterNavigation';
import { toast } from 'sonner';
import { useReader } from '@/contexts/ReaderContext';
import { cn } from '@/lib/utils';

export const ReaderMainContent: React.FC = () => {
  const navigate = useNavigate();
  const { 
    book, 
    activeChapter, 
    tocVisible, 
    setActiveChapter, 
    setShowEnhancer 
  } = useReader();

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

  return (
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
  );
};

// For backward compatibility
const ReaderContent = ReaderMainContent;
export default ReaderContent;
