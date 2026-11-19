"use client";

import { useEffect, useRef, useState } from "react";

// Balão de perfil com botão para subir a foto.
// Provisório: a foto fica guardada neste aparelho (localStorage).
// Na Fase 2 passa a ser salva na conta do usuário (Supabase).
const CHAVE = "cris_perfil";

function ler() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE) || "{}");
  } catch {
    return {};
  }
}

export default function PerfilAvatar({ compact = false }) {
  const [perfil, setPerfil] = useState({});
  const [erro, setErro] = useState("");
  const input = useRef(null);

  useEffect(() => {
    setPerfil(ler());
    const atualizar = () => setPerfil(ler());
    window.addEventListener("cris-perfil", atualizar);
    return () => window.removeEventListener("cris-perfil", atualizar);
  }, []);

  function escolher(e) {
    const arquivo = e.target.files?.[0];
    e.target.value = "";
    if (!arquivo) return;
    if (!arquivo.type.startsWith("image/")) {
      setErro("Escolha um arquivo de imagem.");
      return;
    }
    setErro("");
    const url = URL.createObjectURL(arquivo);
    const img = new Image();
    img.onload = () => {
      const lado = 256;
      const canvas = document.createElement("canvas");
      canvas.width = lado;
      canvas.height = lado;
      const corte = Math.min(img.width, img.height);
      canvas
        .getContext("2d")
        .drawImage(img, (img.width - corte) / 2, (img.height - corte) / 2, corte, corte, 0, 0, lado, lado);
      const foto = canvas.toDataURL("image/jpeg", 0.85);
      URL.revokeObjectURL(url);
      const novo = { ...ler(), foto };
      try {
        localStorage.setItem(CHAVE, JSON.stringify(novo));
      } catch {
        setErro("Não foi possível guardar a foto.");
        return;
      }
      setPerfil(novo);
      window.dispatchEvent(new Event("cris-perfil"));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      setErro("Não consegui abrir essa imagem.");
    };
    img.src = url;
  }

  const nome = perfil.nome || (perfil.email ? perfil.email.split("@")[0] : "Meu perfil");
  const inicial = nome.charAt(0).toUpperCase();

  if (compact) {
    return perfil.foto ? (
      <img src={perfil.foto} alt="Sua foto de perfil" title={nome} className="mx-auto h-11 w-11 rounded-full border-2 border-white object-cover" />
    ) : (
      <div title={nome} className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-white/20 font-display text-lg font-semibold" aria-hidden="true">
        {inicial}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="relative h-16 w-16 shrink-0">
        {perfil.foto ? (
          <img src={perfil.foto} alt="Sua foto de perfil" className="h-16 w-16 rounded-full border-2 border-white object-cover" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white bg-white/20 font-display text-2xl font-semibold" aria-hidden="true">
            {inicial}
          </div>
        )}
        <button
          type="button"
          onClick={() => input.current?.click()}
          aria-label={perfil.foto ? "Trocar foto de perfil" : "Subir foto de perfil"}
          className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-white text-lilac shadow ring-1 ring-lav-line"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        </button>
        <input ref={input} type="file" accept="image/*" onChange={escolher} className="hidden" />
      </div>
      <div className="min-w-0">
        <p className="truncate font-semibold">{nome}</p>
        {erro ? <p className="text-xs text-white">{erro}</p> : <p className="text-xs text-white/85">{perfil.foto ? "Toque na câmera para trocar" : "Toque na câmera para subir sua foto"}</p>}
      </div>
    </div>
  );
}
