
import React from 'react';
import { Cpu, HardDrive, Clock } from 'lucide-react';

interface PerformanceMetrics {
  memoryUsage: { used: number; total: number };
  cpuUsage: number;
  uptime: { hours: number; minutes: number };
}

interface PerformanceMonitorProps {
  metrics: PerformanceMetrics;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ metrics }) => {
  const { memoryUsage, cpuUsage, uptime } = metrics;
  
  return (
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
            <span className="text-sm text-muted-foreground">{uptime.hours}h {uptime.minutes}m</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMonitor;
