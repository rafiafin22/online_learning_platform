import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import Header from "@/components/layout/header"
import MobileNav from "@/components/layout/mobile-nav"

interface DashboardLayoutProps {
  children: ReactNode
  role: "admin" | "lecturer" | "student"
}

export default async function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const session = await getSession()

  if (!session) {
    redirect("/")
  }

  if (session.role !== role) {
    if (session.role === "admin") {
      redirect("/admin/dashboard")
    } else if (session.role === "lecturer") {
      redirect("/lecturer/dashboard")
    } else {
      redirect("/student/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header user={session} />
      <div className="md:hidden">
        <MobileNav user={session} />
      </div>
      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
