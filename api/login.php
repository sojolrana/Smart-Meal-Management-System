<?php
require_once 'config.php';
session_start(); 

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => "error", "message" => "Invalid Request"]);
    exit();
}

$email = $_POST['email'];
$password = $_POST['password'];

try {
    $stmt = $conn->prepare("SELECT id, password, role, is_approved, is_blocked FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode(["status" => "error", "message" => "User not found."]);
        exit();
    }

    if (!password_verify($password, $user['password'])) {
        echo json_encode(["status" => "error", "message" => "Invalid password."]);
        exit();
    }

    if ($user['is_blocked'] == 1) {
        echo json_encode(["status" => "error", "message" => "Your account has been BLOCKED. Contact Admin."]);
        exit();
    }

    if ($user['is_approved'] == 0) {
        echo json_encode(["status" => "error", "message" => "Account pending, needs Admin approval."]);
        exit();
    }

    $_SESSION['user_id'] = $user['id'];
    $_SESSION['role'] = $user['role'];
    $_SESSION['logged_in'] = true;

    echo json_encode([
        "status" => "success", 
        "message" => "Login successful",
        "role" => $user['role'],
        "redirect_url" => $user['role'] . "_dashboard.html" 
    ]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Database error."]);
}
?>