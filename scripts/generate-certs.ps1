# Geração de certificados digitais para o OdontoApp (Windows PowerShell)
# Requisito: OpenSSL instalado (ex: via Git Bash, Chocolatey ou Windows OpenSSL)

$ErrorActionPreference = "Stop"

$ScriptDir  = Split-Path -Parent $MyInvocation.MyCommand.Path
$CertDir    = Join-Path $ScriptDir "..\certificates"
$CaDirP     = Join-Path $CertDir "ca"
$ServerDir  = Join-Path $CertDir "server"

New-Item -ItemType Directory -Force -Path $CaDirP, $ServerDir | Out-Null

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  OdontoApp - Geração de Certificados SSL" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# ─── 1. CA (Autoridade Certificadora) ─────────────────────────────────────────

Write-Host ">>> [1/3] Gerando chave privada da CA (4096 bits)..." -ForegroundColor Yellow
openssl genrsa -out "$CaDirP\ca.key" 4096

Write-Host ">>> [2/3] Gerando certificado raiz da CA (autoassinado, 10 anos)..." -ForegroundColor Yellow
openssl req -new -x509 -days 3650 `
  -key "$CaDirP\ca.key" `
  -out "$CaDirP\ca.crt" `
  -subj "/C=BR/ST=Sao Paulo/L=Sao Paulo/O=OdontoApp/OU=Tecnologia/CN=OdontoApp Root CA/emailAddress=ti@odonto.app"

# ─── 2. Certificado do Servidor HTTPS ─────────────────────────────────────────

Write-Host ">>> [3/3] Gerando chave privada do servidor HTTPS (2048 bits)..." -ForegroundColor Yellow
openssl genrsa -out "$ServerDir\server.key" 2048

Write-Host "          Gerando CSR do servidor..." -ForegroundColor Yellow
openssl req -new `
  -key "$ServerDir\server.key" `
  -out "$ServerDir\server.csr" `
  -subj "/C=BR/ST=Sao Paulo/L=Sao Paulo/O=OdontoApp/OU=Tecnologia/CN=localhost/emailAddress=ti@odonto.app"

# Subject Alternative Names (obrigatório para navegadores modernos)
$serverExtContent = @"
[req]
req_extensions = v3_req
distinguished_name = req_distinguished_name

[req_distinguished_name]

[v3_req]
basicConstraints = CA:FALSE
keyUsage = critical, digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
DNS.2 = *.localhost
IP.1  = 127.0.0.1
IP.2  = ::1
"@
$serverExtContent | Out-File -FilePath "$ServerDir\server-ext.cnf" -Encoding utf8 -NoNewline

Write-Host "          Assinando certificado do servidor com a CA (2 anos)..." -ForegroundColor Yellow
openssl x509 -req -days 730 `
  -in "$ServerDir\server.csr" `
  -CA "$CaDirP\ca.crt" `
  -CAkey "$CaDirP\ca.key" `
  -CAcreateserial `
  -out "$ServerDir\server.crt" `
  -extensions v3_req `
  -extfile "$ServerDir\server-ext.cnf"

# ─── Verificação ──────────────────────────────────────────────────────────────

Write-Host ""
Write-Host "=============================================" -ForegroundColor Green
Write-Host "  Verificação dos Certificados" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

Write-Host "`n--- Certificado CA ---" -ForegroundColor Cyan
openssl x509 -in "$CaDirP\ca.crt" -noout -subject -issuer -dates

Write-Host "`n--- Certificado do Servidor ---" -ForegroundColor Cyan
openssl x509 -in "$ServerDir\server.crt" -noout -subject -dates

Write-Host "`n--- Verificação da cadeia ---" -ForegroundColor Cyan
openssl verify -CAfile "$CaDirP\ca.crt" "$ServerDir\server.crt"

Write-Host ""
Write-Host "=============================================" -ForegroundColor Green
Write-Host "  Certificados gerados com sucesso!" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Arquivos criados em: $CertDir" -ForegroundColor Yellow
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Cyan
Write-Host "  1. Instale o CA no Windows (executar como Administrador):"
Write-Host "       certutil -addstore Root '$CaDirP\ca.crt'"
Write-Host ""
Write-Host "  2. Para instalar manualmente no Chrome/Edge:"
Write-Host "       Configurações > Segurança > Gerenciar certificados"
Write-Host "       > Autoridades de certificação raiz confiáveis > Importar"
Write-Host "       Arquivo: $CaDirP\ca.crt"
Write-Host ""
Write-Host "  3. Execute o servidor HTTPS:"
Write-Host "       npm run dev:https"
Write-Host ""
