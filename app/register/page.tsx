import RegisterForm from "@/components/register-form"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function RegisterPage() {
  const session = await getSession()

  if (session) {
    if (session.role === "admin") {
      redirect("/admin/dashboard")
    } else if (session.role === "lecturer") {
      redirect("/lecturer/dashboard")
    } else {
      redirect("/student/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Register Account</h1>
        <RegisterForm />
      </div>
    </div>
  )
}
