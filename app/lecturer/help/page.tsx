import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import DashboardLayout from "@/components/layout/dashboard-layout"
import ChatbotPage from "@/components/chatbot/chatbot-page"

export default async function LecturerHelpPage() {
  const session = await getSession()

  if (!session || session.role !== "lecturer") {
    redirect("/")
  }

  return (
    <DashboardLayout role="lecturer">
      <ChatbotPage userRole="lecturer" />
    </DashboardLayout>
  )
}
