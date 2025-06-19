"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, HelpCircle, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Message {
  id: string
  text: string
  isBot: boolean
  timestamp: Date
}

interface ChatbotPageProps {
  userRole: "admin" | "lecturer" | "student"
}

export default function ChatbotPage({ userRole }: ChatbotPageProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const welcomeMessage: Message = {
      id: generateId(),
      text: `Hello! Welcome to the Learning Platform Help Center. I'm your ${userRole} assistant and I'm here to help you navigate and use all the features available to you. What would you like to know about?`,
      isBot: true,
      timestamp: new Date(),
    }
    setMessages([welcomeMessage])
  }, [userRole])

  const getResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()

    // Example: simple responses
    if (message.includes("hello") || message.includes("hi")) {
      return `Hi there! I'm your ${userRole} assistant. How can I help you today?`
    }

    if (message.includes("help")) {
      return `You can ask me about platform features!`
    }

    if (message.includes("logout")) {
      return `To logout: click the Logout button at the top right.`
    }

    // Default fallback response
    return `I'm not sure about that. Please try asking something else!`
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: generateId(),
      text: inputValue,
      isBot: false,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue("")
    setIsTyping(true)

    setTimeout(() => {
      const botResponse: Message = {
        id: generateId(),
        text: getResponse(currentInput), // <-- use your dynamic function here
        isBot: true,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
      setIsTyping(false)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  const quickQuestions = [
    userRole === "student"
      ? "How do I join a class?"
      : userRole === "lecturer"
      ? "How do I create a class?"
      : "How do I manage users?",
    userRole === "student"
      ? "How do I submit assignments?"
      : userRole === "lecturer"
      ? "How do I create assignments?"
      : "How do I view all classes?",
    "How do I check attendance?",
    "How do I view rankings?",
    "How do I navigate the platform?",
    "How do I manage my profile?",
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <HelpCircle className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">Help Center</h1>
          <p className="text-muted-foreground">
            Get help with Learning Platform features - Ask me anything!
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">Chat Assistant</CardTitle>
                <Badge variant="secondary">
                  {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Mode
                </Badge>
              </div>
              <CardDescription>
                Ask questions about any platform feature and get instant help
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col flex-1 p-0 overflow-hidden">
              <ScrollArea className="flex-1">
                <div className="px-4 py-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.isBot ? "justify-start" : "justify-end"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg px-4 py-3 ${
                          message.isBot
                            ? "bg-gray-100 text-gray-900"
                            : "bg-blue-600 text-white"
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          {message.isBot ? (
                            <Bot className="h-5 w-5 mt-0.5" />
                          ) : (
                            <User className="h-5 w-5 mt-0.5" />
                          )}
                          <div className="text-sm whitespace-pre-line leading-relaxed">
                            {message.text}
                          </div>
                        </div>
                        <div className="text-xs opacity-70 mt-2 text-right">
                          {new Intl.DateTimeFormat("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          }).format(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg px-4 py-3 max-w-[85%]">
                        <div className="flex items-center space-x-3">
                          <Bot className="h-5 w-5" />
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about the platform..."
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Questions</CardTitle>
              <CardDescription>Click any question to get started</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full text-left justify-start h-auto py-3 text-sm"
                  onClick={() => {
                    setInputValue(question)
                    handleSendMessage()
                  }}
                >
                  {question}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
