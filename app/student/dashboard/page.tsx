import { redirect } from "next/navigation"
import Link from "next/link"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db-mysql"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import JoinClassForm from "@/components/student/join-class-form"

export default async function StudentDashboard() {
  const session = await getSession()

  if (!session) {
    redirect("/")
  }

  if (session.role !== "student") {
    if (session.role === "admin") {
      redirect("/admin/dashboard")
    } else {
      redirect("/lecturer/dashboard")
    }
  }

  let classData = null
  if (session.classId) {
    classData = await db.classes.findById(session.classId)
  }

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {session.fullName}</p>
        </div>

        {!classData ? (
          <Card>
            <CardHeader>
              <CardTitle>Join a Class</CardTitle>
              <CardDescription>You haven&apos;t joined any class yet. Enter a class code to join.</CardDescription>
            </CardHeader>
            <CardContent>
              <JoinClassForm studentId={session.id} />
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Class Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Class Name:</span> {classData.name}
                  </div>
                  <div>
                    <span className="font-medium">Class Code:</span> {classData.code}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>View your class schedule and sessions.</p>
                <Link href="/student/schedule">
                  <Button variant="outline" className="w-full">
                    View Schedule
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Assignments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>View and submit assignments for your class.</p>
                <Link href="/student/assignments">
                  <Button variant="outline" className="w-full">
                    View Assignments
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attendance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Check your attendance records.</p>
                <Link href="/student/attendance">
                  <Button variant="outline" className="w-full">
                    View Attendance
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rankings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>See how you rank among your classmates.</p>
                <Link href="/student/rankings">
                  <Button variant="outline" className="w-full">
                    View Rankings
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Manage your profile and class settings.</p>
                <Link href="/student/profile">
                  <Button variant="outline" className="w-full">
                    View Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
