"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const router = useRouter();
  const [logado, setLogado] = useState(false);

  useEffect(() => {
    setLogado(document.cookie.split("; ").includes("cris_sessao=1"));
  }, []);

  function sair() {
    document.cookie = "cris_sessao=; path=/; max-age=0; samesite=lax";
    setLogado(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-lav bg-cream/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-3">
        <Link href="/" aria-label="Início">
          <img src="/logo.png" alt="Cris Paixão Espaço Terapêutico" className="h-11 w-auto" />
        </Link>
        <nav className="flex items-center gap-2">
          {logado ? (
            <>
              <Link href="/sessoes" className="hidden min-h-11 items-center px-3 font-bold text-plum sm:flex">
                Minhas sessões
              </Link>
              <button type="button" onClick={sair} className="min-h-11 px-3 font-bold text-plum">
                Sair
              </button>
            </>
          ) : (
            <Link href="/login" className="hidden min-h-11 items-center px-3 font-bold text-plum sm:flex">
              Entrar
            </Link>
          )}
          <Link href="/agendar" className="btn btn-primary !min-h-11 !px-5">
            Agendar
          </Link>
        </nav>
      </div>
    </header>
  );
}
