# Tutorial: Certificados Digitais e Segurança com OpenSSL no OdontoApp

**Versão:** 1.0 | **Data:** Maio 2026  
**Stack:** Next.js 15 · TypeScript · OpenSSL 3.x · Web Crypto API · Node.js 18+

---

## Sumário

1. [Conceitos Fundamentais](#1-conceitos-fundamentais)
2. [Estrutura de Certificados do OdontoApp](#2-estrutura-de-certificados-do-odontoapp)
3. [Pré-requisitos](#3-pré-requisitos)
4. [Gerando os Certificados com OpenSSL](#4-gerando-os-certificados-com-openssl)
5. [Instalando o CA no Navegador](#5-instalando-o-ca-no-navegador)
6. [Rodando o Servidor HTTPS](#6-rodando-o-servidor-https)
7. [Como Funciona a Criptografia de Campos](#7-como-funciona-a-criptografia-de-campos)
8. [Cabeçalhos HTTP de Segurança](#8-cabeçalhos-http-de-segurança)
9. [Política de Segurança no Site](#9-política-de-segurança-no-site)
10. [Referência de Comandos OpenSSL](#10-referência-de-comandos-openssl)
11. [Perguntas Frequentes](#11-perguntas-frequentes)

---

## 1. Conceitos Fundamentais

### O que é um Certificado Digital?

Um certificado digital é um documento eletrônico que vincula uma chave pública a uma identidade (pessoa, empresa ou domínio). Funciona como uma "carteira de identidade digital" verificada por uma entidade confiável.

**Componentes:**
- **Chave Privada** (`.key`): secreta, permanece no servidor. Assina e decifra dados.
- **Chave Pública** (`.pem`, `.crt`): distribuída livremente. Verifica assinaturas e cifra dados.
- **Certificado** (`.crt`): contém a chave pública + metadados (CN, validade, etc.) + assinatura da CA.

### PKI: Infraestrutura de Chave Pública

```
┌─────────────────────────────────────────────┐
│          Autoridade Certificadora (CA)       │
│          OdontoApp Root CA (autoassinada)    │
│              ca.key + ca.crt                │
└──────────────────────┬──────────────────────┘
                       │ assina
            ┌──────────┴──────────┐
            │                     │
     ┌──────▼──────┐      ┌───────▼────────┐
     │  Cert        │      │  Cert           │
     │  Servidor    │      │  Aplicação      │
     │  HTTPS       │      │  (criptografia) │
     │  server.crt  │      │  app.key +      │
     └─────────────┘      │  app-public.pem │
                           └────────────────┘
```

### TLS vs. Criptografia de Campos

| Camada           | Tecnologia       | O que protege                        |
|------------------|------------------|--------------------------------------|
| Transporte       | TLS 1.2+ (HTTPS) | Todo o tráfego HTTP em trânsito       |
| Aplicação        | RSA-OAEP + AES   | Campos sensíveis (senha, CPF) no corpo |

O OdontoApp implementa **ambas** as camadas para proteção em profundidade.

---

## 2. Estrutura de Certificados do OdontoApp

```
certificates/
├── ca/
│   ├── ca.key            ← Chave privada da CA (4096 bits RSA) — NUNCA compartilhar!
│   └── ca.crt            ← Certificado raiz da CA (autoassinado, 10 anos)
├── server/
│   ├── server.key        ← Chave privada do servidor HTTPS (2048 bits RSA)
│   ├── server.csr        ← Requisição de certificado (Certificate Signing Request)
│   ├── server.crt        ← Certificado do servidor assinado pela CA (2 anos)
│   └── server-ext.cnf    ← Configuração com Subject Alternative Names (SANs)
└── app/
    ├── app.key           ← Chave privada da aplicação (decifra campos sensíveis)
    └── app-public.pem    ← Chave pública (cifra campos no navegador)
```

> **⚠️ SEGURANÇA:** Todo o diretório `certificates/` está no `.gitignore`.  
> **Nunca commite chaves privadas** (arquivos `.key`).

---

## 3. Pré-requisitos

### OpenSSL

Verifique a instalação:
```bash
openssl version
# OpenSSL 3.x.x ...
```

**Instalação:**
- **Windows:** Git Bash já inclui OpenSSL. Alternativas: [Win64 OpenSSL](https://slproweb.com/products/Win32OpenSSL.html) ou `choco install openssl`
- **macOS:** `brew install openssl`
- **Linux:** `apt install openssl` ou `dnf install openssl`

### Node.js 18+

```bash
node --version
# v18.x.x ou superior
```

---

## 4. Gerando os Certificados com OpenSSL

### Método 1: Script Automático (Recomendado)

**Linux/macOS/Git Bash:**
```bash
npm run generate-certs
# ou diretamente:
bash scripts/generate-certs.sh
```

**Windows PowerShell:**
```powershell
npm run generate-certs
# ou diretamente:
powershell -ExecutionPolicy Bypass -File scripts/generate-certs.ps1
```

### Método 2: Passo a Passo Manual

Siga cada etapa abaixo para entender o processo completo.

---

#### Etapa 1: Criar a Autoridade Certificadora (CA)

**1a. Gerar a chave privada da CA (4096 bits para maior segurança):**
```bash
openssl genrsa -out certificates/ca/ca.key 4096
```
> O número `4096` é o tamanho da chave em bits. Chaves maiores são mais seguras, mas mais lentas.
> Para a CA, 4096 bits é recomendado pois sua chave protege todos os outros certificados.

**1b. Gerar o certificado raiz autoassinado da CA:**
```bash
# No Git Bash (Windows): adicione MSYS_NO_PATHCONV=1 antes do openssl
MSYS_NO_PATHCONV=1 openssl req -new -x509 -days 3650 \
  -key certificates/ca/ca.key \
  -out certificates/ca/ca.crt \
  -subj "/C=BR/ST=Sao Paulo/L=Sao Paulo/O=OdontoApp/OU=Tecnologia/CN=OdontoApp Root CA"
```

**Parâmetros explicados:**
| Parâmetro    | Significado                                              |
|--------------|----------------------------------------------------------|
| `-x509`      | Gera certificado autoassinado (não precisa de CA externa) |
| `-days 3650` | Validade de 10 anos (CA dura mais que os certificados filhos) |
| `-subj`      | Distinguished Name (DN) — identidade do certificado      |
| `C=BR`       | País: Brasil                                             |
| `ST`         | Estado                                                   |
| `O`          | Organização                                              |
| `CN`         | Common Name — nome do domínio ou entidade                |

**Verificar o certificado da CA:**
```bash
openssl x509 -in certificates/ca/ca.crt -noout -text
```

---

#### Etapa 2: Certificado do Servidor HTTPS

**2a. Gerar chave privada do servidor:**
```bash
openssl genrsa -out certificates/server/server.key 2048
```

**2b. Criar a CSR (Certificate Signing Request):**
```bash
MSYS_NO_PATHCONV=1 openssl req -new \
  -key certificates/server/server.key \
  -out certificates/server/server.csr \
  -subj "/C=BR/ST=Sao Paulo/L=Sao Paulo/O=OdontoApp/OU=Tecnologia/CN=localhost"
```
> A CSR contém a chave pública e as informações que serão gravadas no certificado.
> A CA assina a CSR e gera o certificado final.

**2c. Criar o arquivo de extensões com SANs (obrigatório para Chrome/Edge/Firefox modernos):**
```ini
# certificates/server/server-ext.cnf
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
```

> **Por que SANs?** O campo `CN` (Common Name) foi depreciado para validação de domínio.
> Navegadores modernos exigem que o domínio esteja na extensão `subjectAltName`.

**2d. Assinar o certificado do servidor com a CA:**
```bash
openssl x509 -req -days 730 \
  -in certificates/server/server.csr \
  -CA certificates/ca/ca.crt \
  -CAkey certificates/ca/ca.key \
  -CAcreateserial \
  -out certificates/server/server.crt \
  -extensions v3_req \
  -extfile certificates/server/server-ext.cnf
```

**Verificar o certificado do servidor:**
```bash
openssl x509 -in certificates/server/server.crt -noout -text | grep -A2 "Subject Alternative Name"
```

**Verificar a cadeia de confiança:**
```bash
openssl verify -CAfile certificates/ca/ca.crt certificates/server/server.crt
# Saída esperada: certificates/server/server.crt: OK
```

---

#### Etapa 3: Par de Chaves da Aplicação (Criptografia de Campos)

**3a. Gerar chave privada RSA 2048 bits:**
```bash
openssl genrsa -out certificates/app/app.key 2048
```

**3b. Extrair a chave pública no formato PKCS#8 (SPKI):**
```bash
openssl rsa -in certificates/app/app.key -pubout -out certificates/app/app-public.pem
```
> O formato `-----BEGIN PUBLIC KEY-----` (PKCS#8) é o que a Web Crypto API do navegador aceita.
> Diferente de `-----BEGIN RSA PUBLIC KEY-----` (PKCS#1 — formato mais antigo).

---

## 5. Instalando o CA no Navegador

Para que o navegador confie no certificado do servidor, o CA precisa ser instalado como "Autoridade Raiz Confiável".

### Windows (todos os navegadores via sistema operacional)

**Opção A — Via certutil (linha de comando, como Administrador):**
```powershell
certutil -addstore Root "certificates\ca\ca.crt"
```

**Opção B — Via interface gráfica:**
1. Pressione `Win+R`, digite `certmgr.msc` → Enter
2. Navegue até "Autoridades de Certificação Raiz Confiáveis" → "Certificados"
3. Clique com botão direito → "Todas as Tarefas" → "Importar"
4. Selecione `certificates/ca/ca.crt`
5. Confirme "Colocar todos os certificados no repositório selecionado"

**Reinicie o Chrome/Edge após a instalação.**

### Chrome/Edge (Windows — método alternativo)
1. Acesse `chrome://settings/certificates` (Chrome) ou `edge://settings/privacy/manageCertificates`
2. Aba "Autoridades" → "Importar"
3. Selecione `certificates/ca/ca.crt`
4. Marque "Confiar neste certificado para identificar sites"

### Firefox
Firefox usa sua própria loja de certificados:
1. Acesse `about:preferences#privacy`
2. Role até "Segurança" → "Ver Certificados"
3. Aba "Autoridades" → "Importar"
4. Selecione `certificates/ca/ca.crt`
5. Marque "Confiar neste CA para identificar sites"

### macOS
```bash
sudo security add-trusted-cert -d -r trustRoot \
  -k /Library/Keychains/System.keychain \
  certificates/ca/ca.crt
```

---

## 6. Rodando o Servidor

### Servidor HTTP simples (sem certificados — apenas desenvolvimento rápido)
```bash
npm run dev
# → http://localhost:9002  (todas as rotas em HTTP, sem criptografia de transporte)
```

### Servidor Dual HTTP + HTTPS (produção e testes de segurança)
```bash
npm run dev:https
# → http://localhost:9002   Páginas públicas (/ e /politica-de-seguranca)
# → https://localhost:9443  Páginas seguras  (/auth/* /dashboard/* /api/*)
```

### Arquitetura do servidor dual (`server.js`)

```
Requisição do navegador
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│  HTTP server (porta 9002)                               │
│                                                         │
│  pathname = /              → serve (Next.js)            │
│  pathname = /politica-*    → serve (Next.js)            │
│  pathname = /auth/*        → 301 → https://...:9443/... │
│  pathname = /dashboard/*   → 301 → https://...:9443/... │
│  pathname = /api/*         → 301 → https://...:9443/... │
└─────────────────────────────────────────────────────────┘

         ▼  (após redirect)

┌─────────────────────────────────────────────────────────┐
│  HTTPS server (porta 9443)  — TLS 1.2+, HSTS           │
│                                                         │
│  Serve todas as rotas com:                              │
│   • Certificado server.crt assinado pela CA             │
│   • Header HSTS (63072000s ≈ 2 anos)                    │
│   • Chave privada server.key para handshake TLS         │
└─────────────────────────────────────────────────────────┘
```

### Configurar portas diferentes (opcional)

Crie um `.env.local` na raiz do projeto:
```env
PORT_HTTP=9002
PORT_HTTPS=9443
```
Ou defina as variáveis antes do comando:
```bash
PORT_HTTP=80 PORT_HTTPS=443 npm run dev:https
```

---

## 7. Como Funciona a Criptografia de Campos

### Fluxo Completo (Login)

```
Navegador                          Next.js Servidor              Backend (odonto.lat)
    │                                     │                              │
    │  1. Busca chave pública             │                              │
    │────────── GET /api/public-key ─────►│                              │
    │◄─────── app-public.pem ────────────│                              │
    │                                     │                              │
    │  2. Cifra credenciais no browser    │                              │
    │  ┌─────────────────────────────┐    │                              │
    │  │ AES-256 key aleatória       │    │                              │
    │  │ {email,password} cifrado    │    │                              │
    │  │ AES key cifrada com RSA     │    │                              │
    │  │ → base64 encryptedPayload   │    │                              │
    │  └─────────────────────────────┘    │                              │
    │                                     │                              │
    │  3. Envia payload cifrado           │                              │
    │────── POST /api/secure/login ──────►│                              │
    │       { encryptedPayload: "..." }   │                              │
    │                                     │                              │
    │                       4. Decifra com app.key    │                  │
    │                       ┌────────────────────────┐│                  │
    │                       │ RSA-OAEP → AES key      ││                  │
    │                       │ AES-GCM → { email, pwd }││                  │
    │                       └────────────────────────┘│                  │
    │                                     │                              │
    │                       5. Encaminha em texto claro (via TLS)       │
    │                       ─────────── POST /sessions ────────────────►│
    │                                     │                              │
    │◄──────────────────── { token } ─────────────────────────────────◄─│
```

### Algoritmo Híbrido (src/lib/crypto.ts)

A criptografia híbrida resolve a limitação do RSA (máximo ~190 bytes para 2048 bits):

```
Passo 1: gerar chave AES-256 aleatória por sessão
Passo 2: cifrar os dados com AES-256-GCM (autenticado — detecta adulteração)
Passo 3: cifrar a chave AES com RSA-OAEP / SHA-256
Passo 4: empacotar tudo:
         [4 bytes: tamanho da chave cifrada]
         [N bytes: chave AES cifrada com RSA]
         [12 bytes: IV do AES-GCM]
         [M bytes: ciphertext + tag GCM (16 bytes)]
Passo 5: codificar em base64 para transmissão via JSON
```

### Por que AES-GCM?

- **Confidencialidade**: cifra os dados
- **Autenticidade**: a tag GCM detecta qualquer modificação nos dados em trânsito
- **Performance**: muito mais rápido que RSA para grandes payloads

### Descriptografia no Servidor (src/lib/server-crypto.ts)

```typescript
// Processo inverso:
1. Decodifica base64 → bytes
2. Lê o tamanho da chave AES cifrada (4 bytes)
3. Decifra a chave AES com RSA-OAEP e a chave privada app.key
4. Usa a chave AES para decifrar os dados com AES-256-GCM
5. Verifica a tag de autenticação (falha se dados foram adulterados)
6. Retorna o JSON original
```

---

## 8. Cabeçalhos HTTP de Segurança

Configurados em `next.config.ts` para todas as rotas:

| Cabeçalho                    | Valor                             | Proteção                                      |
|------------------------------|-----------------------------------|-----------------------------------------------|
| `Strict-Transport-Security`  | `max-age=63072000; includeSubDomains` | Força HTTPS por 2 anos (HSTS)             |
| `X-Frame-Options`            | `SAMEORIGIN`                      | Previne clickjacking                          |
| `X-Content-Type-Options`     | `nosniff`                         | Bloqueia MIME sniffing                        |
| `Referrer-Policy`            | `strict-origin-when-cross-origin` | Limita dados enviados no cabeçalho Referer    |
| `Permissions-Policy`         | `camera=(), microphone=()...`     | Desabilita APIs de hardware desnecessárias    |
| `X-XSS-Protection`           | `1; mode=block`                   | Proteção extra em navegadores legados         |
| `X-DNS-Prefetch-Control`     | `on`                              | Melhora performance de DNS                   |

---

## 9. Política de Segurança no Site

A política de segurança está disponível em `/politica-de-seguranca` e pode ser acessada:
- No rodapé da página inicial
- No rodapé dos formulários de login e cadastro

A página cobre:
- Dados coletados e finalidade
- Base legal (LGPD)
- Medidas técnicas de segurança
- Direitos do titular (Art. 18 da LGPD)
- Compartilhamento de dados
- Contato do DPO

---

## 10. Referência de Comandos OpenSSL

### Visualizar certificado
```bash
openssl x509 -in arquivo.crt -noout -text
```

### Verificar cadeia de confiança
```bash
openssl verify -CAfile certificates/ca/ca.crt certificates/server/server.crt
```

### Verificar se chave e certificado correspondem
```bash
# Os hashes devem ser iguais
openssl x509 -noout -modulus -in server.crt | openssl md5
openssl rsa  -noout -modulus -in server.key | openssl md5
```

### Ver datas de validade
```bash
openssl x509 -in server.crt -noout -dates
```

### Renovar certificado do servidor (quando expirar)
```bash
# Reutiliza a mesma CSR e CA — gera novo .crt
openssl x509 -req -days 730 \
  -in certificates/server/server.csr \
  -CA certificates/ca/ca.crt \
  -CAkey certificates/ca/ca.key \
  -CAcreateserial \
  -out certificates/server/server.crt \
  -extensions v3_req \
  -extfile certificates/server/server-ext.cnf
```

### Revogar um certificado (gerar CRL)
```bash
# Criar arquivo de revogação
openssl ca -config openssl.cnf -revoke server.crt
openssl ca -config openssl.cnf -gencrl -out ca.crl
```

### Testar conexão HTTPS
```bash
openssl s_client -connect localhost:9002 -CAfile certificates/ca/ca.crt
```

### Converter formatos
```bash
# PEM → DER (binário)
openssl x509 -in server.crt -outform DER -out server.der

# DER → PEM
openssl x509 -in server.der -inform DER -outform PEM -out server.crt

# PEM → PKCS#12 (para importar no Windows/macOS)
openssl pkcs12 -export -in server.crt -inkey server.key -certfile ca.crt -out server.p12
```

---

## 11. Perguntas Frequentes

**Q: O navegador ainda mostra "Conexão não segura" mesmo após instalar o CA. Por quê?**  
A: Reinicie o navegador. Se persistir, verifique se o certificado do servidor tem SANs (`subjectAltName`) e se o campo `CN` corresponde ao domínio acessado (`localhost`).

**Q: Posso usar este certificado em produção?**  
A: Não. Para produção, use um CA público reconhecido (Let's Encrypt, DigiCert, etc.). Certificados autoassinados são adequados apenas para desenvolvimento e uso offline.

**Q: A criptografia de campos é necessária se já tenho HTTPS?**  
A: Tecnicamente o HTTPS já protege os dados em trânsito. A criptografia de campos adiciona uma camada extra — útil para proteger dados em caso de logging inadvertido no servidor de proxy, comprometimento da camada TLS por um MITM com certificado forjado, ou violação de conformidade com LGPD que exige "técnicas de criptografia" explícitas para dados sensíveis como CPF.

**Q: Onde fica armazenada a chave privada `app.key`?**  
A: No filesystem do servidor Next.js, em `certificates/app/app.key`. Em produção, deve ser movida para um serviço de gerenciamento de segredos (AWS Secrets Manager, Azure Key Vault, HashiCorp Vault) ou definida como variável de ambiente.

**Q: O que acontece se eu rodar `npm run dev` (HTTP) em vez de `npm run dev:https`?**  
A: A aplicação funciona normalmente, mas sem HTTPS. A criptografia de campos ainda funciona (RSA + AES no browser), mas os dados em trânsito não têm proteção TLS. Use sempre `dev:https` para testar segurança corretamente.

**Q: Como gerar certificado para um IP diferente de 127.0.0.1?**  
A: Edite o arquivo `certificates/server/server-ext.cnf` e adicione o IP na seção `[alt_names]`:
```ini
IP.3 = 192.168.1.100
```
Depois regenere apenas o certificado do servidor (etapa 2d).

---

*Para reportar vulnerabilidades de segurança: privacidade@odonto.app*  
*Documentação mantida pelo Departamento de Tecnologia — OdontoApp*
