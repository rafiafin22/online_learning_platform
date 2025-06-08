import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

interface Assignment {
  id: string
  title: string
  dueDate: Date
  instructionsUrl: string
}

interface AssignmentListProps {
  assignments: Assignment[]
}

export default function AssignmentList({ assignments }: AssignmentListProps) {
  if (assignments.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No assignments created yet. Create your first assignment.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {assignments.map((assignment) => (
        <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h3 className="font-medium">{assignment.title}</h3>
            <p className="text-sm text-muted-foreground">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
          </div>
          <Link href={`/lecturer/assignments/${assignment.id}`}>
            <Button variant="ghost" size="icon">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      ))}
    </div>
  )
}
