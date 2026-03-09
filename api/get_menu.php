<?php
require_once 'config.php';
header("Content-Type: application/json");

$date = isset($_GET['date']) ? $_GET['date'] : date('Y-m-d', strtotime('+1 day'));

try {
    $stmt = $conn->prepare("SELECT lunch, dinner FROM daily_menu WHERE menu_date = ?");
    $stmt->execute([$date]);
    $menu = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($menu) {
        echo json_encode(["status" => "success", "data" => $menu]);
    } else {
        echo json_encode([
            "status" => "success", 
            "data" => ["lunch" => "", "dinner" => ""]
        ]);
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Error fetching menu"]);
}
?>