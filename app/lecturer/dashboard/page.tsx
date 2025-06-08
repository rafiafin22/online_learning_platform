import { redirect } from "next/navigation"
import Link from "next/link"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db-mysql"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import CreateClassForm from "@/components/lecturer/create-class-form"

export default async function LecturerDashboard() {
  const session = await getSession()

  if (!session) {
    redirect("/")
  }

  if (session.role !== "lecturer") {
    if (session.role === "admin") {
      redirect("/admin/dashboard")
    } else {
      redirect("/student/dashboard")
    }
  }

  let classData = null
  if (session.classId) {
    classData = await db.classes.findById(session.classId)
  }

  return (
    <DashboardLayout role="lecturer">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Lecturer Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {session.fullName}</p>
        </div>

        {!classData ? (
          <Card>
            <CardHeader>
              <CardTitle>Create Your Class</CardTitle>
              <CardDescription>You don&apos;t have an active class. Create one to get started.</CardDescription>
            </CardHeader>
            <CardContent>
              <CreateClassForm lecturerId={session.id} />
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
                  <div className="text-sm text-muted-foreground">
                    Share this code with your students so they can join your class.
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Manage your class schedule and sessions.</p>
                <Link href="/lecturer/schedule">
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
                <p>Create and grade assignments for your students.</p>
                <Link href="/lecturer/assignments">
                  <Button variant="outline" className="w-full">
                    Manage Assignments
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attendance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Track attendance for your class sessions.</p>
                <Link href="/lecturer/attendance">
                  <Button variant="outline" className="w-full">
                    Manage Attendance
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rankings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>View student rankings based on performance.</p>
                <Link href="/lecturer/rankings">
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
                <Link href="/lecturer/profile">
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
