
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface CampaignInsightsProps {
  campaignId: string;
}

export function CampaignInsights({ campaignId }: CampaignInsightsProps) {
  const [insights, setInsights] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate AI analysis loading
    setIsLoading(true);
    
    const mockInsights = {
      "c1": "Your campaign reached 1,284 users with a 97.3% delivery rate. High-value customers (spend > ₹10K) had a 99% delivery success. We noticed this segment responds best to percentage-based discounts rather than fixed amount offers.",
      "c2": "Your abandoned cart recovery campaign reached 876 users with a 97.5% delivery rate. Customers who abandoned in the last 24 hours had a 15% higher response rate than those from 72+ hours ago.",
      "c3": "Your product launch campaign reached 2,157 users with a 97.3% delivery rate. Fashion enthusiasts engaged most with visual content, with image-based messages performing 22% better than text-only variants.",
      "c4": "Your loyalty program announcement reached 943 users with a 97.7% delivery rate. Frequent shoppers with 5+ orders showed the highest engagement, with a 32% click-through rate."
    };
    
    // Simulate API call delay
    setTimeout(() => {
      if (campaignId in mockInsights) {
        setInsights(mockInsights[campaignId as keyof typeof mockInsights]);
      } else {
        setInsights("Campaign analysis not available.");
      }
      setIsLoading(false);
    }, 1500);
  }, [campaignId]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  return (
    <Card className="bg-blue-50 border-blue-100">
      <CardContent className="pt-4">
        <div className="flex gap-3">
          <div className="bg-blue-100 rounded-full p-1.5 h-fit">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p className="font-medium text-blue-800 mb-1">AI Campaign Analysis</p>
            <p className="text-blue-700 text-sm">{insights}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
