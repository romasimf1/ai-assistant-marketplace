"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Star,
  Clock,
  CheckCircle,
  X
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
}

const demoMessages: Message[] = [
  {
    id: "1",
    content: "Hi! I'm Pat's Food Assistant. I can help you order delicious cheesesteaks and other Philadelphia favorites. What would you like to order today?",
    isUser: false,
    timestamp: new Date(Date.now() - 60000),
  },
  {
    id: "2",
    content: "I'd like to order a cheesesteak from Pat's",
    isUser: true,
    timestamp: new Date(Date.now() - 55000),
  },
  {
    id: "3",
    content: "Great choice! Pat's King of Steaks is a Philadelphia institution. Would you like the original cheesesteak with onions, or would you prefer it without onions? Also, what location would you like to pick up from?",
    isUser: false,
    timestamp: new Date(Date.now() - 50000),
  },
  {
    id: "4",
    content: "Original with onions, pickup from the 9th Street location",
    isUser: true,
    timestamp: new Date(Date.now() - 45000),
  },
  {
    id: "5",
    content: "Perfect! I've placed your order for an original cheesesteak with onions for pickup at Pat's 9th Street location. Your order number is #PHL-2024-001. It should be ready in about 10-15 minutes. The total comes to $12.99. Would you like to add fries or a drink?",
    isUser: false,
    timestamp: new Date(Date.now() - 40000),
  },
];

export default function AssistantDemoPage() {
  const [messages, setMessages] = useState<Message[]>(demoMessages);
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
      status: 'sending',
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue("");

    // Simulate response after a delay
    setTimeout(() => {
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Thanks for your message! I'm processing your request. This is a demo, so I'll respond with a sample reply.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => prev.map(msg =>
        msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
      ));
      setMessages(prev => [...prev, responseMessage]);
    }, 2000);
  };

  const handleVoiceToggle = () => {
    setIsRecording(!isRecording);
  };

  const handlePlaybackToggle = () => {
    setIsPlaying(!isPlaying);
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
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Demo Mode
              </Badge>
              <Button variant="outline">Exit Demo</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback className="bg-orange-500 text-white">
                        PF
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">Pat&apos;s Food Assistant</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Philadelphia Cheesesteak Specialist
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePlaybackToggle}
                      className={isPlaying ? "bg-blue-50 border-blue-200" : ""}
                    >
                      {isPlaying ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                    <div className="flex items-center space-x-1 text-sm text-green-600">
                      <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                      <span>Online</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.isUser
                          ? 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div className={`flex items-center justify-between mt-2 text-xs ${
                        message.isUser ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        <span>{message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        {message.isUser && message.status && (
                          <span className="flex items-center space-x-1">
                            {message.status === 'sending' && <Clock className="h-3 w-3" />}
                            {message.status === 'sent' && <CheckCircle className="h-3 w-3" />}
                            {message.status === 'error' && <X className="h-3 w-3" />}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>

              {/* Input */}
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message or use voice..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleVoiceToggle}
                    className={isRecording ? "bg-red-50 border-red-200 text-red-600" : ""}
                  >
                    {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  <Button onClick={handleSendMessage} disabled={!inputValue.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                {isRecording && (
                  <p className="text-sm text-red-600 mt-2 flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                    <span>Listening... Click the mic to stop recording</span>
                  </p>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Assistant Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About This Assistant</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">4.8/5</span>
                  <span className="text-gray-500">(1,247 reviews)</span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Category:</span>
                    <Badge variant="secondary">Food & Dining</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Response Time:</span>
                    <span>&lt; 2 seconds</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Voice Enabled:</span>
                    <span className="text-green-600">✓ Yes</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Capabilities</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <li>• Order from 50+ Philadelphia restaurants</li>
                    <li>• Real-time menu updates</li>
                    <li>• Delivery tracking</li>
                    <li>• Special dietary accommodations</li>
                    <li>• Local promotions and deals</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ready to Get Started?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full">
                  Sign Up for Full Access
                </Button>
                <Button variant="outline" className="w-full">
                  View Pricing
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  No credit card required for demo
                </p>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Demo Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                  <li>• Try asking about menu items</li>
                  <li>• Mention specific locations</li>
                  <li>• Ask about dietary restrictions</li>
                  <li>• Use voice commands (demo only)</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
