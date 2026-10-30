<?php
/**
 * StudyShare - Secure PDF Upload Handler
 * Validates PDF mime type, size, stores permanently in server uploads/ directory
 * and registers metadata in MySQL notes table.
 */

require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(['status' => 'error', 'message' => 'Only POST requests are allowed.'], 405);
}

// Ensure upload directory exists
if (!is_dir(UPLOAD_DIR)) {
    mkdir(UPLOAD_DIR, 0755, true);
}

// Validate input fields
$studentName = sanitizeInput($_POST['student_name'] ?? '');
$uploaderEmail = filter_var($_POST['uploader_email'] ?? '', FILTER_VALIDATE_EMAIL) ? $_POST['uploader_email'] : null;
$title = sanitizeInput($_POST['title'] ?? '');
$subject = sanitizeInput($_POST['subject'] ?? '');
$subjectCode = sanitizeInput($_POST['subject_code'] ?? '');
$semester = filter_var($_POST['semester'] ?? 0, FILTER_VALIDATE_INT);
$department = sanitizeInput($_POST['department'] ?? '');
$category = sanitizeInput($_POST['category'] ?? 'notes');
$examYear = sanitizeInput($_POST['exam_year'] ?? '');
$university = sanitizeInput($_POST['university'] ?? 'State Technical University');
$description = sanitizeInput($_POST['description'] ?? '');

$userId = isset($_SESSION['user_id']) ? (int)$_SESSION['user_id'] : null;

if (empty($studentName) || empty($title) || empty($subject) || empty($department) || !$semester || $semester < 1 || $semester > 8) {
    sendJsonResponse([
        'status' => 'error',
        'message' => 'Please provide all required fields: Title, Student Name, Subject, Department, and Semester (1-8).'
    ], 400);
}

// Validate File
if (!isset($_FILES['pdf_file']) || $_FILES['pdf_file']['error'] !== UPLOAD_ERR_OK) {
    sendJsonResponse([
        'status' => 'error',
        'message' => 'No valid PDF file uploaded or upload error occurred.'
    ], 400);
}

$file = $_FILES['pdf_file'];
$originalFileName = basename($file['name']);
$fileSize = $file['size'];
$tmpPath = $file['tmp_name'];

// Check file size limit (25MB)
if ($fileSize > MAX_FILE_SIZE) {
    sendJsonResponse([
        'status' => 'error',
        'message' => 'File size exceeds 25MB limit. Please upload a compressed PDF.'
    ], 400);
}

// Strict PDF MIME validation using finfo
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mimeType = $finfo->file($tmpPath);

if ($mimeType !== 'application/pdf') {
    sendJsonResponse([
        'status' => 'error',
        'message' => 'Security Error: Only valid PDF documents are allowed. Detected: ' . htmlspecialchars($mimeType)
    ], 400);
}

// Generate unique, collision-resistant filename on server
$fileExtension = 'pdf';
$uniqueFileName = 'note_' . time() . '_' . bin2hex(random_bytes(8)) . '.' . $fileExtension;
$destinationPath = UPLOAD_DIR . $uniqueFileName;

// Move file to permanent server storage
if (!move_uploaded_file($tmpPath, $destinationPath)) {
    sendJsonResponse([
        'status' => 'error',
        'message' => 'Failed to save PDF on server. Please check folder permissions.'
    ], 500);
}

// Insert metadata into MySQL database
try {
    $stmt = $pdo->prepare("
        INSERT INTO notes (
            user_id, student_name, uploader_email, title, subject, subject_code,
            semester, department, category, exam_year, university, description,
            file_name, original_file_name, file_size
        ) VALUES (
            :user_id, :student_name, :uploader_email, :title, :subject, :subject_code,
            :semester, :department, :category, :exam_year, :university, :description,
            :file_name, :original_file_name, :file_size
        )
    ");

    $stmt->execute([
        ':user_id'            => $userId,
        ':student_name'       => $studentName,
        ':uploader_email'     => $uploaderEmail,
        ':title'              => $title,
        ':subject'            => $subject,
        ':subject_code'       => $subjectCode,
        ':semester'           => $semester,
        ':department'         => $department,
        ':category'           => in_array($category, ['notes', 'pyq', 'syllabus', 'lab_manual']) ? $category : 'notes',
        ':exam_year'          => !empty($examYear) ? $examYear : null,
        ':university'         => $university,
        ':description'        => $description,
        ':file_name'          => $uniqueFileName,
        ':original_file_name' => $originalFileName,
        ':file_size'          => $fileSize
    ]);

    $insertedId = $pdo->lastInsertId();

    sendJsonResponse([
        'status'  => 'success',
        'message' => 'PDF notes uploaded and stored permanently on server successfully!',
        'note_id' => $insertedId,
        'file'    => [
            'name' => $originalFileName,
            'size' => $fileSize
        ]
    ], 201);

} catch (PDOException $e) {
    // Delete orphan file if database insert fails
    if (file_exists($destinationPath)) {
        unlink($destinationPath);
    }
    sendJsonResponse([
        'status'  => 'error',
        'message' => 'Database error while saving notes: ' . $e->getMessage()
    ], 500);
}
?>
