<?php
require_once 'config.php';
session_start();

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') { 
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit(); 
}

$input = json_decode(file_get_contents('php://input'), true);
$student_id_no = $input['student_id'];
$action = strtoupper($input['action']);
$date = date('Y-m-d', strtotime('+1 day'));
$meal_cost = 60.00;

try {
    $conn->beginTransaction();

    $stmt = $conn->prepare("SELECT user_id, wallet_balance FROM students WHERE student_id_no = ? FOR UPDATE");
    $stmt->execute([$student_id_no]);
    $student = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$student) {
        throw new Exception("Student ID not found");
    }

    $uid = $student['user_id'];
    $current_balance = floatval($student['wallet_balance']);

    $stmt = $conn->prepare("SELECT is_active FROM meal_attendance WHERE user_id = ? AND meal_date = ?");
    $stmt->execute([$uid, $date]);
    $status_row = $stmt->fetchColumn();

    $current_status = ($status_row === false) ? 0 : $status_row;
    $target_status = ($action === 'ON') ? 1 : 0;

    if ($current_status == $target_status) {
        $conn->rollBack();
        echo json_encode(["status" => "success", "message" => "Meal is already $action for this student."]);
        exit();
    }

    if ($action === 'ON') {
        $new_balance = $current_balance - $meal_cost;

        $stmt = $conn->prepare("UPDATE students SET wallet_balance = ? WHERE user_id = ?");
        $stmt->execute([$new_balance, $uid]);

        $stmt = $conn->prepare("INSERT INTO transactions (user_id, amount, type, description) VALUES (?, ?, 'debit', ?)");
        $stmt->execute([$uid, $meal_cost, "Meal Booking (by Admin)"]);

        $sql = "INSERT INTO meal_attendance (user_id, meal_date, is_active) VALUES (?, ?, 1) 
                ON DUPLICATE KEY UPDATE is_active = 1";
        $conn->prepare($sql)->execute([$uid, $date]);

    } else {
        $new_balance = $current_balance + $meal_cost;

        $stmt = $conn->prepare("UPDATE students SET wallet_balance = ? WHERE user_id = ?");
        $stmt->execute([$new_balance, $uid]);

        $stmt = $conn->prepare("INSERT INTO transactions (user_id, amount, type, description) VALUES (?, ?, 'credit', ?)");
        $stmt->execute([$uid, $meal_cost, "Meal Refunded (by Admin)"]);

        $sql = "INSERT INTO meal_attendance (user_id, meal_date, is_active) VALUES (?, ?, 0) 
                ON DUPLICATE KEY UPDATE is_active = 0";
        $conn->prepare($sql)->execute([$uid, $date]);
    }

    $conn->commit();
    echo json_encode(["status" => "success", "message" => "Meal forced $action. Balance adjusted."]);

} catch (Exception $e) {
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>