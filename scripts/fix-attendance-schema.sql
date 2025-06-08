-- Fix the attendance schema by removing and recreating with proper constraints
USE learning_platform;

-- Drop existing tables in correct order (child tables first)
DROP TABLE IF EXISTS attendance_records;
DROP TABLE IF EXISTS attendance;

-- Recreate attendance table
CREATE TABLE attendance (
    id VARCHAR(36) PRIMARY KEY,
    class_id VARCHAR(36) NOT NULL,
    title VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);

-- Recreate attendance records table
CREATE TABLE attendance_records (
    id VARCHAR(36) PRIMARY KEY,
    attendance_id VARCHAR(36) NOT NULL,
    student_id VARCHAR(36) NOT NULL,
    status ENUM('present', 'absent', 'late') NOT NULL DEFAULT 'absent',
    FOREIGN KEY (attendance_id) REFERENCES attendance(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_attendance_record (attendance_id, student_id)
);
