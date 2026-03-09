<?php
require_once 'config.php';
session_start();
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') exit();

$input = json_decode(file_get_contents('php://input'), true);
try {
    $stmt = $conn->prepare("UPDATE notices SET title = ?, message = ? WHERE id = ?");
    $stmt->execute([$input['title'], $input['message'], $input['id']]);
    echo json_encode(["status" => "success", "message" => "Updated"]);
} catch (Exception $e) { echo json_encode(["status" => "error"]); }
?>