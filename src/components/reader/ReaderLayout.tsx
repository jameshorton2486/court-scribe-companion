
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import ReaderToolbar from '@/components/ReaderToolbar';
import { useReader } from '@/contexts/ReaderContext';
import { Button } from '@/components/ui/button';
import { FileDown, AlertTriangle } from 'lucide-react';
import ExportDialog from '@/components/reader/ExportDialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ReaderLayoutProps {
  children: ReactNode;
}

const ReaderLayout: React.FC<ReaderLayoutProps> = ({ children }) => {
  const { 
    isDarkTheme, 
    tocVisible, 
    toggleTheme, 
    setTocVisible, 
    book, 
    showExportDialog, 
    setShowExportDialog,
    storageAvailable
  } = useReader();

  const exportButton = (
    <Button 
      variant="outline" 
      size="sm" 
      className="ml-2"
      onClick={() => setShowExportDialog(true)}
    >
      <FileDown size={16} className="mr-1" />
      Export
    </Button>
  );

  return (
    <div className={cn("min-h-screen pb-24", isDarkTheme ? "dark" : "")}>
      <ReaderToolbar 
        title={book?.title || "Loading..."}
        onToggleToc={() => setTocVisible(!tocVisible)}
        onToggleTheme={toggleTheme}
        isDarkTheme={isDarkTheme}
        rightElement={exportButton}
      />
      
      <div className="container mx-auto pt-24">
        {!storageAvailable && (
          <Alert variant="warning" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Limited or no storage available. Changes may not be saved between sessions.
            </AlertDescription>
          </Alert>
        )}
        {children}
      </div>

      {showExportDialog && book && (
        <ExportDialog 
          book={book}
          onClose={() => setShowExportDialog(false)}
        />
      )}
    </div>
  );
};

export default ReaderLayout;
