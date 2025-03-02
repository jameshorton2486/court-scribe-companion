
import React, { useState } from 'react';
import { BookOpen, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TocItem {
  id: string;
  title: string;
  level: number;
  page?: number;
}

interface TableOfContentsProps {
  items: TocItem[];
  activeItemId?: string;
  onItemClick: (id: string) => void;
  className?: string;
}

const TableOfContents = ({
  items,
  activeItemId,
  onItemClick,
  className,
}: TableOfContentsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn('rounded-lg overflow-hidden', className)}>
      <button 
        className="flex items-center justify-between w-full px-4 py-3 bg-card text-card-foreground hover:bg-muted transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <BookOpen size={18} className="mr-2 opacity-70" />
          <span className="font-medium">Table of Contents</span>
        </div>
        <ChevronDown 
          size={18} 
          className={cn(
            "opacity-70 transition-transform duration-200",
            isOpen ? "transform rotate-180" : ""
          )} 
        />
      </button>
      
      <div 
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="bg-card/50 p-2 max-h-96 overflow-y-auto">
          {items.map((item) => (
            <div 
              key={item.id}
              className={cn(
                "toc-item flex justify-between items-center",
                "text-sm hover:bg-muted/50 transition-colors",
                activeItemId === item.id && "active",
                `pl-${Math.min(item.level + 2, 6)}`
              )}
              onClick={() => onItemClick(item.id)}
            >
              <span>{item.title}</span>
              {item.page && (
                <span className="text-xs opacity-60">{item.page}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TableOfContents;
