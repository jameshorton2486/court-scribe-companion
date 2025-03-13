
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { DownloadCloud, Trash2, AlertTriangle } from 'lucide-react';
import { LogEntry, LogLevel } from '../../utils/loggingService';

interface LogViewerProps {
  logs: LogEntry[];
  onClearLogs: () => void;
  onDownloadLogs: () => void;
}

const LogViewer: React.FC<LogViewerProps> = ({ 
  logs, 
  onClearLogs, 
  onDownloadLogs 
}) => {
  // Helper to get color for log level
  const getLogLevelColor = (level: LogLevel): string => {
    switch (level) {
      case LogLevel.DEBUG: return 'text-gray-500';
      case LogLevel.INFO: return 'text-blue-500';
      case LogLevel.WARNING: return 'text-amber-500';
      case LogLevel.ERROR: return 'text-red-500';
      default: return 'text-gray-700';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center px-6 mb-2">
        <div className="text-sm text-muted-foreground">
          {logs.length} log entries
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onDownloadLogs}
            className="flex items-center"
          >
            <DownloadCloud className="mr-1 h-4 w-4" />
            Export
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClearLogs}
            className="flex items-center text-destructive hover:text-destructive"
          >
            <Trash2 className="mr-1 h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>
      
      <ScrollArea className="h-[300px] px-6">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <AlertTriangle className="h-8 w-8 mb-2 opacity-30" />
            <p>No logs to display</p>
          </div>
        ) : (
          <div className="space-y-2">
            {logs.map((log, index) => (
              <div key={index} className="text-sm border-b border-muted pb-2 last:border-0">
                <div className="flex justify-between">
                  <span className={`font-medium ${getLogLevelColor(log.level)}`}>
                    [{log.level.toUpperCase()}]
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div>{log.message}</div>
                {log.data && Object.keys(log.data).length > 0 && (
                  <pre className="mt-1 text-xs bg-muted p-2 rounded overflow-x-auto">
                    {JSON.stringify(log.data, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default LogViewer;
