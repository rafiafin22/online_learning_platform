import { cookies } from "next/headers"
import { db } from "@/lib/db-mysql"

export type User = {
  id: string
  username: string
  fullName: string
  email: string
  role: "admin" | "lecturer" | "student"
  classId?: string
}

export type Session = {
  id: string
  username: string
  fullName: string
  email: string
  role: "admin" | "lecturer" | "student"
  classId?: string
}

export async function getSession(): Promise<Session | null> {
  const sessionCookie = cookies().get("session")

  if (!sessionCookie) {
    return null
  }

  try {
    const sessionId = sessionCookie.value
    const user = await db.users.findBySessionId(sessionId)

    if (!user) {
      return null
    }

    return {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      role: user.role as "admin" | "lecturer" | "student",
      classId: user.classId,
    }
  } catch (error) {
    console.error("Error getting session:", error)
    return null
  }
}

export async function createSession(user: User): Promise<string> {
  const sessionId = crypto.randomUUID()

  await db.sessions.create({
    id: sessionId,
    userId: user.id,
    createdAt: new Date(),
  })

  cookies().set("session", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  })

  return sessionId
}

export async function destroySession() {
  const sessionCookie = cookies().get("session")

  if (sessionCookie) {
    await db.sessions.delete(sessionCookie.value)
    cookies().delete("session")
  }
}
