
import { useState } from 'react';
import { Upload, FileText, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export type Chapter = {
  id: string;
  title: string;
  content: string;
};

export type Book = {
  id: string;
  title: string;
  author: string;
  chapters: Chapter[];
};

interface EbookUploaderProps {
  onBookUploaded: (book: Book) => void;
}

const EbookUploader = ({ onBookUploaded }: EbookUploaderProps) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProcessingStatus('processing');
    try {
      const text = await file.text();
      setContent(text);
      toast.success("File uploaded successfully", {
        description: "The content has been loaded into the text area for editing."
      });
      setProcessingStatus('idle');
    } catch (error) {
      console.error("Error reading file:", error);
      toast.error("Error reading file", {
        description: "Please make sure the file is a valid text file."
      });
      setProcessingStatus('idle');
    }
  };

  const processEbook = () => {
    if (!title.trim()) {
      toast.error("Please enter a title for your ebook");
      return;
    }

    setProcessingStatus('processing');

    try {
      // Generate a simple ID based on title
      const id = title.toLowerCase().replace(/\s+/g, '-');
      
      // Basic chapter extraction (split by headings)
      const chapterRegex = /^#+\s+(.*?)$/gm;
      const contentLines = content.split('\n');
      
      const chapters: Chapter[] = [];
      let currentChapterTitle = '';
      let currentChapterContent = '';
      let chapterCount = 0;
      
      contentLines.forEach(line => {
        const chapterMatch = line.match(/^#+\s+(.*?)$/);
        
        if (chapterMatch) {
          // If we already have content, save the previous chapter
          if (currentChapterTitle) {
            chapters.push({
              id: `ch${chapterCount}`,
              title: currentChapterTitle,
              content: currentChapterContent.trim()
            });
            chapterCount++;
          }
          
          // Start a new chapter
          currentChapterTitle = chapterMatch[1];
          currentChapterContent = `<h2>${currentChapterTitle}</h2>\n`;
        } else if (currentChapterTitle) {
          // Add to current chapter content
          currentChapterContent += line ? `<p>${line}</p>\n` : '';
        }
      });
      
      // Add the last chapter if it exists
      if (currentChapterTitle) {
        chapters.push({
          id: `ch${chapterCount}`,
          title: currentChapterTitle,
          content: currentChapterContent.trim()
        });
      }
      
      // If no chapters were found, create a single chapter
      if (chapters.length === 0) {
        chapters.push({
          id: 'ch0',
          title: title,
          content: `<h2>${title}</h2>\n<p>${content}</p>`
        });
      }

      const newBook: Book = {
        id,
        title,
        author: author || 'Unknown Author',
        chapters
      };

      setProcessingStatus('success');
      onBookUploaded(newBook);
      
      toast.success("E-book processed successfully", {
        description: `Created ${chapters.length} chapter(s) from your content.`
      });
    } catch (error) {
      console.error("Error processing content:", error);
      toast.error("Error processing content", {
        description: "There was a problem converting your content to an e-book format."
      });
      setProcessingStatus('idle');
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Upload or Paste E-book Content</CardTitle>
        <CardDescription>
          Add your e-book content by uploading a file or pasting text directly.
          We'll automatically format it into chapters.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="paste" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="paste">Paste Content</TabsTrigger>
            <TabsTrigger value="upload">Upload File</TabsTrigger>
          </TabsList>
          
          <TabsContent value="paste" className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    E-book Title
                  </label>
                  <input
                    id="title"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    placeholder="Enter e-book title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="author" className="text-sm font-medium">
                    Author (Optional)
                  </label>
                  <input
                    id="author"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    placeholder="Enter author name"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="content" className="text-sm font-medium">
                  E-book Content
                </label>
                <Textarea
                  id="content"
                  placeholder="Paste your e-book content here. Use markdown headings (# Title) to mark chapter titles."
                  className="min-h-[300px]"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Use # headings to mark chapter titles. Each heading will create a new chapter.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-4">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-input rounded-lg p-12">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-muted mb-4">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">Upload an e-book file</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop your file here, or click to browse
                </p>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".txt,.md,.html"
                  onChange={handleFileUpload}
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className="mb-2"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
                <p className="text-xs text-muted-foreground">
                  Supported formats: .txt, .md, .html
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="upload-title" className="text-sm font-medium">
                    E-book Title
                  </label>
                  <input
                    id="upload-title"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    placeholder="Enter e-book title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="upload-author" className="text-sm font-medium">
                    Author (Optional)
                  </label>
                  <input
                    id="upload-author"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    placeholder="Enter author name"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setContent('')}>
          Clear
        </Button>
        <Button 
          onClick={processEbook}
          disabled={processingStatus === 'processing' || !content || !title}
        >
          {processingStatus === 'processing' ? (
            <>Processing...</>
          ) : processingStatus === 'success' ? (
            <><Check className="mr-2 h-4 w-4" /> Processed</>
          ) : (
            <>Process E-book</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EbookUploader;
