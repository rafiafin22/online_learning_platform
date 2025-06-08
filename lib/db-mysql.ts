import mysql from "mysql2/promise"
import { randomUUID } from "crypto"

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "your_password_here",
  database: process.env.DB_NAME || "learning_platform",
  port: Number.parseInt(process.env.DB_PORT || "3306"),
}

// Create connection pool
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export type User = {
  id: string
  username: string
  password: string
  fullName: string
  email: string
  role: string
  classId?: string
  createdAt: Date
}

export type Session = {
  id: string
  userId: string
  createdAt: Date
}

export type Class = {
  id: string
  name: string
  code: string
  lecturerId: string
  createdAt: Date
}

export type Schedule = {
  id: string
  classId: string
  day: string
  startTime: string
  endTime: string
  title: string
  createdAt: Date
}

export type Assignment = {
  id: string
  classId: string
  title: string
  dueDate: Date
  instructionsUrl: string
  createdAt: Date
}

export type Submission = {
  id: string
  assignmentId: string
  studentId: string
  submissionUrl: string
  score?: number
  feedback?: string
  submittedAt: Date
  gradedAt?: Date
}

export type Attendance = {
  id: string
  classId: string
  title: string
  date: Date
  createdAt: Date
}

export type AttendanceRecord = {
  id: string
  attendanceId: string
  studentId: string
  status: "present" | "absent" | "late"
}

export const db = {
  users: {
    findById: async (id: string): Promise<User | null> => {
      const [rows] = await pool.execute(
        "SELECT id, username, password, full_name as fullName, email, role, class_id as classId, created_at as createdAt FROM users WHERE id = ?",
        [id],
      )
      const users = rows as User[]
      return users[0] || null
    },

    findByUsername: async (username: string): Promise<User | null> => {
      const [rows] = await pool.execute(
        "SELECT id, username, password, full_name as fullName, email, role, class_id as classId, created_at as createdAt FROM users WHERE username = ?",
        [username],
      )
      const users = rows as User[]
      return users[0] || null
    },

    findByEmail: async (email: string): Promise<User | null> => {
      const [rows] = await pool.execute(
        "SELECT id, username, password, full_name as fullName, email, role, class_id as classId, created_at as createdAt FROM users WHERE email = ?",
        [email],
      )
      const users = rows as User[]
      return users[0] || null
    },

    findBySessionId: async (sessionId: string): Promise<User | null> => {
      const [rows] = await pool.execute(
        `SELECT u.id, u.username, u.password, u.full_name as fullName, u.email, u.role, u.class_id as classId, u.created_at as createdAt 
         FROM users u 
         JOIN sessions s ON u.id = s.user_id 
         WHERE s.id = ?`,
        [sessionId],
      )
      const users = rows as User[]
      return users[0] || null
    },

    findStudentsByClassId: async (classId: string): Promise<User[]> => {
      const [rows] = await pool.execute(
        'SELECT id, username, password, full_name as fullName, email, role, class_id as classId, created_at as createdAt FROM users WHERE class_id = ? AND role = "student" ORDER BY full_name',
        [classId],
      )
      return rows as User[]
    },

    findAll: async (): Promise<User[]> => {
      const [rows] = await pool.execute(
        "SELECT id, username, password, full_name as fullName, email, role, class_id as classId, created_at as createdAt FROM users ORDER BY created_at DESC",
      )
      return rows as User[]
    },

    create: async (userData: Omit<User, "id" | "createdAt">): Promise<string> => {
      const id = randomUUID()
      await pool.execute(
        "INSERT INTO users (id, username, password, full_name, email, role, class_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          id,
          userData.username,
          userData.password,
          userData.fullName,
          userData.email,
          userData.role,
          userData.classId || null,
        ],
      )
      return id
    },

    update: async (id: string, userData: Partial<Omit<User, "id" | "createdAt">>): Promise<void> => {
      const fields = []
      const values = []

      if (userData.username) {
        fields.push("username = ?")
        values.push(userData.username)
      }
      if (userData.password) {
        fields.push("password = ?")
        values.push(userData.password)
      }
      if (userData.fullName) {
        fields.push("full_name = ?")
        values.push(userData.fullName)
      }
      if (userData.email) {
        fields.push("email = ?")
        values.push(userData.email)
      }
      if (userData.role) {
        fields.push("role = ?")
        values.push(userData.role)
      }
      if (userData.classId !== undefined) {
        fields.push("class_id = ?")
        values.push(userData.classId)
      }

      if (fields.length > 0) {
        values.push(id)
        await pool.execute(`UPDATE users SET ${fields.join(", ")} WHERE id = ?`, values)
      }
    },

    removeFromClass: async (classId: string): Promise<void> => {
      await pool.execute("UPDATE users SET class_id = NULL WHERE class_id = ?", [classId])
    },

    verifyPassword: async (id: string, password: string): Promise<boolean> => {
      const [rows] = await pool.execute("SELECT password FROM users WHERE id = ?", [id])
      const users = rows as { password: string }[]
      return users[0]?.password === password // In production, use bcrypt.compare
    },
  },

  sessions: {
    create: async (sessionData: Session): Promise<string> => {
      await pool.execute("INSERT INTO sessions (id, user_id) VALUES (?, ?)", [sessionData.id, sessionData.userId])
      return sessionData.id
    },

    delete: async (id: string): Promise<void> => {
      await pool.execute("DELETE FROM sessions WHERE id = ?", [id])
    },
  },

  classes: {
    findById: async (id: string): Promise<Class | null> => {
      const [rows] = await pool.execute(
        "SELECT id, name, code, lecturer_id as lecturerId, created_at as createdAt FROM classes WHERE id = ?",
        [id],
      )
      const classes = rows as Class[]
      return classes[0] || null
    },

    findByCode: async (code: string): Promise<Class | null> => {
      const [rows] = await pool.execute(
        "SELECT id, name, code, lecturer_id as lecturerId, created_at as createdAt FROM classes WHERE code = ?",
        [code],
      )
      const classes = rows as Class[]
      return classes[0] || null
    },

    findByLecturerId: async (lecturerId: string): Promise<Class | null> => {
      const [rows] = await pool.execute(
        "SELECT id, name, code, lecturer_id as lecturerId, created_at as createdAt FROM classes WHERE lecturer_id = ?",
        [lecturerId],
      )
      const classes = rows as Class[]
      return classes[0] || null
    },

    findAll: async (): Promise<Class[]> => {
      const [rows] = await pool.execute(
        "SELECT id, name, code, lecturer_id as lecturerId, created_at as createdAt FROM classes ORDER BY created_at DESC",
      )
      return rows as Class[]
    },

    create: async (classData: Omit<Class, "id" | "createdAt">): Promise<string> => {
      const id = randomUUID()
      await pool.execute("INSERT INTO classes (id, name, code, lecturer_id) VALUES (?, ?, ?, ?)", [
        id,
        classData.name,
        classData.code,
        classData.lecturerId,
      ])
      return id
    },

    delete: async (id: string): Promise<void> => {
      await pool.execute("DELETE FROM classes WHERE id = ?", [id])
    },
  },

  schedules: {
    findByClassId: async (classId: string): Promise<Schedule[]> => {
      const [rows] = await pool.execute(
        'SELECT id, class_id as classId, day, start_time as startTime, end_time as endTime, title, created_at as createdAt FROM schedules WHERE class_id = ? ORDER BY FIELD(day, "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"), start_time',
        [classId],
      )
      return rows as Schedule[]
    },

    create: async (scheduleData: Omit<Schedule, "id" | "createdAt">): Promise<string> => {
      const id = randomUUID()
      await pool.execute(
        "INSERT INTO schedules (id, class_id, day, start_time, end_time, title) VALUES (?, ?, ?, ?, ?, ?)",
        [id, scheduleData.classId, scheduleData.day, scheduleData.startTime, scheduleData.endTime, scheduleData.title],
      )
      return id
    },

    delete: async (id: string): Promise<void> => {
      await pool.execute("DELETE FROM schedules WHERE id = ?", [id])
    },

    deleteByClassId: async (classId: string): Promise<void> => {
      await pool.execute("DELETE FROM schedules WHERE class_id = ?", [classId])
    },
  },

  assignments: {
    findById: async (id: string): Promise<Assignment | null> => {
      const [rows] = await pool.execute(
        "SELECT id, class_id as classId, title, due_date as dueDate, instructions_url as instructionsUrl, created_at as createdAt FROM assignments WHERE id = ?",
        [id],
      )
      const assignments = rows as Assignment[]
      return assignments[0] || null
    },

    findByClassId: async (classId: string): Promise<Assignment[]> => {
      const [rows] = await pool.execute(
        "SELECT id, class_id as classId, title, due_date as dueDate, instructions_url as instructionsUrl, created_at as createdAt FROM assignments WHERE class_id = ? ORDER BY due_date ASC",
        [classId],
      )
      return rows as Assignment[]
    },

    create: async (assignmentData: Omit<Assignment, "id" | "createdAt">): Promise<string> => {
      const id = randomUUID()
      await pool.execute(
        "INSERT INTO assignments (id, class_id, title, due_date, instructions_url) VALUES (?, ?, ?, ?, ?)",
        [id, assignmentData.classId, assignmentData.title, assignmentData.dueDate, assignmentData.instructionsUrl],
      )
      return id
    },

    delete: async (id: string): Promise<void> => {
      await pool.execute("DELETE FROM assignments WHERE id = ?", [id])
    },

    deleteByClassId: async (classId: string): Promise<void> => {
      await pool.execute("DELETE FROM assignments WHERE class_id = ?", [classId])
    },
  },

  submissions: {
    findById: async (id: string): Promise<Submission | null> => {
      const [rows] = await pool.execute(
        "SELECT id, assignment_id as assignmentId, student_id as studentId, submission_url as submissionUrl, score, feedback, submitted_at as submittedAt, graded_at as gradedAt FROM submissions WHERE id = ?",
        [id],
      )
      const submissions = rows as Submission[]
      return submissions[0] || null
    },

    findByAssignmentId: async (assignmentId: string): Promise<Submission[]> => {
      const [rows] = await pool.execute(
        "SELECT id, assignment_id as assignmentId, student_id as studentId, submission_url as submissionUrl, score, feedback, submitted_at as submittedAt, graded_at as gradedAt FROM submissions WHERE assignment_id = ?",
        [assignmentId],
      )
      return rows as Submission[]
    },

    findByStudentId: async (studentId: string): Promise<Submission[]> => {
      const [rows] = await pool.execute(
        "SELECT id, assignment_id as assignmentId, student_id as studentId, submission_url as submissionUrl, score, feedback, submitted_at as submittedAt, graded_at as gradedAt FROM submissions WHERE student_id = ?",
        [studentId],
      )
      return rows as Submission[]
    },

    findByAssignmentAndStudent: async (assignmentId: string, studentId: string): Promise<Submission | null> => {
      const [rows] = await pool.execute(
        "SELECT id, assignment_id as assignmentId, student_id as studentId, submission_url as submissionUrl, score, feedback, submitted_at as submittedAt, graded_at as gradedAt FROM submissions WHERE assignment_id = ? AND student_id = ?",
        [assignmentId, studentId],
      )
      const submissions = rows as Submission[]
      return submissions[0] || null
    },

    create: async (submissionData: Omit<Submission, "id">): Promise<string> => {
      const id = randomUUID()
      await pool.execute(
        "INSERT INTO submissions (id, assignment_id, student_id, submission_url, submitted_at) VALUES (?, ?, ?, ?, ?)",
        [
          id,
          submissionData.assignmentId,
          submissionData.studentId,
          submissionData.submissionUrl,
          submissionData.submittedAt,
        ],
      )
      return id
    },

    update: async (id: string, data: Partial<Submission>): Promise<void> => {
      const fields = []
      const values = []

      if (data.score !== undefined) {
        fields.push("score = ?")
        values.push(data.score)
      }
      if (data.feedback !== undefined) {
        fields.push("feedback = ?")
        values.push(data.feedback)
      }
      if (data.gradedAt !== undefined) {
        fields.push("graded_at = ?")
        values.push(data.gradedAt)
      }

      if (fields.length > 0) {
        values.push(id)
        await pool.execute(`UPDATE submissions SET ${fields.join(", ")} WHERE id = ?`, values)
      }
    },
  },

  attendance: {
    findById: async (id: string): Promise<Attendance | null> => {
      const [rows] = await pool.execute(
        "SELECT id, class_id as classId, title, date, created_at as createdAt FROM attendance WHERE id = ?",
        [id],
      )
      const attendances = rows as Attendance[]
      return attendances[0] || null
    },

    findByClassId: async (classId: string): Promise<Attendance[]> => {
      const [rows] = await pool.execute(
        "SELECT id, class_id as classId, title, date, created_at as createdAt FROM attendance WHERE class_id = ? ORDER BY date DESC",
        [classId],
      )
      return rows as Attendance[]
    },

    findRecordsByAttendanceId: async (attendanceId: string): Promise<AttendanceRecord[]> => {
      const [rows] = await pool.execute(
        "SELECT id, attendance_id as attendanceId, student_id as studentId, status FROM attendance_records WHERE attendance_id = ? ORDER BY (SELECT full_name FROM users WHERE id = student_id)",
        [attendanceId],
      )
      return rows as AttendanceRecord[]
    },

    findRecordsByStudentId: async (studentId: string): Promise<AttendanceRecord[]> => {
      const [rows] = await pool.execute(
        "SELECT id, attendance_id as attendanceId, student_id as studentId, status FROM attendance_records WHERE student_id = ?",
        [studentId],
      )
      return rows as AttendanceRecord[]
    },

    create: async (attendanceData: Omit<Attendance, "id" | "createdAt">): Promise<string> => {
      const id = randomUUID()
      await pool.execute("INSERT INTO attendance (id, class_id, title, date) VALUES (?, ?, ?, ?)", [
        id,
        attendanceData.classId,
        attendanceData.title,
        attendanceData.date,
      ])
      return id
    },

    createRecord: async (recordData: Omit<AttendanceRecord, "id">): Promise<string> => {
      const id = randomUUID()

      // Use INSERT ... ON DUPLICATE KEY UPDATE to handle potential duplicates
      await pool.execute(
        `INSERT INTO attendance_records (id, attendance_id, student_id, status) 
         VALUES (?, ?, ?, ?) 
         ON DUPLICATE KEY UPDATE status = VALUES(status)`,
        [id, recordData.attendanceId, recordData.studentId, recordData.status],
      )
      return id
    },

    updateRecord: async (id: string, data: Partial<AttendanceRecord>): Promise<void> => {
      if (data.status) {
        await pool.execute("UPDATE attendance_records SET status = ? WHERE id = ?", [data.status, id])
      }
    },

    deleteByClassId: async (classId: string): Promise<void> => {
      // Delete attendance records first (due to foreign key constraints)
      await pool.execute(
        "DELETE ar FROM attendance_records ar JOIN attendance a ON ar.attendance_id = a.id WHERE a.class_id = ?",
        [classId],
      )
      // Then delete attendance sessions
      await pool.execute("DELETE FROM attendance WHERE class_id = ?", [classId])
    },
  },
}
