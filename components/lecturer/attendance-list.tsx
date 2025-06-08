import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

interface Attendance {
  id: string
  title: string
  date: Date
}

interface AttendanceListProps {
  attendances: Attendance[]
}

export default function AttendanceList({ attendances }: AttendanceListProps) {
  if (attendances.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No attendance sessions created yet. Create your first session.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {attendances.map((attendance) => (
        <div key={attendance.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h3 className="font-medium">{attendance.title}</h3>
            <p className="text-sm text-muted-foreground">{new Date(attendance.date).toLocaleDateString()}</p>
          </div>
          <Link href={`/lecturer/attendance/${attendance.id}`}>
            <Button variant="ghost" size="icon">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      ))}
    </div>
  )
}
