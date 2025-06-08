import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db-mysql"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import CreateScheduleForm from "@/components/lecturer/create-schedule-form"
import ScheduleList from "@/components/lecturer/schedule-list"

export default async function LecturerSchedule() {
  const session = await getSession()

  if (!session || session.role !== "lecturer") {
    redirect("/")
  }

  if (!session.classId) {
    redirect("/lecturer/dashboard")
  }

  const schedules = await db.schedules.findByClassId(session.classId)

  return (
    <DashboardLayout role="lecturer">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Class Schedule</h1>
          <p className="text-muted-foreground">Manage your class schedule and sessions</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Add New Schedule</CardTitle>
              <CardDescription>Create a new schedule entry for your class</CardDescription>
            </CardHeader>
            <CardContent>
              <CreateScheduleForm classId={session.classId} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Schedule</CardTitle>
              <CardDescription>Your weekly class schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <ScheduleList schedules={schedules} />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
