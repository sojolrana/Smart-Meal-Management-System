<?php
require_once 'config.php';
session_start();

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'student') {
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);
$status = intval($input['status']); 
$target_date = isset($input['date']) ? $input['date'] : date('Y-m-d', strtotime('+1 day'));
$user_id = $_SESSION['user_id'];
$MEAL_COST = 60; 

$today_date = date('Y-m-d');
$tomorrow_date = date('Y-m-d', strtotime('+1 day'));
$current_hour = intval(date('H'));

if ($target_date <= $today_date) {
    echo json_encode(["status" => "error", "message" => "Modifications for today are closed."]);
    exit();
}

if ($target_date === $tomorrow_date && $current_hour >= 22) {
    echo json_encode(["status" => "error", "message" => "Time's up! Deadline for tomorrow was 10:00 PM."]);
    exit();
}

try {
    $conn->beginTransaction();

    $stmt = $conn->prepare("SELECT is_active FROM meal_attendance WHERE user_id = ? AND meal_date = ?");
    $stmt->execute([$user_id, $target_date]);
    $existing = $stmt->fetchColumn();
    $current_status = ($existing === false) ? 0 : $existing;

    if ($status === 1 && $current_status == 0) {
        $stmt = $conn->prepare("SELECT wallet_balance FROM students WHERE user_id = ?");
        $stmt->execute([$user_id]);
        if ($stmt->fetchColumn() < $MEAL_COST) throw new Exception("Insufficient Balance! Need $MEAL_COST TK.");

        $conn->prepare("UPDATE students SET wallet_balance = wallet_balance - ? WHERE user_id = ?")->execute([$MEAL_COST, $user_id]);
        $conn->prepare("INSERT INTO transactions (user_id, amount, type, description) VALUES (?, ?, 'debit', ?)")->execute([$user_id, $MEAL_COST, "Meal Booking ($target_date)"]);

    } elseif ($status === 0 && $current_status == 1) {
        $conn->prepare("UPDATE students SET wallet_balance = wallet_balance + ? WHERE user_id = ?")->execute([$MEAL_COST, $user_id]);
        $conn->prepare("INSERT INTO transactions (user_id, amount, type, description) VALUES (?, ?, 'credit', ?)")->execute([$user_id, $MEAL_COST, "Meal Refund ($target_date)"]);
    }

    $sql = "INSERT INTO meal_attendance (user_id, meal_date, is_active) VALUES (?, ?, ?) 
            ON DUPLICATE KEY UPDATE is_active = VALUES(is_active)";
    $conn->prepare($sql)->execute([$user_id, $target_date, $status]);

    $conn->commit();
    echo json_encode(["status" => "success", "message" => "Meal updated for $target_date", "new_status" => $status]);

} catch (Exception $e) {
    $conn->rollBack();
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>