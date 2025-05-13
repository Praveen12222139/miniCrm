
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronDown, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CampaignInsights } from "@/components/campaign/CampaignInsights";

// Mock campaign data
const mockCampaigns = [
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

const CampaignHistory = () => {
  const [campaigns, setCampaigns] = useState(mockCampaigns);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);

  // Filter campaigns based on search query
  const filteredCampaigns = campaigns.filter(
    (campaign) =>
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.segmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "pending":
        return "bg-amber-500";
      case "failed":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
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
          <h1 className="text-2xl font-bold">Campaign History</h1>
          <p className="text-gray-500">View and analyze your past campaigns</p>
        </div>
      </div>

      {selectedCampaign && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Campaign Insights</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setSelectedCampaign(null)}>
                Close
              </Button>
            </div>
            <CardDescription>
              AI-generated analysis for campaign performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CampaignInsights campaignId={selectedCampaign} />
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search campaigns..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Filter
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setCampaigns([...campaigns].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))}>
                Sort by Date (Newest)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCampaigns([...campaigns].sort((a, b) => b.audienceSize - a.audienceSize))}>
                Sort by Audience Size
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button asChild>
            <Link to="/campaigns/create">New Campaign</Link>
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign Name</TableHead>
              <TableHead>Segment</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Tag</TableHead>
              <TableHead className="text-right">Audience</TableHead>
              <TableHead className="text-right">Sent</TableHead>
              <TableHead className="text-right">Failed</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCampaigns.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell className="font-medium">{campaign.name}</TableCell>
                <TableCell>{campaign.segmentName}</TableCell>
                <TableCell>{formatDate(campaign.createdAt)}</TableCell>
                <TableCell>
                  <Badge variant="outline">{campaign.tag}</Badge>
                </TableCell>
                <TableCell className="text-right">{campaign.audienceSize.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <span className="text-green-600">{campaign.sent.toLocaleString()}</span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-red-600">{campaign.failed.toLocaleString()}</span>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCampaign(campaign.id)}
                  >
                    View Insights
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CampaignHistory;
