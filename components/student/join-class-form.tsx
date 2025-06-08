"use client"

import type React from "react"

import { useState } from "react"
import { joinClass } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface JoinClassFormProps {
  studentId: string
}

export default function JoinClassForm({ studentId }: JoinClassFormProps) {
  const [classCode, setClassCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await joinClass(studentId, classCode)

      if (result.success) {
        toast({
          title: "Joined class successfully",
          description: "Refreshing dashboard...",
        })
        window.location.reload()
      } else {
        toast({
          title: "Failed to join class",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Failed to join class",
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
        <Label htmlFor="classCode">Class Code</Label>
        <Input
          id="classCode"
          value={classCode}
          onChange={(e) => setClassCode(e.target.value)}
          placeholder="Enter 5-digit class code"
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Joining..." : "Join Class"}
      </Button>
    </form>
  )
}
