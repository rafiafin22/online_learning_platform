import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import DashboardLayout from "@/components/layout/dashboard-layout"
import ChatbotPage from "@/components/chatbot/chatbot-page"

export default async function AdminHelpPage() {
  const session = await getSession()

  if (!session || session.role !== "admin") {
    redirect("/")
  }

  return (
    <DashboardLayout role="admin">
      <ChatbotPage userRole="admin" />
    </DashboardLayout>
  )
}
