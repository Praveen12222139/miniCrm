
import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft, Code } from "lucide-react";

const ApiDocs = () => {
  const [activeTab, setActiveTab] = useState("ingestion");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="sm" asChild className="mr-4">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">API Documentation</h1>
            <p className="text-gray-500">Reference for data ingestion and campaign delivery</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="w-full max-w-md">
            <TabsTrigger value="ingestion">Data Ingestion</TabsTrigger>
            <TabsTrigger value="campaigns">Campaign API</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          </TabsList>

          <TabsContent value="ingestion">
            <Card>
              <CardHeader>
                <CardTitle>Customer Data Ingestion</CardTitle>
                <CardDescription>
                  REST APIs for ingesting customer and order data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">POST /api/customers</h3>
                  <Card className="bg-zinc-950 text-white p-4">
                    <pre className="whitespace-pre-wrap text-sm">
{`// Request Body
{
  "name": "John Smith",
  "email": "john.smith@example.com",
  "phone": "+911234567890",
  "city": "Mumbai",
  "loyalty_tier": "gold",
  "first_purchase_date": "2023-01-15"
}`}
                    </pre>
                  </Card>
                </div>
                <div>
                  <h3 className="font-medium mb-2">POST /api/orders</h3>
                  <Card className="bg-zinc-950 text-white p-4">
                    <pre className="whitespace-pre-wrap text-sm">
{`// Request Body
{
  "customer_id": "cust_12345",
  "order_id": "ord_98765",
  "amount": 1250.50,
  "currency": "INR",
  "date": "2024-05-12T14:30:00Z",
  "items": [
    {
      "product_id": "prod_111",
      "name": "Cotton T-Shirt",
      "quantity": 2,
      "price": 499.50,
      "category": "apparel"
    },
    {
      "product_id": "prod_222",
      "name": "Denim Jeans",
      "quantity": 1,
      "price": 999.00,
      "category": "apparel"
    }
  ],
  "payment_method": "credit_card",
  "shipping_address": {
    "city": "Mumbai",
    "state": "Maharashtra",
    "country": "IN",
    "pincode": "400001"
  }
}`}
                    </pre>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campaigns">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Management API</CardTitle>
                <CardDescription>
                  APIs for creating and managing campaigns
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">POST /api/campaigns</h3>
                  <Card className="bg-zinc-950 text-white p-4">
                    <pre className="whitespace-pre-wrap text-sm">
{`// Request Body
{
  "name": "Summer Sale 2024",
  "message": "Hi {{name}}, enjoy 20% off on your next purchase!",
  "segment": {
    "rules": [
      {
        "field": "days_since_last_purchase",
        "operator": "greater_than",
        "value": "90"
      },
      {
        "field": "total_spend",
        "operator": "greater_than",
        "value": "5000"
      }
    ],
    "operator": "AND"
  },
  "schedule": {
    "send_at": "2024-06-01T09:00:00Z",
    "timezone": "Asia/Kolkata"
  }
}`}
                    </pre>
                  </Card>
                </div>
                <div>
                  <h3 className="font-medium mb-2">GET /api/campaigns/:id/stats</h3>
                  <Card className="bg-zinc-950 text-white p-4">
                    <pre className="whitespace-pre-wrap text-sm">
{`// Response
{
  "campaign_id": "camp_12345",
  "audience_size": 1284,
  "sent": 1249,
  "failed": 35,
  "delivery_rate": 97.3,
  "segments_breakdown": [
    {
      "segment": "High Value Customers",
      "count": 432,
      "delivery_rate": 99.1
    },
    {
      "segment": "Inactive Customers",
      "count": 852,
      "delivery_rate": 96.4
    }
  ]
}`}
                    </pre>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="webhooks">
            <Card>
              <CardHeader>
                <CardTitle>Webhook Endpoints</CardTitle>
                <CardDescription>
                  Webhook integrations for delivery receipts and event tracking
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="mb-4">
                  <p>
                    Configure your webhook endpoints to receive real-time updates for message delivery status
                    and customer events.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Delivery Receipt Webhook</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    This webhook is triggered when a message delivery status is updated
                  </p>
                  <Card className="bg-zinc-950 text-white p-4">
                    <pre className="whitespace-pre-wrap text-sm">
{`// Webhook Payload
{
  "event": "message.status_updated",
  "delivery_id": "del_98765",
  "campaign_id": "camp_12345",
  "customer_id": "cust_54321",
  "status": "delivered",
  "timestamp": "2024-05-12T15:23:45Z",
  "metadata": {
    "vendor": "sms_gateway_1",
    "message_id": "msg_112233"
  }
}`}
                    </pre>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              API Integration Example
            </CardTitle>
            <CardDescription>
              Sample code for integrating with our APIs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Card className="bg-zinc-950 text-white p-4">
              <pre className="whitespace-pre-wrap text-sm">
{`// JavaScript Example
async function createCampaign() {
  const response = await fetch('https://api.example.com/api/campaigns', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_API_KEY'
    },
    body: JSON.stringify({
      name: "Re-engagement Campaign",
      message: "Hi {{name}}, we miss you! Come back for a special offer.",
      segment: {
        rules: [
          {
            field: "days_since_last_purchase",
            operator: "greater_than",
            value: "90"
          }
        ]
      }
    })
  });
  
  const data = await response.json();
  console.log('Campaign created:', data);
}`}
              </pre>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApiDocs;
