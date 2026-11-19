"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import { lerPerfil, prepararFoto, salvarPerfil } from "../../lib/foto";

const PADRAO = { email: true, whatsapp: true, financeiro: true, novidades: false, antecedencia: "1d", novoAgendamento: true };

function Chave({ ligado, aoMudar, titulo, descricao }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <p className="font-semibold">{titulo}</p>
        {descricao && <p className="text-sm text-soft">{descricao}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={ligado}
        aria-label={titulo}
        onClick={() => aoMudar(!ligado)}
        className={`relative h-8 w-14 shrink-0 rounded-full transition-colors ${ligado ? "bg-plum" : "bg-lav-line"}`}
      >
        <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all ${ligado ? "left-7" : "left-1"}`} />
      </button>
    </div>
  );
}

export default function Perfil() {
  const router = useRouter();
  const input = useRef(null);
  const [pronto, setPronto] = useState(false);
  const [adm, setAdm] = useState(false);
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [foto, setFoto] = useState("");
  const [notif, setNotif] = useState(PADRAO);
  const [erro, setErro] = useState("");
  const [salvo, setSalvo] = useState(false);

  useEffect(() => {
    const p = lerPerfil();
    setEmail(p.email || "");
    setNome(p.nome || "");
    setTelefone(p.telefone || "");
    setFoto(p.foto || "");
    setNotif({ ...PADRAO, ...(p.notif || {}) });
    setAdm(document.cookie.split("; ").includes("cris_papel=adm"));
    setPronto(true);
  }, []);

  async function escolherFoto(e) {
    const arquivo = e.target.files?.[0];
    e.target.value = "";
    if (!arquivo) return;
    try {
      const nova = await prepararFoto(arquivo);
      setFoto(nova);
      salvarPerfil({ foto: nova });
      setErro("");
    } catch (err) {
      setErro(err.message || "Não foi possível usar essa foto.");
    }
  }

  function removerFoto() {
    setFoto("");
    salvarPerfil({ foto: "" });
  }

  function mascara(v) {
    const d = v.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 2) return d;
    if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  }

  function salvar(e) {
    e.preventDefault();
    const limpo = nome.trim();
    if (!limpo) {
      setErro("Escreva seu nome.");
      return;
    }
    try {
      salvarPerfil({ nome: limpo, telefone, notif });
      setNome(limpo);
      setErro("");
      setSalvo(true);
      setTimeout(() => setSalvo(false), 2500);
    } catch {
      setErro("Não foi possível salvar neste aparelho.");
    }
  }

  function sair() {
    document.cookie = "cris_sessao=; path=/; max-age=0; samesite=lax";
    document.cookie = "cris_papel=; path=/; max-age=0; samesite=lax";
    router.push("/");
    router.refresh();
  }

  const inicial = (nome || email || "?").charAt(0).toUpperCase();
  const mudar = (campo) => (v) => setNotif((n) => ({ ...n, [campo]: v }));

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-8">
        <div>
          <h1 className="font-display text-3xl font-semibold">Meu perfil</h1>
          <p className="text-soft">Seus dados e como você quer receber os avisos.</p>
        </div>

        {!pronto ? null : (
          <form onSubmit={salvar} className="flex flex-col gap-6">
            <section className="card flex flex-col gap-5 p-6" aria-labelledby="t-dados">
              <h2 id="t-dados" className="font-display text-xl font-semibold">Foto e dados</h2>

              <div className="flex items-center gap-4">
                {foto ? (
                  <img src={foto} alt="Sua foto de perfil" className="h-24 w-24 shrink-0 rounded-full border-4 border-lav-line object-cover" />
                ) : (
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-lav-line bg-lav font-display text-4xl font-semibold text-plum" aria-hidden="true">
                    {inicial}
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => input.current?.click()} className="btn btn-soft">
                    {foto ? "Trocar foto" : "Subir foto"}
                  </button>
                  {foto && (
                    <button type="button" onClick={removerFoto} className="btn text-plum">Remover</button>
                  )}
                  <input ref={input} type="file" accept="image/*" onChange={escolherFoto} className="hidden" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="nome" className="text-sm font-semibold">Nome</label>
                <input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} autoComplete="given-name" className="input" required />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-semibold">E-mail</label>
                <input id="email" value={email} readOnly className="input bg-lav/50 text-soft" />
                <p className="text-xs text-soft">O e-mail é o seu acesso e não pode ser alterado por aqui.</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="tel" className="text-sm font-semibold">WhatsApp</label>
                <input id="tel" value={telefone} onChange={(e) => setTelefone(mascara(e.target.value))} inputMode="tel" autoComplete="tel" placeholder="(71) 90000-0000" className="input" />
                <p className="text-xs text-soft">Usado para enviar o link da sessão e os lembretes.</p>
              </div>
            </section>

            <section className="card flex flex-col p-6" aria-labelledby="t-notif">
              <h2 id="t-notif" className="font-display text-xl font-semibold">Notificações</h2>
              <div className="mt-2 divide-y divide-lav-line">
                <Chave ligado={notif.email} aoMudar={mudar("email")} titulo="Lembretes por e-mail" descricao="Link da sessão e lembrete do horário." />
                <Chave ligado={notif.whatsapp} aoMudar={mudar("whatsapp")} titulo="Lembretes por WhatsApp" descricao="Mesmo aviso, direto no seu WhatsApp." />
                <Chave ligado={notif.financeiro} aoMudar={mudar("financeiro")} titulo="Pagamentos e contrato" descricao="Confirmação de pagamento e contrato assinado." />
                {adm && (
                  <Chave ligado={notif.novoAgendamento} aoMudar={mudar("novoAgendamento")} titulo="Novo agendamento" descricao="Avisar quando um cliente marcar ou cancelar." />
                )}
                <Chave ligado={notif.novidades} aoMudar={mudar("novidades")} titulo="Novidades e comunicados" descricao="Avisos ocasionais do Espaço Terapêutico." />
              </div>
              <div className="mt-4 flex flex-col gap-1.5">
                <label htmlFor="ant" className="text-sm font-semibold">Lembrar com antecedência de</label>
                <select id="ant" value={notif.antecedencia} onChange={(e) => mudar("antecedencia")(e.target.value)} className="input">
                  <option value="1d">1 dia antes</option>
                  <option value="2h">2 horas antes</option>
                  <option value="30m">30 minutos antes</option>
                </select>
              </div>
            </section>

            <section className="card flex flex-col gap-3 p-6" aria-labelledby="t-seg">
              <h2 id="t-seg" className="font-display text-xl font-semibold">Segurança</h2>
              <p className="text-sm text-soft">
                A troca de senha fica disponível quando o login real for ativado. Até lá, o acesso é provisório.
              </p>
              <button type="button" disabled className="btn btn-soft self-start opacity-60">Alterar senha</button>
            </section>

            {erro && <p role="alert" className="font-semibold text-[#9b1c1c]">{erro}</p>}

            <div className="flex flex-wrap items-center gap-3">
              <button type="submit" className="btn btn-primary">Salvar alterações</button>
              {salvo && <span role="status" className="font-semibold text-mint-ink">Salvo ✓</span>}
              <Link href={adm ? "/painel" : "/sessoes"} className="btn text-plum">Voltar</Link>
              <button type="button" onClick={sair} className="btn ml-auto text-plum">Sair</button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
