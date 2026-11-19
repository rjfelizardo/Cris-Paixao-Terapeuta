// Recorta a imagem em quadrado e reduz (256 px) para guardar como foto de perfil.
export function prepararFoto(arquivo, lado = 256) {
  return new Promise((resolve, reject) => {
    if (!arquivo || !arquivo.type.startsWith("image/")) return reject(new Error("Escolha um arquivo de imagem."));
    const url = URL.createObjectURL(arquivo);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = lado;
      canvas.height = lado;
      const corte = Math.min(img.width, img.height);
      canvas.getContext("2d").drawImage(img, (img.width - corte) / 2, (img.height - corte) / 2, corte, corte, 0, 0, lado, lado);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Não consegui abrir essa imagem."));
    };
    img.src = url;
  });
}

const CHAVE = "cris_perfil";

export function lerPerfil() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE) || "{}");
  } catch {
    return {};
  }
}

// Provisório: guarda no aparelho. Na Fase 2 vai para a conta (Supabase).
export function salvarPerfil(dados) {
  const novo = { ...lerPerfil(), ...dados };
  localStorage.setItem(CHAVE, JSON.stringify(novo));
  window.dispatchEvent(new Event("cris-perfil"));
  return novo;
}
