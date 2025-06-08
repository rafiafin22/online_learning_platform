"use client"

import type React from "react"

import { useState } from "react"
import { createSchedule } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface CreateScheduleFormProps {
  classId: string
}

export default function CreateScheduleForm({ classId }: CreateScheduleFormProps) {
  const [title, setTitle] = useState("")
  const [day, setDay] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await createSchedule(classId, {
        title,
        day,
        startTime,
        endTime,
      })

      if (result.success) {
        toast({
          title: "Schedule created successfully",
          description: "Your schedule has been added",
        })
        setTitle("")
        setDay("")
        setStartTime("")
        setEndTime("")
      } else {
        toast({
          title: "Failed to create schedule",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Failed to create schedule",
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
          placeholder="e.g., Mathematics Lecture"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="day">Day</Label>
        <Select value={day} onValueChange={setDay} required>
          <SelectTrigger>
            <SelectValue placeholder="Select day" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Monday">Monday</SelectItem>
            <SelectItem value="Tuesday">Tuesday</SelectItem>
            <SelectItem value="Wednesday">Wednesday</SelectItem>
            <SelectItem value="Thursday">Thursday</SelectItem>
            <SelectItem value="Friday">Friday</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time</Label>
          <Input id="startTime" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endTime">End Time</Label>
          <Input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Schedule"}
      </Button>
    </form>
  )
}
