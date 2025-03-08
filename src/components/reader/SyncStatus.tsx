
import { useState } from 'react';
import { useReader } from '@/contexts/ReaderContext';
import { Button } from '@/components/ui/button';
import { Cloud, CloudOff, RefreshCw, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import BackupRestoreDialog from './BackupRestoreDialog';
import StoragePreferences from './StoragePreferences';

const SyncStatus = () => {
  const { syncStatus, syncWithServer } = useReader();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    if (isSyncing) return;
    
    setIsSyncing(true);
    const success = await syncWithServer();
    setIsSyncing(false);
    
    if (success) {
      toast.success('Synchronization complete', {
        description: 'Your book data has been synchronized with the server.'
      });
    } else {
      toast.error('Synchronization failed', {
        description: 'There was an error synchronizing your data. Please try again later.'
      });
    }
  };

  let icon = <Cloud className="h-4 w-4 mr-2" />;
  let label = 'Synced';
  let buttonVariant: 'outline' | 'secondary' | 'destructive' = 'outline';
  
  if (syncStatus === 'unsynchronized') {
    icon = <CloudOff className="h-4 w-4 mr-2" />;
    label = 'Sync needed';
    buttonVariant = 'secondary';
  } else if (syncStatus === 'synchronizing' || isSyncing) {
    icon = <RefreshCw className="h-4 w-4 mr-2 animate-spin" />;
    label = 'Syncing...';
    buttonVariant = 'outline';
  } else if (syncStatus === 'error') {
    icon = <AlertCircle className="h-4 w-4 mr-2" />;
    label = 'Sync failed';
    buttonVariant = 'destructive';
  }

  return (
    <div className="flex items-center space-x-2">
      <StoragePreferences />
      <BackupRestoreDialog />
      <Button
        variant={buttonVariant}
        size="sm"
        onClick={handleSync}
        disabled={syncStatus === 'synchronizing' || isSyncing}
      >
        {icon}
        {label}
      </Button>
    </div>
  );
};

export default SyncStatus;
