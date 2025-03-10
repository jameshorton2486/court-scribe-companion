
import { Book, Edit, FileText } from 'lucide-react';
import { Chapter } from './DocumentUploader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ChapterListProps {
  chapters: Chapter[];
  onChapterSelect: (chapter: Chapter) => void;
}

const ChapterList: React.FC<ChapterListProps> = ({ 
  chapters, 
  onChapterSelect 
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Book className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Chapters</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {chapters.map((chapter) => (
          <Card 
            key={chapter.id} 
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => onChapterSelect(chapter)}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {chapter.title}
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onChapterSelect(chapter);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div 
                className="line-clamp-3 text-sm text-muted-foreground"
                dangerouslySetInnerHTML={{ 
                  __html: chapter.content
                    .replace(/<h2>.*?<\/h2>/g, '') // Remove headings
                    .substring(0, 150) + '...' 
                }}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ChapterList;
