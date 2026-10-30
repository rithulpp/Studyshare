<?php
/**
 * StudyShare - Secure PDF Download & Stream Handler
 * Increments download counters and sends proper download headers
 */

require_once __DIR__ . '/config.php';

$noteId = filter_var($_GET['id'] ?? 0, FILTER_VALIDATE_INT);
$streamMode = isset($_GET['stream']) && $_GET['stream'] === '1';

if (!$noteId) {
    http_response_code(400);
    die('Invalid note ID provided.');
}

try {
    $stmt = $pdo->prepare("SELECT * FROM notes WHERE id = :id LIMIT 1");
    $stmt->execute([':id' => $noteId]);
    $note = $stmt->fetch();

    if (!$note) {
        http_response_code(404);
        die('Note not found.');
    }

    $filePath = UPLOAD_DIR . basename($note['file_name']);

    if (!file_exists($filePath)) {
        http_response_code(404);
        die('Requested file does not exist on server.');
    }

    if (!$streamMode) {
        // Increment download count
        $updateStmt = $pdo->prepare("UPDATE notes SET downloads_count = downloads_count + 1 WHERE id = :id");
        $updateStmt->execute([':id' => $noteId]);
    } else {
        // Increment view count
        $updateStmt = $pdo->prepare("UPDATE notes SET views_count = views_count + 1 WHERE id = :id");
        $updateStmt->execute([':id' => $noteId]);
    }

    $filename = $note['original_file_name'] ?: 'studyshare_notes_' . $noteId . '.pdf';
    $sanitizedFilename = str_replace(['"', "'", "\r", "\n"], '', $filename);

    header('Content-Type: application/pdf');
    header('Content-Length: ' . filesize($filePath));
    header('Cache-Control: public, must-revalidate, max-age=0');
    header('Pragma: public');

    if ($streamMode) {
        header('Content-Disposition: inline; filename="' . $sanitizedFilename . '"');
    } else {
        header('Content-Disposition: attachment; filename="' . $sanitizedFilename . '"');
    }

    readfile($filePath);
    exit;

} catch (PDOException $e) {
    http_response_code(500);
    die('Database query failed: ' . htmlspecialchars($e->getMessage()));
}
?>
