
import { Button } from '@/components/ui/button';
import BookEnhancer from '@/components/book-enhancer/BookEnhancer';
import { useReader } from '@/contexts/ReaderContext';
import { Book } from '@/components/ebook-uploader/EbookUploader';
import { toast } from 'sonner';

interface EnhancerWrapperProps {
  onBookEnhanced: (enhancedBook: Book) => void;
}

const EnhancerWrapper: React.FC<EnhancerWrapperProps> = ({ onBookEnhanced }) => {
  const { book, setShowEnhancer } = useReader();

  if (!book) return null;

  const handleEnhancementComplete = (enhancedBook: Book) => {
    onBookEnhanced(enhancedBook);
    setShowEnhancer(false);
    toast.success("Book enhancement completed", {
      description: "Your book has been successfully enhanced and updated.",
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-24">
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
};

export default EnhancerWrapper;
