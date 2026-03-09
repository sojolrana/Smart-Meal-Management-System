<?php
require_once 'config.php';

$today = date('Y-m-d');
$MEAL_COST = 50;
$count = 0;

try {
    $conn->beginTransaction();

    $sql = "SELECT user_id FROM meal_attendance WHERE meal_date = ? AND is_active = 1";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$today]);
    $students = $stmt->fetchAll(PDO::FETCH_COLUMN);

    foreach ($students as $uid) {
        $upd = $conn->prepare("UPDATE students SET wallet_balance = wallet_balance - ? WHERE user_id = ?");
        $upd->execute([$MEAL_COST, $uid]);

        $ins = $conn->prepare("INSERT INTO transactions (user_id, amount, type, description) VALUES (?, ?, 'debit', ?)");
        $ins->execute([$uid, $MEAL_COST, "Meal Charge for $today"]);
        
        $count++;
    }

    $conn->commit();
    echo "Success: Deducted money from $count students for $today.";

} catch (Exception $e) {
    $conn->rollBack();
    echo "Error: " . $e->getMessage();
}
?>