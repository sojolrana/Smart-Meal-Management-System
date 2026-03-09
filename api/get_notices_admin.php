<?php
require_once 'config.php';
try {
    $stmt = $conn->query("SELECT id, title, message, created_at FROM notices ORDER BY created_at DESC LIMIT 10");
    $notices = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["status" => "success", "data" => $notices]);
} catch (PDOException $e) { echo json_encode(["status" => "error", "data" => []]); }
?>