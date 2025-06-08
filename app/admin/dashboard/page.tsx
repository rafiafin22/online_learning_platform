import { redirect } from "next/navigation"
import Link from "next/link"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db-mysql"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminDashboard() {
  const session = await getSession()

  if (!session) {
    redirect("/")
  }

  if (session.role !== "admin") {
    if (session.role === "lecturer") {
      redirect("/lecturer/dashboard")
    } else {
      redirect("/student/dashboard")
    }
  }

  const users = await db.users.findAll()
  const classes = await db.classes.findAll()

  const totalUsers = users.length
  const totalStudents = users.filter((user) => user.role === "student").length
  const totalLecturers = users.filter((user) => user.role === "lecturer").length
  const totalClasses = classes.length

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {session.fullName}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Lecturers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalLecturers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClasses}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View and manage all users in the system.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Total of {totalUsers} users registered in the system.</p>
              <Link href="/admin/users">
                <Button variant="outline" className="w-full">
                  Manage Users
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Class Management</CardTitle>
              <CardDescription>View and manage all classes in the system.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Total of {totalClasses} classes created in the system.</p>
              <Link href="/admin/classes">
                <Button variant="outline" className="w-full">
                  Manage Classes
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
