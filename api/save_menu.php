<?php
require_once 'config.php';
session_start();

if (!isset($_SESSION['user_id']) || 
   ($_SESSION['role'] !== 'kitchen_staff' && $_SESSION['role'] !== 'admin')) {
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);
$date = $input['date'];
$lunch = $input['lunch'];
$dinner = $input['dinner'];

try {
    $sql = "INSERT INTO daily_menu (menu_date, lunch, dinner) 
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            lunch = VALUES(lunch), 
            dinner = VALUES(dinner)";
            
    $stmt = $conn->prepare($sql);
    $stmt->execute([$date, $lunch, $dinner]);

    echo json_encode(["status" => "success", "message" => "Menu updated successfully!"]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Database Error: " . $e->getMessage()]);
}
?>