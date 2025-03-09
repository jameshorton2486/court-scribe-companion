
import { useReader } from '@/contexts/ReaderContext';
import ReaderLayout from '@/components/reader/ReaderLayout';
import TocSidebar from '@/components/reader/TocSidebar';
import ReaderContent from '@/components/reader/ReaderContent';
import EnhancerWrapper from '@/components/reader/EnhancerWrapper';

const ReaderUI = () => {
  const { showEnhancer } = useReader();
  
  if (showEnhancer) {
    return <EnhancerWrapper onBookEnhanced={(updatedBook) => {}} />;
  }
  
  return (
    <ReaderLayout>
      <TocSidebar />
      <ReaderContent />
    </ReaderLayout>
  );
};

export default ReaderUI;
