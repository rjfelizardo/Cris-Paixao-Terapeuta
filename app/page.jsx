import Link from "next/link";
import Header from "../components/Header";
import { SERVICOS } from "../components/Servicos";

const PASSOS = [
  ["Escolha o dia e o horário", "Veja os horários livres da agenda e reserve o seu."],
  ["Pague com Pix ou cartão", "A confirmação é imediata e o contrato é assinado na mesma tela."],
  ["Receba o link da sessão", "O link do Google Meet chega por e-mail, com lembretes antes do horário."],
];

export default function Home() {
  return (
    <main>
      <Header />

      <section className="bg-gradient-to-b from-lav to-cream">
        <div className="mx-auto grid max-w-5xl items-center gap-8 px-6 py-10 md:grid-cols-2 md:py-16">
          <div className="flex justify-center md:order-2">
            <div className="h-56 w-56 overflow-hidden rounded-full border-4 border-lav-line md:h-80 md:w-80">
              <img src="/cris.jpg" alt="Cristiane Paixão, terapeuta" className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="flex flex-col gap-5 text-center md:text-left">
            <span className="eyebrow">Espaço Terapêutico</span>
            <h1 className="font-display text-[2.4rem] font-semibold leading-[1.1] md:text-5xl">
              Quem olha para dentro <em className="text-plum">desperta</em>
            </h1>
            <p className="text-soft">
              Um espaço de escuta e presença para você se reencontrar, com atendimento online e horário marcado em poucos minutos.
            </p>
            <div className="flex flex-col gap-2 md:flex-row">
              <Link href="/agendar" className="btn btn-primary">Agendar minha sessão</Link>
              <a href="#servicos" className="btn text-plum">Conhecer o atendimento</a>
            </div>
          </div>
        </div>
      </section>

      <section id="servicos" className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="font-display text-3xl font-semibold">Como posso te ajudar</h2>
        <p className="mt-1 text-soft">Escolha o atendimento que faz sentido para o seu momento.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {SERVICOS.map((s) => (
            <article key={s.id} className="card flex flex-col gap-2 p-5">
              <h3 className="text-lg font-bold">{s.nome}</h3>
              <p className="text-soft">{s.desc}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-soft">{s.duracao} · online</span>
                <span className="font-bold">{s.valor}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-lav">
        <div className="mx-auto grid max-w-5xl items-center gap-6 px-6 py-12 md:grid-cols-2">
          <div className="aspect-[4/5] overflow-hidden rounded-2xl md:max-h-[34rem]">
            <img src="/cris-sobre.jpg" alt="Cristiane Paixão sorrindo em seu espaço de atendimento" className="h-full w-full object-cover" style={{ objectPosition: "center 25%" }} />
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-3xl font-semibold">Quem sou eu</h2>
            <p className="text-ink/90">[Texto da Cris sobre a trajetória, a formação e a forma como ela atende. Três ou quatro linhas.]</p>
            <p className="font-display text-2xl italic text-plum">Escuta, acolhimento, presença, transformação.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="font-display text-3xl font-semibold">Como funciona</h2>
        <ol className="mt-6 grid gap-6 md:grid-cols-3">
          {PASSOS.map(([t, d], i) => (
            <li key={t} className="flex items-start gap-4">
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-plum font-bold text-white">{i + 1}</span>
              <div>
                <div className="font-bold">{t}</div>
                <div className="text-soft">{d}</div>
              </div>
            </li>
          ))}
        </ol>
        <Link href="/agendar" className="btn btn-primary mt-8 md:max-w-xs">Agendar minha sessão</Link>
      </section>

      <footer className="bg-ink px-6 py-10 text-center text-[#f3ebf9]">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4">
          <img src="/logo.png" alt="" className="h-12 w-auto rounded-xl bg-cream px-3 py-1.5" />
          <p className="font-display text-2xl">Trate-se com elegância.</p>
          <div className="flex gap-3">
            <a href="https://instagram.com/crispaixaoterapeuta" className="flex min-h-11 items-center rounded-full border border-[#bfa8d6] px-5 font-semibold">Instagram</a>
            <a href="#" className="flex min-h-11 items-center rounded-full border border-[#bfa8d6] px-5 font-semibold">WhatsApp</a>
          </div>
          <p className="text-sm text-[#cdbbdd]">© Cris Paixão Espaço Terapêutico · [CNPJ ou registro profissional]</p>
        </div>
      </footer>
    </main>
  );
}
