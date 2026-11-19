"use client";

import { useEffect, useMemo, useState } from "react";

// Taxas do Mercado Pago usadas na estimativa (conferir com a conta real da Cris).
const TAXA = { Pix: 0.0099, Cartão: 0.0498 };

const PERIODOS = [
  { id: "mes", label: "Este mês" },
  { id: "90", label: "Últimos 90 dias" },
  { id: "ano", label: "Este ano" },
  { id: "tudo", label: "Tudo" },
];

const STATUS = [
  { id: "todos", label: "Todos" },
  { id: "pago", label: "Pagos" },
  { id: "pendente", label: "Pendentes" },
  { id: "reembolsado", label: "Reembolsados" },
];

const RELATORIOS = [
  { id: "extrato", titulo: "Extrato de pagamentos", desc: "Cada pagamento com valor, taxa e líquido." },
  { id: "mensal", titulo: "Resumo por mês", desc: "Sessões, valor bruto, taxas e líquido por mês." },
  { id: "forma", titulo: "Por forma de pagamento", desc: "Quanto entrou em Pix e em cartão, com as taxas." },
];

const brl = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const pad = (n) => String(n).padStart(2, "0");
const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const dmy = (s) => `${s.slice(8, 10)}/${s.slice(5, 7)}/${s.slice(0, 4)}`;
const mesRot = (k) => new Date(+k.slice(0, 4), +k.slice(5, 7) - 1, 1).toLocaleDateString("pt-BR", { month: "short", year: "2-digit" }).replace(".", "");

function inicioDoPeriodo(id) {
  const h = new Date();
  if (id === "mes") return iso(new Date(h.getFullYear(), h.getMonth(), 1));
  if (id === "ano") return `${h.getFullYear()}-01-01`;
  if (id === "90") return iso(new Date(h.getTime() - 90 * 86400000));
  return "";
}

// Dados de exemplo para a tela. No sistema real, vêm dos pagamentos confirmados pelo Mercado Pago.
function gerarExemplo() {
  const valor = 250; // valor da sessão
  const lista = [];
  for (let i = 0; i < 26; i++) {
    const d = new Date(Date.now() - (i * 6 + (i % 3)) * 86400000);
    const forma = i % 3 === 0 ? "Cartão" : "Pix";
    const status = i === 1 ? "pendente" : i === 11 ? "reembolsado" : "pago";
    lista.push({ id: i, data: iso(d), cliente: `Cliente ${pad((i % 9) + 1)}`, forma, valor, status });
  }
  return lista;
}

const taxaDe = (p) => (p.status === "pago" ? Math.round(p.valor * TAXA[p.forma] * 100) / 100 : 0);

function montarRelatorio(id, lista) {
  const pagos = lista.filter((p) => p.status === "pago");
  if (id === "extrato") {
    return {
      nome: "extrato-de-pagamentos",
      head: ["Data", "Cliente", "Forma", "Valor bruto", "Taxa", "Valor líquido", "Situação"],
      rows: lista.map((p) => [dmy(p.data), p.cliente, p.forma, p.valor, taxaDe(p), p.status === "pago" ? p.valor - taxaDe(p) : 0, p.status[0].toUpperCase() + p.status.slice(1)]),
      moeda: [3, 4, 5],
    };
  }
  const agrupar = (chave) => {
    const m = new Map();
    for (const p of pagos) {
      const k = chave(p);
      const a = m.get(k) ?? { qtd: 0, bruto: 0, taxa: 0 };
      a.qtd += 1;
      a.bruto += p.valor;
      a.taxa += taxaDe(p);
      m.set(k, a);
    }
    return [...m.entries()];
  };
  if (id === "mensal") {
    const linhas = agrupar((p) => p.data.slice(0, 7)).sort((a, b) => a[0].localeCompare(b[0]));
    return {
      nome: "resumo-por-mes",
      head: ["Mês", "Sessões pagas", "Valor bruto", "Taxas", "Valor líquido"],
      rows: linhas.map(([k, a]) => [mesRot(k), a.qtd, a.bruto, a.taxa, a.bruto - a.taxa]),
      moeda: [2, 3, 4],
    };
  }
  const linhas = agrupar((p) => p.forma).sort((a, b) => b[1].bruto - a[1].bruto);
  return {
    nome: "por-forma-de-pagamento",
    head: ["Forma de pagamento", "Sessões pagas", "Valor bruto", "Taxas", "Valor líquido"],
    rows: linhas.map(([k, a]) => [k, a.qtd, a.bruto, a.taxa, a.bruto - a.taxa]),
    moeda: [2, 3, 4],
  };
}

function baixarCsv(rel) {
  const num = (v) => String(v.toFixed(2)).replace(".", ",");
  const celula = (v, j) => {
    const t = typeof v === "number" && rel.moeda.includes(j) ? num(v) : String(v);
    return /[;"\n]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
  };
  const linhas = [rel.head.join(";"), ...rel.rows.map((r) => r.map(celula).join(";"))];
  const blob = new Blob(["﻿" + linhas.join("\r\n")], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${rel.nome}-${iso(new Date())}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function Chip({ on, onClick, children }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`min-h-11 rounded-full border px-4 text-sm font-bold ${on ? "border-plum bg-plum text-white" : "border-lav-line bg-white text-ink"}`}
    >
      {children}
    </button>
  );
}

function Tile({ rotulo, valor, sub, tom }) {
  return (
    <div className="card p-4">
      <div className="text-sm text-soft">{rotulo}</div>
      <div className={`font-display text-4xl font-semibold ${tom === "ok" ? "text-mint-ink" : "text-plum"}`}>{valor}</div>
      {sub && <div className="text-sm text-soft">{sub}</div>}
    </div>
  );
}

function Selo({ status }) {
  const estilo = status === "pago" ? "bg-mint text-mint-ink" : status === "pendente" ? "bg-sand text-sand-ink" : "bg-lav text-ink";
  const rotulo = status === "pago" ? "Pago" : status === "pendente" ? "Pendente" : "Reembolsado";
  return <span className={`rounded-full px-3 py-0.5 text-sm font-bold ${estilo}`}>{rotulo}</span>;
}

export default function Financeiro() {
  const [todos, setTodos] = useState([]);
  const [periodo, setPeriodo] = useState("90");
  const [status, setStatus] = useState("todos");
  const [relId, setRelId] = useState("extrato");

  useEffect(() => setTodos(gerarExemplo()), []);

  const lista = useMemo(() => {
    const ini = inicioDoPeriodo(periodo);
    return todos.filter((p) => !ini || p.data >= ini).sort((a, b) => b.data.localeCompare(a.data));
  }, [todos, periodo]);

  const resumo = useMemo(() => {
    const pagos = lista.filter((p) => p.status === "pago");
    const bruto = pagos.reduce((s, p) => s + p.valor, 0);
    const taxas = pagos.reduce((s, p) => s + taxaDe(p), 0);
    const pendente = lista.filter((p) => p.status === "pendente").reduce((s, p) => s + p.valor, 0);
    return { bruto, taxas, liquido: bruto - taxas, pendente, qtd: pagos.length, ticket: pagos.length ? bruto / pagos.length : 0 };
  }, [lista]);

  const meses = useMemo(() => {
    const h = new Date();
    const chaves = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(h.getFullYear(), h.getMonth() - i, 1);
      chaves.push(`${d.getFullYear()}-${pad(d.getMonth() + 1)}`);
    }
    const soma = new Map();
    for (const p of todos) if (p.status === "pago") soma.set(p.data.slice(0, 7), (soma.get(p.data.slice(0, 7)) ?? 0) + p.valor);
    const itens = chaves.map((k) => ({ k, v: soma.get(k) ?? 0 }));
    const max = Math.max(1, ...itens.map((i) => i.v));
    return { itens, max };
  }, [todos]);

  const visiveis = lista.filter((p) => status === "todos" || p.status === status);
  const rel = useMemo(() => montarRelatorio(relId, lista), [relId, lista]);
  const fmtCel = (v, j) => (typeof v === "number" && rel.moeda.includes(j) ? brl(v) : v);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-semibold leading-tight">Financeiro</h1>
          <p className="text-soft">Pagamentos, taxas e relatórios dos seus atendimentos.</p>
        </div>
      </div>

      <div className="rounded-xl bg-sand px-4 py-3 text-sm text-sand-ink print:hidden">
        Dados de exemplo. No sistema real, aparecem aqui os pagamentos confirmados pelo Mercado Pago. As taxas são uma estimativa (Pix {String(TAXA.Pix * 100).replace(".", ",")}%, cartão {String(TAXA.Cartão * 100).replace(".", ",")}%).
      </div>

      <div className="flex flex-wrap gap-2 print:hidden" role="group" aria-label="Período">
        {PERIODOS.map((p) => (
          <Chip key={p.id} on={periodo === p.id} onClick={() => setPeriodo(p.id)}>{p.label}</Chip>
        ))}
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-4">
        <Tile rotulo="Recebido (bruto)" valor={brl(resumo.bruto)} sub={`${resumo.qtd} ${resumo.qtd === 1 ? "sessão paga" : "sessões pagas"}`} tom="ok" />
        <Tile rotulo="Líquido, após taxas" valor={brl(resumo.liquido)} sub={`taxas: ${brl(resumo.taxas)}`} />
        <Tile rotulo="A receber" valor={brl(resumo.pendente)} sub="pagamentos pendentes" />
        <Tile rotulo="Valor médio por sessão" valor={brl(resumo.ticket)} />
      </div>

      <section className="card p-6">
        <h2 className="font-display text-2xl font-semibold">Últimos 6 meses</h2>
        <p className="mb-4 text-sm text-soft">Valor recebido por mês (pagamentos confirmados).</p>
        <div className="flex h-44 items-end gap-3">
          {meses.itens.map((m) => (
            <div key={m.k} className="flex flex-1 flex-col items-center gap-1">
              <div className="flex h-36 w-full items-end justify-center">
                <div title={brl(m.v)} className="w-full max-w-10 rounded-t bg-plum" style={{ height: `${Math.max(m.v ? 4 : 0, (m.v / meses.max) * 100)}%` }} />
              </div>
              <span className="text-xs font-bold text-soft">{mesRot(m.k)}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="card flex flex-col gap-3 p-6 print:hidden">
        <h2 className="font-display text-2xl font-semibold">Pagamentos</h2>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Situação">
          {STATUS.map((s) => (
            <Chip key={s.id} on={status === s.id} onClick={() => setStatus(s.id)}>{s.label}</Chip>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-140 border-collapse text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-soft">
                {["Data", "Cliente", "Forma", "Valor", "Situação"].map((h) => (
                  <th key={h} className="border-b border-lav px-3 py-2 font-bold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visiveis.map((p) => (
                <tr key={p.id} className="border-b border-lav last:border-0">
                  <td className="px-3 py-3">{dmy(p.data)}</td>
                  <td className="px-3 py-3 font-bold">{p.cliente}</td>
                  <td className="px-3 py-3">{p.forma}</td>
                  <td className="px-3 py-3 font-bold">{brl(p.valor)}</td>
                  <td className="px-3 py-3"><Selo status={p.status} /></td>
                </tr>
              ))}
              {visiveis.length === 0 && (
                <tr><td colSpan={5} className="px-3 py-6 text-soft">Nenhum pagamento neste período.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card flex flex-col gap-4 p-6">
        <div>
          <h2 className="font-display text-2xl font-semibold">Relatórios</h2>
          <p className="text-sm text-soft">Vale o período escolhido acima. Baixe em planilha (abre no Excel e no Google Planilhas) ou salve em PDF.</p>
        </div>

        <div className="grid gap-3 md:grid-cols-3 print:hidden">
          {RELATORIOS.map((r) => (
            <button
              key={r.id}
              type="button"
              aria-pressed={relId === r.id}
              onClick={() => setRelId(r.id)}
              className={`rounded-2xl border-2 p-4 text-left ${relId === r.id ? "border-plum bg-lav" : "border-lav-line bg-white"}`}
            >
              <span className="block font-bold">{r.titulo}</span>
              <span className="text-sm text-soft">{r.desc}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 print:hidden">
          <button type="button" onClick={() => baixarCsv(rel)} className="btn btn-primary !min-h-12">Baixar planilha (CSV)</button>
          <button type="button" onClick={() => window.print()} className="btn btn-soft !min-h-12">Imprimir ou salvar em PDF</button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-lav">
          <table className="w-full min-w-150 border-collapse text-sm">
            <caption className="hidden p-3 text-left font-bold print:table-caption">
              {RELATORIOS.find((r) => r.id === relId).titulo} · Cris Paixão Espaço Terapêutico
            </caption>
            <thead>
              <tr className="bg-cream text-left text-xs uppercase tracking-wider text-soft">
                {rel.head.map((h) => (<th key={h} className="whitespace-nowrap px-3 py-2 font-bold">{h}</th>))}
              </tr>
            </thead>
            <tbody>
              {rel.rows.map((r, i) => (
                <tr key={i} className="border-t border-lav">
                  {r.map((c, j) => (<td key={j} className="px-3 py-2">{fmtCel(c, j)}</td>))}
                </tr>
              ))}
              {rel.rows.length === 0 && (
                <tr><td colSpan={rel.head.length} className="px-3 py-4 text-soft">Nada para mostrar neste período.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
