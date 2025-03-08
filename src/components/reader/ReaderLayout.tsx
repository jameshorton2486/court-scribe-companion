
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import ReaderToolbar from '@/components/ReaderToolbar';
import { useReader } from '@/contexts/ReaderContext';
import { Button } from '@/components/ui/button';
import { FileDown, AlertTriangle, HardDrive, Database, Info } from 'lucide-react';
import ExportDialog from '@/components/reader/ExportDialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import StoragePreferences from '@/components/reader/StoragePreferences';
import SyncStatus from '@/components/reader/SyncStatus';

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
    storageAvailable,
    syncStatus,
    storageType
  } = useReader();

  const rightElements = (
    <div className="flex items-center">
      <StoragePreferences />
      <SyncStatus />
      <Button 
        variant="outline" 
        size="sm" 
        className="ml-2"
        onClick={() => setShowExportDialog(true)}
      >
        <FileDown size={16} className="mr-1" />
        Export
      </Button>
    </div>
  );

  return (
    <div className={cn("min-h-screen pb-24", isDarkTheme ? "dark" : "")}>
      <ReaderToolbar 
        title={book?.title || "Loading..."}
        onToggleToc={() => setTocVisible(!tocVisible)}
        onToggleTheme={toggleTheme}
        isDarkTheme={isDarkTheme}
        rightElement={rightElements}
      />
      
      <div className="container mx-auto pt-24">
        {!storageAvailable && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Limited Storage Available</AlertTitle>
            <AlertDescription>
              Your browser has limited or no storage available. Changes may not be saved between sessions.
              This could be due to private browsing mode, storage permissions, or device limitations.
            </AlertDescription>
          </Alert>
        )}
        
        {storageAvailable && storageType === 'sessionStorage' && (
          <Alert className="mb-4 border-amber-300 dark:border-amber-800">
            <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertTitle>Session Storage Active</AlertTitle>
            <AlertDescription className="flex items-center space-x-2">
              <Database size={16} className="text-amber-600 dark:text-amber-400" />
              <span>Your books are being stored in session storage and will be deleted when you close your browser. 
              To change this setting, click the Storage button above.</span>
            </AlertDescription>
          </Alert>
        )}
        
        {storageAvailable && storageType === 'localStorage' && (
          <Alert className="mb-4 border-blue-300 dark:border-blue-800 bg-blue-50 dark:bg-blue-950">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertTitle>Local Storage Active</AlertTitle>
            <AlertDescription className="flex items-center space-x-2">
              <HardDrive size={16} className="text-blue-600 dark:text-blue-400" />
              <span>Your books are being stored in your browser's local storage and will persist between sessions.
              To change this setting, click the Storage button above.</span>
            </AlertDescription>
          </Alert>
        )}
        
        {syncStatus === 'unsynchronized' && (
          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Changes have not been synchronized with the server. Some modifications may be lost.
              Click the "Sync needed" button above to synchronize your data.
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
