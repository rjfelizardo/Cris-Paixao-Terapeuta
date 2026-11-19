// Provisório: lista de administradores e nomes conhecidos por e-mail.
// Na Fase 2 isso vem do banco (papel e nome do usuário).
export const ADMINS = ["rjfelizardo@gmail.com", "crispaixaoterapeuta@gmail.com"];

const NOMES = {
  "rjfelizardo@gmail.com": "Rodrigo",
  "crispaixaoterapeuta@gmail.com": "Cris",
};

export function nomeDoEmail(email) {
  const e = String(email || "").trim().toLowerCase();
  if (NOMES[e]) return NOMES[e];
  const base = e.split("@")[0].replace(/[._-]+/g, " ").trim().split(" ")[0] || "";
  return base.charAt(0).toUpperCase() + base.slice(1);
}
