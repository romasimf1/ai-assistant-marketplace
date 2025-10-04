"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Mic,
  ShoppingCart,
  Car,
  Stethoscope,
  Plane,
  Home as HomeIcon,
  Zap,
  Star,
  LogOut,
  User,
} from "lucide-react";

import { useAuthStore } from "@/lib/store";
import { useAuthApi } from "@/hooks/useApi";

const categories = [
  {
    id: "food",
    name: "Food & Dining",
    description: "Order food from local Philadelphia restaurants",
    icon: ShoppingCart,
    color: "bg-orange-500",
    assistants: 12,
  },
  {
    id: "travel",
    name: "Travel & Transportation",
    description: "Book rides, flights, and plan your journeys",
    icon: Plane,
    color: "bg-blue-500",
    assistants: 8,
  },
  {
    id: "healthcare",
    name: "Healthcare",
    description: "Schedule appointments and manage health services",
    icon: Stethoscope,
    color: "bg-green-500",
    assistants: 6,
  },
  {
    id: "automotive",
    name: "Automotive",
    description: "Car repairs, parts, and maintenance services",
    icon: Car,
    color: "bg-red-500",
    assistants: 5,
  },
  {
    id: "shopping",
    name: "Shopping & Retail",
    description: "Find products and compare prices locally",
    icon: HomeIcon,
    color: "bg-purple-500",
    assistants: 9,
  },
  {
    id: "utilities",
    name: "Utilities & Services",
    description: "Manage bills, utilities, and home services",
    icon: Zap,
    color: "bg-yellow-500",
    assistants: 4,
  },
];

export default function Home() {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Mic className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              AI Assistant Marketplace
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/marketplace" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
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
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-4">
            🏆 Philadelphia&apos;s #1 AI Assistant Platform
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Your Personal AI Assistant
            <span className="text-blue-600 block">for Every Task</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Connect with specialized AI-powered voice assistants for food ordering, travel booking,
            healthcare appointments, automotive services, and more. All tailored for Philadelphia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-3">
              Try Free Demo
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3">
              Browse Assistants
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 bg-white/50 dark:bg-gray-800/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Assistant Category
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              From food delivery to car repairs, find the perfect AI assistant for your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${category.color} text-white`}>
                      <category.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="group-hover:text-blue-600 transition-colors">
                        {category.name}
                      </CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {category.assistants} assistants
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {category.description}
                  </CardDescription>
                  <Button variant="ghost" className="mt-4 p-0 h-auto font-semibold text-blue-600 hover:text-blue-700">
                    Explore assistants →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Our AI Assistants?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Mic className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Natural Voice Conversations</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Chat naturally with AI assistants that understand Philadelphia context and local preferences.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Star className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Demo Testing</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Try any assistant before committing. Experience the power of AI without upfront costs.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <HomeIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Philadelphia Focused</h3>
              <p className="text-gray-600 dark:text-gray-300">
                All assistants are trained on local knowledge, from sports venues to neighborhood dining.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Experience the Future?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of Philadelphia residents who are already using AI assistants for their daily tasks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-blue-600">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Mic className="h-6 w-6" />
                <span className="text-xl font-bold">AI Assistant Marketplace</span>
              </div>
              <p className="text-gray-400">
                Democratizing access to AI-powered services in Philadelphia and beyond.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/marketplace" className="hover:text-white">Marketplace</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/api" className="hover:text-white">API Docs</Link></li>
                <li><Link href="/enterprise" className="hover:text-white">Enterprise</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/press" className="hover:text-white">Press Kit</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 AI Assistant Marketplace. Made with ❤️ in Philadelphia, PA.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
