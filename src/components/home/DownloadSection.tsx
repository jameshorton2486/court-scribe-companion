
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileDown } from 'lucide-react';
import { toast } from "sonner";

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

const DownloadSection = () => {
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
              <a href="https://github.com/jameshorton2486/court-scribe-companion/releases/latest" target="_blank" rel="noopener noreferrer">
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
  );
};

export default DownloadSection;
