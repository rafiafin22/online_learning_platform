// This file simulates a database using in-memory storage
// In a real application, this would connect to MySQL

type User = {
  id: string
  username: string
  password: string
  fullName: string
  email: string
  role: string
  classId?: string
  createdAt: Date
}

type Session = {
  id: string
  userId: string
  createdAt: Date
}

type Class = {
  id: string
  name: string
  code: string
  lecturerId: string
  createdAt: Date
}

type Schedule = {
  id: string
  classId: string
  day: string
  startTime: string
  endTime: string
  title: string
  createdAt: Date
}

type Assignment = {
  id: string
  classId: string
  title: string
  dueDate: Date
  instructionsUrl: string
  createdAt: Date
}

type Submission = {
  id: string
  assignmentId: string
  studentId: string
  submissionUrl: string
  score?: number
  feedback?: string
  submittedAt: Date
  gradedAt?: Date
}

type Attendance = {
  id: string
  classId: string
  title: string
  date: Date
  createdAt: Date
}

type AttendanceRecord = {
  id: string
  attendanceId: string
  studentId: string
  status: "present" | "absent" | "late"
}

// In-memory database
let users: User[] = [
  {
    id: "admin-id",
    username: "admin",
    password: "admin", // In a real app, this would be hashed
    fullName: "Admin User",
    email: "admin@example.com",
    role: "admin",
    createdAt: new Date(),
  },
]

let sessions: Session[] = []
let classes: Class[] = []
let schedules: Schedule[] = []
let assignments: Assignment[] = []
const submissions: Submission[] = []
let attendances: Attendance[] = []
let attendanceRecords: AttendanceRecord[] = []

export const db = {
  users: {
    findById: async (id: string) => {
      return users.find((user) => user.id === id)
    },
    findByUsername: async (username: string) => {
      return users.find((user) => user.username === username)
    },
    findByEmail: async (email: string) => {
      return users.find((user) => user.email === email)
    },
    findBySessionId: async (sessionId: string) => {
      const session = sessions.find((s) => s.id === sessionId)
      if (!session) return null
      return users.find((user) => user.id === session.userId)
    },
    findStudentsByClassId: async (classId: string) => {
      return users.filter((user) => user.classId === classId && user.role === "student")
    },
    findAll: async () => {
      return [...users]
    },
    create: async (userData: Omit<User, "id" | "createdAt">) => {
      const id = crypto.randomUUID()
      const newUser = {
        id,
        ...userData,
        createdAt: new Date(),
      }
      users.push(newUser)
      return id
    },
    update: async (id: string, userData: Partial<Omit<User, "id" | "createdAt">>) => {
      const index = users.findIndex((user) => user.id === id)
      if (index !== -1) {
        users[index] = { ...users[index], ...userData }
      }
    },
    removeFromClass: async (classId: string) => {
      users = users.map((user) => {
        if (user.classId === classId) {
          return { ...user, classId: undefined }
        }
        return user
      })
    },
    verifyPassword: async (id: string, password: string) => {
      const user = users.find((user) => user.id === id)
      return user?.password === password // In a real app, this would use bcrypt.compare
    },
  },
  sessions: {
    create: async (sessionData: Session) => {
      sessions.push(sessionData)
      return sessionData.id
    },
    delete: async (id: string) => {
      sessions = sessions.filter((session) => session.id !== id)
    },
  },
  classes: {
    findById: async (id: string) => {
      return classes.find((c) => c.id === id)
    },
    findByCode: async (code: string) => {
      return classes.find((c) => c.code === code)
    },
    findByLecturerId: async (lecturerId: string) => {
      return classes.find((c) => c.lecturerId === lecturerId)
    },
    findAll: async () => {
      return [...classes]
    },
    create: async (classData: Omit<Class, "id" | "createdAt">) => {
      const id = crypto.randomUUID()
      const newClass = {
        id,
        ...classData,
        createdAt: new Date(),
      }
      classes.push(newClass)
      return id
    },
    delete: async (id: string) => {
      classes = classes.filter((c) => c.id !== id)
    },
  },
  schedules: {
    findByClassId: async (classId: string) => {
      return schedules.filter((schedule) => schedule.classId === classId)
    },
    create: async (scheduleData: Omit<Schedule, "id" | "createdAt">) => {
      const id = crypto.randomUUID()
      const newSchedule = {
        id,
        ...scheduleData,
        createdAt: new Date(),
      }
      schedules.push(newSchedule)
      return id
    },
    delete: async (id: string) => {
      schedules = schedules.filter((schedule) => schedule.id !== id)
    },
    deleteByClassId: async (classId: string) => {
      schedules = schedules.filter((schedule) => schedule.classId !== classId)
    },
  },
  assignments: {
    findById: async (id: string) => {
      return assignments.find((assignment) => assignment.id === id)
    },
    findByClassId: async (classId: string) => {
      return assignments.filter((assignment) => assignment.classId === classId)
    },
    create: async (assignmentData: Omit<Assignment, "id" | "createdAt">) => {
      const id = crypto.randomUUID()
      const newAssignment = {
        id,
        ...assignmentData,
        createdAt: new Date(),
      }
      assignments.push(newAssignment)
      return id
    },
    delete: async (id: string) => {
      assignments = assignments.filter((assignment) => assignment.id !== id)
    },
    deleteByClassId: async (classId: string) => {
      assignments = assignments.filter((assignment) => assignment.classId !== classId)
    },
  },
  submissions: {
    findById: async (id: string) => {
      return submissions.find((submission) => submission.id === id)
    },
    findByAssignmentId: async (assignmentId: string) => {
      return submissions.filter((submission) => submission.assignmentId === assignmentId)
    },
    findByStudentId: async (studentId: string) => {
      return submissions.filter((submission) => submission.studentId === studentId)
    },
    findByAssignmentAndStudent: async (assignmentId: string, studentId: string) => {
      return submissions.find(
        (submission) => submission.assignmentId === assignmentId && submission.studentId === studentId,
      )
    },
    create: async (submissionData: Omit<Submission, "id">) => {
      const id = crypto.randomUUID()
      const newSubmission = {
        id,
        ...submissionData,
      }
      submissions.push(newSubmission)
      return id
    },
    update: async (id: string, data: Partial<Submission>) => {
      const index = submissions.findIndex((submission) => submission.id === id)
      if (index !== -1) {
        submissions[index] = { ...submissions[index], ...data }
      }
    },
  },
  attendance: {
    findById: async (id: string) => {
      return attendances.find((attendance) => attendance.id === id)
    },
    findByClassId: async (classId: string) => {
      return attendances.filter((attendance) => attendance.classId === classId)
    },
    findRecordsByAttendanceId: async (attendanceId: string) => {
      return attendanceRecords.filter((record) => record.attendanceId === attendanceId)
    },
    findRecordsByStudentId: async (studentId: string) => {
      return attendanceRecords.filter((record) => record.studentId === studentId)
    },
    create: async (attendanceData: Omit<Attendance, "id" | "createdAt">) => {
      const id = crypto.randomUUID()
      const newAttendance = {
        id,
        ...attendanceData,
        createdAt: new Date(),
      }
      attendances.push(newAttendance)
      return id
    },
    createRecord: async (recordData: Omit<AttendanceRecord, "id">) => {
      const id = crypto.randomUUID()
      const newRecord = {
        id,
        ...recordData,
      }
      attendanceRecords.push(newRecord)
      return id
    },
    updateRecord: async (id: string, data: Partial<AttendanceRecord>) => {
      const index = attendanceRecords.findIndex((record) => record.id === id)
      if (index !== -1) {
        attendanceRecords[index] = { ...attendanceRecords[index], ...data }
      }
    },
    deleteByClassId: async (classId: string) => {
      const attendanceIds = attendances
        .filter((attendance) => attendance.classId === classId)
        .map((attendance) => attendance.id)

      attendanceRecords = attendanceRecords.filter((record) => !attendanceIds.includes(record.attendanceId))

      attendances = attendances.filter((attendance) => attendance.classId !== classId)
    },
  },
}
