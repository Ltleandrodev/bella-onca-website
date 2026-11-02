"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder"
);

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      setError("Não foi possível entrar. Confira e-mail e senha.");
      return;
    }

    router.push("/admin/painel");
  }

  return (
    <main className="adminPage">
      <form className="adminLogin" onSubmit={submit}>
        <p className="eyebrow">BELLA ONÇA • ADMIN</p>
        <h1>Painel</h1>
        <p className="adminNote">Entre com a conta de administrador configurada no projeto.</p>
        <div className="field"><label>E-mail</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
        <div className="field"><label>Senha</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
        {error && <p style={{color:"#8a2f2f",fontWeight:700}}>{error}</p>}
        <button className="btn" style={{width:"100%"}} disabled={loading}>{loading ? "Entrando..." : "Entrar"}</button>
        <a href="/" className="textLink" style={{display:"inline-block",marginTop:20}}>← Voltar ao site</a>
      </form>
    </main>
  );
}
