
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Book } from '@/components/ebook-uploader/BookProcessor';
import EnhancementOptions from './EnhancementOptions';
import EnhancementPreview from './EnhancementPreview';
import { enhanceBook } from './enhancementProcessor';

interface BookEnhancerProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
  onBookEnhanced: (enhancedBook: Book) => void;
}

const BookEnhancer: React.FC<BookEnhancerProps> = ({
  book,
  isOpen,
  onClose,
  onBookEnhanced
}) => {
  const [selectedChapters, setSelectedChapters] = useState<string[]>(book.chapters.map(ch => ch.id));
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Grammar options
  const [enableGrammarCheck, setEnableGrammarCheck] = useState(true);
  const [grammarLevel, setGrammarLevel] = useState(2);
  const [enableSpellingCheck, setEnableSpellingCheck] = useState(true);
  
  // Content options
  const [enableContentExpansion, setEnableContentExpansion] = useState(false);
  const [expansionLevel, setExpansionLevel] = useState(1);
  const [writingStyle, setWritingStyle] = useState('professional');
  const [improveClarity, setImproveClarity] = useState(true);
  
  // Formatting options
  const [enableProfessionalFormatting, setEnableProfessionalFormatting] = useState(true);
  const [fontFamily, setFontFamily] = useState('serif');
  const [generateTOC, setGenerateTOC] = useState(true);
  const [addChapterBreaks, setAddChapterBreaks] = useState(true);

  const handleEnhance = async (options: {
    enableGrammarCheck: boolean;
    grammarLevel: number;
    enableSpellingCheck: boolean;
    enableContentExpansion: boolean;
    expansionLevel: number;
    writingStyle: string;
    improveClarity: boolean;
    enableProfessionalFormatting: boolean;
    fontFamily: string;
    generateTOC: boolean;
    addChapterBreaks: boolean;
  }) => {
    if (selectedChapters.length === 0) {
      toast.error('Please select at least one chapter to enhance');
      return;
    }

    setIsProcessing(true);
    setEnableGrammarCheck(options.enableGrammarCheck);
    setGrammarLevel(options.grammarLevel);
    setEnableSpellingCheck(options.enableSpellingCheck);
    setEnableContentExpansion(options.enableContentExpansion);
    setExpansionLevel(options.expansionLevel);
    setWritingStyle(options.writingStyle);
    setImproveClarity(options.improveClarity);
    setEnableProfessionalFormatting(options.enableProfessionalFormatting);
    setFontFamily(options.fontFamily);
    setGenerateTOC(options.generateTOC);
    setAddChapterBreaks(options.addChapterBreaks);

    try {
      toast.info('Starting book enhancement', {
        description: `Enhancing ${selectedChapters.length} chapters with selected options`
      });
      
      const enhancedBook = await enhanceBook(
        book,
        selectedChapters,
        options
      );
      
      toast.success('Book enhanced successfully', {
        description: `${selectedChapters.length} chapters have been enhanced`
      });
      
      onBookEnhanced(enhancedBook);
      onClose();
    } catch (error) {
      console.error('Error enhancing book:', error);
      toast.error('Failed to enhance book', {
        description: 'There was a problem enhancing your book. Please try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Enhance Book: {book.title}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <EnhancementOptions
              chapters={book.chapters}
              selectedChapters={selectedChapters}
              setSelectedChapters={setSelectedChapters}
              onEnhance={handleEnhance}
              isProcessing={isProcessing}
            />
          </div>
          
          <div>
            <EnhancementPreview
              chapters={book.chapters}
              selectedChapters={selectedChapters}
              grammarOptions={{
                enableGrammarCheck,
                grammarLevel,
                enableSpellingCheck
              }}
              contentOptions={{
                enableContentExpansion,
                expansionLevel,
                writingStyle,
                improveClarity
              }}
              formattingOptions={{
                enableProfessionalFormatting,
                fontFamily,
                generateTOC,
                addChapterBreaks
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookEnhancer;
