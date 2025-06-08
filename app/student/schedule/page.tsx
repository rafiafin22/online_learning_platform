import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db-mysql"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function StudentSchedule() {
  const session = await getSession()

  if (!session || session.role !== "student") {
    redirect("/")
  }

  if (!session.classId) {
    redirect("/student/dashboard")
  }

  const schedules = await db.schedules.findByClassId(session.classId)

  const sortedSchedules = schedules.sort((a, b) => {
    const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)
  })

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Class Schedule</h1>
          <p className="text-muted-foreground">Your weekly class schedule</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Schedule</CardTitle>
            <CardDescription>Your class sessions for the week</CardDescription>
          </CardHeader>
          <CardContent>
            {sortedSchedules.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No schedules available yet. Your lecturer will add schedule entries.
              </div>
            ) : (
              <div className="space-y-4">
                {sortedSchedules.map((schedule) => (
                  <div key={schedule.id} className="p-4 border rounded-lg">
                    <h3 className="font-medium">{schedule.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {schedule.day} • {schedule.startTime} - {schedule.endTime}
                    </p>
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
