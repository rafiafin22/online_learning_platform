"use client"

import type React from "react"

import { useState } from "react"
import { createAssignment } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface CreateAssignmentFormProps {
  classId: string
}

export default function CreateAssignmentForm({ classId }: CreateAssignmentFormProps) {
  const [title, setTitle] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [instructions, setInstructions] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!instructions) {
      toast({
        title: "Instructions file required",
        description: "Please upload an instructions file",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const result = await createAssignment(classId, {
        title,
        dueDate,
        instructions,
      })

      if (result.success) {
        toast({
          title: "Assignment created successfully",
          description: "Your assignment has been added",
        })
        setTitle("")
        setDueDate("")
        setInstructions(null)
        // Reset file input
        const fileInput = document.getElementById("instructions") as HTMLInputElement
        if (fileInput) fileInput.value = ""
      } else {
        toast({
          title: "Failed to create assignment",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Failed to create assignment",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Assignment Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Math Problem Set 1"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dueDate">Due Date</Label>
        <Input
          id="dueDate"
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="instructions">Instructions File</Label>
        <Input
          id="instructions"
          type="file"
          onChange={(e) => setInstructions(e.target.files?.[0] || null)}
          accept=".pdf,.doc,.docx,.txt"
          required
        />
        <p className="text-sm text-muted-foreground">Upload assignment instructions (PDF, DOC, DOCX, or TXT)</p>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Assignment"}
      </Button>
    </form>
  )
}
