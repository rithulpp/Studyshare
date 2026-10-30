<?php
/**
 * StudyShare - Student Registration Handler
 */

require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(['status' => 'error', 'message' => 'Method not allowed.'], 405);
}

// Support JSON or Form Data
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true) ?: $_POST;

$name = sanitizeInput($data['name'] ?? '');
$email = filter_var(trim($data['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$password = $data['password'] ?? '';
$department = sanitizeInput($data['department'] ?? 'Computer Science & Engineering');
$semester = (int)($data['semester'] ?? 1);
$collegeName = sanitizeInput($data['college_name'] ?? 'State Institute of Engineering');
$rollNumber = sanitizeInput($data['roll_number'] ?? '');

if (empty($name) || !$email || strlen($password) < 6) {
    sendJsonResponse([
        'status'  => 'error',
        'message' => 'Please provide full name, valid college email, and password of at least 6 characters.'
    ], 400);
}

try {
    // Check if email already registered
    $checkStmt = $pdo->prepare("SELECT id FROM users WHERE email = :email LIMIT 1");
    $checkStmt->execute([':email' => $email]);
    if ($checkStmt->fetch()) {
        sendJsonResponse([
            'status'  => 'error',
            'message' => 'This email address is already registered. Please log in instead.'
        ], 409);
    }

    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    $stmt = $pdo->prepare("
        INSERT INTO users (name, email, password, department, semester, college_name, roll_number)
        VALUES (:name, :email, :password, :department, :semester, :college_name, :roll_number)
    ");
    $stmt->execute([
        ':name'         => $name,
        ':email'        => $email,
        ':password'     => $hashedPassword,
        ':department'   => $department,
        ':semester'     => $semester,
        ':college_name' => $collegeName,
        ':roll_number'  => $rollNumber
    ]);

    $userId = $pdo->lastInsertId();
    $_SESSION['user_id'] = $userId;
    $_SESSION['user_name'] = $name;
    $_SESSION['user_email'] = $email;

    sendJsonResponse([
        'status'  => 'success',
        'message' => 'Student registration successful!',
        'user'    => [
            'id'          => $userId,
            'name'        => $name,
            'email'       => $email,
            'department'  => $department,
            'semester'    => $semester,
            'college_name'=> $collegeName
        ]
    ], 201);

} catch (PDOException $e) {
    sendJsonResponse(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()], 500);
}
?>
