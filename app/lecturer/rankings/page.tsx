import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db-mysql"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default async function LecturerRankings() {
  const session = await getSession()

  if (!session || session.role !== "lecturer") {
    redirect("/")
  }

  if (!session.classId) {
    redirect("/lecturer/dashboard")
  }

  const students = await db.users.findStudentsByClassId(session.classId)
  const assignments = await db.assignments.findByClassId(session.classId)
  const attendances = await db.attendance.findByClassId(session.classId)

  // Calculate rankings for each student
  const rankings = await Promise.all(
    students.map(async (student) => {
      const submissions = await db.submissions.findByStudentId(student.id)
      const attendanceRecords = await db.attendance.findRecordsByStudentId(student.id)

      // Calculate average assignment score
      const gradedSubmissions = submissions.filter((s) => s.score !== undefined)
      const averageScore =
        gradedSubmissions.length > 0
          ? gradedSubmissions.reduce((sum, s) => sum + (s.score || 0), 0) / gradedSubmissions.length
          : 0

      // Calculate attendance percentage
      const presentCount = attendanceRecords.filter((r) => r.status === "present").length
      const lateCount = attendanceRecords.filter((r) => r.status === "late").length
      const attendancePercentage =
        attendances.length > 0 ? ((presentCount + lateCount * 0.5) / attendances.length) * 100 : 0

      // Calculate overall score (70% assignments, 30% attendance)
      const overallScore = averageScore * 0.7 + attendancePercentage * 0.3

      return {
        student,
        averageScore: Math.round(averageScore),
        attendancePercentage: Math.round(attendancePercentage),
        overallScore: Math.round(overallScore),
        submittedAssignments: submissions.length,
        totalAssignments: assignments.length,
        presentSessions: presentCount,
        totalSessions: attendances.length,
      }
    }),
  )

  // Sort by overall score (descending)
  rankings.sort((a, b) => b.overallScore - a.overallScore)

  return (
    <DashboardLayout role="lecturer">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Class Rankings</h1>
          <p className="text-muted-foreground">Student performance rankings based on assignments and attendance</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Student Rankings</CardTitle>
            <CardDescription>Rankings calculated from assignment scores (70%) and attendance (30%)</CardDescription>
          </CardHeader>
          <CardContent>
            {rankings.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">No students in your class yet.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Overall Score</TableHead>
                    <TableHead>Assignment Avg</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Submissions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rankings.map((ranking, index) => (
                    <TableRow key={ranking.student.id}>
                      <TableCell>
                        <Badge variant={index === 0 ? "default" : index === 1 ? "secondary" : "outline"}>
                          #{index + 1}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{ranking.student.fullName}</TableCell>
                      <TableCell>
                        <span className="font-bold">{ranking.overallScore}%</span>
                      </TableCell>
                      <TableCell>{ranking.averageScore}%</TableCell>
                      <TableCell>
                        {ranking.attendancePercentage}% ({ranking.presentSessions}/{ranking.totalSessions})
                      </TableCell>
                      <TableCell>
                        {ranking.submittedAssignments}/{ranking.totalAssignments}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
