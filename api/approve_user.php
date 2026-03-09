<?php
require_once 'config.php';
session_start();

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') { exit(); }

$input = json_decode(file_get_contents('php://input'), true);
$target_id = $input['id'];
$action = $input['action']; 

try {
    if($action === 'approve') {
        $stmt = $conn->prepare("UPDATE users SET is_approved = 1 WHERE id = ?");
        $stmt->execute([$target_id]);
        echo json_encode(["status" => "success", "message" => "User Approved!"]);
    } else {
        $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$target_id]);
        echo json_encode(["status" => "success", "message" => "User Rejected and Deleted."]);
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "error"]);
}
?>