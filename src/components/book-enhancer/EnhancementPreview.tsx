
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Chapter } from '@/components/ebook-uploader/BookProcessor';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, BookOpen, X, Blocks } from 'lucide-react';

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
        <Card className="bg-background/60">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h4 className="font-medium">Selected Chapters</h4>
            </div>
            <div className="text-sm text-muted-foreground">
              {selectedChapters.length === 0 ? (
                <p>No chapters selected</p>
              ) : (
                <p>{selectedChapters.length} of {chapters.length} chapters</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-background/60">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center space-x-2">
              <Blocks className="h-5 w-5 text-primary" />
              <h4 className="font-medium">Enhancements</h4>
            </div>
            <div className="text-sm text-muted-foreground">
              {totalEnhancements === 0 ? (
                <p>No enhancements selected</p>
              ) : (
                <p>{totalEnhancements} enhancement types active</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-background/60">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h4 className="font-medium">Output Format</h4>
            </div>
            <div className="text-sm text-muted-foreground">
              {formattingOptions.enableProfessionalFormatting ? (
                <p>Professional e-book format</p>
              ) : (
                <p>Standard format</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="p-4">
          <h4 className="font-medium mb-2">Selected Enhancement Options</h4>
          <div className="space-y-3">
            <div>
              <h5 className="text-sm font-medium mb-1">Grammar & Spelling</h5>
              <ul className="text-sm space-y-1">
                <li className="flex items-center space-x-2">
                  {grammarOptions.enableGrammarCheck ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span>Grammar Correction {grammarOptions.enableGrammarCheck && `(Level ${grammarOptions.grammarLevel})`}</span>
                </li>
                <li className="flex items-center space-x-2">
                  {grammarOptions.enableSpellingCheck ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span>Spelling Correction</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-sm font-medium mb-1">Content</h5>
              <ul className="text-sm space-y-1">
                <li className="flex items-center space-x-2">
                  {contentOptions.enableContentExpansion ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span>Content Expansion {contentOptions.enableContentExpansion && `(Level ${contentOptions.expansionLevel})`}</span>
                </li>
                <li className="flex items-center space-x-2">
                  {contentOptions.improveClarity ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span>Improve Clarity & Readability</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Writing Style: {contentOptions.writingStyle.charAt(0).toUpperCase() + contentOptions.writingStyle.slice(1)}</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-sm font-medium mb-1">Formatting</h5>
              <ul className="text-sm space-y-1">
                <li className="flex items-center space-x-2">
                  {formattingOptions.enableProfessionalFormatting ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span>Professional Formatting</span>
                </li>
                {formattingOptions.enableProfessionalFormatting && (
                  <>
                    <li className="flex items-center space-x-2 pl-6">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Font: {formattingOptions.fontFamily.charAt(0).toUpperCase() + formattingOptions.fontFamily.slice(1)}</span>
                    </li>
                    <li className="flex items-center space-x-2 pl-6">
                      {formattingOptions.generateTOC ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span>Table of Contents</span>
                    </li>
                    <li className="flex items-center space-x-2 pl-6">
                      {formattingOptions.addChapterBreaks ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span>Chapter Breaks</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {selectedChaptersDetails.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-3">Chapters to Enhance</h4>
            <ScrollArea className="h-28">
              <ul className="space-y-2">
                {selectedChaptersDetails.map((chapter, index) => (
                  <li key={chapter.id} className="text-sm flex items-start space-x-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    <div>
                      <span className="font-medium">Chapter {index + 1}: {chapter.title}</span>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {chapter.content.replace(/<[^>]*>/g, '').substring(0, 60)}...
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancementPreview;
