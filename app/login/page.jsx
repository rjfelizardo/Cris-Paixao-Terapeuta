"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [modo, setModo] = useState("entrar");
  const [verSenha, setVerSenha] = useState(false);
  const criando = modo === "criar";

  function enviar(e) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") || "").trim().toLowerCase();
    document.cookie = "cris_sessao=1; path=/; max-age=86400; samesite=lax";
    // Provisório: e-mails de administrador (Fase 2 troca por papel real no banco).
    const ehAdm = ["rjfelizardo@gmail.com"].includes(email);
    document.cookie = ehAdm
      ? "cris_papel=adm; path=/; max-age=86400; samesite=lax"
      : "cris_papel=; path=/; max-age=0; samesite=lax";
    const next = new URLSearchParams(window.location.search).get("next");
    router.push(next && next.startsWith("/") && !next.startsWith("//") ? next : ehAdm ? "/painel" : "/sessoes");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-lav to-cream px-5 py-8">
      <Link href="/" aria-label="Voltar ao início">
        <img src="/logo.png" alt="Cris Paixão Espaço Terapêutico" className="h-14 w-auto" />
      </Link>

      <div className="card mt-8 flex w-full max-w-md flex-col gap-5 p-6 md:p-8">
        <div className="flex flex-col gap-1 text-center">
          <h1 className="font-display text-3xl font-semibold">{criando ? "Criar minha conta" : "Que bom ter você aqui"}</h1>
          <p className="text-soft">
            {criando ? "Leva menos de um minuto." : "Entre para ver suas sessões e agendar novos horários."}
          </p>
        </div>

        <form onSubmit={enviar} className="flex flex-col gap-4">
          {criando && (
            <div className="flex flex-col gap-1">
              <label htmlFor="nome" className="text-sm text-ink/90">Nome completo</label>
              <input id="nome" name="nome" autoComplete="name" className="input" required />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm text-ink/90">E-mail</label>
            <input id="email" name="email" type="email" autoComplete="email" placeholder="voce@email.com" className="input" required />
          </div>

          {criando && (
            <div className="flex flex-col gap-1">
              <label htmlFor="whatsapp" className="text-sm text-ink/90">WhatsApp (para avisos da sessão)</label>
              <input id="whatsapp" name="whatsapp" type="tel" autoComplete="tel" placeholder="(71) 90000-0000" className="input" />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <div className="flex items-baseline justify-between">
              <label htmlFor="senha" className="text-sm text-ink/90">Senha</label>
              {!criando && <a href="#" className="flex min-h-11 items-center text-sm font-bold text-plum">Esqueci minha senha</a>}
            </div>
            <div className="relative">
              <input
                id="senha"
                name="senha"
                type={verSenha ? "text" : "password"}
                autoComplete={criando ? "new-password" : "current-password"}
                className="input pr-24"
                required
              />
              <button
                type="button"
                onClick={() => setVerSenha(!verSenha)}
                aria-pressed={verSenha}
                className="absolute right-1 top-1 flex min-h-11 items-center px-3 text-sm font-bold text-plum"
              >
                {verSenha ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          {criando && (
            <div className="flex items-start gap-3">
              <input id="termos" type="checkbox" required className="mt-1 h-6 w-6 flex-none accent-plum" />
              <label htmlFor="termos" className="text-[0.95rem] text-ink/90">
                Li e aceito os <a href="#" className="font-bold text-plum underline">termos de uso</a> e a <a href="#" className="font-bold text-plum underline">política de privacidade</a>.
              </label>
            </div>
          )}

          <button type="submit" className="btn btn-primary mt-1">{criando ? "Criar conta" : "Entrar"}</button>
        </form>

        <div className="flex items-center gap-3 text-sm text-soft" aria-hidden="true">
          <span className="h-px flex-1 bg-lav-line" />ou<span className="h-px flex-1 bg-lav-line" />
        </div>

        <button type="button" className="btn btn-soft">Receber link de acesso por e-mail</button>

        <p className="text-center text-soft">
          {criando ? "Já tem conta?" : "Ainda não tem conta?"}{" "}
          <button type="button" onClick={() => setModo(criando ? "entrar" : "criar")} className="min-h-11 font-bold text-plum underline">
            {criando ? "Entrar" : "Criar conta"}
          </button>
        </p>
      </div>

      <Link href="/" className="mt-6 flex min-h-11 items-center font-bold text-plum">Voltar ao site</Link>
    </main>
  );
}
