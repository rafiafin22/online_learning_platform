import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db-mysql"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AttendanceRecordList from "@/components/lecturer/attendance-record-list"

interface AttendanceDetailPageProps {
  params: {
    id: string
  }
}

export default async function AttendanceDetailPage({ params }: AttendanceDetailPageProps) {
  const session = await getSession()

  if (!session || session.role !== "lecturer") {
    redirect("/")
  }

  if (!session.classId) {
    redirect("/lecturer/dashboard")
  }

  const attendance = await db.attendance.findById(params.id)

  if (!attendance || attendance.classId !== session.classId) {
    redirect("/lecturer/attendance")
  }

  const records = await db.attendance.findRecordsByAttendanceId(params.id)
  const students = await db.users.findStudentsByClassId(session.classId)

  return (
    <DashboardLayout role="lecturer">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{attendance.title}</h1>
          <p className="text-muted-foreground">{new Date(attendance.date).toLocaleDateString()}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Student Attendance</CardTitle>
            <CardDescription>Mark attendance for each student</CardDescription>
          </CardHeader>
          <CardContent>
            <AttendanceRecordList records={records} students={students} attendanceId={params.id} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
