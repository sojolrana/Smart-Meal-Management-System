<?php
require_once 'config.php';
session_start();

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'student') { exit(); }

$input = json_decode(file_get_contents('php://input'), true);
$booking_id = $input['booking_id'];
$user_id = $_SESSION['user_id'];

try {
    $conn->beginTransaction();

    $stmt = $conn->prepare("SELECT total_cost, quantity, booking_date FROM guest_bookings WHERE id = ? AND user_id = ?");
    $stmt->execute([$booking_id, $user_id]);
    $booking = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$booking) {
        throw new Exception("Booking not found.");
    }

    $target_date = $booking['booking_date'];
    $today = date('Y-m-d');
    $tomorrow = date('Y-m-d', strtotime('+1 day'));
    $current_hour = intval(date('H'));

    if ($target_date <= $today) {
        throw new Exception("Cannot cancel past/today's bookings.");
    }

    if ($target_date === $tomorrow && $current_hour >= 22) {
        throw new Exception("Too late! Cancellation deadline for tomorrow was 10 PM.");
    }
    // -----------------------

    $refund_amount = $booking['total_cost'];
    $upd = $conn->prepare("UPDATE students SET wallet_balance = wallet_balance + ? WHERE user_id = ?");
    $upd->execute([$refund_amount, $user_id]);

    $del = $conn->prepare("DELETE FROM guest_bookings WHERE id = ?");
    $del->execute([$booking_id]);

    $trans = $conn->prepare("INSERT INTO transactions (user_id, amount, type, description) VALUES (?, ?, 'credit', ?)");
    $trans->execute([$user_id, $refund_amount, "Refund: Guest Cancelled ($target_date)"]);

    $conn->commit();
    echo json_encode(["status" => "success", "message" => "Cancelled & Refunded $refund_amount TK."]);

} catch (Exception $e) {
    $conn->rollBack();
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>