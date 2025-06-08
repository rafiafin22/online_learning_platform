import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db-mysql"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DeleteClassButton from "@/components/lecturer/delete-class-button"

export default async function LecturerProfile() {
  const session = await getSession()

  if (!session || session.role !== "lecturer") {
    redirect("/")
  }

  let classData = null
  if (session.classId) {
    classData = await db.classes.findById(session.classId)
  }

  return (
    <DashboardLayout role="lecturer">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Manage your profile and class settings</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="font-medium">Full Name:</span> {session.fullName}
              </div>
              <div>
                <span className="font-medium">Email:</span> {session.email}
              </div>
              <div>
                <span className="font-medium">Username:</span> {session.username}
              </div>
              <div>
                <span className="font-medium">Role:</span> Lecturer
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Class Management</CardTitle>
              <CardDescription>Manage your class settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {classData ? (
                <>
                  <div>
                    <span className="font-medium">Class Name:</span> {classData.name}
                  </div>
                  <div>
                    <span className="font-medium">Class Code:</span> {classData.code}
                  </div>
                  <div className="pt-4">
                    <DeleteClassButton classId={classData.id} lecturerId={session.id} className={classData.name} />
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground">
                  You don&apos;t have an active class. Create one from the dashboard.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
