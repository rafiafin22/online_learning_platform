import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db-mysql"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import CreateAttendanceForm from "@/components/lecturer/create-attendance-form"
import AttendanceList from "@/components/lecturer/attendance-list"

export default async function LecturerAttendance() {
  const session = await getSession()

  if (!session || session.role !== "lecturer") {
    redirect("/")
  }

  if (!session.classId) {
    redirect("/lecturer/dashboard")
  }

  const attendances = await db.attendance.findByClassId(session.classId)

  return (
    <DashboardLayout role="lecturer">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Attendance</h1>
          <p className="text-muted-foreground">Track student attendance for your class</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Create Attendance</CardTitle>
              <CardDescription>Create a new attendance session</CardDescription>
            </CardHeader>
            <CardContent>
              <CreateAttendanceForm classId={session.classId} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attendance Sessions</CardTitle>
              <CardDescription>Manage existing attendance sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <AttendanceList attendances={attendances} />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
