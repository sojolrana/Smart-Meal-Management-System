<?php
require_once 'config.php';
session_start();
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') { exit(); }

$input = json_decode(file_get_contents('php://input'), true);
try {
    $stmt = $conn->prepare("INSERT INTO notices (title, message, posted_by) VALUES (?, ?, ?)");
    $stmt->execute([$input['title'], $input['message'], $_SESSION['user_id']]);
    echo json_encode(["status" => "success", "message" => "Notice Published"]);
} catch (Exception $e) { echo json_encode(["status" => "error"]); }
?>