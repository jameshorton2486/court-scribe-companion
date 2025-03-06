
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Terminal } from 'lucide-react';

const InstructionsSection = () => {
  return (
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
  );
};

export default InstructionsSection;
