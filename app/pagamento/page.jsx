"use client";

import Link from "next/link";
import { useState } from "react";
import Header from "../../components/Header";

export default function Pagamento() {
  const [forma, setForma] = useState("pix");

  return (
    <main>
      <Header />
      <div className="mx-auto flex max-w-xl flex-col gap-6 px-5 pb-12 pt-4">
        <h1 className="font-display text-3xl font-semibold">Pagamento</h1>

        <div className="flex flex-col gap-1 rounded-2xl bg-lav p-4">
          <div className="font-bold">Terapia Holística e Integrativa</div>
          <div className="text-ink/90">Quarta, 14 de janeiro · 11:00 · online</div>
          <div className="mt-2 flex justify-between font-bold"><span>Total</span><span>R$ 300,00</span></div>
        </div>

        <section className="flex flex-col gap-3">
          <h2 className="eyebrow">Seus dados</h2>
          <div className="flex flex-col gap-1">
            <label htmlFor="nome" className="text-sm text-ink/90">Nome completo</label>
            <input id="nome" className="input" placeholder="Como está no seu documento" />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm text-ink/90">E-mail (o link da sessão será enviado aqui)</label>
            <input id="email" type="email" className="input" placeholder="voce@email.com" />
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="eyebrow">Forma de pagamento</h2>
          <div className="grid grid-cols-2 gap-2">
            {[["pix", "Pix"], ["cartao", "Cartão"]].map(([id, label]) => (
              <button
                key={id}
                type="button"
                aria-pressed={forma === id}
                onClick={() => setForma(id)}
                className={`min-h-13 rounded-2xl border-2 font-bold ${forma === id ? "border-plum bg-plum text-white" : "border-lav-line bg-white text-ink"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        <div className="flex items-start gap-3">
          <input id="aceite" type="checkbox" className="mt-1 h-6 w-6 flex-none accent-plum" />
          <label htmlFor="aceite" className="text-[0.95rem] text-ink/90">
            Li e aceito o <a href="#" className="font-bold text-plum underline">contrato de prestação de serviço</a>. A assinatura fica registrada com data e horário.
          </label>
        </div>

        <div className="flex flex-col gap-2">
          <Link href="/sessoes" className="btn btn-primary">{forma === "pix" ? "Pagar com Pix" : "Pagar com cartão"}</Link>
          <p className="text-center text-sm text-soft">Pagamento seguro pelo Mercado Pago</p>
        </div>
      </div>
    </main>
  );
}
