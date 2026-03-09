<?php
require_once 'config.php';
session_start();

if (!isset($_SESSION['user_id']) || 
   ($_SESSION['role'] !== 'kitchen_staff' && $_SESSION['role'] !== 'admin')) {
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit();
}

$tomorrow_date = date('Y-m-d', strtotime('+1 day'));

try {
    $sql_on = "SELECT COUNT(*) as total_on FROM meal_attendance 
               WHERE meal_date = ? AND is_active = 1";
    $stmt = $conn->prepare($sql_on);
    $stmt->execute([$tomorrow_date]);
    $count_student = $stmt->fetch(PDO::FETCH_ASSOC)['total_on'];

    $sql_guest = "SELECT SUM(quantity) as total_guest FROM guest_bookings 
                  WHERE booking_date = ?";
    $stmt_guest = $conn->prepare($sql_guest);
    $stmt_guest->execute([$tomorrow_date]);
    $result_guest = $stmt_guest->fetch(PDO::FETCH_ASSOC);
    $count_guest = $result_guest['total_guest'] ? $result_guest['total_guest'] : 0;

    $sql_off = "SELECT COUNT(*) as total_off FROM meal_attendance 
                WHERE meal_date = ? AND is_active = 0";
    $stmt = $conn->prepare($sql_off);
    $stmt->execute([$tomorrow_date]);
    $count_off = $stmt->fetch(PDO::FETCH_ASSOC)['total_off'];

    $sql_list = "SELECT s.full_name, s.student_id_no, s.department, 
                 COALESCE(ma.is_active, 0) as status
                 FROM students s
                 JOIN users u ON s.user_id = u.id
                 LEFT JOIN meal_attendance ma ON s.user_id = ma.user_id AND ma.meal_date = ?
                 WHERE u.is_approved = 1
                 ORDER BY status DESC, s.student_id_no ASC";
                 
    $stmt_list = $conn->prepare($sql_list);
    $stmt_list->execute([$tomorrow_date]);
    $student_list = $stmt_list->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "date" => $tomorrow_date,
        "total_meals" => $count_student + $count_guest,
        "breakdown" => [
            "student" => $count_student,
            "guest" => $count_guest
        ],
        "total_off" => $count_off,
        "student_list" => $student_list
    ]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>