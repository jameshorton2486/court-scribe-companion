
import { Textarea } from '@/components/ui/textarea';

interface PasteTabProps {
  title: string;
  setTitle: (title: string) => void;
  author: string;
  setAuthor: (author: string) => void;
  content: string;
  setContent: (content: string) => void;
}

const PasteTab = ({ title, setTitle, author, setAuthor, content, setContent }: PasteTabProps) => {
  return (
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
  );
};

export default PasteTab;
