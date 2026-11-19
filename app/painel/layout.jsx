import Header from "../../components/Header";

export default function PainelLayout({ children }) {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="mx-auto flex max-w-6xl min-w-0 flex-col gap-6 p-6 md:p-8">{children}</main>
    </div>
  );
}
