"use client"

import type React from "react"

import { useState } from "react"
import { createAttendance } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface CreateAttendanceFormProps {
  classId: string
}

export default function CreateAttendanceForm({ classId }: CreateAttendanceFormProps) {
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await createAttendance(classId, title, date)

      if (result.success) {
        toast({
          title: "Attendance session created",
          description: "You can now mark student attendance",
        })
        setTitle("")
        setDate("")
      } else {
        toast({
          title: "Failed to create attendance",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Failed to create attendance",
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
        <Label htmlFor="title">Session Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Week 1 Lecture"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Attendance Session"}
      </Button>
    </form>
  )
}
