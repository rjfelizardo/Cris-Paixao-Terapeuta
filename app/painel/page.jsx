export const metadata = { title: "Painel | Cris Paixão" };

const NUMEROS = [["Sessões hoje", "3"], ["Sessões na semana", "9"], ["Recebido no mês", "R$ [0,00]"], ["Contratos pendentes", "1"]];
const HOJE = [
  { h: "09:00", cliente: "[Nome do cliente]", serv: "Terapia Holística e Integrativa", status: "pago" },
  { h: "11:00", cliente: "[Nome do cliente]", serv: "Terapia Holística e Integrativa", status: "pago", destaque: true },
  { h: "15:30", cliente: "[Nome do cliente]", serv: "Terapia Holística e Integrativa", status: "aguardando" },
];

export default function Painel() {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-semibold leading-tight">Boa tarde, Cris</h1>
          <p className="text-soft">Quarta, 14 de janeiro</p>
        </div>
        <a href="#" className="btn btn-primary !min-h-12">Bloquear horário</a>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        {NUMEROS.map(([l, v]) => (
          <div key={l} className="card p-4">
            <div className="text-sm text-soft">{l}</div>
            <div className="font-display text-4xl font-semibold text-plum">{v}</div>
          </div>
        ))}
      </div>

      <section className="card flex flex-col gap-2 p-6">
        <h2 className="font-display text-2xl font-semibold">Atendimentos de hoje</h2>
        {HOJE.map((a) => (
          <div key={a.h} className="flex flex-wrap items-center gap-4 border-t border-lav py-3.5">
            <div className="w-18 flex-none text-lg font-bold">{a.h}</div>
            <div className="min-w-48 flex-1">
              <div className="font-bold">{a.cliente}</div>
              <div className="text-sm text-soft">{a.serv} · online</div>
            </div>
            {a.status === "pago"
              ? <span className="rounded-full bg-mint px-3 py-0.5 text-sm font-bold text-mint-ink">Pago</span>
              : <span className="rounded-full bg-sand px-3 py-0.5 text-sm font-bold text-sand-ink">Aguardando pagamento</span>}
            <a href="#" className={`flex min-h-11 items-center rounded-full px-5 font-bold ${a.status !== "pago" ? "border border-[#c9b3dd]" : a.destaque ? "bg-plum text-white" : "bg-lav"}`}>
              {a.status === "pago" ? "Entrar na sessão" : "Ver detalhes"}
            </a>
          </div>
        ))}
      </section>
    </>
  );
}
