
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookText, Wand2, ListChecks, BookOpen, FileSearch, FileSpreadsheet } from 'lucide-react';

const FeatureCard = ({ icon, title, description }) => {
  const Icon = icon;
  
  return (
    <div className="flex flex-col items-center p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="p-3 rounded-full bg-primary/10 mb-3">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="font-medium text-lg mb-2 text-center">{title}</h3>
      <p className="text-sm text-muted-foreground text-center">{description}</p>
    </div>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: BookText,
      title: "DOCX Processing",
      description: "Load and process DOCX files with automatic text encoding fixes"
    },
    {
      icon: ListChecks,
      title: "TOC Generation",
      description: "Automatically generate a structured table of contents for your book"
    },
    {
      icon: Wand2,
      title: "AI Enhancement",
      description: "Enhance grammar, style, and coherence with AI assistance"
    },
    {
      icon: BookOpen,
      title: "Content Generation",
      description: "Generate complete chapters based on outlines with AI support"
    },
    {
      icon: FileSearch,
      title: "Content Review",
      description: "Get professional feedback on your content with AI analysis"
    },
    {
      icon: FileSpreadsheet,
      title: "Multi-file Support",
      description: "Process multiple documents in batch mode for efficiency"
    }
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-center">Key Features</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeaturesSection;
