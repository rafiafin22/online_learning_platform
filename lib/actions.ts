"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { db } from "@/lib/db-mysql"
import { createSession, destroySession } from "@/lib/auth"
import { uploadToBlob } from "@/lib/storage"

export async function login(username: string, password: string) {
  try {
    const user = await db.users.findByUsername(username)

    if (!user) {
      return { success: false, error: "Invalid username or password" }
    }

    const isPasswordValid = await db.users.verifyPassword(user.id, password)

    if (!isPasswordValid) {
      return { success: false, error: "Invalid username or password" }
    }

    await createSession(user)

    return {
      success: true,
      role: user.role,
    }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function register(userData: {
  username: string
  password: string
  fullName: string
  email: string
  role: string
}) {
  try {
    const existingUser = await db.users.findByUsername(userData.username)

    if (existingUser) {
      return { success: false, error: "Username already exists" }
    }

    const existingEmail = await db.users.findByEmail(userData.email)

    if (existingEmail) {
      return { success: false, error: "Email already exists" }
    }

    await db.users.create({
      username: userData.username,
      password: userData.password,
      fullName: userData.fullName,
      email: userData.email,
      role: userData.role,
    })

    return { success: true }
  } catch (error) {
    console.error("Registration error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function logout() {
  await destroySession()
  redirect("/")
}

export async function createClass(lecturerId: string, className: string) {
  try {
    // Check if lecturer already has a class
    const lecturer = await db.users.findById(lecturerId)

    if (lecturer.classId) {
      return { success: false, error: "You already have an active class" }
    }

    // Generate a random 5-digit class code
    const classCode = Math.floor(10000 + Math.random() * 90000).toString()

    const classId = await db.classes.create({
      name: className,
      code: classCode,
      lecturerId,
    })

    // Update lecturer with class ID
    await db.users.update(lecturerId, { classId })

    revalidatePath("/lecturer/dashboard")
    return { success: true, classId, classCode }
  } catch (error) {
    console.error("Create class error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function joinClass(studentId: string, classCode: string) {
  try {
    // Check if student already has a class
    const student = await db.users.findById(studentId)

    if (student.classId) {
      return { success: false, error: "You already joined a class" }
    }

    // Find class by code
    const classData = await db.classes.findByCode(classCode)

    if (!classData) {
      return { success: false, error: "Invalid class code" }
    }

    // Update student with class ID
    await db.users.update(studentId, { classId: classData.id })

    revalidatePath("/student/dashboard")
    return { success: true, classId: classData.id }
  } catch (error) {
    console.error("Join class error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function exitClass(userId: string) {
  try {
    await db.users.update(userId, { classId: null })
    revalidatePath("/student/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Exit class error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function deleteClass(classId: string, lecturerId: string) {
  try {
    // Remove class ID from all students in the class
    await db.users.removeFromClass(classId)

    // Remove class ID from lecturer
    await db.users.update(lecturerId, { classId: null })

    // Delete all class data
    await db.schedules.deleteByClassId(classId)
    await db.assignments.deleteByClassId(classId)
    await db.attendance.deleteByClassId(classId)
    await db.classes.delete(classId)

    revalidatePath("/lecturer/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Delete class error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function createSchedule(
  classId: string,
  scheduleData: {
    day: string
    startTime: string
    endTime: string
    title: string
  },
) {
  try {
    await db.schedules.create({
      classId,
      day: scheduleData.day,
      startTime: scheduleData.startTime,
      endTime: scheduleData.endTime,
      title: scheduleData.title,
    })

    revalidatePath("/lecturer/schedule")
    return { success: true }
  } catch (error) {
    console.error("Create schedule error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function deleteSchedule(scheduleId: string) {
  try {
    await db.schedules.delete(scheduleId)
    revalidatePath("/lecturer/schedule")
    return { success: true }
  } catch (error) {
    console.error("Delete schedule error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function createAssignment(
  classId: string,
  assignmentData: {
    title: string
    dueDate: string
    instructions: File
  },
) {
  try {
    // Upload instruction file to blob storage
    const instructionsUrl = await uploadToBlob(
      assignmentData.instructions,
      `assignments/${classId}/${crypto.randomUUID()}`,
    )

    await db.assignments.create({
      classId,
      title: assignmentData.title,
      dueDate: new Date(assignmentData.dueDate),
      instructionsUrl,
    })

    revalidatePath("/lecturer/assignments")
    return { success: true }
  } catch (error) {
    console.error("Create assignment error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function deleteAssignment(assignmentId: string) {
  try {
    await db.assignments.delete(assignmentId)
    revalidatePath("/lecturer/assignments")
    return { success: true }
  } catch (error) {
    console.error("Delete assignment error:", error)
    return { success: false, error: "Failed to delete assignment" }
  }
}

export async function submitAssignment(assignmentId: string, studentId: string, submissionFile: File) {
  try {
    // Upload submission file to blob storage
    const submissionUrl = await uploadToBlob(
      submissionFile,
      `submissions/${assignmentId}/${studentId}/${crypto.randomUUID()}`,
    )

    await db.submissions.create({
      assignmentId,
      studentId,
      submissionUrl,
      submittedAt: new Date(),
    })

    revalidatePath("/student/assignments")
    return { success: true }
  } catch (error) {
    console.error("Submit assignment error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function gradeSubmission(submissionId: string, score: number, feedback: string) {
  try {
    await db.submissions.update(submissionId, {
      score,
      feedback,
      gradedAt: new Date(),
    })

    revalidatePath("/lecturer/assignments")
    return { success: true }
  } catch (error) {
    console.error("Grade submission error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function createAttendance(classId: string, title: string, date: string) {
  try {
    console.log("Creating attendance session:", { classId, title, date })

    const attendanceId = await db.attendance.create({
      classId,
      title,
      date: new Date(date),
    })

    console.log("Attendance session created with ID:", attendanceId)

    // Get all students in the class
    const students = await db.users.findStudentsByClassId(classId)
    console.log("Found students:", students.length)

    // Create attendance records for each student (default to absent)
    for (const student of students) {
      console.log("Creating attendance record for student:", student.fullName)
      try {
        await db.attendance.createRecord({
          attendanceId,
          studentId: student.id,
          status: "absent",
        })
        console.log("Created attendance record for:", student.fullName)
      } catch (recordError) {
        console.error("Error creating attendance record for student:", student.fullName, recordError)
      }
    }

    revalidatePath("/lecturer/attendance")
    return { success: true, attendanceId }
  } catch (error) {
    console.error("Create attendance error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function updateAttendanceRecord(recordId: string, status: "present" | "absent" | "late") {
  try {
    console.log("Updating attendance record:", { recordId, status })

    await db.attendance.updateRecord(recordId, { status })

    console.log("Attendance record updated successfully")

    revalidatePath("/lecturer/attendance")
    return { success: true }
  } catch (error) {
    console.error("Update attendance record error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function updateUserInfo(
  userId: string,
  userData: {
    fullName?: string
    email?: string
    password?: string
  },
) {
  try {
    await db.users.update(userId, userData)
    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Update user info error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
