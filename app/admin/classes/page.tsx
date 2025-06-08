import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db-mysql"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ClassManagementTable from "@/components/admin/class-management-table"

export default async function AdminClasses() {
  const session = await getSession()

  if (!session || session.role !== "admin") {
    redirect("/")
  }

  const classes = await db.classes.findAll()
  const users = await db.users.findAll()

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Class Management</h1>
          <p className="text-muted-foreground">View all classes and their members</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Classes</CardTitle>
            <CardDescription>View class details and members</CardDescription>
          </CardHeader>
          <CardContent>
            <ClassManagementTable classes={classes} users={users} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
