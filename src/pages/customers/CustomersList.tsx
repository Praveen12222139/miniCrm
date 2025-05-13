
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Plus, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";

// Mock customer data
const mockCustomers = [
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

const CustomersList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredCustomers = mockCustomers.filter((customer) => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <h1 className="text-2xl font-bold">Customer Management</h1>
            <p className="text-gray-500">View and manage your customer data</p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input 
              placeholder="Search customers..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Customer List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Purchase</TableHead>
                  <TableHead>Total Spent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium flex items-center">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <UserRound className="h-4 w-4 text-blue-700" />
                        </div>
                        {customer.name}
                      </TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>
                        <Badge variant={customer.status === "active" ? "default" : "outline"}>
                          {customer.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{customer.lastPurchase}</TableCell>
                      <TableCell>{customer.totalSpent}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No customers found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomersList;
