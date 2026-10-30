<?php
/**
 * PHP Reverse Proxy - Fachada Cega de Rastreio (para cPanel / Apache / Hostinger / VPS)
 */
$backendBaseUrl = getenv('BACKEND_API_URL') ?: 'https://jetlogs.shop';
$facadeSecret   = getenv('FACADE_SECRET') ?: 'jetlogs-facade-shield-token-2026';

$requestUri = $_SERVER['REQUEST_URI'];
$targetUrl  = rtrim($backendBaseUrl, '/') . $requestUri;

$ch = curl_init($targetUrl);
$headers = [
    'Content-Type: application/json',
    'X-Facade-Secret: ' . $facadeSecret,
];

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, file_get_contents('php://input'));
}

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

http_response_code($httpCode ?: 200);
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
echo $response;
exit;

