import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db-mysql"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function StudentAttendance() {
  const session = await getSession()

  if (!session || session.role !== "student") {
    redirect("/")
  }

  if (!session.classId) {
    redirect("/student/dashboard")
  }

  const attendances = await db.attendance.findByClassId(session.classId)
  const myRecords = await db.attendance.findRecordsByStudentId(session.id)

  const attendanceWithRecords = attendances.map((attendance) => {
    const record = myRecords.find((r) => r.attendanceId === attendance.id)
    return {
      ...attendance,
      status: record?.status || "absent",
    }
  })

  const totalSessions = attendances.length
  const presentCount = myRecords.filter((r) => r.status === "present").length
  const lateCount = myRecords.filter((r) => r.status === "late").length
  const absentCount = totalSessions - presentCount - lateCount

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Attendance</h1>
          <p className="text-muted-foreground">Your attendance record</p>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSessions}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Present</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{presentCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Late</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{lateCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Absent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{absentCount}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Attendance History</CardTitle>
            <CardDescription>Your attendance record for all sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {attendanceWithRecords.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">No attendance sessions yet.</div>
            ) : (
              <div className="space-y-4">
                {attendanceWithRecords.map((attendance) => (
                  <div key={attendance.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{attendance.title}</h3>
                      <p className="text-sm text-muted-foreground">{new Date(attendance.date).toLocaleDateString()}</p>
                    </div>
                    <Badge
                      variant={
                        attendance.status === "present"
                          ? "default"
                          : attendance.status === "late"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {attendance.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
