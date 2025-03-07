
import React from 'react';
import OptionsList from './OptionsList';

interface OptionsSectionProps {
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

const OptionsSection: React.FC<OptionsSectionProps> = ({
  grammarOptions,
  contentOptions,
  formattingOptions
}) => {
  const grammarItems = [
    {
      enabled: grammarOptions.enableGrammarCheck,
      label: `Grammar Correction ${grammarOptions.enableGrammarCheck ? `(Level ${grammarOptions.grammarLevel})` : ''}`
    },
    {
      enabled: grammarOptions.enableSpellingCheck,
      label: 'Spelling Correction'
    }
  ];

  const contentItems = [
    {
      enabled: contentOptions.enableContentExpansion,
      label: `Content Expansion ${contentOptions.enableContentExpansion ? `(Level ${contentOptions.expansionLevel})` : ''}`
    },
    {
      enabled: contentOptions.improveClarity,
      label: 'Improve Clarity & Readability'
    },
    {
      enabled: true,
      label: `Writing Style: ${contentOptions.writingStyle.charAt(0).toUpperCase() + contentOptions.writingStyle.slice(1)}`
    }
  ];

  const formattingItems = [
    {
      enabled: formattingOptions.enableProfessionalFormatting,
      label: 'Professional Formatting'
    }
  ];

  if (formattingOptions.enableProfessionalFormatting) {
    formattingItems.push(
      {
        enabled: true,
        label: `Font: ${formattingOptions.fontFamily.charAt(0).toUpperCase() + formattingOptions.fontFamily.slice(1)}`,
        indented: true
      },
      {
        enabled: formattingOptions.generateTOC,
        label: 'Table of Contents',
        indented: true
      },
      {
        enabled: formattingOptions.addChapterBreaks,
        label: 'Chapter Breaks',
        indented: true
      }
    );
  }

  return (
    <div className="space-y-3">
      <OptionsList title="Grammar & Spelling" options={grammarItems} />
      <OptionsList title="Content" options={contentItems} />
      <OptionsList title="Formatting" options={formattingItems} />
    </div>
  );
};

export default OptionsSection;
