<?php
require_once 'config.php';
session_start();

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit();
}

try {
    
    $sql = "SELECT u.id, u.email, u.role, u.created_at, 
            s.full_name as s_name, s.student_id_no, 
            k.full_name as k_name 
            FROM users u
            LEFT JOIN students s ON u.id = s.user_id
            LEFT JOIN kitchen_staff k ON u.id = k.user_id
            WHERE u.is_approved = 0";
            
    $stmt = $conn->query($sql);
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["status" => "success", "data" => $users]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>