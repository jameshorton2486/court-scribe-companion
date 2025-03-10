
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import DocumentManager from "@/components/document/DocumentManager";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="document-enhancer-theme">
      <div className="min-h-screen bg-background p-4 md:p-8">
        <header className="container mx-auto mb-8">
          <h1 className="text-3xl font-bold text-center">Document Enhancer</h1>
          <p className="text-center text-muted-foreground">
            Upload a document, edit content by chapter, and enhance it with AI
          </p>
        </header>
        
        <main className="container mx-auto max-w-4xl">
          <DocumentManager />
        </main>
        
        <footer className="container mx-auto mt-12 text-center text-sm text-muted-foreground">
          <p>Document Enhancer &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
      <Toaster position="top-center" />
    </ThemeProvider>
  );
}

export default App;
