import "./globals.css";
import Header from "../components/Header";

const URL_SITE = "https://cris-paixao-terapeuta.vercel.app";

export const metadata = {
  metadataBase: new URL(URL_SITE),
  title: "Cris Paixão | Espaço Terapêutico",
  description: "Atendimento terapêutico online com agendamento e pagamento em poucos minutos.",
  openGraph: {
    title: "Cris Paixão | Espaço Terapêutico",
    description: "Atendimento terapêutico online com agendamento e pagamento em poucos minutos.",
    url: URL_SITE,
    siteName: "Cris Paixão Espaço Terapêutico",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "/og.png", width: 200, height: 200, alt: "Cris Paixão Espaço Terapêutico" }],
  },
  twitter: { card: "summary", images: ["/og.png"] },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Nunito+Sans:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
