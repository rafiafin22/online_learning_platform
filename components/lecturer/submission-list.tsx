"use client"

import { useState } from "react"
import { gradeSubmission } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface Submission {
  id: string
  studentId: string
  submissionUrl: string
  score?: number
  feedback?: string
  submittedAt: Date
  gradedAt?: Date
}

interface Student {
  id: string
  fullName: string
}

interface SubmissionListProps {
  submissions: Submission[]
  students: Student[]
  assignmentId: string
}

export default function SubmissionList({ submissions, students, assignmentId }: SubmissionListProps) {
  const [gradingSubmission, setGradingSubmission] = useState<string | null>(null)
  const [score, setScore] = useState("")
  const [feedback, setFeedback] = useState("")
  const { toast } = useToast()

  async function handleGrade(submissionId: string) {
    try {
      const result = await gradeSubmission(submissionId, Number.parseInt(score), feedback)

      if (result.success) {
        toast({
          title: "Submission graded",
          description: "The grade has been saved",
        })
        setGradingSubmission(null)
        setScore("")
        setFeedback("")
      } else {
        toast({
          title: "Failed to grade submission",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Failed to grade submission",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      {students.map((student) => {
        const submission = submissions.find((s) => s.studentId === student.id)

        return (
          <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">{student.fullName}</h4>
              {submission ? (
                <div className="text-sm text-muted-foreground">
                  <p>Submitted: {new Date(submission.submittedAt).toLocaleDateString()}</p>
                  {submission.score !== undefined && <p>Score: {submission.score}/100</p>}
                </div>
              ) : (
                <p className="text-sm text-red-600">Not submitted</p>
              )}
            </div>

            {submission && (
              <div className="flex items-center space-x-2">
                <a
                  href={submission.submissionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  View Submission
                </a>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setGradingSubmission(submission.id)
                        setScore(submission.score?.toString() || "")
                        setFeedback(submission.feedback || "")
                      }}
                    >
                      {submission.score !== undefined ? "Edit Grade" : "Grade"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Grade Submission</DialogTitle>
                      <DialogDescription>Grade {student.fullName}&apos;s submission</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="score">Score (0-100)</Label>
                        <Input
                          id="score"
                          type="number"
                          min="0"
                          max="100"
                          value={score}
                          onChange={(e) => setScore(e.target.value)}
                          placeholder="Enter score"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="feedback">Feedback</Label>
                        <Textarea
                          id="feedback"
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          placeholder="Enter feedback for the student"
                          rows={4}
                        />
                      </div>

                      <Button onClick={() => handleGrade(submission.id)} className="w-full">
                        Save Grade
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
