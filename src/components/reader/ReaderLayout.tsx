
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import ReaderToolbar from '@/components/ReaderToolbar';
import { useReader } from '@/contexts/ReaderContext';

interface ReaderLayoutProps {
  children: ReactNode;
}

const ReaderLayout: React.FC<ReaderLayoutProps> = ({ children }) => {
  const { isDarkTheme, tocVisible, toggleTheme, setTocVisible, book } = useReader();

  return (
    <div className={cn("min-h-screen pb-24", isDarkTheme ? "dark" : "")}>
      <ReaderToolbar 
        title={book?.title || "Loading..."}
        onToggleToc={() => setTocVisible(!tocVisible)}
        onToggleTheme={toggleTheme}
        isDarkTheme={isDarkTheme}
      />
      
      <div className="container mx-auto pt-24">
        {children}
      </div>
    </div>
  );
};

export default ReaderLayout;
