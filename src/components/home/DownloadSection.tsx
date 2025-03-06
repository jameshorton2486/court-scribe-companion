
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileDown, ExternalLink, AlertTriangle } from 'lucide-react';
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
  // Function to redirect to the GitHub releases page
  // Note: We're changing the approach since the direct download link isn't working
  const handleDownloadRedirect = () => {
    try {
      // Instead of trying to download directly, we'll redirect to the releases page
      const githubReleasesUrl = 'https://github.com/jameshorton2486/court-scribe-companion/releases';
      
      toast.info("Redirecting to GitHub", {
        description: "You'll be redirected to GitHub where you can download the latest release."
      });
      
      // Open GitHub releases page in a new tab
      window.open(githubReleasesUrl, '_blank');
    } catch (error) {
      console.error("Redirect error:", error);
      toast.error("Redirect failed", {
        description: "There was a problem opening the GitHub page. Please try visiting the link directly."
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
          Download the application source code from GitHub
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-2">
          <p>Click the button below to download the Book Processor application:</p>
          
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-md flex items-start mb-4">
            <AlertTriangle className="text-amber-500 h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-sm text-amber-800">
              The direct download link is currently unavailable. Please use the GitHub releases page to download the application.
            </p>
          </div>
          
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 mt-4">
            <Button size="lg" className="w-full" onClick={handleDownloadRedirect}>
              <Github className="mr-2 h-5 w-5" />
              Download from GitHub Releases
            </Button>
            <Button variant="outline" size="lg" className="w-full" asChild>
              <a href="https://github.com/jameshorton2486/court-scribe-companion" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-5 w-5" />
                View Repository
              </a>
            </Button>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h3 className="font-medium text-lg mb-2">Installation Requirements</h3>
          <p className="text-muted-foreground">
            The Book Processor is a Python application that requires Python 3.7+ to be installed on your system.
            After downloading, extract the ZIP file and follow the installation instructions in the README.
          </p>
        </div>
        
        <div className="mt-6 border border-dashed border-primary/20 rounded-lg p-4">
          <h3 className="font-medium text-lg mb-2 flex items-center">
            <Github className="mr-2 h-5 w-5" />
            Using GitHub Desktop
          </h3>
          <p className="text-sm mb-3">
            Prefer a visual interface for managing your repository? Follow these steps:
          </p>
          <ol className="list-decimal list-inside text-sm space-y-2 text-muted-foreground">
            <li>Download and install <a href="https://desktop.github.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GitHub Desktop</a></li>
            <li>Go to <a href="https://github.com/jameshorton2486/court-scribe-companion" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">the repository</a> and click "Code" → "Open with GitHub Desktop"</li>
            <li>Choose where to save the repository on your computer</li>
            <li>Make changes locally using your favorite code editor</li>
            <li>Use GitHub Desktop to commit and push your changes back to GitHub</li>
          </ol>
          <div className="mt-3">
            <Button variant="link" size="sm" className="h-auto p-0" asChild>
              <a href="https://docs.github.com/en/desktop/installing-and-configuring-github-desktop/overview/getting-started-with-github-desktop" target="_blank" rel="noopener noreferrer" className="flex items-center">
                Learn more about GitHub Desktop
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DownloadSection;
