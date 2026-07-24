<?php
declare(strict_types=1);

/**
 * Recebe os formulários de "Banco de Talentos" e de candidatura a uma vaga
 * específica (pages/candidatura.html) e envia os dados + currículo anexado
 * por e-mail via mail() nativo do PHP (compatível com hospedagem
 * compartilhada, sem dependências externas).
 *
 * TODO: confirmar com o time da Hi-Com o e-mail definitivo de destino das
 * candidaturas antes de publicar em produção.
 */

const DESTINATION_EMAIL = 'engenharia@hccom.com.br';
const FROM_EMAIL = 'no-reply@hccom.com.br';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx'];
const ALLOWED_MIME_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

function render_message(string $title, string $message, bool $isError = false): void
{
    header('Content-Type: text/html; charset=UTF-8');
    $color = $isError ? '#dc2626' : '#16a34a';
    echo '<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">';
    echo '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
    echo '<title>' . htmlspecialchars($title) . '</title>';
    echo '<style>body{font-family:system-ui,sans-serif;max-width:560px;margin:80px auto;padding:0 24px;color:#0a0e27;text-align:center;}';
    echo 'h1{color:' . $color . ';font-size:1.5rem;}a{color:#2563eb;}</style></head><body>';
    echo '<h1>' . htmlspecialchars($title) . '</h1>';
    echo '<p>' . htmlspecialchars($message) . '</p>';
    echo '<p><a href="javascript:history.back()">Voltar</a></p>';
    echo '</body></html>';
}

function fail(string $message): void
{
    http_response_code(400);
    render_message('Não foi possível enviar', $message, true);
    exit;
}

/** Remove quebras de linha para evitar injeção de cabeçalhos de e-mail. */
function clean_header_value(string $value): string
{
    return trim(str_replace(["\r", "\n"], ' ', $value));
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    fail('Método de envio inválido.');
}

$name = clean_header_value($_POST['fullName'] ?? '');
$email = clean_header_value($_POST['email'] ?? '');
$phone = clean_header_value($_POST['phone'] ?? '');
$area = clean_header_value($_POST['interestArea'] ?? '');
$vaga = clean_header_value($_POST['vaga'] ?? '');

if ($name === '' || $email === '' || $phone === '') {
    fail('Preencha todos os campos obrigatórios (nome, e-mail e telefone).');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    fail('O e-mail informado não é válido.');
}

$attachment = null;

if (!empty($_FILES['resume']['name'])) {
    $file = $_FILES['resume'];

    if ($file['error'] !== UPLOAD_ERR_OK) {
        fail('Ocorreu um erro ao enviar o arquivo do currículo. Tente novamente.');
    }

    if ($file['size'] > MAX_FILE_SIZE) {
        fail('O arquivo do currículo deve ter no máximo 5MB.');
    }

    $extension = strtolower((string) pathinfo($file['name'], PATHINFO_EXTENSION));
    $mimeType = function_exists('mime_content_type') ? mime_content_type($file['tmp_name']) : $file['type'];

    if (!in_array($extension, ALLOWED_EXTENSIONS, true) || !in_array($mimeType, ALLOWED_MIME_TYPES, true)) {
        fail('Formato de arquivo não permitido. Envie um currículo em PDF, DOC ou DOCX.');
    }

    $safeName = preg_replace('/[^A-Za-z0-9 ._-]/', '_', basename($file['name']));

    $attachment = [
        'name' => $safeName !== '' ? $safeName : ('curriculo.' . $extension),
        'type' => $mimeType,
        'content' => file_get_contents($file['tmp_name']),
    ];
}

$subjectText = $vaga !== '' ? "Candidatura - {$vaga}" : 'Novo cadastro no Banco de Talentos';
$subject = '=?UTF-8?B?' . base64_encode($subjectText) . '?=';

$bodyLines = [
    'Nome: ' . $name,
    'E-mail: ' . $email,
    'Telefone: ' . $phone,
];

if ($vaga !== '') {
    $bodyLines[] = 'Vaga: ' . $vaga;
} elseif ($area !== '') {
    $bodyLines[] = 'Área de interesse: ' . $area;
}

$bodyLines[] = '';
$bodyLines[] = $attachment ? 'Currículo anexado a este e-mail.' : 'Nenhum currículo foi anexado.';

$body = implode("\r\n", $bodyLines);

$boundary = 'hicom-' . bin2hex(random_bytes(12));

$headers = "MIME-Version: 1.0\r\n";
$headers .= 'From: Site Hi-Com <' . FROM_EMAIL . ">\r\n";
$headers .= 'Reply-To: ' . clean_header_value($name) . ' <' . $email . ">\r\n";

if ($attachment) {
    $headers .= "Content-Type: multipart/mixed; boundary=\"{$boundary}\"\r\n";

    $message = "--{$boundary}\r\n";
    $message .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $message .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
    $message .= $body . "\r\n\r\n";

    $message .= "--{$boundary}\r\n";
    $message .= 'Content-Type: ' . $attachment['type'] . '; name="' . $attachment['name'] . "\"\r\n";
    $message .= "Content-Transfer-Encoding: base64\r\n";
    $message .= 'Content-Disposition: attachment; filename="' . $attachment['name'] . "\"\r\n\r\n";
    $message .= chunk_split(base64_encode($attachment['content']));
    $message .= "--{$boundary}--";
} else {
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $message = $body;
}

$sent = @mail(DESTINATION_EMAIL, $subject, $message, $headers);

if (!$sent) {
    fail('Não foi possível enviar sua candidatura no momento. Tente novamente mais tarde ou envie um e-mail diretamente para ' . DESTINATION_EMAIL . '.');
}

render_message('Candidatura enviada com sucesso!', 'Obrigado pelo interesse em fazer parte da Hi-Com. Nosso time de recrutamento entrará em contato caso seu perfil seja compatível com uma oportunidade.');
