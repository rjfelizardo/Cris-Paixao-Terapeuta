import Link from "next/link";

export default function Header() {
  return (
    <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-3">
      <Link href="/" aria-label="Início">
        <img src="/logo.png" alt="Cris Paixão Espaço Terapêutico" className="h-11 w-auto" />
      </Link>
      <nav className="flex items-center gap-2">
        <Link href="/sessoes" className="hidden min-h-11 items-center px-3 font-bold text-plum sm:flex">
          Minhas sessões
        </Link>
        <Link href="/agendar" className="btn btn-primary !min-h-11 !px-5">
          Agendar
        </Link>
      </nav>
    </header>
  );
}
