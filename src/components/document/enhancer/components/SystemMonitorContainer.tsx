
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface SystemMonitorContainerProps {
  title: string;
  description: string;
  operationStatus: 'idle' | 'active' | 'error';
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (value: string) => void;
  tabs: {
    id: string;
    label: string;
    content: React.ReactNode;
  }[];
  lastUpdated: string;
}

const SystemMonitorContainer: React.FC<SystemMonitorContainerProps> = ({
  title,
  description,
  operationStatus,
  children,
  activeTab,
  onTabChange,
  tabs,
  lastUpdated
}) => {
  const getBadgeVariant = () => {
    switch (operationStatus) {
      case 'idle': return 'outline';
      case 'error': return 'destructive';
      default: return 'default';
    }
  };

  const getOperationStatusText = () => {
    return operationStatus.charAt(0).toUpperCase() + operationStatus.slice(1);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge 
            variant={getBadgeVariant()}
            className="ml-2"
          >
            {getOperationStatusText()}
          </Badge>
        </div>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className={`grid w-full grid-cols-${tabs.length}`}>
          {tabs.map(tab => (
            <TabsTrigger key={tab.id} value={tab.id}>{tab.label}</TabsTrigger>
          ))}
        </TabsList>
        
        {tabs.map(tab => (
          <TabsContent key={tab.id} value={tab.id} className="border-none p-0">
            <CardContent className="px-0 py-2">
              {tab.content}
            </CardContent>
          </TabsContent>
        ))}
      </Tabs>
      
      <CardFooter className="pt-0">
        <p className="text-xs text-muted-foreground w-full text-center">
          System monitoring active. Last updated: {lastUpdated}
        </p>
      </CardFooter>
    </Card>
  );
};

export default SystemMonitorContainer;
