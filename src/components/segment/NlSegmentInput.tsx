
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface NlSegmentInputProps {
  onRulesGenerated: (rules: any[]) => void;
}

export function NlSegmentInput({ onRulesGenerated }: NlSegmentInputProps) {
  const [prompt, setPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a description of the segment you want to create.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    // Simulate AI processing delay
    setTimeout(() => {
      // Mock AI response based on the prompt
      let generatedRules: any[] = [];

      if (prompt.toLowerCase().includes("haven't shopped") || prompt.toLowerCase().includes("inactive")) {
        const days = prompt.match(/(\d+)\s*(?:days|months)/i);
        const dayCount = days ? parseInt(days[1]) : 90;
        
        generatedRules.push({
          id: Date.now(),
          field: "days_since_last_purchase",
          operator: "greater_than",
          value: dayCount.toString(),
        });
      }

      if (prompt.toLowerCase().includes("spent") || prompt.toLowerCase().includes("spend")) {
        const amount = prompt.match(/(\d+)k|\₹\s*(\d+,*\d*)/i);
        const spendAmount = amount ? (amount[1] ? parseInt(amount[1]) * 1000 : amount[2].replace(',', '')) : "5000";
        
        generatedRules.push({
          id: Date.now() + 1,
          field: "total_spend",
          operator: prompt.toLowerCase().includes("less") ? "less_than" : "greater_than",
          value: spendAmount.toString(),
        });
      }

      if (generatedRules.length === 0) {
        // Default fallback if no specific patterns were detected
        generatedRules = [
          {
            id: Date.now(),
            field: "visit_count",
            operator: "greater_than",
            value: "3",
          }
        ];
      }

      onRulesGenerated(generatedRules);
      setIsProcessing(false);
      setPrompt("");
      
      toast({
        title: "Rules generated",
        description: `${generatedRules.length} rule${generatedRules.length !== 1 ? 's' : ''} created from your description.`,
      });
    }, 1200);
  };

  return (
    <div className="flex gap-2">
      <div className="flex-1">
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your audience segment, e.g. 'People who haven't shopped in 6 months and spent over ₹5K'"
        />
      </div>
      <Button
        onClick={handleGenerate}
        disabled={isProcessing || !prompt.trim()}
        className="whitespace-nowrap"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Rules
          </>
        )}
      </Button>
    </div>
  );
}
