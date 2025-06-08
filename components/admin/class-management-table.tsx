"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Eye } from "lucide-react"

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
  lecturerId: string
  createdAt: Date
}

interface ClassManagementTableProps {
  classes: Class[]
  users: User[]
}

export default function ClassManagementTable({ classes, users }: ClassManagementTableProps) {
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)

  function getLecturerName(lecturerId: string) {
    const lecturer = users.find((u) => u.id === lecturerId)
    return lecturer ? lecturer.fullName : "Unknown"
  }

  function getClassMembers(classId: string) {
    return users.filter((u) => u.classId === classId)
  }

  function getStudentCount(classId: string) {
    return users.filter((u) => u.classId === classId && u.role === "student").length
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Class Name</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Lecturer</TableHead>
            <TableHead>Students</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.map((classData) => (
            <TableRow key={classData.id}>
              <TableCell className="font-medium">{classData.name}</TableCell>
              <TableCell>
                <Badge variant="outline">{classData.code}</Badge>
              </TableCell>
              <TableCell>{getLecturerName(classData.lecturerId)}</TableCell>
              <TableCell>{getStudentCount(classData.id)}</TableCell>
              <TableCell>{new Date(classData.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" onClick={() => setSelectedClass(classData)}>
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!selectedClass} onOpenChange={() => setSelectedClass(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Class Details</DialogTitle>
            <DialogDescription>
              {selectedClass?.name} ({selectedClass?.code})
            </DialogDescription>
          </DialogHeader>

          {selectedClass && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Lecturer</h4>
                  <p className="text-sm text-muted-foreground">{getLecturerName(selectedClass.lecturerId)}</p>
                </div>
                <div>
                  <h4 className="font-medium">Created</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedClass.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Class Members</h4>
                <div className="space-y-2">
                  {getClassMembers(selectedClass.id).map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="font-medium">{member.fullName}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                      <Badge variant={member.role === "lecturer" ? "secondary" : "outline"}>{member.role}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
