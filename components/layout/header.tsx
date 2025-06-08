import Link from "next/link"
import type { User } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { logout } from "@/lib/actions"

interface HeaderProps {
  user: User
}

export default function Header({ user }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href={`/${user.role}/dashboard`} className="text-xl font-bold">
            Learning Platform
          </Link>
          <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </span>
        </div>

        <nav className="hidden md:flex items-center space-x-4">
          {user.role === "lecturer" && user.classId && (
            <>
              <Link href="/lecturer/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="/lecturer/schedule" className="text-gray-600 hover:text-gray-900">
                Schedule
              </Link>
              <Link href="/lecturer/assignments" className="text-gray-600 hover:text-gray-900">
                Assignments
              </Link>
              <Link href="/lecturer/attendance" className="text-gray-600 hover:text-gray-900">
                Attendance
              </Link>
              <Link href="/lecturer/rankings" className="text-gray-600 hover:text-gray-900">
                Rankings
              </Link>
            </>
          )}

          {user.role === "student" && user.classId && (
            <>
              <Link href="/student/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="/student/schedule" className="text-gray-600 hover:text-gray-900">
                Schedule
              </Link>
              <Link href="/student/assignments" className="text-gray-600 hover:text-gray-900">
                Assignments
              </Link>
              <Link href="/student/attendance" className="text-gray-600 hover:text-gray-900">
                Attendance
              </Link>
              <Link href="/student/rankings" className="text-gray-600 hover:text-gray-900">
                Rankings
              </Link>
            </>
          )}

          {user.role === "admin" && (
            <>
              <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="/admin/users" className="text-gray-600 hover:text-gray-900">
                Users
              </Link>
              <Link href="/admin/classes" className="text-gray-600 hover:text-gray-900">
                Classes
              </Link>
            </>
          )}

          <Link href={`/${user.role}/help`} className="text-gray-600 hover:text-gray-900">
            Help
          </Link>

          <Link href={`/${user.role}/profile`} className="text-gray-600 hover:text-gray-900">
            Profile
          </Link>
        </nav>

        <form action={logout}>
          <Button variant="outline" size="sm" type="submit">
            Logout
          </Button>
        </form>
      </div>
    </header>
  )
}
