<?php
require 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $password = $_POST['password'];
    $role = $_POST['role']; // <--- THIS IS THE NEW PART (Gets 'candidate' or 'employer')

    if (!empty($username) && !empty($email) && !empty($password)) {

        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        // Insert user with the specific ROLE
        $sql = "INSERT INTO users (username, email, phone, password, role) VALUES (:username, :email, :phone, :password, :role)";
        $stmt = $pdo->prepare($sql);

        try {
            $stmt->execute([
                'username' => $username,
                'email' => $email,
                'phone' => $phone,
                'password' => $hashed_password,
                'role' => $role
            ]);

            // Success! Go to login page
            header("Location: login.php");
            exit;

        } catch (PDOException $e) {
            echo "Error: " . $e->getMessage();
        }
    } else {
        echo "Please fill all fields.";
    }
}
?>