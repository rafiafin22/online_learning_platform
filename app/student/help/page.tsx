import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import DashboardLayout from "@/components/layout/dashboard-layout"
import ChatbotPage from "@/components/chatbot/chatbot-page"

export default async function StudentHelpPage() {
  const session = await getSession()

  if (!session || session.role !== "student") {
    redirect("/")
  }

  return (
    <DashboardLayout role="student">
      <ChatbotPage userRole="student" />
    </DashboardLayout>
  )
}
