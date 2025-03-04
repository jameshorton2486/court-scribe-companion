
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Download, FileDown, Github } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import MainNavigation from "@/components/MainNavigation";

const Index = () => {
  const handleOpenPythonApp = () => {
    alert("In a real deployment, this would launch the Python application. For now, please run book_processor.py directly.");
  };

  const handleDownloadSource = () => {
    // This would download the source code zip file in a real application
    alert("This would download the Python source code in a real deployment.");
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex flex-col">
        <MainNavigation />
        
        <main className="flex-1 container mx-auto px-4 pt-20 pb-8">
          <div className="max-w-4xl mx-auto mt-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold tracking-tight">Book Processor Application</h1>
              <p className="text-xl text-muted-foreground mt-2">Process, enhance, and analyze large documents with AI assistance</p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-6 w-6" />
                  Book Processor Application
                </CardTitle>
                <CardDescription>
                  Our desktop Python application for processing large documents and generating AI-assisted content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Features</h3>
                      <ul className="space-y-1 list-disc list-inside text-sm">
                        <li>Process documents with thousands of pages</li>
                        <li>AI-assisted table of contents generation</li>
                        <li>Content enhancement and formatting</li>
                        <li>Chapter extraction and organization</li>
                        <li>Comprehensive document analysis</li>
                      </ul>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Requirements</h3>
                      <ul className="space-y-1 list-disc list-inside text-sm">
                        <li>Python 3.7 or higher</li>
                        <li>Tkinter (included with most Python installations)</li>
                        <li>Required libraries: docx, openai</li>
                        <li>OpenAI API key for AI features</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Getting Started</h3>
                    <ol className="space-y-1 list-decimal list-inside text-sm">
                      <li>Install Python 3.7 or higher if not already installed</li>
                      <li>Install required dependencies with <code>pip install -r requirements.txt</code></li>
                      <li>Run the application with <code>python book_processor.py</code></li>
                      <li>Load your document using the File Processing tab</li>
                      <li>Process your document and generate AI-assisted table of contents</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                <Button 
                  className="w-full sm:w-auto" 
                  onClick={handleOpenPythonApp}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Launch Application
                </Button>
                <Button variant="outline" className="w-full sm:w-auto" onClick={handleDownloadSource}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Source Code
                </Button>
                <Button variant="secondary" className="w-full sm:w-auto" asChild>
                  <a href="https://github.com/your-repo/book-processor" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    View on GitHub
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
        
        <footer className="py-6 border-t">
          <div className="container mx-auto px-4">
            <p className="text-center text-sm text-muted-foreground">
              Book Processor Application &copy; {new Date().getFullYear()} - All rights reserved
            </p>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
};

export default Index;
