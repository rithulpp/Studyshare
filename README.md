# StudyShare 🎓 - Student Notes Sharing & PYQ Portal

> A modern, full-featured academic collaboration platform for college students to upload, organize, search, preview, and download study notes, previous year question papers (PYQs), and syllabus permanently.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff.svg)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-4.21-000000.svg)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4.0-38bdf8.svg)](https://tailwindcss.com/)
[![PHP](https://img.shields.io/badge/PHP-7.4%20%7C%208.x-777bb4.svg)](https://www.php.net/)
[![MySQL](https://img.shields.io/badge/MySQL-5.7+-4479a1.svg)](https://www.mysql.com/)

---

## 🚀 Key Features

1. **Student Registration & Login**:
   - Secure student authentication with semester, department, college name, and roll number.
   - Demo student auto-fill shortcut for instant evaluation.

2. **Permanent Server-Side PDF Storage**:
   - Uploaded files are written directly to server disk storage (`uploads/`).
   - Permanent metadata records ensure shared notes remain saved even after browser refresh or server restart.

3. **Search & Multi-Filter Engine**:
   - Instant search by subject name, course code (e.g. `CS301`), title, or topics.
   - Filter by **Semester (1st to 8th)** and **Department** (Computer Science, IT, Mechanical, Civil, Electronics, Electrical, Applied Sciences).
   - Filter by material category (Lecture Notes, Question Papers/PYQs, Syllabus, Lab Manuals) and sort orders.

4. **In-Browser PDF Viewer & Direct Downloads**:
   - Built-in PDF reader with responsive preview iframe and full-page viewing.
   - One-click file downloads with original filenames and proper `Content-Disposition` headers.
   - Student ratings (1 to 5 stars) and personal bookmarking to revision library.

5. **Previous Year Question Papers (PYQ) Hub**:
   - Dedicated exam preparation section filterable by examination year (2020 to 2025), semester, and department.

6. **Student Dashboard**:
   - Real-time download counters, view counts, and total files contributed.
   - Management table for uploaded notes with preview, download, and delete actions.
   - Saved bookmarks library for quick exam revision.

7. **Contact & Feedback Center**:
   - Working feedback form with rating selection, missing note requests, and bug reports.

8. **Dual-Stack Implementation (Node.js & PHP/MySQL)**:
   - **Active Full-Stack App**: Runs on Node.js/Express + React + Vite with permanent disk storage.
   - **Included PHP & MySQL Project**: Standalone PHP 8.x backend files and `db.sql` database dump included in `/php_backend/` for college project submissions and XAMPP hosting.

---

## 📁 Repository Structure

```
studyshare/
├── php_backend/                # Standalone PHP & MySQL backend
│   ├── config.php              # PDO MySQL connection
│   ├── db.sql                  # Database schema & seed records
│   ├── download.php            # Secure PDF streamer & download counter
│   ├── feedback.php            # Feedback & contact form handler
│   ├── get_notes.php           # Search & filter REST handler
│   ├── login.php               # Student authentication endpoint
│   ├── register.php            # Student registration endpoint
│   ├── upload.php              # Strict PDF upload validation & storage
│   └── README.md               # XAMPP / WAMP / cPanel setup guide
├── src/                        # React + TypeScript Frontend
│   ├── components/
│   │   ├── AuthModal.tsx       # Student login & registration modal
│   │   ├── ContactFeedbackView.tsx # Contact & feedback form
│   │   ├── DashboardView.tsx   # Student dashboard & upload manager
│   │   ├── FilterBar.tsx       # Department & semester filters
│   │   ├── Footer.tsx          # Responsive footer
│   │   ├── HeroSection.tsx     # Homepage hero with live search
│   │   ├── Navbar.tsx          # Navigation header & user status
│   │   ├── NoteCard.tsx        # Resource display card (zero-pill design)
│   │   ├── NotesGrid.tsx       # Notes catalog grid & skeleton loaders
│   │   ├── PdfViewerModal.tsx  # In-browser PDF stream reader
│   │   ├── PhpSourceModal.tsx  # Interactive PHP code inspector & export
│   │   └── PYQSection.tsx      # Previous year question papers hub
│   ├── App.tsx                 # Root application component
│   ├── main.tsx                # Frontend entry point
│   ├── index.css               # Tailwind CSS imports
│   └── types.ts                # TypeScript interfaces & constants
├── data/                       # Persistent JSON database (Node.js mode)
│   ├── notes.json              # Notes catalog & metadata
│   ├── users.json              # Registered students
│   └── feedback.json           # Contact submissions
├── uploads/                    # Server-side permanent PDF storage
├── server.ts                   # Express full-stack server & Vite middleware
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🛠️ Quick Start Guide

### Option 1: Running the Modern Full-Stack App (Node.js + React)

#### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn

#### 2. Installation
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/studyshare-student-portal.git

# Navigate into the project folder
cd studyshare-student-portal

# Install dependencies
npm install
```

#### 3. Start Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

#### 4. Build for Production
```bash
npm run build
npm start
```

---

### Option 2: Running the PHP & MySQL Version (XAMPP / WAMP / cPanel)

If you need to run or submit the project as a classic PHP/MySQL web application:

1. Copy the files inside `php_backend/` into your web server root (e.g., `C:/xampp/htdocs/studyshare/` or `public_html/`).
2. Open **phpMyAdmin** (`http://localhost/phpmyadmin`).
3. Create a new database named `studyshare_db`.
4. Import `php_backend/db.sql`.
5. Verify credentials in `php_backend/config.php`:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_USER', 'root');
   define('DB_PASS', '');
   define('DB_NAME', 'studyshare_db');
   ```
6. Ensure the `uploads/` directory has write permissions (`chmod 775 uploads` on Linux).

---

## 🔒 Security & Validation Highlights

- **Strict File Type Verification**: Validates PDF MIME type (`application/pdf`) and magic bytes, preventing arbitrary script or executable uploads.
- **Unique Hash Filenames**: Prevents filename collision and directory traversal vulnerabilities while preserving user-friendly original file names on download.
- **Parameterized SQL / PDO**: Zero SQL injection risk through prepared statements with parameter bindings.
- **Client & Server Validation**: Enforces semester range (1–8), required subject and title metadata, and maximum file size limits (25MB–28MB).

---

## 📄 License
This project is open-source and released under the [Apache-2.0 License](LICENSE). Built for college students, educators, and academic peer sharing.
