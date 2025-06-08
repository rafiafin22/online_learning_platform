import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db-mysql"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import StudentAssignmentList from "@/components/student/assignment-list"

export default async function StudentAssignments() {
  const session = await getSession()

  if (!session || session.role !== "student") {
    redirect("/")
  }

  if (!session.classId) {
    redirect("/student/dashboard")
  }

  const assignments = await db.assignments.findByClassId(session.classId)
  const submissions = await db.submissions.findByStudentId(session.id)

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Assignments</h1>
          <p className="text-muted-foreground">View and submit your assignments</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Assignment List</CardTitle>
            <CardDescription>Your class assignments and submission status</CardDescription>
          </CardHeader>
          <CardContent>
            <StudentAssignmentList assignments={assignments} submissions={submissions} studentId={session.id} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
