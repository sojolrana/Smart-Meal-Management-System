<?php
require_once 'config.php';
session_start();

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'student') {
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);
$amount = isset($input['amount']) ? floatval($input['amount']) : 0;
$method = isset($input['method']) ? $input['method'] : 'Unknown';

if ($amount <= 0) {
    echo json_encode(["status" => "error", "message" => "Invalid amount"]);
    exit();
}

try {
    $conn->beginTransaction();

    $stmt = $conn->prepare("UPDATE students SET wallet_balance = wallet_balance + ? WHERE user_id = ?");
    $stmt->execute([$amount, $_SESSION['user_id']]);

    $desc = "Recharge via " . ucfirst($method);
    $stmt = $conn->prepare("INSERT INTO transactions (user_id, amount, type, description) VALUES (?, ?, 'credit', ?)");
    $stmt->execute([$_SESSION['user_id'], $amount, $desc]);

    $conn->commit();
    echo json_encode(["status" => "success", "message" => "Recharge successful!"]);

} catch (Exception $e) {
    $conn->rollBack();
    echo json_encode(["status" => "error", "message" => "System error"]);
}
?>