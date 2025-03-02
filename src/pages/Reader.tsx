
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import ReaderToolbar from '@/components/ReaderToolbar';
import TableOfContents, { TocItem } from '@/components/TableOfContents';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Book } from '@/components/EbookUploader';

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

const Reader = () => {
  const { bookId, chapterId } = useParams<{ bookId: string; chapterId: string }>();
  const navigate = useNavigate();
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [tocVisible, setTocVisible] = useState(false);
  const [activeChapter, setActiveChapter] = useState<string | undefined>(chapterId);
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

  // Set the first chapter as active if no chapter is specified
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
    <div className={cn("min-h-screen pb-24", isDarkTheme ? "dark" : "")}>
      <ReaderToolbar 
        title={book.title}
        onToggleToc={() => setTocVisible(!tocVisible)}
        onToggleTheme={handleToggleTheme}
        isDarkTheme={isDarkTheme}
      />
      
      <div className="container mx-auto pt-24">
        <div className="flex flex-col md:flex-row">
          {/* Table of Contents Sidebar - larger screens */}
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

          {/* Mobile TOC */}
          {tocVisible && (
            <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden">
              <div className="fixed inset-y-0 left-0 z-50 w-3/4 max-w-xs pt-20 pb-6 bg-card overflow-y-auto animate-slide-in">
                <div className="px-4 py-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-lg">Table of Contents</h3>
                    <button 
                      className="p-2 rounded-full hover:bg-muted"
                      onClick={() => setTocVisible(false)}
                    >
                      <X size={18} />
                    </button>
                  </div>
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
              <div 
                className="fixed inset-0 z-40 bg-black/20" 
                onClick={() => setTocVisible(false)}
              />
            </div>
          )}

          {/* Main Content */}
          <main className={cn(
            "flex-1 transition-all duration-300", 
            tocVisible ? "md:ml-64" : "ml-0"
          )}>
            <div className="reader-page">
              <div className="animate-blur-in">
                <h1 className="text-3xl font-semibold mb-6">{currentChapter.title}</h1>
                
                <div 
                  className="reader-content"
                  dangerouslySetInnerHTML={{ __html: currentChapter.content }}
                />
                
                {/* Navigation buttons */}
                <div className="flex justify-between mt-12 pt-6 border-t">
                  <button
                    onClick={handlePrevChapter}
                    className={cn(
                      "flex items-center px-4 py-2 rounded-md transition-colors",
                      currentChapterIndex > 0 
                        ? "bg-primary/10 hover:bg-primary/20" 
                        : "opacity-50 cursor-not-allowed"
                    )}
                    disabled={currentChapterIndex <= 0}
                  >
                    <ArrowLeft size={18} className="mr-2" />
                    Previous Chapter
                  </button>
                  
                  <button
                    onClick={handleNextChapter}
                    className={cn(
                      "flex items-center px-4 py-2 rounded-md transition-colors",
                      currentChapterIndex < book.chapters.length - 1 
                        ? "bg-primary/10 hover:bg-primary/20" 
                        : "opacity-50 cursor-not-allowed"
                    )}
                    disabled={currentChapterIndex >= book.chapters.length - 1}
                  >
                    Next Chapter
                    <ArrowRight size={18} className="ml-2" />
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Reader;
