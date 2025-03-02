
import { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import PasteTab from './PasteTab';
import UploadTab from './UploadTab';
import { processBookContent, Book } from './BookProcessor';

export type { Chapter, Book } from './BookProcessor';

interface EbookUploaderProps {
  onBookUploaded: (book: Book) => void;
}

const EbookUploader = ({ onBookUploaded }: EbookUploaderProps) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  const handleProcess = () => {
    setProcessingStatus('processing');
    
    const book = processBookContent(title, author, content);
    
    if (book) {
      setProcessingStatus('success');
      onBookUploaded(book);
      
      toast.success("E-book processed successfully", {
        description: `Created ${book.chapters.length} chapter(s) from your content.`
      });
    } else {
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
          
          <TabsContent value="paste">
            <PasteTab
              title={title}
              setTitle={setTitle}
              author={author}
              setAuthor={setAuthor}
              content={content}
              setContent={setContent}
            />
          </TabsContent>
          
          <TabsContent value="upload">
            <UploadTab
              title={title}
              setTitle={setTitle}
              author={author}
              setAuthor={setAuthor}
              setContent={setContent}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setContent('')}>
          Clear
        </Button>
        <Button 
          onClick={handleProcess}
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
