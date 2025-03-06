
import PageTransition from "@/components/PageTransition";
import MainNavigation from "@/components/MainNavigation";
import Header from "@/components/home/Header";
import DownloadSection from "@/components/home/DownloadSection";
import InstructionsSection from "@/components/home/InstructionsSection";
import Footer from "@/components/home/Footer";

const Index = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex flex-col">
        <MainNavigation />
        
        <main className="flex-1 container mx-auto px-4 pt-20 pb-8">
          <Header />
          <div className="max-w-4xl mx-auto">
            <DownloadSection />
            <InstructionsSection />
          </div>
        </main>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Index;
