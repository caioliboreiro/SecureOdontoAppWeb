// Página social/pública — servida via HTTP (sem dados sensíveis)
// Server Component: sem hooks, sem estado, sem JS no cliente

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import { ArrowRight, CalendarCheck, ClipboardList, Lock, LogIn, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AppoitmentImage  from '../assets/appointment.png';
import SmartAppoitment  from '../assets/smart-schedule.png';

export const metadata = {
  title: 'OdontoApp — Gestão Odontológica',
  description: 'Sistema de gestão odontológica com agendamentos, tratamentos e histórico de pacientes.',
};

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-green-50">

      {/* ── Cabeçalho ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/80 backdrop-blur shadow-sm supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
          <Logo />
          <nav className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" size="sm" className="text-sm px-2 sm:px-4 hover:bg-blue-100 transition" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button size="sm" className="text-sm px-2 sm:px-4 bg-blue-600 hover:bg-blue-700 text-white transition" asChild>
              <Link href="/auth/signup">
                <span className="hidden sm:inline">Cadastre-se</span>
                <span className="sm:hidden">Cadastrar</span>
                <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* ── Aviso de conexão segura ────────────────────────────────────────── */}
      <div className="w-full bg-blue-600 text-white text-xs sm:text-sm py-2 px-4 text-center flex items-center justify-center gap-2">
        <Lock className="h-3.5 w-3.5 shrink-0" />
        <span>
          Login e dados protegidos por <strong>HTTPS + Certificado Digital (RSA-OAEP)</strong> —{' '}
          <Link href="/politica-de-seguranca" className="underline underline-offset-2 hover:text-blue-200 transition">
            ver Política de Segurança
          </Link>
        </span>
      </div>

      <main className="flex-1">

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section className="container grid items-center gap-6 sm:gap-8 pb-8 sm:pb-12 pt-8 sm:pt-12 md:py-16 px-4">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 sm:gap-6 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
              <ShieldCheck className="h-3.5 w-3.5" /> Sistema certificado e em conformidade com a LGPD
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tighter text-blue-900 drop-shadow-sm">
              Bem-vindo ao <span className="text-blue-600">OdontoApp</span>
            </h1>
            <p className="max-w-[700px] text-base sm:text-lg text-foreground/80 px-4 sm:px-0">
              Plataforma completa de gestão para clínicas odontológicas. Agendamentos inteligentes,
              controle de tratamentos e histórico de pacientes — tudo com segurança digital de ponta a ponta.
            </p>
          </div>

          {/* CTAs — redirecionam para HTTPS automaticamente via server.js */}
          <div className="mx-auto mt-4 flex flex-col sm:flex-row gap-4 w-full max-w-md sm:max-w-lg justify-center px-4 sm:px-0">
            <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md px-6 py-3 text-base sm:text-lg transition-transform hover:scale-105" asChild>
              <Link href="/auth/login">
                <LogIn className="mr-2 h-5 w-5" />
                Acessar minha conta
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-blue-600 text-blue-700 hover:bg-blue-50 font-semibold rounded-lg px-6 py-3 text-base sm:text-lg transition-transform hover:scale-105" asChild>
              <Link href="/auth/signup">
                Criar nova conta
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        {/* ── Funcionalidades ───────────────────────────────────────────────── */}
        <section className="container py-10 sm:py-14 px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-blue-900 mb-8">
            Tudo que sua clínica precisa
          </h2>
          <div className="grid gap-8 sm:gap-10 md:grid-cols-3 max-w-5xl mx-auto">

            <Card className="rounded-2xl shadow-xl hover:shadow-2xl border-0 bg-white/90 transition-shadow duration-300 group">
              <CardHeader className="pb-4">
                <div className="relative w-full h-44 sm:h-52 overflow-hidden rounded-t-2xl">
                  <Image
                    src={AppoitmentImage}
                    alt="Gerenciamento de Tratamentos"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    data-ai-hint="dental treatment plan"
                  />
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <ClipboardList className="h-5 w-5 text-blue-600 shrink-0" />
                  <CardTitle className="text-lg sm:text-xl text-blue-900 font-bold">Tratamentos</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm sm:text-base">
                  Crie e organize planos de tratamento personalizados para cada paciente de forma eficiente.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-xl hover:shadow-2xl border-0 bg-white/90 transition-shadow duration-300 group">
              <CardHeader className="pb-4">
                <div className="relative w-full h-44 sm:h-52 overflow-hidden rounded-t-2xl">
                  <Image
                    src={SmartAppoitment}
                    alt="Agendamento de Consultas"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    data-ai-hint="calendar schedule appointment"
                  />
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <CalendarCheck className="h-5 w-5 text-blue-600 shrink-0" />
                  <CardTitle className="text-lg sm:text-xl text-blue-900 font-bold">Agendamento Inteligente</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm sm:text-base">
                  Facilite o agendamento de consultas e otimize a agenda dos profissionais com automação.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Card de segurança */}
            <Card className="rounded-2xl shadow-xl hover:shadow-2xl border-0 bg-gradient-to-br from-blue-600 to-blue-800 text-white transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-center w-full h-44 sm:h-52 rounded-t-2xl bg-blue-900/30">
                  <ShieldCheck className="h-24 w-24 text-white/80" />
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <Lock className="h-5 w-5 text-blue-200 shrink-0" />
                  <CardTitle className="text-lg sm:text-xl font-bold text-white">Segurança Digital</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm sm:text-base text-blue-100">
                  HTTPS com certificado próprio, criptografia RSA-OAEP + AES-256 e conformidade com a LGPD para seus dados sensíveis.
                </CardDescription>
                <Link
                  href="/politica-de-seguranca"
                  className="inline-flex items-center gap-1 mt-4 text-xs text-blue-200 hover:text-white underline underline-offset-2 transition"
                >
                  Ler Política de Segurança <ArrowRight className="h-3 w-3" />
                </Link>
              </CardContent>
            </Card>

          </div>
        </section>

        {/* ── Sobre a empresa ───────────────────────────────────────────────── */}
        <section className="container py-10 sm:py-14 px-4 max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-4">Sobre o OdontoApp</h2>
          <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
            O OdontoApp foi desenvolvido para modernizar a gestão de clínicas odontológicas brasileiras,
            unindo praticidade operacional com proteção rigorosa de dados de saúde. Nossa plataforma
            atende profissionais autônomos e clínicas de todos os portes, seguindo as diretrizes do
            Conselho Federal de Odontologia (CFO) e da Lei Geral de Proteção de Dados (LGPD).
          </p>
        </section>

      </main>

      {/* ── Rodapé ────────────────────────────────────────────────────────── */}
      <footer className="border-t py-4 sm:py-6 bg-white/80">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-3 px-4">
          <p className="text-xs sm:text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} OdontoApp. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="/politica-de-seguranca" className="hover:text-blue-600 hover:underline transition">
              Política de Segurança
            </Link>
            <span className="flex items-center gap-1 text-green-700 font-medium">
              <Lock className="h-3 w-3" /> Login via HTTPS
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
