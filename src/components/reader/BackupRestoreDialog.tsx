
import { useState } from 'react';
import { useReader } from '@/contexts/ReaderContext';
import { Book } from '@/components/ebook-uploader/EbookUploader';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Archive, 
  Download, 
  Upload, 
  Info, 
  AlertTriangle,
  Check
} from 'lucide-react';
import { toast } from 'sonner';

const BackupRestoreDialog = () => {
  const { exportBooks, importBooks, book } = useReader();
  const [open, setOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Generate the export
      const exportData = await exportBooks();
      
      // Create a blob with the export data
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      
      // Create a download link and trigger it
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `court-reporter-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Backup created successfully', {
        description: 'Your book data has been exported to a file.'
      });
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export failed', {
        description: 'There was an error creating your backup file.'
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    setImportSuccess(false);
    
    if (e.target.files && e.target.files.length > 0) {
      setImportFile(e.target.files[0]);
    } else {
      setImportFile(null);
    }
  };

  const handleImport = async () => {
    if (!importFile) {
      setImportError('Please select a backup file to import');
      return;
    }

    setIsImporting(true);
    setImportError(null);
    
    try {
      // Read the file
      const fileContent = await importFile.text();
      
      // Parse the JSON content
      const importData = JSON.parse(fileContent);
      
      // Validate the structure
      if (!Array.isArray(importData)) {
        throw new Error('Invalid backup file format: Expected an array of books');
      }
      
      // Import the books
      const importedCount = await importBooks(importData);
      
      // Show success message
      setImportSuccess(true);
      toast.success('Import successful', {
        description: `Imported ${importedCount} book(s) from backup file.`
      });
    } catch (error) {
      console.error('Import error:', error);
      setImportError(error instanceof Error ? error.message : 'Unknown error importing backup file');
      toast.error('Import failed', {
        description: 'The selected file could not be imported. Please check the file format.'
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Archive size={16} />
          <span className="hidden md:inline">Backup</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Backup & Restore</DialogTitle>
          <DialogDescription>
            Export your books for safekeeping or restore from a previous backup.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="export" className="mt-4">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="export" className="flex items-center gap-1">
              <Download className="w-4 h-4" />
              Export Data
            </TabsTrigger>
            <TabsTrigger value="import" className="flex items-center gap-1">
              <Upload className="w-4 h-4" />
              Import Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-4">
            <div className="bg-amber-50 dark:bg-amber-950 p-3 rounded-md mb-2">
              <div className="flex items-start gap-2">
                <Info size={18} className="text-amber-600 dark:text-amber-400 mt-0.5" />
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  Create a backup file containing all your books. Store this file safely to restore your books if your browser data is cleared.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm">
                The export will include:
              </p>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>All saved books in your library</li>
                <li>Book content and chapter organization</li>
                <li>Book metadata (title, author, etc.)</li>
              </ul>
            </div>

            <Button
              className="w-full mt-4"
              onClick={handleExport}
              disabled={isExporting || !book}
            >
              {isExporting ? 'Creating backup...' : 'Export All Books'}
            </Button>
          </TabsContent>

          <TabsContent value="import" className="space-y-4">
            <div className="bg-amber-50 dark:bg-amber-950 p-3 rounded-md mb-2">
              <div className="flex items-start gap-2">
                <Info size={18} className="text-amber-600 dark:text-amber-400 mt-0.5" />
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  Restore your books from a previously created backup file. This will add the books from the backup to your current library.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="backup-file">Select Backup File</Label>
              <Input 
                id="backup-file" 
                type="file" 
                accept=".json" 
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">
                Select a .json backup file created by the Court Reporter application
              </p>
            </div>

            {importError && (
              <div className="bg-destructive/10 p-3 rounded-md">
                <div className="flex items-start gap-2">
                  <AlertTriangle size={18} className="text-destructive mt-0.5" />
                  <p className="text-sm text-destructive">{importError}</p>
                </div>
              </div>
            )}

            {importSuccess && (
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-md">
                <div className="flex items-start gap-2">
                  <Check size={18} className="text-green-600 dark:text-green-400 mt-0.5" />
                  <p className="text-sm text-green-800 dark:text-green-200">
                    Import successful! Your books have been restored.
                  </p>
                </div>
              </div>
            )}

            <Button
              className="w-full mt-4"
              onClick={handleImport}
              disabled={isImporting || !importFile}
            >
              {isImporting ? 'Importing...' : 'Restore From Backup'}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default BackupRestoreDialog;
