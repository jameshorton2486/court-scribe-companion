
import { useState } from 'react';
import { useReader } from '@/contexts/ReaderContext';
import { Button } from '@/components/ui/button';
import { Cloud, CloudOff, RefreshCw, AlertCircle, Shield, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import BackupRestoreDialog from './BackupRestoreDialog';
import StoragePreferences from './StoragePreferences';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SyncStatus = () => {
  const { syncStatus, syncWithServer, storageType } = useReader();
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSecurityInfo, setShowSecurityInfo] = useState(false);

  const handleSync = async () => {
    if (isSyncing) return;
    
    try {
      setIsSyncing(true);
      const success = await syncWithServer();
      
      if (success) {
        toast.success('Synchronization complete', {
          description: 'Your book data has been synchronized with the server.'
        });
      } else {
        // More detailed error feedback
        toast.error('Synchronization failed', {
          description: 'There was an error synchronizing your data. Please check your connection and try again.',
          action: {
            label: 'Retry',
            onClick: () => handleSync(),
          },
        });
      }
    } catch (error) {
      console.error('Sync error:', error);
      toast.error('Synchronization error', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred during synchronization',
      });
    } finally {
      setIsSyncing(false);
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

  // Security indicator based on storage type
  const securityIcon = storageType === 'localStorage' ? 
    <Shield className="h-4 w-4 text-green-500" /> : 
    <ShieldAlert className="h-4 w-4 text-amber-500" />;

  const securityTooltip = storageType === 'localStorage' ? 
    'Your data is stored securely in your browser\'s local storage' : 
    'Your data is stored in session storage and will be lost when you close the browser';

  const toggleSecurityInfo = () => {
    setShowSecurityInfo(!showSecurityInfo);
    if (!showSecurityInfo) {
      toast.info('Security Information', {
        description: securityTooltip
      });
    }
  };

  // Responsive layout for different screen sizes
  return (
    <div className="flex flex-wrap items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="px-2"
              onClick={toggleSecurityInfo}
            >
              {securityIcon}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{securityTooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <div className="flex items-center gap-2">
        <StoragePreferences />
        <BackupRestoreDialog />
      </div>
      
      <Button
        variant={buttonVariant}
        size="sm"
        onClick={handleSync}
        disabled={syncStatus === 'synchronizing' || isSyncing}
        className="whitespace-nowrap"
      >
        {icon}
        <span className="hidden sm:inline">{label}</span>
        <span className="sm:hidden">{syncStatus === 'unsynchronized' ? 'Sync' : ''}</span>
      </Button>
    </div>
  );
};

export default SyncStatus;
