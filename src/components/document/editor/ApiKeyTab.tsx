
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { setOpenAIApiKey, testApiKey } from '../enhancer/EnhancementService';

const ApiKeyTab = () => {
  const [apiKey, setApiKey] = useState('');
  const [apiKeyStatus, setApiKeyStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [testingApiKey, setTestingApiKey] = useState(false);

  const handleTestApiKey = async () => {
    if (!apiKey.trim()) {
      toast.error("API Key Required", {
        description: "Please enter an OpenAI API key to test"
      });
      return;
    }

    setTestingApiKey(true);
    setApiKeyStatus(null);
    setOpenAIApiKey(apiKey);

    try {
      const result = await testApiKey();
      setApiKeyStatus(result);
      
      if (result.success) {
        toast.success("API Key Valid", {
          description: result.message
        });
      } else {
        toast.error("API Key Invalid", {
          description: result.message
        });
      }
    } catch (error) {
      setApiKeyStatus({
        success: false,
        message: "An error occurred while testing the API key"
      });
      toast.error("Connection Error", {
        description: "Could not test the API key. Please try again."
      });
    } finally {
      setTestingApiKey(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">Test OpenAI API Key</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Enter your OpenAI API key to test the connection and enable AI enhancements.
        </p>
        
        <div className="flex space-x-2">
          <Input
            type="password"
            placeholder="Enter OpenAI API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <Button 
            onClick={handleTestApiKey}
            disabled={testingApiKey}
          >
            {testingApiKey ? 
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </> : 
              "Test Key"
            }
          </Button>
        </div>
      </div>
      
      {apiKeyStatus && (
        <Alert variant={apiKeyStatus.success ? "default" : "destructive"}>
          {apiKeyStatus.success ? 
            <CheckCircle className="h-4 w-4" /> : 
            <XCircle className="h-4 w-4" />
          }
          <AlertTitle>
            {apiKeyStatus.success ? "API Key Valid" : "API Key Invalid"}
          </AlertTitle>
          <AlertDescription>
            {apiKeyStatus.message}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ApiKeyTab;
