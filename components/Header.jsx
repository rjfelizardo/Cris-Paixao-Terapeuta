"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header({ espaco = true }) {
  const router = useRouter();
  const [logado, setLogado] = useState(false);
  const [adm, setAdm] = useState(false);
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    const c = document.cookie.split("; ");
    setLogado(c.includes("cris_sessao=1"));
    setAdm(c.includes("cris_papel=adm"));
  }, []);

  useEffect(() => {
    if (!aberto) return;
    const onKey = (e) => e.key === "Escape" && setAberto(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [aberto]);

  function sair() {
    document.cookie = "cris_sessao=; path=/; max-age=0; samesite=lax";
    document.cookie = "cris_papel=; path=/; max-age=0; samesite=lax";
    setLogado(false);
    setAberto(false);
    router.push("/");
    router.refresh();
  }

  const fechar = () => setAberto(false);
  const item = "flex min-h-12 items-center rounded-xl px-4 font-bold text-white hover:bg-white/15";

  return (
    <>
      {/* espaço reservado para o botão não cobrir o conteúdo (a home dispensa: o topo é a própria faixa lilás) */}
      {espaco && <div className="h-16" aria-hidden="true" />}

      <button
        type="button"
        onClick={() => setAberto(true)}
        aria-label="Abrir menu"
        aria-expanded={aberto}
        aria-controls="menu-lateral"
        className="fixed left-4 top-3 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-lav-line"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b2a4a" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      {aberto && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-ink/50" onClick={fechar} aria-hidden="true" />
          <aside
            id="menu-lateral"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="absolute left-0 top-0 flex h-full w-72 max-w-[85vw] flex-col gap-6 bg-lilac p-5 text-white shadow-xl"
          >
            <div className="flex items-center justify-between">
              <Link href="/" onClick={fechar} aria-label="Início">
                <img src="/logo.png" alt="Cris Paixão Espaço Terapêutico" className="h-12 w-auto rounded-xl bg-cream px-3 py-1.5" />
              </Link>
              <button type="button" onClick={fechar} aria-label="Fechar menu" className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col gap-1" aria-label="Menu principal">
              <Link href="/" onClick={fechar} className={item}>Início</Link>
              <Link href="/agendar" onClick={fechar} className={item}>Agendar sessão</Link>
              {logado && <Link href="/sessoes" onClick={fechar} className={item}>Minhas sessões</Link>}
              {adm && <Link href="/painel" onClick={fechar} className={item}>Painel da Cris</Link>}
              {logado ? (
                <button type="button" onClick={sair} className={`${item} text-left`}>Sair</button>
              ) : (
                <Link href="/login" onClick={fechar} className={item}>Entrar</Link>
              )}
            </nav>

            <div className="mt-auto flex flex-col gap-1 border-t border-white/30 pt-4 text-white">
              <a href="https://instagram.com/crispaixaoterapeuta" className="flex min-h-11 items-center px-4 font-semibold">Instagram</a>
              <a href="#" className="flex min-h-11 items-center px-4 font-semibold">WhatsApp</a>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
