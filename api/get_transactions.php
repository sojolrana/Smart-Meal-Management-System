<?php
require_once 'config.php';
session_start();

if (!isset($_SESSION['user_id'])) { exit(); }

$user_id = $_SESSION['user_id'];

try {
    $sql = "SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 10";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$user_id]);
    $history = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["status" => "success", "data" => $history]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error"]);
}
?>