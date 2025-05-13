
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { PieChart, Database, Users, Mail, Code } from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { useAuth } from "@/context/AuthContext";

// Mock data for dashboard stats
const stats = [
  { label: "Total Customers", value: "1,248", icon: Users, color: "bg-blue-500" },
  { label: "Total Orders", value: "3,427", icon: Database, color: "bg-green-500" },
  { label: "Active Campaigns", value: "7", icon: Mail, color: "bg-amber-500" },
  { label: "Delivery Rate", value: "94%", icon: PieChart, color: "bg-violet-500" },
];

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Set page title
    document.title = 'miniCrm - Customer Relationship Management';
    
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleWelcome = () => {
    toast({
      title: "Welcome to miniCrm",
      description: "Start by creating your first customer segment.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">miniCrm</h1>
            <span className="text-sm text-gray-600">Welcome back, {user?.name}</span>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleWelcome} variant="outline">
              Welcome
            </Button>
            <Button asChild>
              <Link to="/campaigns/create">Create Campaign</Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm font-medium text-gray-500">{stat.label}</CardTitle>
                  <div className={`${stat.color} p-2 rounded-lg`}>
                    <stat.icon className="h-4 w-4 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaigns</CardTitle>
              <CardDescription>Create and manage your marketing campaigns</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <p className="text-gray-500">
                Target specific customer segments with personalized messaging.
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link to="/campaigns">View Campaigns</Link>
              </Button>
              <Button asChild>
                <Link to="/campaigns/create">Create Campaign</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Data</CardTitle>
              <CardDescription>View and analyze your customer information</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <p className="text-gray-500">
                Explore customer profiles, purchasing patterns, and engagement metrics.
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link to="/customers">View Customers</Link>
              </Button>
              <Button asChild>
                <Link to="/campaigns/create">Create Segment</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                <CardTitle>API Documentation</CardTitle>
              </div>
              <CardDescription>Access the developer resources</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <p className="text-gray-500">
                Browse API reference, webhooks, and integration guides.
              </p>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline" asChild>
                <Link to="/api-docs">View Documentation</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
