import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db-mysql"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import CreateAssignmentForm from "@/components/lecturer/create-assignment-form"
import AssignmentList from "@/components/lecturer/assignment-list"

export default async function LecturerAssignments() {
  const session = await getSession()

  if (!session || session.role !== "lecturer") {
    redirect("/")
  }

  if (!session.classId) {
    redirect("/lecturer/dashboard")
  }

  const assignments = await db.assignments.findByClassId(session.classId)

  return (
    <DashboardLayout role="lecturer">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Assignments</h1>
          <p className="text-muted-foreground">Create and manage assignments for your class</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Create New Assignment</CardTitle>
              <CardDescription>Add a new assignment for your students</CardDescription>
            </CardHeader>
            <CardContent>
              <CreateAssignmentForm classId={session.classId} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assignment List</CardTitle>
              <CardDescription>Manage your existing assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <AssignmentList assignments={assignments} />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
