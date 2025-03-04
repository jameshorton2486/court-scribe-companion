
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, BookOpen, Download, Upload } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import MainNavigation from "@/components/MainNavigation";

const Index = () => {
  const handleOpenPythonApp = () => {
    // In a production environment, you would:
    // 1. Either use Electron to open the Python app
    // 2. Or redirect to a download page for the Python app
    // 3. Or execute the Python app if it's on the same system
    
    alert("In a real deployment, this would launch the Python application. For now, please run book_processor.py directly.");
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex flex-col">
        <MainNavigation />
        
        <main className="flex-1 container mx-auto px-4 pt-20 pb-8">
          <div className="max-w-4xl mx-auto mt-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold tracking-tight">Book Processor Suite</h1>
              <p className="text-xl text-muted-foreground mt-2">Process, enhance, and read your books with AI assistance</p>
            </div>
            
            <Tabs defaultValue="python" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="python">Python Application</TabsTrigger>
                <TabsTrigger value="web">Web Reader</TabsTrigger>
              </TabsList>
              
              <TabsContent value="python" className="mt-6">
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
                    <Button variant="outline" className="w-full sm:w-auto">
                      <Download className="mr-2 h-4 w-4" />
                      Download Source Code
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="web" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Book className="mr-2 h-6 w-6" />
                      Web Reader
                    </CardTitle>
                    <CardDescription>
                      Read and navigate your processed books in our responsive web reader
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p>
                        After processing your documents with the Python application, use our web reader to 
                        access your content from any device with a modern web browser.
                      </p>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h3 className="font-medium mb-2">Features</h3>
                        <ul className="space-y-1 list-disc list-inside text-sm">
                          <li>Responsive design for all devices</li>
                          <li>Dark/light mode support</li>
                          <li>Interactive table of contents</li>
                          <li>Chapter navigation</li>
                          <li>Reading preferences customization</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full sm:w-auto">
                      <a href="/reader/sample">
                        <Book className="mr-2 h-4 w-4" />
                        Open Web Reader
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        
        <footer className="py-6 border-t">
          <div className="container mx-auto px-4">
            <p className="text-center text-sm text-muted-foreground">
              Book Processor Suite &copy; {new Date().getFullYear()} - All rights reserved
            </p>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
};

export default Index;
