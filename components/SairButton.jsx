"use client";

import { useRouter } from "next/navigation";

export default function SairButton() {
  const router = useRouter();
  function sair() {
    document.cookie = "cris_sessao=; path=/; max-age=0; samesite=lax";
    router.push("/");
    router.refresh();
  }
  return (
    <button type="button" onClick={sair} className="min-h-11 px-3 font-bold text-plum">
      Sair
    </button>
  );
}
