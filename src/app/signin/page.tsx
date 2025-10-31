"use client";
import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const onSubmit = async () => {
    const params = new URLSearchParams({ callbackUrl: "/calendar", email });
    await fetch(`/api/auth/signin/email?${params.toString()}`, { method: "POST" });
    setSent(true);
  };
  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="text-xl font-semibold">Accede con tu email</h1>
      <label className="flex flex-col gap-1">
        <span className="text-sm">Email</span>
        <input className="rounded border px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <button className="rounded bg-brand px-4 py-2 text-white" onClick={() => void onSubmit()} disabled={!email}>
        Enviar enlace
      </button>
      {sent && <p className="text-sm text-slate-600">Si el email existe, recibirás un enlace de acceso.</p>}
    </div>
  );
}


