"use client"

import { deleteSchedule } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Schedule {
  id: string
  day: string
  startTime: string
  endTime: string
  title: string
}

interface ScheduleListProps {
  schedules: Schedule[]
}

export default function ScheduleList({ schedules }: ScheduleListProps) {
  const { toast } = useToast()

  async function handleDelete(scheduleId: string) {
    try {
      const result = await deleteSchedule(scheduleId)

      if (result.success) {
        toast({
          title: "Schedule deleted",
          description: "The schedule has been removed",
        })
      } else {
        toast({
          title: "Failed to delete schedule",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Failed to delete schedule",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  if (schedules.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No schedules created yet. Add your first schedule entry.
      </div>
    )
  }

  const sortedSchedules = schedules.sort((a, b) => {
    const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)
  })

  return (
    <div className="space-y-4">
      {sortedSchedules.map((schedule) => (
        <div key={schedule.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h3 className="font-medium">{schedule.title}</h3>
            <p className="text-sm text-muted-foreground">
              {schedule.day} • {schedule.startTime} - {schedule.endTime}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(schedule.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}
