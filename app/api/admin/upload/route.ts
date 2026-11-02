import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAdmin(request);
    if (!user) return NextResponse.json({ error: "Acesso negado." }, { status: 403 });

    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "Arquivo não enviado." }, { status: 400 });
    if (!file.type.startsWith("image/")) return NextResponse.json({ error: "Envie uma imagem." }, { status: 400 });
    if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: "Imagem maior que 10 MB." }, { status: 400 });

    const supabase = getSupabaseAdmin();
    const bucket = "bella-media";
    const bucketInfo = await supabase.storage.getBucket(bucket);
    if (bucketInfo.error) {
      const created = await supabase.storage.createBucket(bucket, { public: true, fileSizeLimit: 10485760 });
      if (created.error) throw created.error;
    }

    const safeName = file.name.toLowerCase().replace(/[^a-z0-9.\-_]+/g, "-");
    const path = `${new Date().getFullYear()}/${Date.now()}-${safeName}`;
    const bytes = await file.arrayBuffer();
    const { error } = await supabase.storage.from(bucket).upload(path, bytes, { contentType: file.type, upsert: false });
    if (error) throw error;

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return NextResponse.json({ success: true, url: data.publicUrl });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Erro ao enviar imagem." }, { status: 500 });
  }
}
