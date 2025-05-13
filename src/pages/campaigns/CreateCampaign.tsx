
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { SegmentBuilder } from "@/components/segment/SegmentBuilder";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AiMessageGenerator } from "@/components/campaign/AiMessageGenerator";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Campaign name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [audiencePreview, setAudiencePreview] = useState<number | null>(null);
  const [segmentRules, setSegmentRules] = useState<any[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      message: "Hi {{name}}, we have a special offer for you!",
    },
  });

  const onSubmit = (values: FormValues) => {
    // Validate if segment rules exist
    if (segmentRules.length === 0) {
      toast({
        title: "Missing audience segment",
        description: "Please define at least one rule for your audience segment.",
        variant: "destructive",
      });
      return;
    }

    // Simulate campaign creation
    toast({
      title: "Campaign created",
      description: "Your campaign has been created and is being processed.",
    });

    // Navigate to campaign history after short delay
    setTimeout(() => {
      navigate("/campaigns");
    }, 1500);
  };

  const handlePreviewAudience = () => {
    // Simulate audience calculation
    const randomSize = Math.floor(Math.random() * (2500 - 500 + 1)) + 500;
    setAudiencePreview(randomSize);

    toast({
      title: "Audience preview calculated",
      description: `Your segment would target approximately ${randomSize.toLocaleString()} customers.`,
    });
  };

  const handleAiMessage = (message: string) => {
    form.setValue("message", message);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="sm" asChild className="mr-4">
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create Campaign</h1>
          <p className="text-gray-500">Define your audience and craft your message</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Summer Sale Announcement" {...field} />
                    </FormControl>
                    <FormDescription>
                      Give your campaign a descriptive name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description about this campaign's purpose..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Define Audience Segment</h2>
              <SegmentBuilder onRulesChange={setSegmentRules} />
              
              <div className="mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreviewAudience}
                  disabled={segmentRules.length === 0}
                >
                  Preview Audience
                </Button>
                
                {audiencePreview !== null && (
                  <Card className="mt-4">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Estimated audience size</p>
                          <p className="text-2xl font-bold">{audiencePreview.toLocaleString()}</p>
                        </div>
                        <Badge variant="outline" className="px-3 py-1">
                          {audiencePreview > 1000 ? "Large Audience" : "Targeted Audience"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Campaign Message</h2>
            
            <Tabs defaultValue="manual">
              <TabsList>
                <TabsTrigger value="manual">Write Message</TabsTrigger>
                <TabsTrigger value="ai">AI Suggestions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="manual" className="pt-4">
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your campaign message. Use {{name}} to personalize it."
                          className="min-h-[120px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Use {"{{name}}"} and other placeholder variables to personalize your message.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="ai" className="pt-4">
                <AiMessageGenerator 
                  onSelectMessage={handleAiMessage}
                  objective="re-engage inactive customers"
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" asChild>
              <Link to="/campaigns">Cancel</Link>
            </Button>
            <Button type="submit">Create Campaign</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateCampaign;
