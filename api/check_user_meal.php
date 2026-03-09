<?php
require_once 'config.php';
session_start();

if (!isset($_SESSION['user_id']) || 
   ($_SESSION['role'] !== 'kitchen_staff' && $_SESSION['role'] !== 'admin')) {
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);
$student_id = isset($input['student_id']) ? trim($input['student_id']) : '';
$date = isset($input['date']) ? $input['date'] : date('Y-m-d');

if(empty($student_id)) {
    echo json_encode(["status" => "error", "message" => "Enter Student ID"]);
    exit();
}

try {
    $stmt = $conn->prepare("SELECT user_id, full_name, photo_path, hall_name FROM students WHERE student_id_no = ?");
    $stmt->execute([$student_id]);
    $student = $stmt->fetch(PDO::FETCH_ASSOC);

    if(!$student) {
        echo json_encode(["status" => "error", "message" => "Student not found"]);
        exit();
    }

    $stmt = $conn->prepare("SELECT is_active FROM meal_attendance WHERE user_id = ? AND meal_date = ?");
    $stmt->execute([$student['user_id'], $date]);
    $status = $stmt->fetchColumn();

    $is_active = ($status === false) ? 0 : $status;

    echo json_encode([
        "status" => "success",
        "data" => [
            "name" => $student['full_name'],
            "hall" => $student['hall_name'],
            "photo" => $student['photo_path'],
            "date" => $date,
            "meal_status" => $is_active
        ]
    ]);

} catch (PDOException $e) { echo json_encode(["status" => "error"]); }
?>