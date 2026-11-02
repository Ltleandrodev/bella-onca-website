"use client";

import { FormEvent, useEffect, useState, type ReactNode } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import type {
  BeforeAfter,
  Certificate,
  Faq,
  GalleryItem,
  Highlight,
  ModelItem,
  Review,
  Service,
  SiteSettings
} from "@/lib/types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder"
);

type Data = {
  services: Service[];
  models: ModelItem[];
  beforeAfter: BeforeAfter[];
  reviews: Review[];
  gallery: GalleryItem[];
  certificates: Certificate[];
  highlights: Highlight[];
  faqs: Faq[];
  settings: SiteSettings | null;
};

type Tab = "antes" | "modelos" | "servicos" | "galeria" | "destaques" | "avaliacoes" | "certificados" | "faq" | "config";
type SaveFn = (table: string, action: string, payload: unknown, id?: string) => Promise<void>;
type RemoveFn = (table: string, id: string) => Promise<void>;
type UploadFn = (file?: File | null) => Promise<string>;
type BaseProps = { save: SaveFn; remove: RemoveFn };

const defaultSettings: SiteSettings = {
  id: 1,
  hero_title: "Seu olhar, sua assinatura.",
  hero_subtitle: "Cílios e sobrancelhas com técnica, delicadeza e personalidade.",
  about_text: "",
  whatsapp: "",
  instagram: "bellaonca.studio",
  address: "",
  hours: "Atendimento com horário agendado",
  professional_name: "Bella Onça",
  professional_title: "Especialista em cílios e sobrancelhas",
  professional_photo_url: "",
  booking_policy: "Agendamentos são confirmados pelo WhatsApp.",
  care_before: "Chegue sem maquiagem na região dos olhos.",
  care_after: "Siga as orientações recebidas no atendimento."
};

export default function AdminDashboard() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [data, setData] = useState<Data>({ services: [], models: [], beforeAfter: [], reviews: [], gallery: [], certificates: [], highlights: [], faqs: [], settings: null });
  const [tab, setTab] = useState<Tab>("antes");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function api(url: string, options: RequestInit = {}, currentToken?: string) {
    const headers = new Headers(options.headers || {});
    headers.set("Authorization", `Bearer ${currentToken || token}`);
    const response = await fetch(url, { ...options, headers });
    const json = await response.json();
    if (!response.ok) throw new Error(json.error || "Erro na operação.");
    return json;
  }

  async function load(currentToken?: string) {
    const t = currentToken || token;
    if (!t) return;
    setLoading(true);
    try {
      const response = await fetch("/api/admin/data", { headers: { Authorization: `Bearer ${t}` } });
      const json = await response.json();
      if (response.status === 403) {
        await supabase.auth.signOut();
        router.push("/admin");
        return;
      }
      if (!response.ok) throw new Error(json.error || "Erro ao carregar painel.");
      setData(json);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro ao carregar painel.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin");
        return;
      }
      setToken(session.access_token);
      await load(session.access_token);
    })();
  }, []);

  async function save(table: string, action: string, payload: unknown, id?: string) {
    setMessage("");
    await api("/api/admin/resource", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table, action, payload, id })
    });
    setMessage("Salvo com sucesso.");
    await load();
  }

  async function remove(table: string, id: string) {
    if (!confirm("Excluir este item?")) return;
    await save(table, "delete", {}, id);
  }

  async function upload(file?: File | null) {
    if (!file) return "";
    const form = new FormData();
    form.append("file", file);
    const json = await api("/api/admin/upload", { method: "POST", body: form });
    return json.url as string;
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push("/admin");
  }

  const tabs: [Tab, string][] = [
    ["antes", "Antes & Depois"],
    ["modelos", "Modelos"],
    ["servicos", "Preços"],
    ["galeria", "Galeria"],
    ["destaques", "Destaques"],
    ["avaliacoes", "Avaliações"],
    ["certificados", "Certificados"],
    ["faq", "FAQ"],
    ["config", "Informações"]
  ];

  return (
    <main className="adminPage"><div className="adminShell">
      <div className="adminTop">
        <div><p className="eyebrow">BELLA ONÇA • ADMIN</p><h1>Painel de conteúdo</h1></div>
        <div className="rowActions"><a className="miniBtn" href="/" target="_blank">Ver site</a><button className="miniBtn" onClick={logout}>Sair</button></div>
      </div>
      <div className="adminTabs">{tabs.map(([key, label]) => <button key={key} className={`tabBtn ${tab === key ? "active" : ""}`} onClick={() => setTab(key)}>{label}</button>)}</div>
      {message && <div className="adminCard"><strong>{message}</strong></div>}
      {loading ? <div className="adminCard">Carregando...</div> : <>
        {tab === "antes" && <BeforeEditor items={data.beforeAfter} save={save} remove={remove} upload={upload} />}
        {tab === "modelos" && <ModelEditor items={data.models} save={save} remove={remove} upload={upload} />}
        {tab === "servicos" && <ServiceEditor items={data.services} save={save} remove={remove} />}
        {tab === "galeria" && <GalleryEditor items={data.gallery} save={save} remove={remove} upload={upload} />}
        {tab === "destaques" && <HighlightEditor items={data.highlights} save={save} remove={remove} upload={upload} />}
        {tab === "avaliacoes" && <ReviewEditor items={data.reviews} save={save} remove={remove} upload={upload} />}
        {tab === "certificados" && <CertificateEditor items={data.certificates} save={save} remove={remove} upload={upload} />}
        {tab === "faq" && <FaqEditor items={data.faqs} save={save} remove={remove} />}
        {tab === "config" && <SettingsEditor settings={data.settings || defaultSettings} save={save} upload={upload} />}
      </>}
    </div></main>
  );
}

function ServiceEditor({ items, save, remove }: BaseProps & { items: Service[] }) {
  const empty = { name: "", category: "Cílios", description: "", price: "", active: true, sort_order: items.length + 1 };
  const [form, setForm] = useState<any>(empty);
  const [id, setId] = useState<string>();
  function edit(item: Service) { setId(item.id); setForm({ ...item, price: String(item.price) }); window.scrollTo({ top: 0, behavior: "smooth" }); }
  async function submit(event: FormEvent) { event.preventDefault(); await save("services", id ? "update" : "create", { ...form, price: Number(form.price), sort_order: Number(form.sort_order) }, id); setId(undefined); setForm({ ...empty, sort_order: items.length + 2 }); }
  return <><form className="adminCard" onSubmit={submit}><h2>{id ? "Editar serviço" : "Novo serviço"}</h2><div className="adminGrid3"><Field label="Nome"><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></Field><Field label="Categoria"><CategorySelect value={form.category} onChange={value => setForm({ ...form, category: value })} /></Field><Field label="Preço"><input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required /></Field></div><Field label="Descrição"><textarea value={form.description || ""} onChange={e => setForm({ ...form, description: e.target.value })} /></Field><FormActions active={form.active} setActive={(active) => setForm({ ...form, active })} id={id} cancel={() => { setId(undefined); setForm(empty); }} /></form><CategoryList items={items} categoryOf={x => x.category} render={x => <><div><h4>{x.name} • R$ {Number(x.price).toFixed(2)}</h4><p>{x.active ? "Publicado" : "Oculto"}</p></div><RowButtons edit={() => edit(x)} remove={() => remove("services", x.id)} /></>} /></>;
}

function ModelEditor({ items, save, remove, upload }: BaseProps & { items: ModelItem[]; upload: UploadFn }) {
  const empty = { title: "", category: "Cílios", description: "", price: "", image_url: "", style_tag: "Natural", featured: false, active: true, sort_order: items.length + 1 };
  const [form, setForm] = useState<any>(empty); const [id, setId] = useState<string>(); const [file, setFile] = useState<File | null>(null); const [busy, setBusy] = useState(false);
  function edit(item: ModelItem) { setId(item.id); setForm({ ...item, price: String(item.price), style_tag: item.style_tag || "Natural", featured: !!item.featured }); setFile(null); window.scrollTo({ top: 0, behavior: "smooth" }); }
  async function submit(event: FormEvent) { event.preventDefault(); setBusy(true); try { let image = form.image_url; if (file) image = await upload(file); await save("models", id ? "update" : "create", { ...form, image_url: image, price: Number(form.price), sort_order: Number(form.sort_order) }, id); setId(undefined); setForm({ ...empty, sort_order: items.length + 2 }); setFile(null); } finally { setBusy(false); } }
  return <><form className="adminCard" onSubmit={submit}><h2>{id ? "Editar modelo" : "Novo modelo"}</h2><div className="adminGrid3"><Field label="Nome do modelo"><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></Field><Field label="Categoria"><CategorySelect value={form.category} onChange={value => setForm({ ...form, category: value })} /></Field><Field label="Valor"><input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required /></Field></div><div className="adminGrid2"><Field label="Estilo"><select value={form.style_tag} onChange={e => setForm({ ...form, style_tag: e.target.value })}><option>Natural</option><option>Marcante</option><option>Alongado</option><option>Definido</option></select></Field><Field label="Foto"><input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} /></Field></div><Field label="Descrição"><textarea value={form.description || ""} onChange={e => setForm({ ...form, description: e.target.value })} /></Field>{form.image_url && <img className="previewImg" src={form.image_url} alt="Prévia" />}<div className="rowActions"><label><input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} /> Publicado</label><label><input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} /> Destaque</label><button className="btn" disabled={busy}>{busy ? "Salvando..." : id ? "Salvar alterações" : "Adicionar modelo"}</button>{id && <button type="button" className="miniBtn" onClick={() => { setId(undefined); setForm(empty); setFile(null); }}>Cancelar</button>}</div></form><CategoryList items={items} categoryOf={x => x.category} render={x => <><div style={{ display: "flex", gap: 12, alignItems: "center" }}>{x.image_url && <img className="previewImg" src={x.image_url} alt="" />}<div><h4>{x.title} • R$ {Number(x.price).toFixed(2)}</h4><p>{x.style_tag || "Natural"} • {x.featured ? "Destaque • " : ""}{x.active ? "Publicado" : "Oculto"}</p></div></div><RowButtons edit={() => edit(x)} remove={() => remove("models", x.id)} /></>} /></>;
}

function BeforeEditor({ items, save, remove, upload }: BaseProps & { items: BeforeAfter[]; upload: UploadFn }) {
  const empty = { title: "", category: "Cílios", service: "", description: "", before_url: "", after_url: "", active: true, sort_order: items.length + 1 };
  const [form, setForm] = useState<any>(empty); const [id, setId] = useState<string>(); const [before, setBefore] = useState<File | null>(null); const [after, setAfter] = useState<File | null>(null); const [busy, setBusy] = useState(false);
  function edit(item: BeforeAfter) { setId(item.id); setForm({ ...item, category: item.category || "Cílios" }); setBefore(null); setAfter(null); window.scrollTo({ top: 0, behavior: "smooth" }); }
  async function submit(event: FormEvent) { event.preventDefault(); setBusy(true); try { let beforeUrl = form.before_url; let afterUrl = form.after_url; if (before) beforeUrl = await upload(before); if (after) afterUrl = await upload(after); await save("before_after", id ? "update" : "create", { ...form, before_url: beforeUrl, after_url: afterUrl, sort_order: Number(form.sort_order) }, id); setId(undefined); setForm({ ...empty, sort_order: items.length + 2 }); setBefore(null); setAfter(null); } finally { setBusy(false); } }
  return <><form className="adminCard" onSubmit={submit}><h2>{id ? "Editar antes e depois" : "Novo antes e depois"}</h2><div className="adminGrid3"><Field label="Título"><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></Field><Field label="Categoria"><CategorySelect value={form.category} onChange={value => setForm({ ...form, category: value })} /></Field><Field label="Serviço / modelo"><input value={form.service || ""} onChange={e => setForm({ ...form, service: e.target.value })} placeholder="Ex.: Volume Brasileiro" /></Field></div><Field label="Descrição"><textarea value={form.description || ""} onChange={e => setForm({ ...form, description: e.target.value })} /></Field><div className="adminGrid2"><Field label="Foto ANTES"><input type="file" accept="image/*" onChange={e => setBefore(e.target.files?.[0] || null)} /></Field><Field label="Foto DEPOIS"><input type="file" accept="image/*" onChange={e => setAfter(e.target.files?.[0] || null)} /></Field></div><div style={{ display: "flex", gap: 10 }}>{form.before_url && <img className="previewImg" src={form.before_url} alt="Antes" />}{form.after_url && <img className="previewImg" src={form.after_url} alt="Depois" />}</div><FormActions active={form.active} setActive={(active) => setForm({ ...form, active })} id={id} busy={busy} cancel={() => { setId(undefined); setForm(empty); setBefore(null); setAfter(null); }} /></form><CategoryList items={items} categoryOf={x => x.category || "Cílios"} render={x => <><div><h4>{x.title}</h4><p>{x.service || "Sem serviço"} • {x.active ? "Publicado" : "Oculto"}</p></div><RowButtons edit={() => edit(x)} remove={() => remove("before_after", x.id)} /></>} /></>;
}

function GalleryEditor({ items, save, remove, upload }: BaseProps & { items: GalleryItem[]; upload: UploadFn }) {
  const empty = { title: "", category: "Cílios", description: "", image_url: "", active: true, sort_order: items.length + 1 };
  const [form, setForm] = useState<any>(empty); const [id, setId] = useState<string>(); const [file, setFile] = useState<File | null>(null); const [busy, setBusy] = useState(false);
  function edit(item: GalleryItem) { setId(item.id); setForm(item); setFile(null); window.scrollTo({ top: 0, behavior: "smooth" }); }
  async function submit(event: FormEvent) { event.preventDefault(); setBusy(true); try { let image = form.image_url; if (file) image = await upload(file); await save("gallery", id ? "update" : "create", { ...form, image_url: image, sort_order: Number(form.sort_order) }, id); setId(undefined); setForm({ ...empty, sort_order: items.length + 2 }); setFile(null); } finally { setBusy(false); } }
  return <><form className="adminCard" onSubmit={submit}><h2>{id ? "Editar foto" : "Nova foto da galeria"}</h2><div className="adminGrid2"><Field label="Título"><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></Field><Field label="Categoria"><CategorySelect value={form.category} onChange={value => setForm({ ...form, category: value })} /></Field></div><Field label="Descrição"><textarea value={form.description || ""} onChange={e => setForm({ ...form, description: e.target.value })} /></Field><Field label="Foto"><input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} /></Field>{form.image_url && <img className="previewImg" src={form.image_url} alt="" />}<FormActions active={form.active} setActive={(active) => setForm({ ...form, active })} id={id} busy={busy} cancel={() => { setId(undefined); setForm(empty); setFile(null); }} /></form><CategoryList items={items} categoryOf={x => x.category} render={x => <><div style={{ display: "flex", gap: 12, alignItems: "center" }}>{x.image_url && <img className="previewImg" src={x.image_url} alt="" />}<div><h4>{x.title}</h4><p>{x.active ? "Publicado" : "Oculto"}</p></div></div><RowButtons edit={() => edit(x)} remove={() => remove("gallery", x.id)} /></>} /></>;
}

function HighlightEditor({ items, save, remove, upload }: BaseProps & { items: Highlight[]; upload: UploadFn }) {
  const empty = { title: "", subtitle: "", badge: "DESTAQUE", image_url: "", button_text: "Quero saber mais", button_message: "", active: true, sort_order: items.length + 1 };
  const [form, setForm] = useState<any>(empty); const [id, setId] = useState<string>(); const [file, setFile] = useState<File | null>(null); const [busy, setBusy] = useState(false);
  function edit(item: Highlight) { setId(item.id); setForm(item); setFile(null); window.scrollTo({ top: 0, behavior: "smooth" }); }
  async function submit(event: FormEvent) { event.preventDefault(); setBusy(true); try { let image = form.image_url; if (file) image = await upload(file); await save("highlights", id ? "update" : "create", { ...form, image_url: image, sort_order: Number(form.sort_order) }, id); setId(undefined); setForm({ ...empty, sort_order: items.length + 2 }); setFile(null); } finally { setBusy(false); } }
  return <><form className="adminCard" onSubmit={submit}><h2>{id ? "Editar destaque" : "Novo destaque / promoção"}</h2><div className="adminGrid3"><Field label="Título"><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></Field><Field label="Selo"><input value={form.badge || ""} onChange={e => setForm({ ...form, badge: e.target.value })} placeholder="Ex.: NOVIDADE" /></Field><Field label="Texto do botão"><input value={form.button_text || ""} onChange={e => setForm({ ...form, button_text: e.target.value })} /></Field></div><Field label="Descrição"><textarea value={form.subtitle || ""} onChange={e => setForm({ ...form, subtitle: e.target.value })} /></Field><Field label="Mensagem automática do WhatsApp"><input value={form.button_message || ""} onChange={e => setForm({ ...form, button_message: e.target.value })} /></Field><Field label="Imagem"><input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} /></Field>{form.image_url && <img className="previewImg" src={form.image_url} alt="" />}<FormActions active={form.active} setActive={(active) => setForm({ ...form, active })} id={id} busy={busy} cancel={() => { setId(undefined); setForm(empty); setFile(null); }} /></form><List items={items} render={x => <><div><h4>{x.title}</h4><p>{x.badge || "Sem selo"} • {x.active ? "Publicado" : "Oculto"}</p></div><RowButtons edit={() => edit(x)} remove={() => remove("highlights", x.id)} /></>} /></>;
}

function ReviewEditor({ items, save, remove, upload }: BaseProps & { items: Review[]; upload: UploadFn }) {
  const empty = { client_name: "", text: "", rating: 5, photo_url: "", source: "admin", active: true, sort_order: items.length + 1 };
  const [form, setForm] = useState<any>(empty); const [id, setId] = useState<string>(); const [file, setFile] = useState<File | null>(null); const [busy, setBusy] = useState(false);
  function edit(item: Review) { setId(item.id); setForm({ ...item, photo_url: item.photo_url || "" }); setFile(null); window.scrollTo({ top: 0, behavior: "smooth" }); }
  async function submit(event: FormEvent) { event.preventDefault(); setBusy(true); try { let image = form.photo_url; if (file) image = await upload(file); await save("reviews", id ? "update" : "create", { ...form, photo_url: image || null, rating: Number(form.rating), sort_order: Number(form.sort_order) }, id); setId(undefined); setForm({ ...empty, sort_order: items.length + 2 }); setFile(null); } finally { setBusy(false); } }
  const pending = items.filter(item => !item.active && item.source === "public").length;
  return <><div className="adminHint">As avaliações enviadas pelo site chegam como <strong>pendentes</strong>. Abra a avaliação, confira comentário/foto e marque “Publicado” para ela aparecer no site. {pending > 0 && <strong> Pendentes agora: {pending}.</strong>}</div><form className="adminCard" onSubmit={submit}><h2>{id ? "Editar / aprovar avaliação" : "Nova avaliação"}</h2><div className="adminGrid2"><Field label="Nome da cliente"><input value={form.client_name} onChange={e => setForm({ ...form, client_name: e.target.value })} required /></Field><Field label="Estrelas"><select value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })}>{[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} estrelas</option>)}</select></Field></div><Field label="Comentário"><textarea value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} required /></Field><Field label="Foto da avaliação"><input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} /></Field>{form.photo_url && <img className="previewImg" src={form.photo_url} alt="Foto da avaliação" />}<FormActions active={form.active} setActive={(active) => setForm({ ...form, active })} id={id} busy={busy} cancel={() => { setId(undefined); setForm(empty); setFile(null); }} /></form><List items={items} render={x => <><div style={{ display: "flex", gap: 12, alignItems: "center" }}>{x.photo_url && <img className="previewImg" src={x.photo_url} alt="" />}<div><h4>{x.client_name} • {"★".repeat(x.rating)}{!x.active && x.source === "public" && <span className="pendingTag">Pendente</span>}</h4><p>{x.text} • {x.active ? "Publicado" : "Oculto"}</p></div></div><RowButtons edit={() => edit(x)} remove={() => remove("reviews", x.id)} /></>} /></>;
}

function CertificateEditor({ items, save, remove, upload }: BaseProps & { items: Certificate[]; upload: UploadFn }) {
  const empty = { title: "", issuer: "", year: "", image_url: "", active: true, sort_order: items.length + 1 };
  const [form, setForm] = useState<any>(empty); const [id, setId] = useState<string>(); const [file, setFile] = useState<File | null>(null); const [busy, setBusy] = useState(false);
  function edit(item: Certificate) { setId(item.id); setForm(item); setFile(null); window.scrollTo({ top: 0, behavior: "smooth" }); }
  async function submit(event: FormEvent) { event.preventDefault(); setBusy(true); try { let image = form.image_url; if (file) image = await upload(file); await save("certificates", id ? "update" : "create", { ...form, image_url: image, sort_order: Number(form.sort_order) }, id); setId(undefined); setForm({ ...empty, sort_order: items.length + 2 }); setFile(null); } finally { setBusy(false); } }
  return <><form className="adminCard" onSubmit={submit}><h2>{id ? "Editar certificado" : "Novo certificado"}</h2><div className="adminGrid3"><Field label="Curso / certificado"><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></Field><Field label="Instituição"><input value={form.issuer || ""} onChange={e => setForm({ ...form, issuer: e.target.value })} /></Field><Field label="Ano"><input value={form.year || ""} onChange={e => setForm({ ...form, year: e.target.value })} /></Field></div><Field label="Foto do certificado (opcional)"><input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} /></Field>{form.image_url && <img className="previewImg" src={form.image_url} alt="" />}<FormActions active={form.active} setActive={(active) => setForm({ ...form, active })} id={id} busy={busy} cancel={() => { setId(undefined); setForm(empty); setFile(null); }} /></form><List items={items} render={x => <><div><h4>{x.title}</h4><p>{[x.issuer, x.year].filter(Boolean).join(" • ")} • {x.active ? "Publicado" : "Oculto"}</p></div><RowButtons edit={() => edit(x)} remove={() => remove("certificates", x.id)} /></>} /></>;
}

function FaqEditor({ items, save, remove }: BaseProps & { items: Faq[] }) {
  const empty = { question: "", answer: "", active: true, sort_order: items.length + 1 };
  const [form, setForm] = useState<any>(empty); const [id, setId] = useState<string>();
  function edit(item: Faq) { setId(item.id); setForm(item); window.scrollTo({ top: 0, behavior: "smooth" }); }
  async function submit(event: FormEvent) { event.preventDefault(); await save("faqs", id ? "update" : "create", { ...form, sort_order: Number(form.sort_order) }, id); setId(undefined); setForm({ ...empty, sort_order: items.length + 2 }); }
  return <><form className="adminCard" onSubmit={submit}><h2>{id ? "Editar pergunta" : "Nova pergunta frequente"}</h2><Field label="Pergunta"><input value={form.question} onChange={e => setForm({ ...form, question: e.target.value })} required /></Field><Field label="Resposta"><textarea value={form.answer} onChange={e => setForm({ ...form, answer: e.target.value })} required /></Field><FormActions active={form.active} setActive={(active) => setForm({ ...form, active })} id={id} cancel={() => { setId(undefined); setForm(empty); }} /></form><List items={items} render={x => <><div><h4>{x.question}</h4><p>{x.answer} • {x.active ? "Publicado" : "Oculto"}</p></div><RowButtons edit={() => edit(x)} remove={() => remove("faqs", x.id)} /></>} /></>;
}

function SettingsEditor({ settings, save, upload }: { settings: SiteSettings; save: SaveFn; upload: UploadFn }) {
  const [form, setForm] = useState(settings); const [photo, setPhoto] = useState<File | null>(null); const [busy, setBusy] = useState(false);
  useEffect(() => setForm(settings), [settings]);
  async function submit(event: FormEvent) { event.preventDefault(); setBusy(true); try { let professionalPhoto = form.professional_photo_url; if (photo) professionalPhoto = await upload(photo); await save("site_settings", "update", { ...form, professional_photo_url: professionalPhoto }, "1"); setPhoto(null); } finally { setBusy(false); } }
  return <form className="adminCard" onSubmit={submit}><h2>Informações do site</h2><div className="adminGrid2"><Field label="Título principal"><input value={form.hero_title} onChange={e => setForm({ ...form, hero_title: e.target.value })} /></Field><Field label="Frase principal"><input value={form.hero_subtitle} onChange={e => setForm({ ...form, hero_subtitle: e.target.value })} /></Field></div><div className="adminGrid2"><Field label="Nome da profissional"><input value={form.professional_name} onChange={e => setForm({ ...form, professional_name: e.target.value })} /></Field><Field label="Título profissional"><input value={form.professional_title} onChange={e => setForm({ ...form, professional_title: e.target.value })} /></Field></div><Field label="Sobre a profissional / Bella Onça"><textarea value={form.about_text} onChange={e => setForm({ ...form, about_text: e.target.value })} /></Field><Field label="Foto da profissional"><input type="file" accept="image/*" onChange={e => setPhoto(e.target.files?.[0] || null)} /></Field>{form.professional_photo_url && <img className="previewImg" src={form.professional_photo_url} alt="" />}<div className="adminGrid2"><Field label="Cuidados ANTES (uma orientação por linha)"><textarea value={form.care_before} onChange={e => setForm({ ...form, care_before: e.target.value })} /></Field><Field label="Cuidados DEPOIS (uma orientação por linha)"><textarea value={form.care_after} onChange={e => setForm({ ...form, care_after: e.target.value })} /></Field></div><Field label="Política de agendamento"><textarea value={form.booking_policy} onChange={e => setForm({ ...form, booking_policy: e.target.value })} /></Field><div className="adminGrid2"><Field label="WhatsApp com DDD"><input value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} placeholder="5535999999999" /></Field><Field label="Instagram"><input value={form.instagram} onChange={e => setForm({ ...form, instagram: e.target.value })} /></Field><Field label="Endereço"><input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></Field><Field label="Horários"><input value={form.hours} onChange={e => setForm({ ...form, hours: e.target.value })} /></Field></div><button className="btn" disabled={busy}>{busy ? "Salvando..." : "Salvar informações"}</button></form>;
}

function CategorySelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <select value={value} onChange={e => onChange(e.target.value)}><option>Cílios</option><option>Sobrancelhas</option><option>Outro</option></select>;
}

function FormActions({ active, setActive, id, busy, cancel }: { active: boolean; setActive: (value: boolean) => void; id?: string; busy?: boolean; cancel: () => void }) {
  return <div className="rowActions"><label><input type="checkbox" checked={active} onChange={e => setActive(e.target.checked)} /> Publicado</label><button className="btn" disabled={busy}>{busy ? "Salvando..." : id ? "Salvar alterações" : "Adicionar"}</button>{id && <button type="button" className="miniBtn" onClick={cancel}>Cancelar</button>}</div>;
}

function RowButtons({ edit, remove }: { edit: () => void; remove: () => void }) {
  return <div className="rowActions"><button className="miniBtn" onClick={edit}>Editar</button><button className="miniBtn danger" onClick={remove}>Excluir</button></div>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <div className="field"><label>{label}</label>{children}</div>;
}

function CategoryList<T>({ items, categoryOf, render }: { items: T[]; categoryOf: (item: T) => string; render: (item: T) => ReactNode }) {
  const preferred = ["Cílios", "Sobrancelhas"];
  const categories = Array.from(new Set(items.map(item => categoryOf(item) || "Outros"))).sort((a, b) => {
    const ai = preferred.indexOf(a); const bi = preferred.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b, "pt-BR");
    if (ai === -1) return 1; if (bi === -1) return -1; return ai - bi;
  });
  return <div className="adminCard"><h2>Itens cadastrados</h2>{items.length ? <div className="adminCategoryList">{categories.map(category => <section className="adminCategorySection" key={category}><div className="adminCategoryTitle"><strong>{category}</strong><span>{items.filter(item => (categoryOf(item) || "Outros") === category).length} itens</span></div><div className="adminList">{items.filter(item => (categoryOf(item) || "Outros") === category).map((item, index) => <div className="adminRow" key={String((item as any).id || index)}>{render(item)}</div>)}</div></section>)}</div> : <p className="adminNote">Nenhum item cadastrado ainda.</p>}</div>;
}

function List<T>({ items, render }: { items: T[]; render: (item: T) => ReactNode }) {
  return <div className="adminCard"><h2>Itens cadastrados</h2><div className="adminList">{items.length ? items.map((item, index) => <div className="adminRow" key={String((item as any).id || index)}>{render(item)}</div>) : <p className="adminNote">Nenhum item cadastrado ainda.</p>}</div></div>;
}
