
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AiMessageGeneratorProps {
  onSelectMessage: (message: string) => void;
  objective: string;
}

interface MessageVariant {
  id: string;
  text: string;
  tone: string;
}

export function AiMessageGenerator({ onSelectMessage, objective }: AiMessageGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [variants, setVariants] = useState<MessageVariant[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    // Auto-generate on component mount
    handleGenerate();
  }, []);

  const handleGenerate = () => {
    setIsGenerating(true);
    setVariants([]);
    setSelectedId(null);

    // Mock AI message generation
    setTimeout(() => {
      const generatedVariants: MessageVariant[] = [
        {
          id: "1",
          text: "Hi {{name}}, we've missed you! It's been a while since your last purchase. Come back and enjoy 15% off your next order with code: WELCOME15",
          tone: "Friendly",
        },
        {
          id: "2",
          text: "{{name}}, exclusive offer just for you! Since we haven't seen you shopping with us recently, we're offering 10% off your next purchase. Limited time only!",
          tone: "Urgent",
        },
        {
          id: "3",
          text: "We noticed you've been away, {{name}}. Discover our latest collection with free shipping on orders over ₹1000. Your style is waiting!",
          tone: "Professional",
        },
      ];

      setVariants(generatedVariants);
      setIsGenerating(false);
    }, 2000);
  };

  const handleSelectMessage = (variant: MessageVariant) => {
    setSelectedId(variant.id);
    onSelectMessage(variant.text);
    toast({
      title: "Message selected",
      description: "The AI-generated message has been applied to your campaign.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium">AI-generated message suggestions</h3>
          <p className="text-sm text-gray-500">
            Based on your objective: "{objective}"
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            "Regenerate"
          )}
        </Button>
      </div>

      {isGenerating ? (
        <div className="py-12 flex flex-col items-center justify-center text-center">
          <Loader2 className="h-8 w-8 animate-spin mb-2 text-gray-400" />
          <p className="text-gray-500">Generating message variants...</p>
          <p className="text-sm text-gray-400">This may take a few moments</p>
        </div>
      ) : (
        <div className="space-y-4">
          {variants.map((variant) => (
            <Card
              key={variant.id}
              className={`transition-all cursor-pointer hover:shadow-md ${
                selectedId === variant.id ? "border-blue-400 ring-1 ring-blue-200" : ""
              }`}
              onClick={() => handleSelectMessage(variant)}
            >
              <CardContent className="pt-4 relative">
                {selectedId === variant.id && (
                  <CheckCircle2 className="absolute top-3 right-3 h-5 w-5 text-blue-500" />
                )}
                <div className="mb-2 flex items-center">
                  <span className="text-sm font-medium bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                    {variant.tone} Tone
                  </span>
                </div>
                <p className="text-gray-700">{variant.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
