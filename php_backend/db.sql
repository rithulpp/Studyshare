-- StudyShare Database Schema
-- Database: studyshare_db

CREATE DATABASE IF NOT EXISTS `studyshare_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `studyshare_db`;

-- --------------------------------------------------------
-- Table structure for table `users`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `department` VARCHAR(100) NOT NULL,
  `semester` TINYINT NOT NULL,
  `college_name` VARCHAR(150) DEFAULT 'State Institute of Engineering & Technology',
  `roll_number` VARCHAR(50) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `notes`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `notes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT DEFAULT NULL,
  `student_name` VARCHAR(100) NOT NULL,
  `uploader_email` VARCHAR(150) DEFAULT NULL,
  `title` VARCHAR(200) NOT NULL,
  `subject` VARCHAR(120) NOT NULL,
  `subject_code` VARCHAR(20) DEFAULT NULL,
  `semester` TINYINT NOT NULL,
  `department` VARCHAR(100) NOT NULL,
  `category` ENUM('notes', 'pyq', 'syllabus', 'lab_manual') NOT NULL DEFAULT 'notes',
  `exam_year` VARCHAR(10) DEFAULT NULL,
  `university` VARCHAR(120) DEFAULT 'State Technical University',
  `description` TEXT DEFAULT NULL,
  `file_name` VARCHAR(255) NOT NULL,
  `original_file_name` VARCHAR(255) NOT NULL,
  `file_size` INT NOT NULL,
  `downloads_count` INT DEFAULT 0,
  `views_count` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX (`subject`),
  INDEX (`semester`),
  INDEX (`department`),
  INDEX (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `feedback`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `feedback` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `subject` VARCHAR(200) NOT NULL,
  `category` VARCHAR(50) NOT NULL DEFAULT 'General',
  `rating` TINYINT DEFAULT 5,
  `message` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Sample initial seed data
-- --------------------------------------------------------
INSERT INTO `users` (`id`, `name`, `email`, `password`, `department`, `semester`, `college_name`, `roll_number`) VALUES
(1, 'Aarav Sharma', 'aarav.sharma@studyshare.edu', '$2y$10$wT8K8U9YQ0g1eZ9sQz.tAe7O9lqW7L5vR1h0B9d4u1M3N7O5X6Y', 'Computer Science & Engineering', 5, 'Apex Engineering College', 'CS2023-042'),
(2, 'Priya Patel', 'priya.patel@studyshare.edu', '$2y$10$wT8K8U9YQ0g1eZ9sQz.tAe7O9lqW7L5vR1h0B9d4u1M3N7O5X6Y', 'Information Technology', 3, 'National Institute of Tech', 'IT2024-118'),
(3, 'Rohan Verma', 'rohan.verma@studyshare.edu', '$2y$10$wT8K8U9YQ0g1eZ9sQz.tAe7O9lqW7L5vR1h0B9d4u1M3N7O5X6Y', 'Mechanical Engineering', 6, 'Metro College of Engineering', 'ME2022-091');

INSERT INTO `notes` (`id`, `user_id`, `student_name`, `uploader_email`, `title`, `subject`, `subject_code`, `semester`, `department`, `category`, `exam_year`, `university`, `description`, `file_name`, `original_file_name`, `file_size`, `downloads_count`, `views_count`) VALUES
(1, 1, 'Aarav Sharma', 'aarav.sharma@studyshare.edu', 'Data Structures & Algorithms Handwritten Complete Notes', 'Data Structures & Algorithms', 'CS301', 3, 'Computer Science & Engineering', 'notes', NULL, 'State Technical University', 'Covers Trees, Binary Search Trees, Graphs, Sorting Algorithms, Dynamic Programming, and Time Complexity Analysis with solved diagrammatic examples.', 'dsa_handwritten_notes_sem3.pdf', 'DSA_Complete_Handwritten_Notes.pdf', 3485760, 482, 1250),
(2, 2, 'Priya Patel', 'priya.patel@studyshare.edu', 'Database Management Systems (DBMS) - Relational Algebra & SQL', 'Database Management Systems', 'CS402', 4, 'Computer Science & Engineering', 'notes', NULL, 'Autonomous Tech University', 'Comprehensive lecture notes on Normalization (1NF to BCNF), Transaction Processing, ACID properties, and Concurrency Control.', 'dbms_lecture_notes_unit1_4.pdf', 'DBMS_Unit1-4_ProfLectureNotes.pdf', 2894100, 319, 870),
(3, 1, 'Aarav Sharma', 'aarav.sharma@studyshare.edu', 'Operating Systems 2024 End-Semester Question Paper with Solutions', 'Operating Systems', 'CS401', 4, 'Computer Science & Engineering', 'pyq', '2024', 'State Technical University', 'Official question paper from May/June 2024 examination with step-by-step solutions for Banker\'s algorithm and CPU scheduling problems.', 'os_pyq_2024_solved.pdf', 'OS_EndSem_2024_QuestionPaper.pdf', 1945600, 563, 1640),
(4, 3, 'Rohan Verma', 'rohan.verma@studyshare.edu', 'Fluid Mechanics & Hydraulic Machinery Comprehensive Guide', 'Fluid Mechanics', 'ME303', 3, 'Mechanical Engineering', 'notes', NULL, 'Metro College of Engineering', 'Includes Bernoulli equation derivations, Navier-Stokes simplified solutions, boundary layer theory, and pump performance curves.', 'fluid_mech_handbook.pdf', 'Fluid_Mechanics_Detailed_Notes.pdf', 4120000, 214, 610),
(5, 2, 'Priya Patel', 'priya.patel@studyshare.edu', 'Object Oriented Programming using Java (OOPs) PYQ 2023', 'Java & OOPs', 'IT302', 3, 'Information Technology', 'pyq', '2023', 'National Institute of Tech', 'Previous year question paper containing 5 units: Polymorphism, Multi-threading, Collections Framework, and Exception Handling.', 'java_pyq_2023.pdf', 'Java_OOP_Nov2023_QuestionPaper.pdf', 1520000, 388, 990);
