
import React from 'react';
import { BookOpen, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Header = () => {
  return (
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
    </div>
  );
};

export default Header;
