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

    // Common responses for all users
    if (message.includes("hello") || message.includes("hi") || message.includes("help")) {
      return `Hi there! I'm your Learning Platform assistant. I can help you with:
      
${userRole === "student" ? "• Joining classes\n• Viewing assignments\n• Submitting work\n• Checking attendance\n• Viewing rankings" : ""}
${userRole === "lecturer" ? "• Creating classes\n• Managing schedules\n• Creating assignments\n• Taking attendance\n• Viewing student rankings" : ""}
${userRole === "admin" ? "• Managing users\n• Viewing all classes\n• System administration" : ""}

What specific feature would you like to learn about?`
    }

    // Student-specific responses
    if (userRole === "student") {
      if (message.includes("join") && message.includes("class")) {
        return `To join a class:
1. Go to your Student Dashboard
2. If you haven't joined a class yet, you'll see a "Join a Class" form
3. Enter the 5-digit class code provided by your lecturer
4. Click "Join Class"
5. You'll then have access to all class features like assignments, schedule, and attendance.

💡 Tip: Make sure you get the correct class code from your lecturer!`
      }

      if (message.includes("assignment") || message.includes("submit")) {
        return `To work with assignments:
1. Go to "Assignments" from the navigation menu
2. You'll see all available assignments with due dates
3. Click "Download Instructions" to get the assignment details
4. To submit: Click "Submit" button, upload your file (PDF, DOC, DOCX, TXT, ZIP)
5. Once submitted, you can view your submission and check for grades/feedback

📝 Note: Pay attention to due dates - overdue assignments will be marked in red!`
      }

      if (message.includes("attendance")) {
        return `To check your attendance:
1. Go to "Attendance" from the navigation menu
2. View your attendance statistics (Present, Late, Absent counts)
3. See detailed attendance history for each session
4. Your attendance affects your overall ranking in the class

📊 Your attendance percentage is calculated as: (Present + Late×0.5) / Total Sessions`
      }

      if (message.includes("ranking") || message.includes("grade")) {
        return `To view your rankings:
1. Go to "Rankings" from the navigation menu
2. See your current class rank and overall score
3. Rankings are calculated from: 70% assignment scores + 30% attendance
4. Compare your performance with classmates

🏆 Your position in the class is highlighted in blue for easy identification!`
      }

      if (message.includes("schedule")) {
        return `To view your class schedule:
1. Go to "Schedule" from the navigation menu
2. See all weekly class sessions with times and days
3. Sessions are organized by day (Monday to Friday)
4. Each session shows the title, day, and time period

📅 This helps you plan your week and never miss a class!`
      }
    }

    // Lecturer-specific responses
    if (userRole === "lecturer") {
      if (message.includes("create") && message.includes("class")) {
        return `To create a class:
1. Go to your Lecturer Dashboard
2. If you don't have a class, you'll see "Create Your Class" form
3. Enter your class name
4. Click "Create Class"
5. You'll get a unique 5-digit class code to share with students

⚠️ Important: You can only have one active class at a time. Share the class code with your students so they can join.`
      }

      if (message.includes("assignment")) {
        return `To manage assignments:
1. Go to "Assignments" from the navigation menu
2. To create: Fill out the form with title, due date, and upload instructions
3. View all assignments in the assignment list
4. Click the eye icon to view submissions and grade them
5. You can provide scores (0-100) and written feedback for each student

📋 Tip: Upload clear instruction files to help students understand the requirements!`
      }

      if (message.includes("attendance")) {
        return `To manage attendance:
1. Go to "Attendance" from the navigation menu
2. Create new attendance sessions with title and date
3. Click on any session to mark individual student attendance
4. Set each student as Present, Absent, or Late
5. Attendance data is used in student rankings calculation

✅ Regular attendance tracking helps monitor student engagement!`
      }

      if (message.includes("schedule")) {
        return `To manage your schedule:
1. Go to "Schedule" from the navigation menu
2. Add new schedule entries with day, time, and session title
3. Choose from Monday to Friday
4. Set start and end times for each session
5. Students can view this schedule to know when classes occur

🕐 Keep your schedule updated so students always know when to attend!`
      }

      if (message.includes("ranking") || message.includes("grade")) {
        return `To view student rankings:
1. Go to "Rankings" from the navigation menu
2. See all students ranked by overall performance
3. Rankings show: Overall score, assignment average, attendance percentage
4. Formula: 70% assignment scores + 30% attendance
5. Use this to identify students who need additional support

📈 This helps you track class performance and provide targeted help!`
      }

      if (message.includes("delete") && message.includes("class")) {
        return `To delete your class:
1. Go to "Profile" from the navigation menu
2. In the "Class Management" section, click "Delete Class"
3. Confirm the deletion in the dialog
4. This will remove all students from the class and delete all class data

⚠️ Warning: This action cannot be undone! All assignments, attendance, and student data will be permanently lost.`
      }
    }

    // Admin-specific responses
    if (userRole === "admin") {
      if (message.includes("user") || message.includes("manage")) {
        return `To manage users:
1. Go to "Users" from the navigation menu
2. View all registered users (students, lecturers, admins)
3. Click the edit icon to modify user information
4. You can update names, emails, and passwords
5. See which class each user belongs to

👥 You have full control over user accounts and can help with account issues!`
      }

      if (message.includes("class")) {
        return `To manage classes:
1. Go to "Classes" from the navigation menu
2. View all created classes with their details
3. See lecturer names, student counts, and creation dates
4. Click the eye icon to view detailed class information
5. See all members of each class (lecturer + students)

🏫 This gives you oversight of all educational activities on the platform!`
      }

      if (message.includes("dashboard")) {
        return `Your Admin Dashboard shows:
1. Total system statistics (users, students, lecturers, classes)
2. Quick access to user and class management
3. Overview of platform usage
4. Navigation to detailed management pages

📊 Use these metrics to monitor platform growth and usage patterns!`
      }
    }

    // Profile and general features
    if (message.includes("profile")) {
      return `To manage your profile:
1. Go to "Profile" from the navigation menu
2. View your personal information
3. ${userRole === "student" ? "Exit your current class if needed" : ""}
${userRole === "lecturer" ? "Delete your class if needed (this removes all students and data)" : ""}
4. Your profile shows your role and current class status

👤 Keep your profile information up to date for the best experience!`
    }

    if (message.includes("logout") || message.includes("exit")) {
      return `To logout:
1. Click the "Logout" button in the top-right corner of any page
2. You'll be redirected to the login page
3. Your session will be securely ended

🔒 Always logout when using shared computers for security!`
    }

    if (message.includes("navigation") || message.includes("menu")) {
      return `Navigation options:
• Desktop: Use the top navigation bar
• Mobile: Click the hamburger menu (☰) for the side navigation
• All main features are accessible from the navigation menu
• Your current role determines which menu items you see

📱 The interface adapts to your device for the best experience!`
    }

    // Default response
    return `I'm not sure about that specific question. Here are some topics I can help with:

${userRole === "student" ? "• Joining classes\n• Assignments and submissions\n• Attendance tracking\n• Rankings and grades\n• Class schedule" : ""}
${userRole === "lecturer" ? "• Creating and managing classes\n• Assignment creation and grading\n• Attendance management\n• Schedule management\n• Student rankings" : ""}
${userRole === "admin" ? "• User management\n• Class oversight\n• System administration" : ""}
• Profile management
• Navigation help
• Logout process

Try asking about any of these topics, or be more specific about what you need help with!`
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
        text: `This is a mock response for role: ${userRole}.`,
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
