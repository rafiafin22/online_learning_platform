"use client"

import type React from "react"

import { useState } from "react"
import { createClass } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface CreateClassFormProps {
  lecturerId: string
}

export default function CreateClassForm({ lecturerId }: CreateClassFormProps) {
  const [className, setClassName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await createClass(lecturerId, className)

      if (result.success) {
        toast({
          title: "Class created successfully",
          description: `Your class code is: ${result.classCode}`,
        })
      } else {
        toast({
          title: "Failed to create class",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Failed to create class",
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
        <Label htmlFor="className">Class Name</Label>
        <Input
          id="className"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          placeholder="Enter class name"
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Class"}
      </Button>
    </form>
  )
}
