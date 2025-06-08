import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db-mysql"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SubmissionList from "@/components/lecturer/submission-list"

interface AssignmentDetailPageProps {
  params: {
    id: string
  }
}

export default async function AssignmentDetailPage({ params }: AssignmentDetailPageProps) {
  const session = await getSession()

  if (!session || session.role !== "lecturer") {
    redirect("/")
  }

  if (!session.classId) {
    redirect("/lecturer/dashboard")
  }

  const assignment = await db.assignments.findById(params.id)

  if (!assignment || assignment.classId !== session.classId) {
    redirect("/lecturer/assignments")
  }

  const submissions = await db.submissions.findByAssignmentId(params.id)
  const students = await db.users.findStudentsByClassId(session.classId)

  return (
    <DashboardLayout role="lecturer">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{assignment.title}</h1>
          <p className="text-muted-foreground">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Assignment Details</CardTitle>
            <CardDescription>View and grade student submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Instructions</h3>
                <a
                  href={assignment.instructionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Download Instructions
                </a>
              </div>

              <div>
                <h3 className="font-medium">
                  Submissions ({submissions.length}/{students.length})
                </h3>
                <SubmissionList submissions={submissions} students={students} assignmentId={params.id} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
