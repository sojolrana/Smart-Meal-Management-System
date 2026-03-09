<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
    exit();
}

$role = $_POST['role'];
$email = $_POST['email'];
$password = password_hash($_POST['password'], PASSWORD_BCRYPT);
$phone = $_POST['phone'];
$fullName = $_POST['full_name'];
$father = $_POST['father_name'];
$mother = $_POST['mother_name'];
$dob = $_POST['dob'] ?: null;
$gender = $_POST['gender'];
$bloodGroup = $_POST['blood_group'];
$presentAddress = $_POST['present_address'];
$permanentAddress = $_POST['permanent_address'];
$hallName = $_POST['hall_name'];

try {
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        throw new Exception("Email already registered!");
    }

    $conn->beginTransaction();

    $stmt = $conn->prepare("INSERT INTO users (email, password, role) VALUES (?, ?, ?)");
    $stmt->execute([$email, $password, $role]);
    $last_id = $conn->lastInsertId();

    function uploadFile($file) {
        if (!isset($file) || $file['error'] !== UPLOAD_ERR_OK) {
            return null; 
        }

        $target_dir = __DIR__ . "/../uploads/"; 
        
        if (!file_exists($target_dir)) {
            if (!mkdir($target_dir, 0777, true)) {
                throw new Exception("Failed to create uploads directory.");
            }
        }

        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $allowed = ['jpg', 'jpeg', 'png', 'gif'];
        
        if (!in_array($ext, $allowed)) {
            throw new Exception("Invalid file type. Only JPG, PNG, GIF allowed.");
        }
        
        if ($file['size'] > 5000000) { 
            throw new Exception("File is too large (Max 5MB).");
        }
        
        $new_filename = uniqid() . "." . $ext;
        $destination = $target_dir . $new_filename;
        
        if (move_uploaded_file($file['tmp_name'], $destination)) {
            return "uploads/" . $new_filename;
        } else {
            throw new Exception("Failed to move file. Error code: " . $file['error']);
        }
    }

    if ($role === 'student') {
        $std_id = $_POST['student_id'];
        $reg_no = $_POST['registration_no'];
        $dept = $_POST['department'];
        $nid = $_POST['student_nid'] ?: null;
        $birth_cert = $_POST['birth_certificate'];
        
        if (empty($_FILES['photo']['name']) || empty($_FILES['id_card']['name'])) {
            throw new Exception("Student Photo and ID Card are required.");
        }

        $photo = uploadFile($_FILES['photo']);
        $id_card = uploadFile($_FILES['id_card']);

        $sql = "INSERT INTO students (
            user_id, full_name, student_id_no, registration_no, department, hall_name, 
            father_name, mother_name, phone, present_address, permanent_address, 
            dob, blood_group, gender, nid_no, birth_certificate_no, photo_path, id_card_path
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            $last_id, $fullName, $std_id, $reg_no, $dept, $hallName,
            $father, $mother, $phone, $presentAddress, $permanentAddress,
            $dob, $bloodGroup, $gender, $nid, $birth_cert, $photo, $id_card
        ]);

    } elseif ($role === 'kitchen_staff') {
        $nid = $_POST['staff_nid'];
        $photo = (!empty($_FILES['staff_photo']['name'])) ? uploadFile($_FILES['staff_photo']) : null;

        $sql = "INSERT INTO kitchen_staff (
            user_id, full_name, father_name, mother_name, hall_name, phone, nid_number, 
            present_address, permanent_address, dob, blood_group, gender, photo_path
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            $last_id, $fullName, $father, $mother, $hallName, $phone, $nid, 
            $presentAddress, $permanentAddress, $dob, $bloodGroup, $gender, $photo
        ]);
    }

    $conn->commit();
    echo json_encode(["status" => "success", "message" => "Registration successful! Wait for Admin Approval."]);

} catch (Exception $e) {
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>