
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SelectChaptersTab from './SelectChaptersTab';
import GrammarEnhancementTab from './GrammarEnhancementTab';
import ContentEnhancementTab from './ContentEnhancementTab';
import FormattingTab from './FormattingTab';
import { Button } from '@/components/ui/button';
import { Chapter } from '@/components/ebook-uploader/BookProcessor';
import { Wand2 } from 'lucide-react';

interface EnhancementOptionsProps {
  chapters: Chapter[];
  selectedChapters: string[];
  setSelectedChapters: (chapterIds: string[]) => void;
  onEnhance: (options: {
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
  }) => void;
  isProcessing: boolean;
}

const EnhancementOptions: React.FC<EnhancementOptionsProps> = ({
  chapters,
  selectedChapters,
  setSelectedChapters,
  onEnhance,
  isProcessing
}) => {
  const [activeTab, setActiveTab] = useState('chapters');
  
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

  const handleEnhance = () => {
    onEnhance({
      enableGrammarCheck,
      grammarLevel,
      enableSpellingCheck,
      enableContentExpansion,
      expansionLevel,
      writingStyle,
      improveClarity,
      enableProfessionalFormatting,
      fontFamily,
      generateTOC,
      addChapterBreaks
    });
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="chapters">Chapters</TabsTrigger>
          <TabsTrigger value="grammar">Grammar</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="formatting">Formatting</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chapters" className="mt-4">
          <SelectChaptersTab 
            chapters={chapters}
            selectedChapters={selectedChapters}
            setSelectedChapters={setSelectedChapters}
          />
        </TabsContent>

        <TabsContent value="grammar" className="mt-4">
          <GrammarEnhancementTab
            enableGrammarCheck={enableGrammarCheck}
            setEnableGrammarCheck={setEnableGrammarCheck}
            grammarLevel={grammarLevel}
            setGrammarLevel={setGrammarLevel}
            enableSpellingCheck={enableSpellingCheck}
            setEnableSpellingCheck={setEnableSpellingCheck}
          />
        </TabsContent>

        <TabsContent value="content" className="mt-4">
          <ContentEnhancementTab
            enableContentExpansion={enableContentExpansion}
            setEnableContentExpansion={setEnableContentExpansion}
            expansionLevel={expansionLevel}
            setExpansionLevel={setExpansionLevel}
            writingStyle={writingStyle}
            setWritingStyle={setWritingStyle}
            improveClarity={improveClarity}
            setImproveClarity={setImproveClarity}
          />
        </TabsContent>

        <TabsContent value="formatting" className="mt-4">
          <FormattingTab
            enableProfessionalFormatting={enableProfessionalFormatting}
            setEnableProfessionalFormatting={setEnableProfessionalFormatting}
            fontFamily={fontFamily}
            setFontFamily={setFontFamily}
            generateTOC={generateTOC}
            setGenerateTOC={setGenerateTOC}
            addChapterBreaks={addChapterBreaks}
            setAddChapterBreaks={setAddChapterBreaks}
          />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button 
          onClick={handleEnhance} 
          disabled={isProcessing || selectedChapters.length === 0}
          className="flex items-center space-x-2"
        >
          <Wand2 className="h-4 w-4" />
          <span>{isProcessing ? 'Enhancing...' : 'Enhance Book'}</span>
        </Button>
      </div>
    </div>
  );
};

export default EnhancementOptions;
