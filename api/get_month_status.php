<?php
require_once 'config.php';
session_start();
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'student') exit();

$month = isset($_GET['month']) ? $_GET['month'] : date('Y-m'); 
$start_date = "$month-01";
$end_date = date("Y-m-t", strtotime($start_date));

try {
    $stmt = $conn->prepare("SELECT meal_date, is_active FROM meal_attendance WHERE user_id = ? AND meal_date BETWEEN ? AND ?");
    $stmt->execute([$_SESSION['user_id'], $start_date, $end_date]);
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $calendar = [];
    foreach ($data as $row) {
        $calendar[$row['meal_date']] = $row['is_active'];
    }
    echo json_encode(["status" => "success", "data" => $calendar]);
} catch (Exception $e) { echo json_encode(["status" => "error"]); }
?>