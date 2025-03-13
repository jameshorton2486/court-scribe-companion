import React, { useState, useCallback } from 'react';
import { Document, Chapter } from '../../DocumentUploader';
import { processDocumentEnhancement } from './services/EnhancementProcessorService';
import { logger } from '../utils/loggingService';
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/components/ui/use-toast"
import { useForm } from "react-hook-form"
import { Enhancements } from "@/components/document/enhancer/components/Enhancements"
import PromptSelectionSection from './components/PromptSelectionSection';

interface EnhancementControllerProps {
  document: Document;
  onDocumentEnhanced: (enhancedDocument: Document) => void;
}

const EnhancementController: React.FC<EnhancementControllerProps> = ({ document, onDocumentEnhanced }) => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancementPrompt, setEnhancementPrompt] = useState('');
  const [enhancedDocument, setEnhancedDocument] = useState<Document | null>(null);
  const { toast } = useToast()

  const form = useForm({
    defaultValues: {
      prompt: "",
    },
  })

  const handlePromptChange = useCallback((newPrompt: string) => {
    setEnhancementPrompt(newPrompt);
  }, []);

  const onSubmit = async (values: any) => {
    setIsEnhancing(true);
    logger.info('Starting document enhancement', { document: document.title });

    try {
      const enhancedChapters = await processDocumentEnhancement(document, enhancementPrompt);

      const enhancedDocument: Document = {
        ...document,
        chapters: enhancedChapters,
      };

      setEnhancedDocument(enhancedDocument);
      onDocumentEnhanced(enhancedDocument);

      logger.info('Document enhancement completed', { document: document.title });
      toast({
        title: "You got it!",
        description: "Document enhancement completed.",
      })
    } catch (error) {
      logger.error('Enhancement process failed with error', { error });
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      })
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Document Enhancement</CardTitle>
          <CardDescription>Enhance your document with AI</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enhancement Prompt</FormLabel>
                    <FormControl>
                      <PromptSelectionSection
                        enhancementPrompt={enhancementPrompt}
                        onPromptSelected={handlePromptChange}
                        disabled={false}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter a prompt to guide the AI in enhancing your document.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={isEnhancing} type="submit">
                {isEnhancing ? "Enhancing..." : "Enhance Document"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      {enhancedDocument && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Enhanced Document Preview</h2>
          <Enhancements document={enhancedDocument} />
        </div>
      )}
    </div>
  );
};

export default EnhancementController;
