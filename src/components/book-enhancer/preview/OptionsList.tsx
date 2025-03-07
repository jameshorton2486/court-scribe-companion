
import React from 'react';
import { Check, X } from 'lucide-react';

interface OptionsListItemProps {
  enabled: boolean;
  label: string;
  indented?: boolean;
}

const OptionsListItem: React.FC<OptionsListItemProps> = ({ enabled, label, indented = false }) => {
  return (
    <li className={`flex items-center space-x-2 ${indented ? 'pl-6' : ''}`}>
      {enabled ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <X className="h-4 w-4 text-muted-foreground" />
      )}
      <span>{label}</span>
    </li>
  );
};

interface OptionsListProps {
  title: string;
  options: Array<{
    enabled: boolean;
    label: string;
    indented?: boolean;
  }>;
}

const OptionsList: React.FC<OptionsListProps> = ({ title, options }) => {
  return (
    <div>
      <h5 className="text-sm font-medium mb-1">{title}</h5>
      <ul className="text-sm space-y-1">
        {options.map((option, index) => (
          <OptionsListItem 
            key={index}
            enabled={option.enabled}
            label={option.label}
            indented={option.indented}
          />
        ))}
      </ul>
    </div>
  );
};

export default OptionsList;
