import { NextResponse } from "next/server";

// Proteção provisória: exige o cookie de sessão para entrar nas telas internas.
// Na Fase 2 isso passa a validar a sessão real (Supabase Auth).
export function middleware(request) {
  const logado = request.cookies.get("cris_sessao")?.value === "1";
  const adm = request.cookies.get("cris_papel")?.value === "adm";
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith("/login")) {
    if (logado) return NextResponse.redirect(new URL("/sessoes", request.url));
    return NextResponse.next();
  }

  if (!logado) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }
  if (pathname.startsWith("/painel") && !adm) {
    return NextResponse.redirect(new URL("/sessoes", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/agendar/:path*", "/pagamento/:path*", "/sessoes/:path*", "/painel/:path*", "/perfil/:path*", "/login"],
};
