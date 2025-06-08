"use client"

import { useState } from "react"
import { exitClass } from "@/lib/actions"
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

interface ExitClassButtonProps {
  userId: string
  className: string
}

export default function ExitClassButton({ userId, className }: ExitClassButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  async function handleExit() {
    setIsLoading(true)

    try {
      const result = await exitClass(userId)

      if (result.success) {
        toast({
          title: "Left class",
          description: "You have successfully left the class",
        })
        setIsOpen(false)
      } else {
        toast({
          title: "Failed to leave class",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Failed to leave class",
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
        <Button variant="destructive">Exit Class</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Exit Class</DialogTitle>
          <DialogDescription>
            Are you sure you want to leave &quot;{className}&quot;? You will lose access to all class materials and your
            progress.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleExit} disabled={isLoading}>
            {isLoading ? "Leaving..." : "Exit Class"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
