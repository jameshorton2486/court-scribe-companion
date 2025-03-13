
import React, { useState, useEffect } from 'react';
import { logger, LogEntry } from '../../utils/loggingService';
import LogViewer from './LogViewer';
import PerformanceMonitor from './PerformanceMonitor';
import SystemMonitorContainer from './SystemMonitorContainer';

const SystemMonitor: React.FC = () => {
  const [activeTab, setActiveTab] = useState('logs');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [memoryUsage, setMemoryUsage] = useState({ used: 0, total: 0 });
  const [cpuUsage, setCpuUsage] = useState(0);
  const [operationStatus, setOperationStatus] = useState<'idle' | 'active' | 'error'>('idle');
  const [uptime, setUptime] = useState({ hours: 0, minutes: 0 });
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());

  // Simulate fetching logs
  useEffect(() => {
    // In a real application, this would fetch from your logging service
    const fakeLogs = logger.getHistory();
    setLogs(fakeLogs);

    // Set up polling for logs
    const interval = setInterval(() => {
      setLogs(logger.getHistory());
      
      // Simulate performance metrics
      setMemoryUsage({
        used: Math.floor(Math.random() * 800),
        total: 1024
      });
      setCpuUsage(Math.floor(Math.random() * 80));
      setUptime({
        hours: Math.floor(Math.random() * 24),
        minutes: Math.floor(Math.random() * 60)
      });
      setLastUpdated(new Date().toLocaleTimeString());
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
      `[${log.timestamp}] [${log.level}] ${log.message} ${log.data ? JSON.stringify(log.data) : ''}`
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

  // Define tabs for the container
  const tabs = [
    {
      id: 'logs',
      label: 'Application Logs',
      content: (
        <LogViewer 
          logs={logs} 
          onClearLogs={handleClearLogs} 
          onDownloadLogs={handleDownloadLogs} 
        />
      )
    },
    {
      id: 'performance',
      label: 'System Performance',
      content: (
        <PerformanceMonitor 
          metrics={{
            memoryUsage,
            cpuUsage,
            uptime
          }}
        />
      )
    }
  ];

  return (
    <SystemMonitorContainer
      title="System Monitor"
      description="Application logs and system performance"
      operationStatus={operationStatus}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      tabs={tabs}
      lastUpdated={lastUpdated}
    >
      {/* Any additional content can go here */}
    </SystemMonitorContainer>
  );
};

export default SystemMonitor;
