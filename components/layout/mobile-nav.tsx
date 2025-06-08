"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import type { User } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { logout } from "@/lib/actions"

interface MobileNavProps {
  user: User
}

export default function MobileNav({ user }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] sm:w-[300px]">
        <div className="flex flex-col h-full">
          <div className="px-2 py-4 border-b">
            <h2 className="text-lg font-bold">Learning Platform</h2>
            <p className="text-sm text-muted-foreground">
              {user.fullName} ({user.role})
            </p>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-2">
            {user.role === "lecturer" && user.classId && (
              <>
                <Link
                  href="/lecturer/dashboard"
                  className="block px-2 py-1 rounded-md hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/lecturer/schedule"
                  className="block px-2 py-1 rounded-md hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  Schedule
                </Link>
                <Link
                  href="/lecturer/assignments"
                  className="block px-2 py-1 rounded-md hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  Assignments
                </Link>
                <Link
                  href="/lecturer/attendance"
                  className="block px-2 py-1 rounded-md hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  Attendance
                </Link>
                <Link
                  href="/lecturer/rankings"
                  className="block px-2 py-1 rounded-md hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  Rankings
                </Link>
              </>
            )}

            {user.role === "student" && user.classId && (
              <>
                <Link
                  href="/student/dashboard"
                  className="block px-2 py-1 rounded-md hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/student/schedule"
                  className="block px-2 py-1 rounded-md hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  Schedule
                </Link>
                <Link
                  href="/student/assignments"
                  className="block px-2 py-1 rounded-md hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  Assignments
                </Link>
                <Link
                  href="/student/attendance"
                  className="block px-2 py-1 rounded-md hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  Attendance
                </Link>
                <Link
                  href="/student/rankings"
                  className="block px-2 py-1 rounded-md hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  Rankings
                </Link>
              </>
            )}

            {user.role === "admin" && (
              <>
                <Link
                  href="/admin/dashboard"
                  className="block px-2 py-1 rounded-md hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/users"
                  className="block px-2 py-1 rounded-md hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  Users
                </Link>
                <Link
                  href="/admin/classes"
                  className="block px-2 py-1 rounded-md hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  Classes
                </Link>
              </>
            )}

            <Link
              href={`/${user.role}/help`}
              className="block px-2 py-1 rounded-md hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              Help
            </Link>

            <Link
              href={`/${user.role}/profile`}
              className="block px-2 py-1 rounded-md hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              Profile
            </Link>
          </nav>

          <div className="px-2 py-4 border-t mt-auto">
            <form action={logout}>
              <Button variant="outline" size="sm" type="submit" className="w-full">
                Logout
              </Button>
            </form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
