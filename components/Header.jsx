"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Icone from "./Icone";
import PerfilAvatar from "./PerfilAvatar";
import { sairPerfil } from "../lib/foto";

const SITE = [
  { nome: "Início", href: "/", icone: "inicio" },
  { nome: "Agendar sessão", href: "/agendar", icone: "agendar" },
];
const PAINEL = [
  { nome: "Agenda", href: "/painel", icone: "agenda" },
  { nome: "Financeiro", href: "/painel/financeiro", icone: "financeiro" },
  { nome: "Clientes", icone: "clientes", soon: true },
  { nome: "Contratos", icone: "contratos", soon: true },
  { nome: "Horários e serviços", icone: "horarios", soon: true },
];
const WHATSAPP = "https://wa.me/5571988731566?text=Ol%C3%A1%2C%20Cris!%20Vim%20pelo%20site.";

// Menu lateral: gaveta aberta pelo botão no celular; barra fixa e recolhível (só ícones) no computador.
export default function Header({ espaco = true }) {
  const router = useRouter();
  const path = usePathname();
  const [logado, setLogado] = useState(false);
  const [adm, setAdm] = useState(false);
  const [aberto, setAberto] = useState(false);
  const [recolhido, setRecolhido] = useState(false);

  useEffect(() => {
    const c = document.cookie.split("; ");
    setLogado(c.includes("cris_sessao=1"));
    setAdm(c.includes("cris_papel=adm"));
    try {
      setRecolhido(localStorage.getItem("cris_menu") === "recolhido");
    } catch {}
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

  // computador: clicar fora da barra recolhe (deixa só os ícones)
  useEffect(() => {
    if (recolhido) return;
    function fora(e) {
      if (!window.matchMedia("(min-width: 768px)").matches) return;
      if (e.target.closest?.("#barra-lateral")) return;
      setRecolhido(true);
      try {
        localStorage.setItem("cris_menu", "recolhido");
      } catch {}
    }
    document.addEventListener("mousedown", fora);
    return () => document.removeEventListener("mousedown", fora);
  }, [recolhido]);

  function alternar() {
    const novo = !recolhido;
    setRecolhido(novo);
    try {
      localStorage.setItem("cris_menu", novo ? "recolhido" : "aberto");
    } catch {}
  }

  function sair() {
    document.cookie = "cris_sessao=; path=/; max-age=0; samesite=lax";
    document.cookie = "cris_papel=; path=/; max-age=0; samesite=lax";
    sairPerfil();
    setLogado(false);
    setAdm(false);
    setAberto(false);
    router.push("/");
    router.refresh();
  }

  const fechar = () => setAberto(false);

  function Item({ it, compact }) {
    const base = `flex min-h-11 items-center gap-3 rounded-xl ${compact ? "justify-center px-0" : "px-3.5"}`;
    const rotulo = compact ? <span className="sr-only">{it.nome}</span> : <span className="min-w-0 truncate">{it.nome}</span>;
    if (it.soon) {
      return (
        <span className={`${base} font-semibold text-white/70`} title={`${it.nome} (em breve)`}>
          <Icone nome={it.icone} />
          {rotulo}
          {!compact && <span className="ml-auto shrink-0 whitespace-nowrap rounded-full bg-white/20 px-2 py-0.5 text-xs">em breve</span>}
        </span>
      );
    }
    const ativo = path === it.href;
    return (
      <Link
        href={it.href}
        onClick={fechar}
        title={compact ? it.nome : undefined}
        aria-current={ativo ? "page" : undefined}
        className={`${base} ${ativo ? "bg-white font-bold text-ink" : "font-semibold text-white hover:bg-white/15"}`}
      >
        <Icone nome={it.icone} />
        {rotulo}
      </Link>
    );
  }

  function Acao({ icone, nome, onClick, href, compact }) {
    const cls = `flex min-h-11 items-center gap-3 rounded-xl font-semibold text-white hover:bg-white/15 ${compact ? "justify-center" : "px-3.5"}`;
    const conteudo = (
      <>
        <Icone nome={icone} />
        {compact ? <span className="sr-only">{nome}</span> : <span>{nome}</span>}
      </>
    );
    if (href) {
      return (
        <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener" className={cls} title={compact ? nome : undefined}>
          {conteudo}
        </a>
      );
    }
    return (
      <button type="button" onClick={onClick} className={`${cls} w-full text-left`} title={compact ? nome : undefined}>
        {conteudo}
      </button>
    );
  }

  function Conteudo({ compact }) {
    return (
      <>
        {logado && <PerfilAvatar compact={compact} />}

        <nav className="flex flex-col gap-1" aria-label="Menu principal">
          {SITE.map((it) => <Item key={it.nome} it={it} compact={compact} />)}
          {logado && <Item it={{ nome: "Minhas sessões", href: "/sessoes", icone: "sessoes" }} compact={compact} />}
          {logado && <Item it={{ nome: "Meu perfil", href: "/perfil", icone: "perfil" }} compact={compact} />}
          {!logado && <Item it={{ nome: "Entrar", href: "/login", icone: "entrar" }} compact={compact} />}
        </nav>

        {adm && (
          <nav className="flex flex-col gap-1 border-t border-white/30 pt-3" aria-label="Menu do painel">
            {!compact && <p className="px-3.5 pb-1 text-xs font-bold uppercase tracking-wider text-white/85">Painel da Cris</p>}
            {PAINEL.map((it) => <Item key={it.nome} it={it} compact={compact} />)}
          </nav>
        )}

        <div className="mt-auto flex flex-col gap-1 border-t border-white/30 pt-3">
          {logado && <Acao icone="sair" nome="Sair" onClick={sair} compact={compact} />}
          <Acao icone="instagram" nome="Instagram" href="https://instagram.com/crispaixaoterapeuta" compact={compact} />
          <Acao icone="whatsapp" nome="WhatsApp" href={WHATSAPP} compact={compact} />
        </div>
      </>
    );
  }

  return (
    <>
      {/* espaço para o botão do celular não cobrir o conteúdo (a home dispensa: o topo é a própria faixa lilás) */}
      {espaco && <div className="h-16 md:hidden" aria-hidden="true" />}

      {/* celular: botão + gaveta */}
      <button
        type="button"
        onClick={() => setAberto(true)}
        aria-label="Abrir menu"
        aria-expanded={aberto}
        aria-controls="menu-lateral"
        className="fixed left-4 top-3 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-lav-line md:hidden print:hidden"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b2a4a" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      {aberto && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-ink/50" onClick={fechar} aria-hidden="true" />
          <aside
            id="menu-lateral"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="absolute left-0 top-0 flex h-full w-72 max-w-[85vw] flex-col gap-4 overflow-y-auto bg-lilac p-5 text-white shadow-xl"
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
            {Conteudo({ compact: false })}
          </aside>
        </div>
      )}

      {/* computador: barra fixa, recolhível */}
      <aside
        id="barra-lateral"
        data-recolhido={recolhido ? "true" : "false"}
        aria-label="Menu lateral"
        className={`fixed inset-y-0 left-0 z-40 hidden bg-lilac text-white transition-[width] duration-200 md:block print:hidden ${recolhido ? "w-[72px]" : "w-64"}`}
      >
        <button
          type="button"
          onClick={alternar}
          aria-label={recolhido ? "Expandir menu" : "Recolher menu"}
          aria-expanded={!recolhido}
          className="absolute -right-3 top-7 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white text-lilac shadow ring-1 ring-lav-line"
        >
          <span className={`flex transition-transform ${recolhido ? "rotate-180" : ""}`}><Icone nome="seta" tamanho={14} /></span>
        </button>

        <div className={`flex h-full flex-col gap-4 overflow-y-auto overscroll-contain py-5 ${recolhido ? "px-3" : "px-4"}`}>
          <Link href="/" aria-label="Início" className="self-start">
            {recolhido ? (
              <img src="/logo-cp.png" alt="Cris Paixão" className="h-11 w-11 rounded-xl bg-cream object-contain p-1.5" />
            ) : (
              <img src="/logo.png" alt="Cris Paixão Espaço Terapêutico" className="h-12 w-auto rounded-xl bg-cream px-3 py-1.5" />
            )}
          </Link>
          {Conteudo({ compact: recolhido })}
        </div>
      </aside>
    </>
  );
}
