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

// Perfil guardado por e-mail, neste aparelho (provisório; na Fase 2 vai para a conta no Supabase).
const ATUAL = "cris_atual";
const LEGADO = "cris_perfil";
const chave = (email) => `cris_perfil:${email}`;

function ler(chaveNome) {
  try {
    return JSON.parse(localStorage.getItem(chaveNome) || "{}");
  } catch {
    return {};
  }
}

export function emailAtual() {
  try {
    return localStorage.getItem(ATUAL) || "";
  } catch {
    return "";
  }
}

export function lerPerfil() {
  const email = emailAtual();
  if (!email) return {};
  let dados = ler(chave(email));
  if (!Object.keys(dados).length) {
    // migra o perfil antigo (único por aparelho) se for deste e-mail
    const legado = ler(LEGADO);
    if (legado.email === email) {
      dados = legado;
      localStorage.setItem(chave(email), JSON.stringify(dados));
    }
  }
  return { ...dados, email };
}

export function salvarPerfil(dados) {
  const email = emailAtual();
  if (!email) throw new Error("sem-login");
  const novo = { ...lerPerfil(), ...dados, email };
  localStorage.setItem(chave(email), JSON.stringify(novo));
  window.dispatchEvent(new Event("cris-perfil"));
  return novo;
}

// No login: define quem está usando o aparelho e cria o perfil dessa pessoa se ainda não existir.
export function entrarPerfil(email, nomePadrao) {
  localStorage.setItem(ATUAL, email);
  const atual = lerPerfil();
  localStorage.setItem(chave(email), JSON.stringify({ ...atual, email, nome: atual.nome || nomePadrao }));
  window.dispatchEvent(new Event("cris-perfil"));
}

export function sairPerfil() {
  try {
    localStorage.removeItem(ATUAL);
  } catch {}
  window.dispatchEvent(new Event("cris-perfil"));
}
