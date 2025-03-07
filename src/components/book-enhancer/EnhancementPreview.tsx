
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Chapter } from '@/components/ebook-uploader/BookProcessor';
import { BookOpen, Blocks } from 'lucide-react';
import PreviewCard from './preview/PreviewCard';
import OptionsSection from './preview/OptionsSection';
import ChaptersList from './preview/ChaptersList';

interface EnhancementPreviewProps {
  chapters: Chapter[];
  selectedChapters: string[];
  grammarOptions: {
    enableGrammarCheck: boolean;
    grammarLevel: number;
    enableSpellingCheck: boolean;
  };
  contentOptions: {
    enableContentExpansion: boolean;
    expansionLevel: number;
    writingStyle: string;
    improveClarity: boolean;
  };
  formattingOptions: {
    enableProfessionalFormatting: boolean;
    fontFamily: string;
    generateTOC: boolean;
    addChapterBreaks: boolean;
  };
}

const EnhancementPreview: React.FC<EnhancementPreviewProps> = ({
  chapters,
  selectedChapters,
  grammarOptions,
  contentOptions,
  formattingOptions
}) => {
  const selectedChaptersDetails = chapters.filter(
    chapter => selectedChapters.includes(chapter.id)
  );

  // Calculate enhancement summary
  const totalEnhancements = [
    grammarOptions.enableGrammarCheck,
    grammarOptions.enableSpellingCheck,
    contentOptions.enableContentExpansion, 
    contentOptions.improveClarity,
    formattingOptions.enableProfessionalFormatting
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Enhancement Preview</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PreviewCard
          icon={<BookOpen className="h-5 w-5 text-primary" />}
          title="Selected Chapters"
          content={
            selectedChapters.length === 0 ? (
              <p>No chapters selected</p>
            ) : (
              <p>{selectedChapters.length} of {chapters.length} chapters</p>
            )
          }
        />
        
        <PreviewCard
          icon={<Blocks className="h-5 w-5 text-primary" />}
          title="Enhancements"
          content={
            totalEnhancements === 0 ? (
              <p>No enhancements selected</p>
            ) : (
              <p>{totalEnhancements} enhancement types active</p>
            )
          }
        />
        
        <PreviewCard
          icon={<BookOpen className="h-5 w-5 text-primary" />}
          title="Output Format"
          content={
            formattingOptions.enableProfessionalFormatting ? (
              <p>Professional e-book format</p>
            ) : (
              <p>Standard format</p>
            )
          }
        />
      </div>
      
      <Card>
        <CardContent className="p-4">
          <h4 className="font-medium mb-2">Selected Enhancement Options</h4>
          <OptionsSection
            grammarOptions={grammarOptions}
            contentOptions={contentOptions}
            formattingOptions={formattingOptions}
          />
        </CardContent>
      </Card>
      
      {selectedChaptersDetails.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-3">Chapters to Enhance</h4>
            <ChaptersList chapters={selectedChaptersDetails} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancementPreview;
