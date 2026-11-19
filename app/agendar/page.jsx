"use client";

import Link from "next/link";
import { useState } from "react";
import Header from "../../components/Header";
import { SERVICO } from "../../components/Servicos";

const DIAS = [
  ["seg", "12"], ["ter", "13"], ["qua", "14"], ["qui", "15"], ["sex", "16"],
];
const HORAS = ["08:00", "09:30", "11:00", "14:00", "15:30", "17:00"]; // sessões de 1h30

function Opcao({ on, onClick, children, className = "" }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`rounded-2xl border font-bold transition ${on ? "border-plum bg-plum text-white" : "border-lav-line bg-white text-ink hover:bg-lav"} ${className}`}
    >
      {children}
    </button>
  );
}

export default function Agendar() {
  const [dia, setDia] = useState(1);
  const [hora, setHora] = useState(2);
  const s = SERVICO;

  return (
    <main>
      <Header />
      <div className="mx-auto flex max-w-xl flex-col gap-6 px-5 pb-12 pt-4">
        <h1 className="font-display text-3xl font-semibold">Agendar sessão</h1>

        <section className="flex items-center justify-between gap-3 rounded-2xl bg-lav p-4">
          <span>
            <span className="block font-bold">{SERVICO.nome}</span>
            <span className="text-sm text-soft">{SERVICO.duracao} · online</span>
          </span>
          <span className="font-bold">{SERVICO.valor}</span>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="eyebrow">1. Dia</h2>
          <div className="grid grid-cols-5 gap-2">
            {DIAS.map(([sem, num], i) => (
              <Opcao key={num} on={dia === i} onClick={() => setDia(i)} className="flex min-h-16 flex-col items-center justify-center">
                <span className="text-xs font-normal uppercase tracking-wider">{sem}</span>
                <span className="text-xl">{num}</span>
              </Opcao>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="eyebrow">2. Horário</h2>
          <div className="grid grid-cols-3 gap-2">
            {HORAS.map((h, i) => (
              <Opcao key={h} on={hora === i} onClick={() => setHora(i)} className="min-h-12">{h}</Opcao>
            ))}
          </div>
          <p className="text-sm text-soft">Horários de Brasília. Depois do pagamento, o link da sessão chega por e-mail.</p>
        </section>

        <div className="card flex flex-col gap-3 p-4">
          <div className="flex items-baseline justify-between">
            <span className="text-soft">{DIAS[dia][0]} {DIAS[dia][1]} de janeiro · {HORAS[hora]}</span>
            <span className="font-bold">{s.valor}</span>
          </div>
          <Link href="/pagamento" className="btn btn-primary">Continuar para o pagamento</Link>
        </div>
      </div>
    </main>
  );
}
