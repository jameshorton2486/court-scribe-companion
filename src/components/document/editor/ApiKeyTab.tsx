
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { setOpenAIApiKey, getOpenAIApiKey, testApiKey } from '../enhancer/EnhancementService';
import { toast } from 'sonner';
import { AlertCircle, CheckCircle, Key } from 'lucide-react';

interface ApiKeyTabProps {
  onApiKeyChanged?: () => Promise<void>;
}

const ApiKeyTab: React.FC<ApiKeyTabProps> = ({ onApiKeyChanged }) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [validationResult, setValidationResult] = useState<{ success: boolean; message: string } | null>(null);
  
  useEffect(() => {
    const savedApiKey = getOpenAIApiKey();
    if (savedApiKey) {
      setApiKey(savedApiKey);
      validateApiKey(savedApiKey);
    }
  }, []);
  
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
    setValidationResult(null);
  };
  
  const validateApiKey = async (key: string) => {
    setIsValidating(true);
    
    try {
      const result = await testApiKey();
      setValidationResult(result);
      
      if (result.success) {
        toast.success("API Key Valid", {
          description: "Your OpenAI API key has been validated successfully.",
        });
      } else {
        toast.error("Invalid API Key", {
          description: result.message,
        });
      }
      
      if (onApiKeyChanged) {
        await onApiKeyChanged();
      }
    } catch (error) {
      console.error("API key validation error:", error);
      setValidationResult({
        success: false,
        message: "An error occurred during validation. Please try again."
      });
      
      toast.error("Validation Error", {
        description: "Could not validate the API key. Please try again.",
      });
    } finally {
      setIsValidating(false);
    }
  };
  
  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      toast.error("API Key Required", {
        description: "Please enter an OpenAI API key."
      });
      return;
    }
    
    setOpenAIApiKey(apiKey.trim());
    await validateApiKey(apiKey.trim());
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              <p className="text-sm font-medium">OpenAI API Key</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Enter your OpenAI API key to enable document enhancement features.
              Your key will only be stored in your browser and is never sent to our servers.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Input
              type="password"
              value={apiKey}
              onChange={handleApiKeyChange}
              placeholder="sk-..."
              className="font-mono"
            />
            <Button onClick={handleSaveApiKey} disabled={isValidating}>
              {isValidating ? "Validating..." : "Save Key"}
            </Button>
          </div>
          
          {validationResult && (
            <div className={`flex items-center gap-2 text-sm ${validationResult.success ? 'text-green-600' : 'text-red-600'}`}>
              {validationResult.success ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <p>{validationResult.message}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeyTab;
