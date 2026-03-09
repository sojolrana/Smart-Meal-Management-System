<?php
require_once 'config.php';

$input = json_decode(file_get_contents('php://input'), true);
$email = isset($input['email']) ? $input['email'] : '';

if (empty($email)) {
    echo json_encode(["status" => "error", "message" => "Email is required"]);
    exit();
}

try {
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    
    if ($stmt->rowCount() > 0) {
        echo json_encode([
            "status" => "success", 
            "message" => "If this email is registered, we have sent a password reset link."
        ]);
    } else {
        echo json_encode([
            "status" => "error", 
            "message" => "Email not found in our records."
        ]);
    }

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Database error"]);
}
?>