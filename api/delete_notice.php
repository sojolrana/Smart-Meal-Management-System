<?php
require_once 'config.php';
session_start();
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') exit();

$input = json_decode(file_get_contents('php://input'), true);
try {
    $stmt = $conn->prepare("DELETE FROM notices WHERE id = ?");
    $stmt->execute([$input['id']]);
    echo json_encode(["status" => "success", "message" => "Deleted"]);
} catch (Exception $e) { echo json_encode(["status" => "error"]); }
?>