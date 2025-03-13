
import React from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, Loader2 } from 'lucide-react';

export type StatusType = 'success' | 'error' | 'warning' | 'info' | 'loading' | 'idle';

interface StatusIndicatorProps {
  status: StatusType;
  message: string;
  description?: string;
  className?: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  message,
  description,
  className = '',
}) => {
  // Configure indicator based on status
  const getStatusConfig = () => {
    switch (status) {
      case 'success':
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          color: 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900/50',
          textColor: 'text-green-800 dark:text-green-300'
        };
      case 'error':
        return {
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
          color: 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900/50',
          textColor: 'text-red-800 dark:text-red-300'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
          color: 'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/50',
          textColor: 'text-amber-800 dark:text-amber-300'
        };
      case 'info':
        return {
          icon: <Info className="h-5 w-5 text-blue-500" />,
          color: 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900/50',
          textColor: 'text-blue-800 dark:text-blue-300'
        };
      case 'loading':
        return {
          icon: <Loader2 className="h-5 w-5 text-gray-500 animate-spin" />,
          color: 'bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800/50',
          textColor: 'text-gray-800 dark:text-gray-300'
        };
      case 'idle':
      default:
        return {
          icon: null,
          color: 'bg-transparent',
          textColor: 'text-gray-500 dark:text-gray-400'
        };
    }
  };

  const { icon, color, textColor } = getStatusConfig();

  // Don't render anything if idle and no message
  if (status === 'idle' && !message) {
    return null;
  }

  return (
    <div className={`rounded-md border p-4 ${color} ${className}`}>
      <div className="flex items-start">
        {icon && <div className="flex-shrink-0 mr-3">{icon}</div>}
        <div>
          <h3 className={`text-sm font-medium ${textColor}`}>{message}</h3>
          {description && <div className={`mt-2 text-sm ${textColor} opacity-90`}>{description}</div>}
        </div>
      </div>
    </div>
  );
};

export default StatusIndicator;
