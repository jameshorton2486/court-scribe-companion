
import { useReader, TocItem } from '@/contexts/ReaderContext';
import { cn } from '@/lib/utils';
import MobileToc from '@/components/reader/MobileToc';

const TocSidebar: React.FC = () => {
  const { toc, activeChapter, tocVisible, setTocVisible, setActiveChapter } = useReader();

  const handleTocItemClick = (id: string) => {
    setActiveChapter(id);
    setTocVisible(false);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 pt-24 pb-4 transition-transform duration-300 transform md:translate-x-0 bg-card border-r",
          tocVisible ? "translate-x-0" : "-translate-x-full",
          "hidden md:block"
        )}
      >
        <div className="px-3 py-4 h-full overflow-y-auto">
          <h3 className="font-medium text-lg mb-3">Table of Contents</h3>
          {toc.map((item) => (
            <div 
              key={item.id}
              className={cn(
                "toc-item flex justify-between items-center",
                activeChapter === item.id && "active"
              )}
              onClick={() => handleTocItemClick(item.id)}
            >
              <span>{item.title}</span>
              {item.page && <span className="text-xs opacity-60">{item.page}</span>}
            </div>
          ))}
        </div>
      </div>

      {tocVisible && (
        <MobileToc 
          toc={toc} 
          activeChapter={activeChapter} 
          onItemClick={handleTocItemClick} 
          onClose={() => setTocVisible(false)} 
        />
      )}
    </>
  );
};

export default TocSidebar;
