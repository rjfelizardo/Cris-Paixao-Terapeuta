import Link from "next/link";
import Header from "../../components/Header";

export const metadata = { title: "Minhas sessões | Cris Paixão" };

export default function Sessoes() {
  return (
    <main>
      <Header />
      <div className="mx-auto flex max-w-xl flex-col gap-6 px-5 pb-12 pt-4">
        <div>
          <h1 className="font-display text-3xl font-semibold">Olá, [Nome]</h1>
          <p className="text-soft">Sua próxima sessão está confirmada.</p>
        </div>

        <section className="flex flex-col gap-3 rounded-3xl bg-plum p-5 text-white">
          <span className="inline-flex self-start rounded-full bg-mint px-3 py-0.5 text-sm font-bold text-mint-ink">Pago e confirmado</span>
          <p className="font-display text-3xl font-semibold leading-tight">Quarta, 14 de janeiro<br />às 11:00</p>
          <p className="text-[#e7daf3]">Terapia Holística e Integrativa · online</p>
          <a href="#" className="btn bg-white text-ink">Entrar na sessão</a>
          <p className="text-sm text-[#e7daf3]">O botão libera 10 minutos antes do horário. O link também foi enviado por e-mail e WhatsApp.</p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="eyebrow">Histórico</h2>
          <div className="card flex items-center justify-between gap-3 !rounded-2xl px-4 py-3">
            <div><div className="font-bold">07 de janeiro · 11:00</div><div className="text-sm text-soft">Terapia Holística e Integrativa</div></div>
            <span className="rounded-full bg-mint px-3 py-0.5 text-sm font-bold text-mint-ink">Realizada</span>
          </div>
          <div className="card flex items-center justify-between gap-3 !rounded-2xl px-4 py-3">
            <div><div className="font-bold">Contrato assinado</div><div className="text-sm text-soft">Registrado em 05 de janeiro</div></div>
            <a href="#" className="flex min-h-11 items-center font-bold text-plum">Ver</a>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-2">
          <a href="#" className="btn btn-soft">Remarcar</a>
          <Link href="/agendar" className="btn btn-primary">Nova sessão</Link>
        </div>
      </div>
    </main>
  );
}
