<?php
require_once 'config.php';
session_start();

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'student') {
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);
$quantity = intval($input['quantity']);
$target_date = $input['date']; 
$user_id = $_SESSION['user_id'];
$GUEST_RATE = 70;

if ($quantity < 1) {
    echo json_encode(["status" => "error", "message" => "Invalid quantity"]);
    exit();
}

$today = date('Y-m-d');
$tomorrow = date('Y-m-d', strtotime('+1 day'));
$current_hour = intval(date('H'));

if ($target_date <= $today) {
    echo json_encode(["status" => "error", "message" => "Cannot book for past dates or today."]);
    exit();
}

if ($target_date === $tomorrow && $current_hour >= 22) {
    echo json_encode(["status" => "error", "message" => "Time's up! Booking for tomorrow closes at 10 PM."]);
    exit();
}

$total_cost = $quantity * $GUEST_RATE;

try {
    $conn->beginTransaction();

    $stmt = $conn->prepare("SELECT wallet_balance FROM students WHERE user_id = ?");
    $stmt->execute([$user_id]);
    $balance = $stmt->fetchColumn();

    if ($balance < $total_cost) {
        throw new Exception("Insufficient Balance. Need $total_cost TK.");
    }

    $upd = $conn->prepare("UPDATE students SET wallet_balance = wallet_balance - ? WHERE user_id = ?");
    $upd->execute([$total_cost, $user_id]);

    $ins = $conn->prepare("INSERT INTO guest_bookings (user_id, booking_date, quantity, total_cost) VALUES (?, ?, ?, ?)");
    $ins->execute([$user_id, $target_date, $quantity, $total_cost]);

    $trans = $conn->prepare("INSERT INTO transactions (user_id, amount, type, description) VALUES (?, ?, 'debit', ?)");
    $trans->execute([$user_id, $total_cost, "Guest Booking: $quantity person(s) on $target_date"]);

    $conn->commit();
    echo json_encode(["status" => "success", "message" => "Booked successfully!"]);

} catch (Exception $e) {
    $conn->rollBack();
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>