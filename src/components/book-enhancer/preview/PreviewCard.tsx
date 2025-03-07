
import React, { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface PreviewCardProps {
  icon: ReactNode;
  title: string;
  content: ReactNode;
}

const PreviewCard: React.FC<PreviewCardProps> = ({
  icon,
  title,
  content
}) => {
  return (
    <Card className="bg-background/60">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center space-x-2">
          {icon}
          <h4 className="font-medium">{title}</h4>
        </div>
        <div className="text-sm text-muted-foreground">
          {content}
        </div>
      </CardContent>
    </Card>
  );
};

export default PreviewCard;
