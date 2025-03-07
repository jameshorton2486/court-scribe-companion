
import React, { useState } from 'react';
import { Book } from '@/components/ebook-uploader/EbookUploader';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileDown, BookText, FileType, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface ExportDialogProps {
  book: Book;
  onClose: () => void;
}

const ExportDialog: React.FC<ExportDialogProps> = ({ book, onClose }) => {
  const [exportFormat, setExportFormat] = useState<'epub' | 'pdf' | 'docx'>('epub');
  const [includeToc, setIncludeToc] = useState(true);
  const [detailedToc, setDetailedToc] = useState(true);
  const [includeCover, setIncludeCover] = useState(true);
  const [pageSize, setPageSize] = useState('a4');
  const [fontFamily, setFontFamily] = useState('serif');
  const [fontSize, setFontSize] = useState('medium');
  const [authorName, setAuthorName] = useState(book.author || '');
  const [bookTitle, setBookTitle] = useState(book.title || '');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    
    // Simulating export process
    setTimeout(() => {
      setIsExporting(false);
      toast.success(`Book exported as ${exportFormat.toUpperCase()}`, {
        description: "Your book has been successfully exported.",
      });
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <FileDown className="w-5 h-5" />
            Export Book
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="format" className="mt-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="format" className="flex items-center gap-1">
              <FileType className="w-4 h-4" />
              Format
            </TabsTrigger>
            <TabsTrigger value="toc" className="flex items-center gap-1">
              <BookText className="w-4 h-4" />
              Table of Contents
            </TabsTrigger>
            <TabsTrigger value="style" className="flex items-center gap-1">
              <Settings className="w-4 h-4" />
              Style & Metadata
            </TabsTrigger>
          </TabsList>

          <TabsContent value="format" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="export-format">Export Format</Label>
              <Select 
                value={exportFormat} 
                onValueChange={(value: any) => setExportFormat(value)}
              >
                <SelectTrigger id="export-format">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="epub">EPUB (E-book)</SelectItem>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="docx">DOCX (Word)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                {exportFormat === 'epub' 
                  ? 'EPUB format is optimized for e-readers and most e-reading apps.' 
                  : exportFormat === 'pdf' 
                    ? 'PDF format preserves formatting and is good for printing.'
                    : 'DOCX format can be edited in Microsoft Word and similar applications.'}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="page-size">Page Size</Label>
              <Select 
                value={pageSize} 
                onValueChange={setPageSize}
                disabled={exportFormat === 'epub'}
              >
                <SelectTrigger id="page-size">
                  <SelectValue placeholder="Select page size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a4">A4</SelectItem>
                  <SelectItem value="letter">US Letter</SelectItem>
                  <SelectItem value="a5">A5</SelectItem>
                  <SelectItem value="b5">B5</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-start space-x-2 pt-2">
              <Checkbox 
                id="include-cover" 
                checked={includeCover} 
                onCheckedChange={(checked) => setIncludeCover(!!checked)}
              />
              <div className="grid gap-1.5 leading-none">
                <Label 
                  htmlFor="include-cover" 
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  Include Book Cover
                </Label>
                <p className="text-xs text-muted-foreground">
                  Generate a cover page with the book title and author
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="toc" className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="include-toc" 
                checked={includeToc} 
                onCheckedChange={(checked) => setIncludeToc(!!checked)}
              />
              <div className="grid gap-1.5 leading-none">
                <Label 
                  htmlFor="include-toc" 
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  Generate Table of Contents
                </Label>
                <p className="text-xs text-muted-foreground">
                  Create a navigable table of contents
                </p>
              </div>
            </div>

            {includeToc && (
              <div className="pl-6 space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="detailed-toc" 
                    checked={detailedToc} 
                    onCheckedChange={(checked) => setDetailedToc(!!checked)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label 
                      htmlFor="detailed-toc" 
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      Include Detailed Sections
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Include subheadings in the table of contents
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Preview Table of Contents</Label>
                  <div className="border rounded-md p-3 bg-card/50 max-h-48 overflow-y-auto">
                    {book.chapters.map((chapter, index) => (
                      <div key={chapter.id} className="py-1">
                        <div className="text-sm font-medium">{index + 1}. {chapter.title}</div>
                        {detailedToc && (
                          <div className="pl-4 text-xs text-muted-foreground">
                            {/* Simulated subheadings */}
                            <div>1.{index + 1} {chapter.title} - Introduction</div>
                            <div>1.{index + 2} {chapter.title} - Key Concepts</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="style" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="book-title">Book Title</Label>
                <Input 
                  id="book-title" 
                  value={bookTitle} 
                  onChange={(e) => setBookTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author-name">Author Name</Label>
                <Input 
                  id="author-name" 
                  value={authorName} 
                  onChange={(e) => setAuthorName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="font-family">Font Family</Label>
              <Select value={fontFamily} onValueChange={setFontFamily}>
                <SelectTrigger id="font-family">
                  <SelectValue placeholder="Select a font" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="serif">Serif (Times New Roman)</SelectItem>
                  <SelectItem value="sans-serif">Sans Serif (Arial)</SelectItem>
                  <SelectItem value="georgia">Georgia</SelectItem>
                  <SelectItem value="garamond">Garamond</SelectItem>
                  <SelectItem value="palatino">Palatino</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="font-size">Font Size</Label>
              <Select value={fontSize} onValueChange={setFontSize}>
                <SelectTrigger id="font-size">
                  <SelectValue placeholder="Select a size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                  <SelectItem value="x-large">Extra Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6 gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? 'Exporting...' : 'Export Book'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
