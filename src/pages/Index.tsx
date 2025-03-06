
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BookOpen, Code, FileDown, Terminal, Info, Download } from "lucide-react";
import { toast } from "sonner";
import PageTransition from "@/components/PageTransition";
import MainNavigation from "@/components/MainNavigation";

const Index = () => {
  // Function to handle direct download
  const handleDirectDownload = () => {
    try {
      // Create a blob with the code content
      const zipFileUrl = '/lovable-uploads/3431316b-947c-4e9d-b6ac-6edf0b9f9f19.png';
      
      // Create a temporary anchor element
      const link = document.createElement('a');
      link.href = zipFileUrl;
      link.download = 'book-processor.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Download started", {
        description: "Once complete, extract the ZIP file and follow the installation instructions."
      });
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Download failed", {
        description: "There was a problem downloading the file. Please try again later."
      });
    }
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
            
            <Alert className="mb-6 border-yellow-500 bg-yellow-50 text-yellow-900">
              <Info className="h-5 w-5 text-yellow-600" />
              <AlertTitle className="font-bold">Important: This is a Desktop Application</AlertTitle>
              <AlertDescription className="mt-2">
                <p className="mb-2">This website is just information about the Book Processor application. The application itself is a <strong>Python program that runs on your computer</strong>, not a web app.</p>
                <p>To use it, download the source code below, then follow the installation instructions.</p>
              </AlertDescription>
            </Alert>
            
            <Card className="mb-6">
              <CardHeader className="bg-primary/5">
                <CardTitle className="flex items-center">
                  <Download className="mr-2 h-6 w-6" />
                  Download Application
                </CardTitle>
                <CardDescription>
                  Download the application source code directly from this page
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p>Click the button below to download the Book Processor application source code:</p>
                  <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 mt-4">
                    <Button size="lg" className="w-full" onClick={handleDirectDownload}>
                      <FileDown className="mr-2 h-5 w-5" />
                      Download Book Processor (ZIP)
                    </Button>
                    <Button variant="outline" size="lg" className="w-full" asChild>
                      <a href="https://github.com/microsoft/BookProcessor/releases/latest" target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 h-5 w-5" />
                        Alternative Download (GitHub)
                      </a>
                    </Button>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h3 className="font-medium text-lg mb-2">Note about Downloads</h3>
                  <p className="text-muted-foreground">
                    If you have trouble with the direct download, please try the GitHub alternative link. 
                    The application is a Python application that requires Python 3.7+ to be installed on your system.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Terminal className="mr-2 h-6 w-6" />
                  How to Run the Book Processor Application
                </CardTitle>
                <CardDescription>
                  The Book Processor is a desktop Python application that runs locally on your computer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-medium mb-2 text-lg">Installation Steps:</h3>
                    <ol className="space-y-3 list-decimal list-inside">
                      <li className="pl-2">
                        <span className="font-medium">Download the source code</span>
                        <p className="text-sm text-muted-foreground mt-1 ml-6">
                          Use the download button at the top of this page.
                        </p>
                      </li>
                      <li className="pl-2">
                        <span className="font-medium">Install Python 3.7+</span>
                        <p className="text-sm text-muted-foreground mt-1 ml-6">
                          If you don't have Python installed, download it from <a href="https://www.python.org/downloads/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">python.org</a>
                        </p>
                      </li>
                      <li className="pl-2">
                        <span className="font-medium">Install dependencies</span>
                        <p className="text-sm text-muted-foreground mt-1 ml-6">
                          Open a terminal/command prompt in the downloaded folder and run:
                        </p>
                        <pre className="bg-black text-white p-2 rounded text-sm mt-1 ml-6 overflow-x-auto">
                          pip install -r requirements.txt
                        </pre>
                      </li>
                      <li className="pl-2">
                        <span className="font-medium">Run the application</span>
                        <p className="text-sm text-muted-foreground mt-1 ml-6">
                          In the same terminal/command prompt, run:
                        </p>
                        <pre className="bg-black text-white p-2 rounded text-sm mt-1 ml-6 overflow-x-auto">
                          python book_processor.py
                        </pre>
                      </li>
                    </ol>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-medium mb-2 text-lg">Using Multiple Files:</h3>
                    <p className="mb-2">The Book Processor supports multiple input files:</p>
                    <ol className="space-y-2 list-decimal list-inside">
                      <li className="pl-2">
                        <span>Launch the application using the steps above</span>
                      </li>
                      <li className="pl-2">
                        <span>In the "File Processing" tab, click "Add Files" to select multiple DOCX or text files</span>
                      </li>
                      <li className="pl-2">
                        <span>Use the file list to manage your input files (add/remove)</span>
                      </li>
                      <li className="pl-2">
                        <span>Select a file from the list and click "Load Selected Document" to process it</span>
                      </li>
                      <li className="pl-2">
                        <span>Alternatively, use "Batch Process All Files" to process all files at once</span>
                      </li>
                    </ol>
                    <div className="mt-4">
                      <img 
                        src="/lovable-uploads/3431316b-947c-4e9d-b6ac-6edf0b9f9f19.png" 
                        alt="Book Processor UI" 
                        className="rounded-md border border-border w-full object-cover max-h-64 object-top"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
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

// Custom Github icon component
const Github = ({ className, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export default Index;
