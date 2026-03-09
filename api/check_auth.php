<?php
require_once 'config.php';
session_start();

if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true) {
    echo json_encode([
        "status" => "logged_in",
        "user_id" => $_SESSION['user_id'],
        "role" => $_SESSION['role']
    ]);
} else {
    echo json_encode(["status" => "not_logged_in"]);
}
?>