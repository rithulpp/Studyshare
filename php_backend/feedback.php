<?php
/**
 * StudyShare - Contact & Student Feedback Handler
 */

require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(['status' => 'error', 'message' => 'Method not allowed.'], 405);
}

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true) ?: $_POST;

$name = sanitizeInput($data['name'] ?? '');
$email = filter_var(trim($data['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$subject = sanitizeInput($data['subject'] ?? 'Student Inquiry');
$category = sanitizeInput($data['category'] ?? 'General');
$rating = (int)($data['rating'] ?? 5);
$message = sanitizeInput($data['message'] ?? '');

if (empty($name) || !$email || empty($message)) {
    sendJsonResponse(['status' => 'error', 'message' => 'Name, email, and message are required.'], 400);
}

try {
    $stmt = $pdo->prepare("
        INSERT INTO feedback (name, email, subject, category, rating, message)
        VALUES (:name, :email, :subject, :category, :rating, :message)
    ");
    $stmt->execute([
        ':name'     => $name,
        ':email'    => $email,
        ':subject'  => $subject,
        ':category' => $category,
        ':rating'   => max(1, min(5, $rating)),
        ':message'  => $message
    ]);

    sendJsonResponse([
        'status'  => 'success',
        'message' => 'Thank you! Your feedback has been received and logged.'
    ], 201);

} catch (PDOException $e) {
    sendJsonResponse(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()], 500);
}
?>
