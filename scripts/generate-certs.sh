#!/bin/bash
# Geração de certificados digitais para o OdontoApp
# Requisito: OpenSSL instalado no sistema

set -e

# Corrige comportamento do Git Bash no Windows que converte /C=BR/... como path
export MSYS_NO_PATHCONV=1

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CERT_DIR="$SCRIPT_DIR/../certificates"

mkdir -p "$CERT_DIR/ca" "$CERT_DIR/server"

echo ""
echo "============================================="
echo "  OdontoApp - Geração de Certificados SSL"
echo "============================================="
echo ""

# ─── 1. CA (Autoridade Certificadora) ────────────────────────────────────────

echo ">>> [1/3] Gerando chave privada da CA (4096 bits)..."
openssl genrsa -out "$CERT_DIR/ca/ca.key" 4096

echo ">>> [2/3] Gerando certificado raiz da CA (autoassinado, 10 anos)..."
openssl req -new -x509 -days 3650 \
  -key "$CERT_DIR/ca/ca.key" \
  -out "$CERT_DIR/ca/ca.crt" \
  -subj "/C=BR/ST=Sao Paulo/L=Sao Paulo/O=OdontoApp/OU=Tecnologia/CN=OdontoApp Root CA/emailAddress=ti@odonto.app"

# ─── 2. Certificado do Servidor HTTPS ────────────────────────────────────────

echo ">>> [3/3] Gerando chave privada do servidor HTTPS (2048 bits)..."
openssl genrsa -out "$CERT_DIR/server/server.key" 2048

echo "          Gerando CSR do servidor..."
openssl req -new \
  -key "$CERT_DIR/server/server.key" \
  -out "$CERT_DIR/server/server.csr" \
  -subj "/C=BR/ST=Sao Paulo/L=Sao Paulo/O=OdontoApp/OU=Tecnologia/CN=localhost/emailAddress=ti@odonto.app"

# Subject Alternative Names (obrigatório para navegadores modernos)
cat > "$CERT_DIR/server/server-ext.cnf" <<EOF
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
EOF

echo "          Assinando certificado do servidor com a CA (2 anos)..."
openssl x509 -req -days 730 \
  -in "$CERT_DIR/server/server.csr" \
  -CA "$CERT_DIR/ca/ca.crt" \
  -CAkey "$CERT_DIR/ca/ca.key" \
  -CAcreateserial \
  -out "$CERT_DIR/server/server.crt" \
  -extensions v3_req \
  -extfile "$CERT_DIR/server/server-ext.cnf"

# ─── Verificação ──────────────────────────────────────────────────────────────

echo ""
echo "============================================="
echo "  Verificação dos Certificados Gerados"
echo "============================================="
echo ""
echo "--- Certificado CA ---"
openssl x509 -in "$CERT_DIR/ca/ca.crt" -noout -subject -issuer -dates

echo ""
echo "--- Certificado do Servidor ---"
openssl x509 -in "$CERT_DIR/server/server.crt" -noout -subject -dates

echo ""
echo "--- Verificação da cadeia ---"
openssl verify -CAfile "$CERT_DIR/ca/ca.crt" "$CERT_DIR/server/server.crt"

echo ""
echo "============================================="
echo "  Certificados gerados com sucesso!"
echo "============================================="
echo ""
echo "Arquivos criados em: $CERT_DIR"
echo ""
echo "Próximos passos:"
echo "  1. Instale o CA no navegador:"
echo "       Chrome/Edge: Configurações > Segurança > Certificados > Autoridades"
echo "       Firefox:     Configurações > Privacidade > Ver certificados > Autoridades"
echo "       Arquivo CA:  $CERT_DIR/ca/ca.crt"
echo ""
echo "  2. Para instalar no Windows (como admin):"
echo "       certutil -addstore Root '$CERT_DIR/ca/ca.crt'"
echo ""
echo "  3. Execute o servidor HTTPS:"
echo "       npm run dev:https"
echo ""
