<?php
/**
 * StudyShare - Fetch & Filter Notes API
 * Supports: Search by subject or title, filter by semester, department, category, and sorting
 */

require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');

$search = isset($_GET['search']) ? trim($_GET['search']) : '';
$department = isset($_GET['department']) ? trim($_GET['department']) : '';
$semester = isset($_GET['semester']) ? (int)$_GET['semester'] : 0;
$category = isset($_GET['category']) ? trim($_GET['category']) : '';
$examYear = isset($_GET['exam_year']) ? trim($_GET['exam_year']) : '';
$sort = isset($_GET['sort']) ? trim($_GET['sort']) : 'newest';

$sql = "SELECT id, user_id, student_name, uploader_email, title, subject, subject_code, semester, department, category, exam_year, university, description, original_file_name, file_size, downloads_count, views_count, created_at FROM notes WHERE 1=1";
$params = [];

if (!empty($search)) {
    $sql .= " AND (subject LIKE :search OR title LIKE :search OR subject_code LIKE :search OR description LIKE :search)";
    $params[':search'] = '%' . $search . '%';
}

if (!empty($department) && $department !== 'all') {
    $sql .= " AND department = :dept";
    $params[':dept'] = $department;
}

if ($semester > 0 && $semester <= 8) {
    $sql .= " AND semester = :sem";
    $params[':sem'] = $semester;
}

if (!empty($category) && $category !== 'all') {
    $sql .= " AND category = :cat";
    $params[':cat'] = $category;
}

if (!empty($examYear) && $examYear !== 'all') {
    $sql .= " AND exam_year = :eyear";
    $params[':eyear'] = $examYear;
}

switch ($sort) {
    case 'popular':
    case 'downloads':
        $sql .= " ORDER BY downloads_count DESC, id DESC";
        break;
    case 'views':
        $sql .= " ORDER BY views_count DESC, id DESC";
        break;
    case 'title':
        $sql .= " ORDER BY title ASC";
        break;
    case 'newest':
    default:
        $sql .= " ORDER BY id DESC";
        break;
}

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $notes = $stmt->fetchAll();

    sendJsonResponse([
        'status' => 'success',
        'count'  => count($notes),
        'notes'  => $notes
    ]);
} catch (PDOException $e) {
    sendJsonResponse([
        'status'  => 'error',
        'message' => 'Query error: ' . $e->getMessage()
    ], 500);
}
?>
