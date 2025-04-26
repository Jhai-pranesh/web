<?php
require_once "phpqrcode/qrlib.php";
?>

<!DOCTYPE html>
<html>
<head>
    <title>QR Code Generator</title>
</head>
<body>
    <h2>Enter text to generate QR Code</h2>
    <form method="POST">
        <input type="text" name="data" required>
        <input type="submit" value="Generate QR Code">
    </form>

    <?php
    if (isset($_POST['data']) && !empty($_POST['data'])) {
        $data = $_POST['data'];

        // Generate a temporary file
        $filename = 'temp_qr.png';

        // Generate QR code
        QRcode::png($data, $filename, QR_ECLEVEL_L, 4);

        // Display it
        echo "<h3>QR Code:</h3>";
        echo "<img src='$filename' alt='QR Code'>";
    }
    ?>
</body>
</html>
