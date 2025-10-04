"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Mic,
  ShoppingCart,
  Car,
  Stethoscope,
  Plane,
  Home,
  Zap,
  Search,
  Star,
  Users,
  MessageCircle,
  LogOut,
  User,
} from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { useAuthApi } from "@/hooks/useApi";

const mockAssistants = [
  {
    id: "1",
    name: "Pat's Food Assistant",
    slug: "pats-food",
    description: "Order from Philadelphia's famous cheesesteaks and local favorites. Knows all the best spots in Center City.",
    category: "food",
    icon: ShoppingCart,
    color: "bg-orange-500",
    rating: 4.8,
    reviews: 1247,
    price: "Free demo",
    isActive: true,
    demoAvailable: true,
  },
  {
    id: "2",
    name: "Philly Rides",
    slug: "philly-rides",
    description: "Book rides, track SEPTA schedules, and navigate Philadelphia traffic like a local.",
    category: "travel",
    icon: Plane,
    color: "bg-blue-500",
    rating: 4.6,
    reviews: 892,
    price: "Free demo",
    isActive: true,
    demoAvailable: true,
  },
  {
    id: "3",
    name: "Health Hub Philly",
    slug: "health-hub",
    description: "Schedule appointments with Philadelphia doctors, find urgent care, and manage prescriptions.",
    category: "healthcare",
    icon: Stethoscope,
    color: "bg-green-500",
    rating: 4.9,
    reviews: 654,
    price: "Free demo",
    isActive: true,
    demoAvailable: true,
  },
  {
    id: "4",
    name: "Auto Assist Philly",
    slug: "auto-assist",
    description: "Find auto parts, schedule repairs, and get roadside assistance from trusted Philadelphia shops.",
    category: "automotive",
    icon: Car,
    color: "bg-red-500",
    rating: 4.7,
    reviews: 423,
    price: "Free demo",
    isActive: true,
    demoAvailable: true,
  },
  {
    id: "5",
    name: "Shop Local Philly",
    slug: "shop-local",
    description: "Discover local stores, compare prices, and support Philadelphia businesses with smart shopping.",
    category: "shopping",
    icon: Home,
    color: "bg-purple-500",
    rating: 4.5,
    reviews: 321,
    price: "Free demo",
    isActive: true,
    demoAvailable: true,
  },
  {
    id: "6",
    name: "Utility Buddy",
    slug: "utility-buddy",
    description: "Manage PGW, PECO, and other utilities. Track usage, pay bills, and get energy-saving tips.",
    category: "utilities",
    icon: Zap,
    color: "bg-yellow-500",
    rating: 4.4,
    reviews: 198,
    price: "Free demo",
    isActive: true,
    demoAvailable: true,
  },
];

const categories = [
  { id: "all", name: "All Categories", count: mockAssistants.length },
  { id: "food", name: "Food & Dining", count: 12 },
  { id: "travel", name: "Travel & Transport", count: 8 },
  { id: "healthcare", name: "Healthcare", count: 6 },
  { id: "automotive", name: "Automotive", count: 5 },
  { id: "shopping", name: "Shopping", count: 9 },
  { id: "utilities", name: "Utilities", count: 4 },
];

export default function MarketplacePage() {
  const { user, isAuthenticated } = useAuthStore();
  const { logoutUser } = useAuthApi();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Mic className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                AI Assistant Marketplace
              </span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/marketplace" className="text-blue-600 font-medium">
                Marketplace
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                About
              </Link>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Pricing
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              {isAuthenticated && user ? (
                <div className="flex items-center space-x-4">
                  <Link href="/marketplace" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      Welcome, {user.firstName || user.email.split('@')[0]}
                    </span>
                  </Link>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-500 text-white">
                      {(user.firstName?.[0] || user.email[0]).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="ghost" onClick={handleLogout} className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                    <LogOut className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" asChild>
                    <Link href="/auth">Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/auth">Get Started</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Your Perfect AI Assistant
          </h1>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Browse our collection of specialized AI assistants designed for Philadelphia life
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search assistants..."
              className="pl-10 bg-white text-gray-900"
            />
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 bg-white dark:bg-gray-800 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={category.id === "all" ? "default" : "outline"}
                className="rounded-full"
              >
                {category.name} ({category.count})
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Assistants Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Featured Assistants
            </h2>
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <span>Sort by:</span>
              <Button variant="ghost" size="sm">Popular</Button>
              <Button variant="ghost" size="sm">Rating</Button>
              <Button variant="ghost" size="sm">Newest</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockAssistants.map((assistant) => (
              <Card key={assistant.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${assistant.color} text-white`}>
                        <assistant.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{assistant.name}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{assistant.rating}</span>
                          </div>
                          <span className="text-sm text-gray-500">({assistant.reviews})</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {assistant.price}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <CardDescription className="text-base mb-4">
                    {assistant.description}
                  </CardDescription>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{assistant.reviews} users</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>Voice enabled</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <Button className="flex-1">
                      Try Demo
                    </Button>
                    <Button variant="outline" size="sm">
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">50+</div>
              <div className="text-blue-100">AI Assistants</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">10K+</div>
              <div className="text-blue-100">Happy Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">500K+</div>
              <div className="text-blue-100">Conversations</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">98%</div>
              <div className="text-blue-100">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Try an Assistant?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            All our AI assistants offer free demos. Experience the power of conversational AI for your daily tasks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-3">
              Browse All Assistants
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3">
              Learn How It Works
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
