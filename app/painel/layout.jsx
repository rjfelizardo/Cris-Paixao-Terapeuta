import Header from "../../components/Header";
import PainelNav from "../../components/PainelNav";

export default function PainelLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-wrap bg-cream">
      <Header espaco={false} />
      <aside className="flex flex-[1_1_240px] flex-col gap-6 bg-lilac p-4 pb-6 pt-20 text-white md:max-w-70 print:hidden">
        <img src="/logo.png" alt="Cris Paixão Espaço Terapêutico" className="h-13 w-auto self-start rounded-xl bg-cream px-3 py-1.5" />
        <PainelNav />
      </aside>
      <main className="flex min-w-0 flex-[999_1_560px] flex-col gap-6 p-6 md:p-8">{children}</main>
    </div>
  );
}
