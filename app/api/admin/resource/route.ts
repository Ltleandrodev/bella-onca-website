import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const tables = new Set([
  "services",
  "models",
  "before_after",
  "reviews",
  "gallery",
  "certificates",
  "highlights",
  "faqs",
  "site_settings"
]);

export async function POST(request: NextRequest) {
  try {
    const user = await requireAdmin(request);
    if (!user) return NextResponse.json({ error: "Acesso negado." }, { status: 403 });

    const body = await request.json();
    const table = String(body.table || "");
    const action = String(body.action || "");
    const payload = body.payload || {};
    const id = body.id;

    if (!tables.has(table)) return NextResponse.json({ error: "Recurso inválido." }, { status: 400 });

    const supabase = getSupabaseAdmin();

    if (action === "delete") {
      if (!id || table === "site_settings") return NextResponse.json({ error: "Exclusão inválida." }, { status: 400 });
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (table === "site_settings") {
      const { data, error } = await supabase.from(table).upsert({ ...payload, id: 1 }).select().single();
      if (error) throw error;
      return NextResponse.json({ success: true, data });
    }

    if (action === "update") {
      if (!id) return NextResponse.json({ error: "ID não informado." }, { status: 400 });
      const { data, error } = await supabase.from(table).update(payload).eq("id", id).select().single();
      if (error) throw error;
      return NextResponse.json({ success: true, data });
    }

    if (action === "create") {
      const { data, error } = await supabase.from(table).insert(payload).select().single();
      if (error) throw error;
      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json({ error: "Ação inválida." }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Erro interno." }, { status: 500 });
  }
}
