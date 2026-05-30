import Link from 'next/link';
import { Shield, Lock, Eye, FileText, Mail, CheckCircle, AlertTriangle } from 'lucide-react';

export const metadata = {
  title: 'Política de Segurança | OdontoApp',
  description: 'Política de Segurança da Informação e Proteção de Dados do OdontoApp',
};

export default function PoliticaDeSegurancaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur shadow-sm">
        <div className="container flex h-16 max-w-screen-xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 text-blue-700 font-bold text-lg hover:text-blue-900 transition">
            ← OdontoApp
          </Link>
          <span className="text-sm text-muted-foreground hidden sm:block">Política de Segurança da Informação</span>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-10">
        {/* Título */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <Shield className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-900 mb-2">
            Política de Segurança da Informação
          </h1>
          <p className="text-muted-foreground text-sm">
            Versão 1.0 — Vigência: 18 de maio de 2026 | Revisão anual
          </p>
        </div>

        {/* Alerta LGPD */}
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
          <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
          <p className="text-sm text-blue-800">
            Esta política está em conformidade com a <strong>Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018)</strong>{' '}
            e com as melhores práticas internacionais de segurança da informação (ISO/IEC 27001).
          </p>
        </div>

        <div className="space-y-8">
          {/* 1. Introdução */}
          <section className="bg-white rounded-2xl shadow-sm border p-6">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-bold text-blue-900">1. Introdução e Compromisso</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              O <strong>OdontoApp</strong> é um sistema de gestão odontológica que trata dados pessoais e dados
              pessoais sensíveis de pacientes, profissionais e colaboradores. Reconhecemos a importância
              da privacidade e nos comprometemos a proteger as informações que nos são confiadas com os mais
              elevados padrões de segurança técnica e administrativa.
            </p>
            <p className="text-gray-700 leading-relaxed mt-2">
              Esta política descreve as medidas adotadas para garantir a confidencialidade, integridade e
              disponibilidade dos dados tratados pela plataforma.
            </p>
          </section>

          {/* 2. Dados coletados */}
          <section className="bg-white rounded-2xl shadow-sm border p-6">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-bold text-blue-900">2. Dados Coletados</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Dados de Cadastro (clientes)</h3>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>Nome completo</li>
                  <li>CPF (dado pessoal sensível)</li>
                  <li>Endereço de e-mail</li>
                  <li>Senha (armazenada com hash)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Dados de Uso</h3>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>Histórico de consultas</li>
                  <li>Planos de tratamento</li>
                  <li>Logs de acesso (IP, data/hora)</li>
                  <li>Token de sessão (temporário)</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-800">
                <strong>Dado sensível:</strong> O CPF é classificado como dado pessoal sensível pela LGPD e
                recebe tratamento diferenciado, incluindo criptografia em trânsito e em repouso.
              </p>
            </div>
          </section>

          {/* 3. Finalidade */}
          <section className="bg-white rounded-2xl shadow-sm border p-6">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-bold text-blue-900">3. Finalidade do Tratamento</h2>
            </div>
            <p className="text-gray-700 mb-3">Os dados são coletados exclusivamente para:</p>
            <ul className="text-gray-700 space-y-2 list-disc list-inside text-sm">
              <li>Identificação e autenticação do usuário na plataforma</li>
              <li>Agendamento e gestão de consultas odontológicas</li>
              <li>Registro e acompanhamento de tratamentos</li>
              <li>Comunicação sobre consultas e procedimentos</li>
              <li>Cumprimento de obrigações legais (ex.: Conselho Federal de Odontologia)</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-3">
              <strong>Base legal (LGPD):</strong> Art. 7º, incisos I (consentimento), V (execução de contrato)
              e VI (exercício regular de direitos).
            </p>
          </section>

          {/* 4. Medidas técnicas */}
          <section className="bg-white rounded-2xl shadow-sm border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-bold text-blue-900">4. Medidas Técnicas de Segurança</h2>
            </div>

            <div className="space-y-5">
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">4.1 Certificado Digital e HTTPS</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Toda a comunicação entre o navegador do usuário e o servidor é protegida por <strong>TLS 1.2+</strong>{' '}
                  utilizando certificado digital emitido por Autoridade Certificadora (CA) própria da plataforma,
                  gerado com <strong>OpenSSL</strong> e chave RSA de 4096 bits para a CA e 2048 bits para o servidor.
                  A conexão HTTPS garante confidencialidade e integridade de todos os dados em trânsito.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-1">4.2 Criptografia de Campos Sensíveis (Ponta a Ponta)</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Antes de sair do navegador, os campos <strong>senha</strong> e <strong>CPF</strong> são cifrados
                  com criptografia híbrida:
                </p>
                <div className="mt-2 p-3 bg-gray-50 rounded-lg font-mono text-xs text-gray-700">
                  <p>1. Geração de chave AES-256 aleatória (por sessão)</p>
                  <p>2. Dados cifrados com AES-256-GCM (autenticado)</p>
                  <p>3. Chave AES cifrada com RSA-OAEP / SHA-256 (2048 bits)</p>
                  <p>4. Decifrado exclusivamente no servidor com chave privada</p>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Mesmo que a comunicação TLS seja interceptada, os campos sensíveis permanecem cifrados.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-1">4.3 Cabeçalhos HTTP de Segurança</h3>
                <p className="text-sm text-gray-700">A plataforma implementa os seguintes cabeçalhos em todas as respostas:</p>
                <ul className="mt-2 text-xs text-gray-600 space-y-1 font-mono list-disc list-inside">
                  <li>Strict-Transport-Security (HSTS) — força HTTPS por 2 anos</li>
                  <li>X-Frame-Options: SAMEORIGIN — previne clickjacking</li>
                  <li>X-Content-Type-Options: nosniff — previne MIME sniffing</li>
                  <li>Referrer-Policy: strict-origin-when-cross-origin</li>
                  <li>Permissions-Policy — desativa câmera, microfone e geolocalização</li>
                  <li>X-XSS-Protection: 1; mode=block</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-1">4.4 Autenticação e Controle de Acesso</h3>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>Tokens JWT com expiração automática</li>
                  <li>Controle de acesso baseado em perfil (RBAC): CLIENT, PROFESSIONAL, ADMIN</li>
                  <li>Logout automático em caso de token inválido ou expirado (HTTP 401)</li>
                  <li>Validação de senha com requisitos de complexidade (maiúscula, número, caractere especial)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-1">4.5 Armazenamento de Sessão</h3>
                <p className="text-sm text-gray-700">
                  Tokens de sessão são armazenados no <code>localStorage</code> do navegador e validados
                  contra o servidor a cada inicialização da aplicação. Dados de usuário não incluem
                  informações sensíveis (CPF e senha não são armazenados localmente).
                </p>
              </div>
            </div>
          </section>

          {/* 5. Compartilhamento */}
          <section className="bg-white rounded-2xl shadow-sm border p-6">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-bold text-blue-900">5. Compartilhamento de Dados</h2>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              O OdontoApp <strong>não vende, não cede e não comercializa</strong> dados pessoais de seus usuários.
              Os dados podem ser compartilhados apenas:
            </p>
            <ul className="mt-2 text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Com profissionais de saúde vinculados à clínica, para fins de atendimento</li>
              <li>Com autoridades públicas, quando exigido por lei ou ordem judicial</li>
              <li>Com prestadores de serviços tecnológicos (processadores de dados), sob acordo de confidencialidade</li>
            </ul>
          </section>

          {/* 6. Direitos do titular */}
          <section className="bg-white rounded-2xl shadow-sm border p-6">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-bold text-blue-900">6. Seus Direitos (LGPD)</h2>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              Conforme o Art. 18 da LGPD, você tem os seguintes direitos sobre seus dados pessoais:
            </p>
            <div className="grid gap-2 sm:grid-cols-2 text-sm">
              {[
                ['Confirmação', 'Saber se seus dados são tratados'],
                ['Acesso', 'Obter cópia dos seus dados'],
                ['Correção', 'Corrigir dados incompletos ou incorretos'],
                ['Anonimização', 'Solicitar anonimização de dados desnecessários'],
                ['Portabilidade', 'Receber seus dados em formato estruturado'],
                ['Eliminação', 'Pedir exclusão dos dados tratados com consentimento'],
                ['Revogação', 'Retirar consentimento a qualquer momento'],
                ['Reclamação', 'Reclamar à ANPD (Autoridade Nacional de Proteção de Dados)'],
              ].map(([title, desc]) => (
                <div key={title} className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-blue-900">{title}:</span>{' '}
                    <span className="text-gray-700">{desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 7. Retenção */}
          <section className="bg-white rounded-2xl shadow-sm border p-6">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-bold text-blue-900">7. Retenção de Dados</h2>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              Os dados são mantidos pelo tempo necessário para as finalidades declaradas e para cumprir
              obrigações legais. Registros de prontuários odontológicos seguem o prazo mínimo de{' '}
              <strong>5 anos</strong> conforme Resolução CFO nº 118/2012. Após o encerramento da conta,
              os dados são anonimizados ou eliminados em até 90 dias, salvo obrigação legal.
            </p>
          </section>

          {/* 8. Incidentes */}
          <section className="bg-white rounded-2xl shadow-sm border p-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <h2 className="text-xl font-bold text-blue-900">8. Resposta a Incidentes</h2>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              Em caso de incidente de segurança que possa gerar risco aos titulares, o OdontoApp se compromete
              a notificar a <strong>ANPD</strong> e os titulares afetados em prazo razoável (até 72 horas),
              conforme exigido pela LGPD, com descrição da natureza do incidente, dados afetados e medidas adotadas.
            </p>
          </section>

          {/* 9. Contato */}
          <section className="bg-white rounded-2xl shadow-sm border p-6">
            <div className="flex items-center gap-2 mb-3">
              <Mail className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-bold text-blue-900">9. Encarregado de Dados (DPO)</h2>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              Para exercer seus direitos, reportar incidentes ou obter esclarecimentos sobre esta política,
              entre em contato com nosso Encarregado de Proteção de Dados:
            </p>
            <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm text-blue-800 font-mono">
              <p>E-mail: privacidade@odonto.app</p>
              <p>Responsável: Departamento de Tecnologia — OdontoApp</p>
            </div>
          </section>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-10">
          © {new Date().getFullYear()} OdontoApp. Todos os direitos reservados.{' '}
          Esta política pode ser atualizada periodicamente. A versão vigente estará sempre disponível nesta página.
        </p>
      </main>
    </div>
  );
}
