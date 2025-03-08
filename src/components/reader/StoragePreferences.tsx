
import { useState } from 'react';
import { useReader } from '@/contexts/ReaderContext';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { HardDrive, Database, Info, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const StoragePreferences = () => {
  const { storageType, setStorageType, storageAvailable } = useReader();
  const [open, setOpen] = useState(false);
  const [selectedStorage, setSelectedStorage] = useState<'localStorage' | 'sessionStorage'>(storageType);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      await setStorageType(selectedStorage);
      setOpen(false);
      toast.success('Storage preferences updated', {
        description: `Your books will now be stored in ${selectedStorage === 'localStorage' ? 'browser local storage' : 'session storage'}.`
      });
    } catch (error) {
      console.error('Error changing storage type:', error);
      toast.error('Failed to update storage preferences', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <HardDrive size={16} />
          <span className="hidden md:inline">Storage</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-w-[90vw] w-full">
        <DialogHeader>
          <DialogTitle>Storage Preferences</DialogTitle>
          <DialogDescription>
            Choose where your books and reading progress should be stored.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="bg-amber-50 dark:bg-amber-950 p-3 rounded-md mb-2">
            <div className="flex items-start gap-2">
              <Info size={18} className="text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-800 dark:text-amber-200">
                All storage happens locally in your browser. No data is sent to our servers unless you explicitly sync.
              </p>
            </div>
          </div>

          <RadioGroup value={selectedStorage} onValueChange={(value: 'localStorage' | 'sessionStorage') => setSelectedStorage(value)}>
            <div className="flex items-center space-x-2 rounded-md border p-3">
              <RadioGroupItem value="localStorage" id="localStorage" disabled={!storageAvailable} />
              <Label htmlFor="localStorage" className="flex flex-col cursor-pointer flex-1">
                <span className="font-medium">Persistent Storage</span>
                <span className="text-sm text-muted-foreground">
                  Books remain available even after closing your browser
                </span>
              </Label>
              <HardDrive className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="flex items-center space-x-2 rounded-md border p-3 mt-2">
              <RadioGroupItem value="sessionStorage" id="sessionStorage" />
              <Label htmlFor="sessionStorage" className="flex flex-col cursor-pointer flex-1">
                <span className="font-medium">Session Storage</span>
                <span className="text-sm text-muted-foreground">
                  Books are only available during your current browser session
                </span>
              </Label>
              <Database className="h-5 w-5 text-muted-foreground" />
            </div>
          </RadioGroup>

          {!storageAvailable && (
            <div className="bg-destructive/10 p-3 rounded-md">
              <div className="flex items-start gap-2">
                <AlertTriangle size={18} className="text-destructive mt-0.5 flex-shrink-0" />
                <p className="text-sm text-destructive">
                  Persistent storage is unavailable in your browser. This could be due to private browsing mode or storage limitations.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setOpen(false)} className="w-full sm:w-auto">Cancel</Button>
          <Button 
            onClick={handleSave} 
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StoragePreferences;
