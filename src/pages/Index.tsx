
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle, Book as BookIcon, Library } from 'lucide-react';
import EbookUploader, { Book } from '@/components/EbookUploader';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

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

const saveBooks = (books: Book[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
};

const Index = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [uploaderOpen, setUploaderOpen] = useState(false);
  
  useEffect(() => {
    // Load saved books on mount
    const savedBooks = getSavedBooks();
    setBooks(savedBooks);
  }, []);
  
  const handleBookUploaded = (book: Book) => {
    const newBooks = [...books.filter(b => b.id !== book.id), book];
    setBooks(newBooks);
    saveBooks(newBooks);
    setUploaderOpen(false);
    toast.success(`${book.title} added to your library`, {
      action: {
        label: "Open",
        onClick: () => navigate(`/reader/${book.id}`),
      },
    });
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Court Reporter's Library</h1>
              <p className="text-muted-foreground mt-1">Your professional e-books collection</p>
            </div>
            <Dialog open={uploaderOpen} onOpenChange={setUploaderOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New E-book
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <EbookUploader onBookUploaded={handleBookUploaded} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {books.length > 0 ? (
          <div>
            <div className="flex items-center mb-8">
              <Library className="h-6 w-6 mr-2" />
              <h2 className="text-2xl font-semibold">Your Library</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {books.map((book) => (
                <div 
                  key={book.id}
                  className="border rounded-xl overflow-hidden bg-card hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/reader/${book.id}`)}
                >
                  <div className="p-6 flex flex-col h-full">
                    <div className="flex-1">
                      <div className="w-full aspect-[3/4] bg-muted rounded-lg mb-4 flex items-center justify-center">
                        <BookIcon size={40} className="text-muted-foreground" />
                      </div>
                      <h3 className="font-medium text-lg mb-1 line-clamp-2">{book.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
                      <p className="text-sm text-muted-foreground">
                        {book.chapters.length} chapter{book.chapters.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <Button className="w-full mt-4" variant="outline" onClick={() => navigate(`/reader/${book.id}`)}>
                      Open Book
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center p-4 bg-muted rounded-full mb-4">
              <Library className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Your library is empty</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Add your first e-book by uploading a file or pasting text content directly.
            </p>
            <Button onClick={() => setUploaderOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New E-book
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
