import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db-mysql"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import UserManagementTable from "@/components/admin/user-management-table"

export default async function AdminUsers() {
  const session = await getSession()

  if (!session || session.role !== "admin") {
    redirect("/")
  }

  const users = await db.users.findAll()
  const classes = await db.classes.findAll()

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage all users in the system</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>View and edit user information</CardDescription>
          </CardHeader>
          <CardContent>
            <UserManagementTable users={users} classes={classes} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
