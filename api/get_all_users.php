<?php
require_once 'config.php';
session_start();

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit();
}

try {
    $sql = "SELECT u.id, u.email, u.role, u.is_approved, u.is_blocked,
            s.full_name as s_name, s.student_id_no, s.wallet_balance, s.hall_name as s_hall,
            k.full_name as k_name, k.hall_name as k_hall
            FROM users u
            LEFT JOIN students s ON u.id = s.user_id
            LEFT JOIN kitchen_staff k ON u.id = k.user_id
            WHERE u.is_approved = 1 AND u.role != 'admin' 
            ORDER BY u.id DESC";
            
    $users = $conn->query($sql)->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["status" => "success", "data" => $users]);
} catch (PDOException $e) { echo json_encode(["status" => "error"]); }
?>