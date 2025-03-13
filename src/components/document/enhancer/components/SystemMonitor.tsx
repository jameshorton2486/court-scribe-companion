
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Cpu, HardDrive, AlertTriangle, Clock, DownloadCloud, Trash2 } from 'lucide-react';
import { logger } from '../../utils/loggingService';

type LogRecord = {
  timestamp: string;
  level: string;
  message: string;
  context?: Record<string, any>;
};

const SystemMonitor: React.FC = () => {
  const [activeTab, setActiveTab] = useState('logs');
  const [logs, setLogs] = useState<LogRecord[]>([]);
  const [memoryUsage, setMemoryUsage] = useState({ used: 0, total: 0 });
  const [cpuUsage, setCpuUsage] = useState(0);
  const [operationStatus, setOperationStatus] = useState('idle');

  // Simulate fetching logs
  useEffect(() => {
    // In a real application, this would fetch from your logging service
    const fakeLogs = logger.getHistory();
    setLogs(fakeLogs as LogRecord[]);

    // Set up polling for logs
    const interval = setInterval(() => {
      setLogs(logger.getHistory() as LogRecord[]);
      
      // Simulate performance metrics
      setMemoryUsage({
        used: Math.floor(Math.random() * 800),
        total: 1024
      });
      setCpuUsage(Math.floor(Math.random() * 80));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleClearLogs = () => {
    logger.clearHistory();
    setLogs([]);
  };

  const handleDownloadLogs = () => {
    // Create a blob with the logs
    const logsText = logs.map(log => 
      `[${log.timestamp}] [${log.level}] ${log.message} ${log.context ? JSON.stringify(log.context) : ''}`
    ).join('\n');
    
    const blob = new Blob([logsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const a = document.createElement('a');
    a.href = url;
    a.download = `document-enhancer-logs-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Helper to get color for log level
  const getLogLevelColor = (level: string): string => {
    switch (level.toLowerCase()) {
      case 'debug': return 'text-gray-500';
      case 'info': return 'text-blue-500';
      case 'warning': return 'text-amber-500';
      case 'error': return 'text-red-500';
      case 'critical': return 'text-red-700 font-semibold';
      default: return 'text-gray-700';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">System Monitor</CardTitle>
          <Badge 
            variant={operationStatus === 'idle' ? 'outline' : operationStatus === 'error' ? 'destructive' : 'default'}
            className="ml-2"
          >
            {operationStatus === 'idle' ? 'Idle' : operationStatus === 'error' ? 'Error' : 'Active'}
          </Badge>
        </div>
        <CardDescription>
          Application logs and system performance
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="logs">Application Logs</TabsTrigger>
          <TabsTrigger value="performance">System Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="logs" className="border-none p-0">
          <CardContent className="px-0 py-2">
            <div className="flex justify-between items-center px-6 mb-2">
              <div className="text-sm text-muted-foreground">
                {logs.length} log entries
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleDownloadLogs}
                  className="flex items-center"
                >
                  <DownloadCloud className="mr-1 h-4 w-4" />
                  Export
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleClearLogs}
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
                      {log.context && Object.keys(log.context).length > 0 && (
                        <pre className="mt-1 text-xs bg-muted p-2 rounded overflow-x-auto">
                          {JSON.stringify(log.context, null, 2)}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="performance" className="border-none p-0">
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="bg-muted rounded-full p-2">
                  <HardDrive className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Memory Usage</span>
                    <span className="text-sm text-muted-foreground">{memoryUsage.used} MB / {memoryUsage.total} MB</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${(memoryUsage.used / memoryUsage.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-muted rounded-full p-2">
                  <Cpu className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">CPU Usage</span>
                    <span className="text-sm text-muted-foreground">{cpuUsage}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${cpuUsage > 80 ? 'bg-red-500' : cpuUsage > 60 ? 'bg-amber-500' : 'bg-primary'}`}
                      style={{ width: `${cpuUsage}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-muted rounded-full p-2">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Uptime</span>
                    <span className="text-sm text-muted-foreground">{Math.floor(Math.random() * 24)}h {Math.floor(Math.random() * 60)}m</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="pt-0">
        <p className="text-xs text-muted-foreground w-full text-center">
          System monitoring active. Last updated: {new Date().toLocaleTimeString()}
        </p>
      </CardFooter>
    </Card>
  );
};

export default SystemMonitor;
