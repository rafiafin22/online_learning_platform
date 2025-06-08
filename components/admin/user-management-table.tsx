"use client"

import { useState } from "react"
import { updateUserInfo } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  username: string
  fullName: string
  email: string
  role: string
  classId?: string
}

interface Class {
  id: string
  name: string
  code: string
}

interface UserManagementTableProps {
  users: User[]
  classes: Class[]
}

export default function UserManagementTable({ users, classes }: UserManagementTableProps) {
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  function handleEdit(user: User) {
    setEditingUser(user)
    setFullName(user.fullName)
    setEmail(user.email)
    setPassword("")
  }

  async function handleUpdate() {
    if (!editingUser) return

    setIsLoading(true)

    try {
      const updateData: any = {
        fullName,
        email,
      }

      if (password) {
        updateData.password = password
      }

      const result = await updateUserInfo(editingUser.id, updateData)

      if (result.success) {
        toast({
          title: "User updated",
          description: "User information has been updated successfully",
        })
        setEditingUser(null)
      } else {
        toast({
          title: "Failed to update user",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Failed to update user",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  function getClassName(classId?: string) {
    if (!classId) return "No class"
    const classData = classes.find((c) => c.id === classId)
    return classData ? `${classData.name} (${classData.code})` : "Unknown class"
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.fullName}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant={user.role === "admin" ? "default" : user.role === "lecturer" ? "secondary" : "outline"}>
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>{getClassName(user.classId)}</TableCell>
              <TableCell>
                {user.role !== "admin" && (
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">New Password (optional)</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to keep current password"
              />
            </div>

            <Button onClick={handleUpdate} className="w-full" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update User"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
