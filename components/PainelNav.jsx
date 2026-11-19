"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITENS = [
  { nome: "Agenda", href: "/painel" },
  { nome: "Financeiro", href: "/painel/financeiro" },
  { nome: "Clientes", soon: true },
  { nome: "Contratos", soon: true },
  { nome: "Horários e serviços", soon: true },
];

export default function PainelNav() {
  const path = usePathname();
  return (
    <nav aria-label="Menu principal" className="flex flex-col gap-1">
      {ITENS.map((i) => {
        if (i.soon) {
          return (
            <span key={i.nome} className="flex min-h-11 items-center justify-between rounded-xl px-3.5 font-semibold text-white/85">
              {i.nome}
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">em breve</span>
            </span>
          );
        }
        const ativo = path === i.href;
        return (
          <Link
            key={i.nome}
            href={i.href}
            aria-current={ativo ? "page" : undefined}
            className={`flex min-h-11 items-center rounded-xl px-3.5 ${ativo ? "bg-white font-bold text-ink" : "font-semibold text-white hover:bg-white/15"}`}
          >
            {i.nome}
          </Link>
        );
      })}
    </nav>
  );
}
