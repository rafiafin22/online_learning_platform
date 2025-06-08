"use client"

import { useState } from "react"
import { deleteClass } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface DeleteClassButtonProps {
  classId: string
  lecturerId: string
  className: string
}

export default function DeleteClassButton({ classId, lecturerId, className }: DeleteClassButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  async function handleDelete() {
    setIsLoading(true)

    try {
      const result = await deleteClass(classId, lecturerId)

      if (result.success) {
        toast({
          title: "Class deleted",
          description: "Your class has been deleted successfully",
        })
        setIsOpen(false)
      } else {
        toast({
          title: "Failed to delete class",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Failed to delete class",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Class</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Class</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{className}&quot;? This action cannot be undone. All students will be
            removed from the class and all class data will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? "Deleting..." : "Delete Class"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
