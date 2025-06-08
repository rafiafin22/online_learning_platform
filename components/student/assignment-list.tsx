"use client"

import { useState } from "react"
import { submitAssignment } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface Assignment {
  id: string
  title: string
  dueDate: Date
  instructionsUrl: string
}

interface Submission {
  id: string
  assignmentId: string
  submissionUrl: string
  score?: number
  feedback?: string
  submittedAt: Date
}

interface StudentAssignmentListProps {
  assignments: Assignment[]
  submissions: Submission[]
  studentId: string
}

export default function StudentAssignmentList({ assignments, submissions, studentId }: StudentAssignmentListProps) {
  const [submittingTo, setSubmittingTo] = useState<string | null>(null)
  const [submissionFile, setSubmissionFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  async function handleSubmit(assignmentId: string) {
    if (!submissionFile) {
      toast({
        title: "File required",
        description: "Please select a file to submit",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const result = await submitAssignment(assignmentId, studentId, submissionFile)

      if (result.success) {
        toast({
          title: "Assignment submitted",
          description: "Your submission has been uploaded",
        })
        setSubmittingTo(null)
        setSubmissionFile(null)
      } else {
        toast({
          title: "Failed to submit assignment",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Failed to submit assignment",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (assignments.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No assignments available yet. Your lecturer will add assignments.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {assignments.map((assignment) => {
        const submission = submissions.find((s) => s.assignmentId === assignment.id)
        const isOverdue = new Date() > new Date(assignment.dueDate)

        return (
          <div key={assignment.id} className="p-4 border rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium">{assignment.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                  {isOverdue && !submission && <span className="text-red-600 ml-2">(Overdue)</span>}
                </p>

                {submission && (
                  <div className="mt-2 text-sm">
                    <p className="text-green-600">
                      ✓ Submitted on {new Date(submission.submittedAt).toLocaleDateString()}
                    </p>
                    {submission.score !== undefined && <p>Score: {submission.score}/100</p>}
                    {submission.feedback && <p className="text-muted-foreground">Feedback: {submission.feedback}</p>}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <a
                  href={assignment.instructionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Download Instructions
                </a>

                {!submission && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSubmittingTo(assignment.id)}>
                        Submit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Submit Assignment</DialogTitle>
                        <DialogDescription>Submit your work for {assignment.title}</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="submission">Upload File</Label>
                          <Input
                            id="submission"
                            type="file"
                            onChange={(e) => setSubmissionFile(e.target.files?.[0] || null)}
                            accept=".pdf,.doc,.docx,.txt,.zip"
                          />
                          <p className="text-sm text-muted-foreground">Accepted formats: PDF, DOC, DOCX, TXT, ZIP</p>
                        </div>

                        <Button onClick={() => handleSubmit(assignment.id)} className="w-full" disabled={isLoading}>
                          {isLoading ? "Submitting..." : "Submit Assignment"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}

                {submission && (
                  <a
                    href={submission.submissionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View Submission
                  </a>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
