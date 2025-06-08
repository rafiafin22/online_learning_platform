import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminProfile() {
  const session = await getSession()

  if (!session || session.role !== "admin") {
    redirect("/")
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Admin account information</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Administrator Information</CardTitle>
            <CardDescription>Your admin account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="font-medium">Full Name:</span> {session.fullName}
            </div>
            <div>
              <span className="font-medium">Email:</span> {session.email}
            </div>
            <div>
              <span className="font-medium">Username:</span> {session.username}
            </div>
            <div>
              <span className="font-medium">Role:</span> Administrator
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
