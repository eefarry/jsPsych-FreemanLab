<?php
$post_data = json_decode(file_get_contents('php://input'), true);

if (!isset($post_data['filedata'])) {
    die("filedata not received");
}

$data = $post_data['filedata'];
$filename = "session-" . uniqid() . ".csv";

$file_path = __DIR__ . "/data/" . $filename;

if (file_put_contents($file_path, $data) === false) {
    die("Error writing to file");
}

echo "Data saved successfully to $file_path";
?>
