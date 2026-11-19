"use client";

import { useEffect, useState } from "react";
import { lerPerfil } from "../lib/foto";

// "Boa tarde, Nome" com o nome de quem está logado (guardado no login).
export default function Saudacao({ prefixo = "" }) {
  const [texto, setTexto] = useState("");

  useEffect(() => {
    let nome = "";
    try {
      nome = lerPerfil().nome || "";
    } catch {}
    const h = new Date().getHours();
    const quando = prefixo || (h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite");
    setTexto(nome ? `${quando}, ${nome}` : quando);
  }, [prefixo]);

  return <>{texto || " "}</>;
}
