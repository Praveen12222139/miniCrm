
// This is a mock API service that simulates communication with a backend

// Mock delay helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Endpoints
export const api = {
  // Campaign related endpoints
  campaigns: {
    // Create a new campaign
    create: async (campaign: any): Promise<any> => {
      await delay(1000); // Simulate network delay
      console.log('API: Creating campaign', campaign);
      return {
        id: 'camp_' + Math.random().toString(36).substring(2, 10),
        ...campaign,
        createdAt: new Date().toISOString(),
        status: 'pending'
      };
    },
    
    // Get all campaigns
    getAll: async (): Promise<any[]> => {
      await delay(800);
      // Return mock data
      return [
        {
          id: "c1",
          name: "Summer Sale Promotion",
          segmentName: "High Value Customers",
          createdAt: "2023-06-15T10:30:00",
          status: "completed",
          audienceSize: 1284,
          sent: 1249,
          failed: 35,
          tag: "Promotion",
        },
        {
          id: "c2",
          name: "Abandoned Cart Recovery",
          segmentName: "Recent Abandoners",
          createdAt: "2023-06-10T14:45:00",
          status: "completed",
          audienceSize: 876,
          sent: 854,
          failed: 22,
          tag: "Re-engagement",
        },
        {
          id: "c3",
          name: "New Product Launch",
          segmentName: "Fashion Enthusiasts",
          createdAt: "2023-06-05T09:15:00",
          status: "completed",
          audienceSize: 2157,
          sent: 2098,
          failed: 59,
          tag: "Product Launch",
        },
        {
          id: "c4",
          name: "Loyalty Program Announcement",
          segmentName: "Frequent Shoppers",
          createdAt: "2023-06-01T11:20:00",
          status: "completed",
          audienceSize: 943,
          sent: 921,
          failed: 22,
          tag: "Loyalty",
        },
      ];
    },
    
    // Get campaign by id
    getById: async (id: string): Promise<any> => {
      await delay(500);
      // Mock a single campaign
      return {
        id,
        name: "Sample Campaign",
        segmentName: "Test Segment",
        createdAt: "2024-05-10T10:30:00",
        status: "completed",
        audienceSize: 500,
        sent: 485,
        failed: 15,
        tag: "Test",
      };
    }
  },
  
  // Customer related endpoints
  customers: {
    // Get all customers
    getAll: async (): Promise<any[]> => {
      await delay(800);
      // Return mock data
      return [
        {
          id: "1",
          name: "Jane Cooper",
          email: "jane.cooper@example.com",
          status: "active",
          lastPurchase: "2024-04-23",
          totalSpent: "$1,224.50",
        },
        {
          id: "2",
          name: "Wade Warren",
          email: "wade.warren@example.com",
          status: "inactive",
          lastPurchase: "2023-11-14",
          totalSpent: "$684.25",
        },
        {
          id: "3",
          name: "Esther Howard",
          email: "esther.howard@example.com",
          status: "active",
          lastPurchase: "2024-05-08",
          totalSpent: "$3,102.75",
        },
        {
          id: "4",
          name: "Cameron Williamson",
          email: "cameron.williamson@example.com",
          status: "active",
          lastPurchase: "2024-04-30",
          totalSpent: "$896.00",
        },
        {
          id: "5",
          name: "Brooklyn Simmons",
          email: "brooklyn.simmons@example.com",
          status: "inactive",
          lastPurchase: "2023-09-22",
          totalSpent: "$425.50",
        },
      ];
    },
    
    // Get customer by id
    getById: async (id: string): Promise<any> => {
      await delay(500);
      // Mock a single customer
      return {
        id,
        name: "Sample Customer",
        email: "sample@example.com",
        status: "active",
        lastPurchase: "2024-05-01",
        totalSpent: "$750.25",
      };
    }
  },
  
  // Segment related endpoints
  segments: {
    // Preview audience size based on rules
    previewAudience: async (rules: any[]): Promise<number> => {
      await delay(1200);
      // Generate a random but realistic audience size based on rules
      const baseSize = 500 + Math.floor(Math.random() * 2000);
      const multiplier = Math.max(0.1, Math.min(2, rules.length * 0.5));
      return Math.floor(baseSize * multiplier);
    },
    
    // Create a new segment
    create: async (segment: any): Promise<any> => {
      await delay(1000);
      return {
        id: 'seg_' + Math.random().toString(36).substring(2, 10),
        ...segment,
        createdAt: new Date().toISOString()
      };
    }
  },
  
  // Communication related endpoints
  communication: {
    // Simulate vendor API for message delivery
    sendMessages: async (campaignId: string, audienceSize: number): Promise<any> => {
      await delay(2000);
      // Simulate ~90% success rate
      const failedCount = Math.floor(audienceSize * 0.08 + Math.random() * audienceSize * 0.04);
      const sentCount = audienceSize - failedCount;
      
      return {
        campaignId,
        audienceSize,
        sent: sentCount,
        failed: failedCount,
        deliveryId: 'del_' + Math.random().toString(36).substring(2, 10)
      };
    },
    
    // Delivery receipt endpoint
    updateDeliveryStatus: async (deliveryId: string, status: 'delivered' | 'failed'): Promise<any> => {
      await delay(300);
      return {
        deliveryId,
        status,
        updatedAt: new Date().toISOString()
      };
    }
  },
  
  // AI-related endpoints
  ai: {
    // Generate message suggestions
    generateMessageSuggestions: async (objective: string): Promise<any[]> => {
      await delay(1500);
      // Return mock AI-generated messages
      return [
        {
          id: "1",
          text: `Hi {{name}}, we've missed you! It's been a while since your last purchase. Come back and enjoy 15% off your next order with code: WELCOME15`,
          tone: "Friendly",
        },
        {
          id: "2",
          text: `{{name}}, exclusive offer just for you! Since we haven't seen you shopping with us recently, we're offering 10% off your next purchase. Limited time only!`,
          tone: "Urgent",
        },
        {
          id: "3",
          text: `We noticed you've been away, {{name}}. Discover our latest collection with free shipping on orders over ₹1000. Your style is waiting!`,
          tone: "Professional",
        },
      ];
    },
    
    // Generate segment rules from natural language
    generateRulesFromText: async (text: string): Promise<any[]> => {
      await delay(1200);
      // Parse the text and generate rules
      const rules = [];
      
      // Check for inactivity patterns
      if (text.toLowerCase().includes("haven't shopped") || text.toLowerCase().includes("inactive")) {
        const days = text.match(/(\d+)\s*(?:days|months)/i);
        const dayCount = days ? parseInt(days[1]) : 90;
        
        rules.push({
          id: Date.now(),
          field: "days_since_last_purchase",
          operator: "greater_than",
          value: dayCount.toString(),
        });
      }
      
      // Check for spending patterns
      if (text.toLowerCase().includes("spent") || text.toLowerCase().includes("spend")) {
        const amount = text.match(/(\d+)k|\₹\s*(\d+,*\d*)/i);
        const spendAmount = amount ? (amount[1] ? parseInt(amount[1]) * 1000 : amount[2].replace(',', '')) : "5000";
        
        rules.push({
          id: Date.now() + 1,
          field: "total_spend",
          operator: text.toLowerCase().includes("less") ? "less_than" : "greater_than",
          value: spendAmount.toString(),
        });
      }
      
      // Fallback if no patterns detected
      if (rules.length === 0) {
        rules.push({
          id: Date.now(),
          field: "visit_count",
          operator: "greater_than",
          value: "3",
        });
      }
      
      return rules;
    },
    
    // Generate campaign insights
    generateCampaignInsights: async (campaignId: string): Promise<string> => {
      await delay(1000);
      // Return mock insights based on campaign ID
      const insights = {
        "c1": "Your campaign reached 1,284 users with a 97.3% delivery rate. High-value customers (spend > ₹10K) had a 99% delivery success. We noticed this segment responds best to percentage-based discounts rather than fixed amount offers.",
        "c2": "Your abandoned cart recovery campaign reached 876 users with a 97.5% delivery rate. Customers who abandoned in the last 24 hours had a 15% higher response rate than those from 72+ hours ago.",
        "c3": "Your product launch campaign reached 2,157 users with a 97.3% delivery rate. Fashion enthusiasts engaged most with visual content, with image-based messages performing 22% better than text-only variants.",
        "c4": "Your loyalty program announcement reached 943 users with a 97.7% delivery rate. Frequent shoppers with 5+ orders showed the highest engagement, with a 32% click-through rate."
      };
      
      return insights[campaignId as keyof typeof insights] || "Campaign analysis not available at this time.";
    },
    
    // Auto-tag campaigns
    generateCampaignTags: async (campaign: any): Promise<string[]> => {
      await delay(800);
      // Generate tags based on campaign properties
      const tags = [];
      
      if (campaign.name.toLowerCase().includes("sale") || campaign.name.toLowerCase().includes("discount")) {
        tags.push("Promotion");
      }
      
      if (campaign.name.toLowerCase().includes("loyalty")) {
        tags.push("Loyalty");
      }
      
      if (campaign.name.toLowerCase().includes("abandoned") || campaign.audience?.includes("inactive")) {
        tags.push("Re-engagement");
      }
      
      if (campaign.name.toLowerCase().includes("launch") || campaign.name.toLowerCase().includes("new")) {
        tags.push("Product Launch");
      }
      
      // Add a fallback tag if none were detected
      if (tags.length === 0) {
        tags.push("General");
      }
      
      return tags;
    }
  }
};
