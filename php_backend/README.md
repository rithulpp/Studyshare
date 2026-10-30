# StudyShare - Student Notes Sharing Portal (PHP & MySQL Edition)

## 📌 Project Overview
StudyShare is a full-featured web portal that enables college students to upload, organize, search, preview, and download semester study notes, Previous Year Question Papers (PYQs), syllabi, and lab manuals.

---

## 🛠️ Requirements
- **Web Server:** Apache or NGINX (e.g. XAMPP, WAMP, MAMP, LAMP, or cPanel hosting)
- **PHP Version:** PHP 7.4, PHP 8.0, 8.1, 8.2 or 8.3
- **Database:** MySQL 5.7+ or MariaDB 10.3+
- **PHP Extensions:** `pdo_mysql`, `fileinfo`, `mbstring`, `session`

---

## 🚀 Step-by-Step Setup Instructions

### 1. Database Configuration
1. Open **phpMyAdmin** (usually `http://localhost/phpmyadmin`).
2. Create a new database named `studyshare_db` with `utf8mb4_unicode_ci` collation.
3. Click on the **Import** tab and choose the file:
   ```
   php_backend/db.sql
   ```
4. Click **Go** / **Import**. This creates the `users`, `notes`, and `feedback` tables with initial sample records and indexes.

### 2. Configure Database Credentials
Open `config.php` and verify or update your database credentials:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');       // Your MySQL username
define('DB_PASS', '');           // Your MySQL password
define('DB_NAME', 'studyshare_db');
```

### 3. Configure Upload Directory & Permissions
Ensure the upload directory exists and has write permissions:
```bash
mkdir -p uploads
chmod 775 uploads   # On Linux/cPanel servers
```

### 4. File Structure
```
├── config.php          # Database PDO connection & configuration
├── db.sql              # MySQL database schema & starter seeds
├── register.php        # Secure student registration endpoint
├── login.php           # Student authentication & session creation
├── upload.php          # Validates PDF MIME type, size limit, and saves permanently
├── get_notes.php       # Search, filter by semester/dept/year, and sort
├── download.php        # Securely streams or downloads PDF & increments counters
├── feedback.php        # Feedback & contact form submissions
├── uploads/            # Server-side persistent storage for uploaded PDFs
└── README.md           # Setup instructions
```

### 5. Security Highlights
- **Strict PDF MIME Validation:** Uses PHP `finfo` (magic byte checking) instead of relying solely on client extension to block malicious executable uploads.
- **Filename Randomization:** Prevents file collision or directory traversal by hashing stored filenames while preserving original names on download.
- **SQL Injection Prevention:** 100% prepared PDO statements with parameterized bindings.
- **Password Security:** Passwords hashed with `PASSWORD_BCRYPT`.
