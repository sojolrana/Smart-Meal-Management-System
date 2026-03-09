<?php
require_once 'config.php';
session_start();

if (!isset($_SESSION['user_id']) || 
   ($_SESSION['role'] !== 'kitchen_staff' && $_SESSION['role'] !== 'admin')) {
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);
$date = isset($input['date']) ? $input['date'] : date('Y-m-d', strtotime('+1 day'));
$filter = isset($input['filter']) ? $input['filter'] : 'all'; // 'all', 'on', 'off'

try {
    $sql = "SELECT s.full_name, s.student_id_no, s.department, 
            COALESCE(ma.is_active, 0) as status
            FROM students s
            JOIN users u ON s.user_id = u.id
            LEFT JOIN meal_attendance ma ON s.user_id = ma.user_id AND ma.meal_date = ?
            WHERE u.is_approved = 1
            ORDER BY status DESC, s.student_id_no ASC";
            
    $stmt = $conn->prepare($sql);
    $stmt->execute([$date]);
    $all_students = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $on_count = 0;
    $off_count = 0;
    $filtered_list = [];

    foreach ($all_students as $student) {
        if ($student['status'] == 1) {
            $on_count++;
        } else {
            $off_count++;
        }

        if ($filter === 'all') {
            $filtered_list[] = $student;
        } elseif ($filter === 'on' && $student['status'] == 1) {
            $filtered_list[] = $student;
        } elseif ($filter === 'off' && $student['status'] == 0) {
            $filtered_list[] = $student;
        }
    }

    echo json_encode([
        "status" => "success",
        "date" => $date,
        "on_count" => $on_count,
        "off_count" => $off_count,
        "list" => $filtered_list
    ]);

} catch (PDOException $e) { 
    echo json_encode(["status" => "error", "message" => $e->getMessage()]); 
}
?>