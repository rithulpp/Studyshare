<?php
/**
 * StudyShare - Student Login Handler
 */

require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(['status' => 'error', 'message' => 'Method not allowed.'], 405);
}

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true) ?: $_POST;

$email = filter_var(trim($data['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$password = $data['password'] ?? '';

if (!$email || empty($password)) {
    sendJsonResponse(['status' => 'error', 'message' => 'Valid email and password required.'], 400);
}

try {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email LIMIT 1");
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password'])) {
        sendJsonResponse(['status' => 'error', 'message' => 'Invalid email or password credentials.'], 401);
    }

    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_name'] = $user['name'];
    $_SESSION['user_email'] = $user['email'];

    sendJsonResponse([
        'status'  => 'success',
        'message' => 'Login successful! Welcome back, ' . htmlspecialchars($user['name']),
        'user'    => [
            'id'           => $user['id'],
            'name'         => $user['name'],
            'email'        => $user['email'],
            'department'   => $user['department'],
            'semester'     => $user['semester'],
            'college_name' => $user['college_name'],
            'roll_number'  => $user['roll_number']
        ]
    ]);

} catch (PDOException $e) {
    sendJsonResponse(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()], 500);
}
?>
