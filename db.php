<?php
$host = 'localhost';
$dbname = 'hustleddb';
$username = 'root';

// --- PASSWORD SETTING FOR MAC ---
// If you are using MAMP, the password is usually 'root'
// If you are using XAMPP, the password is usually '' (empty)
$password = 'root';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // echo "Connected successfully!"; // Uncomment to test
} catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
    // If you see "Access denied", change $password to '' in the line above.
}
?>