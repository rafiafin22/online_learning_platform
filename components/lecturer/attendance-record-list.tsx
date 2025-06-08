"use client"

import { updateAttendanceRecord } from "@/lib/actions"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface AttendanceRecord {
  id: string
  studentId: string
  status: "present" | "absent" | "late"
}

interface Student {
  id: string
  fullName: string
}

interface AttendanceRecordListProps {
  records: AttendanceRecord[]
  students: Student[]
  attendanceId: string
}

export default function AttendanceRecordList({ records, students, attendanceId }: AttendanceRecordListProps) {
  const { toast } = useToast()

  async function handleStatusChange(recordId: string, status: "present" | "absent" | "late") {
    try {
      const result = await updateAttendanceRecord(recordId, status)

      if (result.success) {
        toast({
          title: "Attendance updated",
          description: "Student attendance has been updated",
        })
      } else {
        toast({
          title: "Failed to update attendance",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Failed to update attendance",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  if (students.length === 0) {
    return <div className="text-center text-muted-foreground py-8">No students in your class yet.</div>
  }

  return (
    <div className="space-y-4">
      {students.map((student) => {
        const record = records.find((r) => r.studentId === student.id)

        return (
          <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">{student.fullName}</h4>
              <p className="text-sm text-muted-foreground">Student ID: {student.id.slice(0, 8)}...</p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Status:</span>
              {record ? (
                <Select
                  value={record.status}
                  onValueChange={(value: "present" | "absent" | "late") => handleStatusChange(record.id, value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                    <SelectItem value="late">Late</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <span className="text-sm text-red-600">No record found</span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
