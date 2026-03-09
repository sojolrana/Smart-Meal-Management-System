<?php
require_once 'config.php';
session_start();

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') { exit(); }

$input = json_decode(file_get_contents('php://input'), true);
$student_id_no = $input['student_id'];
$amount = floatval($input['amount']);

if($amount <= 0) {
    echo json_encode(["status" => "error", "message" => "Invalid amount"]);
    exit();
}

try {
    $conn->beginTransaction();

    $stmt = $conn->prepare("SELECT user_id, full_name FROM students WHERE student_id_no = ?");
    $stmt->execute([$student_id_no]);
    $student = $stmt->fetch(PDO::FETCH_ASSOC);

    if(!$student) {
        throw new Exception("Student ID not found.");
    }

    $upd = $conn->prepare("UPDATE students SET wallet_balance = wallet_balance + ? WHERE user_id = ?");
    $upd->execute([$amount, $student['user_id']]);

    $ins = $conn->prepare("INSERT INTO transactions (user_id, amount, type, description) VALUES (?, ?, 'credit', ?)");
    $ins->execute([$student['user_id'], $amount, "Recharge by Admin"]);

    $conn->commit();
    echo json_encode(["status" => "success", "message" => "Added $amount TK to " . $student['full_name']]);

} catch (Exception $e) {
    $conn->rollBack();
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>