
import { useState, useEffect } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { toast } from 'sonner';
import { Book } from '@/components/ebook-uploader/EbookUploader';
import { TocItem } from '@/components/TableOfContents';

// Sample e-book content with legal transcript content
const sampleBook = {
  id: 'court-scribe-companion',
  title: 'The Court Reporter\'s Scribe Companion',
  author: 'Legal Transcription Experts',
  chapters: [
    {
      id: 'ch1',
      title: 'Core Content: Chapter 1: Punctuation in Appellate Transcripts',
      content: `
        <h2>Punctuation in Appellate Transcripts</h2>
        <p>Proper punctuation is crucial in legal transcripts, especially those destined for appellate review. This chapter covers the essential rules and conventions that every court reporter must follow to ensure accuracy and clarity.</p>
        <p>Interactive Element: Calculate punctuation decision tree.</p>
        <p>A/B testing options: 25% higher conversion when samples include workflow diagrams vs pure text.</p>
      `
    },
    {
      id: 'ch2',
      title: 'Pricing Matrix Development',
      content: `
        <h2>Pricing Matrix Development</h2>
        <p>2023 - $0.50 per page + surcharge x ( experience factor / 100 )</p>
        <p>Multiple surcharges:</p>
        <ul>
          <li>Expedite: 1.5x</li>
          <li>Weekend: 2x</li>
          <li>Technical: 1.25x</li>
        </ul>
      `
    },
    {
      id: 'ch3',
      title: 'Legal Transcription Process Model',
      content: `
        <h2>Legal Transcription Process Model</h2>
        <p>Legal Compliance, verification and workflow.</p>
        <p>Setup stage:</p>
        <ul>
          <li>DRAFT: THROUGH COMPLAINT/BEFORE INSERT ON Rev2.0/Content</li>
          <li>BUILD.00.1.LEGAL</li>
          <li>* SET DEFAULTS</li>
          <li>SELECT FROM/\Legal\\CompiledDB\</li>
          <li>3 TABLES: client, case, state</li>
          <li>NEW: CREATE STATE.DEFAULT</li>
          <li>SET MESSAGE_TEXT = "Copyright compliance validation failed."</li>
        </ul>
        <p>Wondering if U.S. Copyright Office electronic deposit requirements...?</p>
      `
    },
    {
      id: 'ch4',
      title: 'AI Formatting Prompt Architecture',
      content: `
        <h2>AI Formatting Prompt Architecture</h2>
        <p>Consistently Enforcement Protocol</p>
        <p>Example formatting rules:</p>
        <ol>
          <li>Rule Chaining Architecture:
            <ul>
              <li>2021: Title (No Colon), Comleted (Style), Not Empty (Cap & Sweetner)</li>
              <li>Consistent: Always or 0 time (never)</li>
              <li>Capitalize: "building" = "Building" when alone</li>
            </ul>
          </li>
          <li>Document Config:
            <ul>
              <li>Consistency: All Level with Roman numeral sequencing</li>
              <li>Continuation: All Level can lead with Roman numerals 1-6</li>
              <li>Consistent paragraph level vs OCR / Appellant C</li>
            </ul>
          </li>
        </ol>
      `
    },
    {
      id: 'ch5',
      title: 'Legal Compliance Checks',
      content: `
        <h2>Legal Compliance Checks</h2>
        <p>Legal Compliance Checks:</p>
        <ul>
          <li>Check all court citation convention 2023 USC Title 28 database</li>
          <li>Official citations are required with FCC / Appendix C</li>
          <li>All statements of 'ment' or 'tion' or 'sion' (3%)</li>
        </ul>
      `
    },
    {
      id: 'ch6',
      title: 'Interactive Resources',
      content: `
        <h2>Interactive Resources</h2>
        <p>Interactive Resources:</p>
        <ul>
          <li>Create interactive link libraries with Markdown or similar</li>
          <li>Develop templates with decision trees (3 levels)</li>
          <li>Generate automated practice tests via JSON question banks</li>
        </ul>
      `
    },
    {
      id: 'ch7',
      title: 'Homophones/Spellings',
      content: `
        <h2>Homophones/Spellings</h2>
        <p>Homophones/Spellings:</p>
        <p>December's note: "legal reporter punctuation guide"</p>
        <p>Definitive list: "Proper transcript formatting + style template"</p>
        <p>Update: PDF extract will now be rejected</p>
        <p>This phrase appears (partially) redundant reviewing across all 21 chapters while maintaining legal accuracy95.</p>
      `
    }
  ]
};

// Generate table of contents from chapters
const generateToc = (chapters: any[]): TocItem[] => {
  return chapters.map((chapter, index) => ({
    id: chapter.id,
    title: chapter.title,
    level: 1,
    page: index + 1
  }));
};

const STORAGE_KEY = 'court-reporter-ebooks';

const getSavedBooks = (): Book[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing saved books:', e);
      return [];
    }
  }
  return [];
};

const useBookLoader = (bookId: string | undefined, navigate: NavigateFunction) => {
  const [book, setBook] = useState<Book | null>(null);
  const [toc, setToc] = useState<TocItem[]>([]);

  // Load the book from localStorage
  useEffect(() => {
    if (bookId === 'court-scribe-companion') {
      // Load the sample book if requested by ID
      setBook(sampleBook);
      setToc(generateToc(sampleBook.chapters));
    } else if (bookId) {
      // Try to load from localStorage
      const savedBooks = getSavedBooks();
      const foundBook = savedBooks.find(b => b.id === bookId);
      
      if (foundBook) {
        setBook(foundBook);
        setToc(generateToc(foundBook.chapters));
      } else {
        toast.error("Book not found", {
          description: "The requested book could not be found in your library.",
        });
        navigate('/');
      }
    }
  }, [bookId, navigate]);

  return { book, toc };
};

export default useBookLoader;
