import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const website = String(form.get("website") || "");
    if (website) return NextResponse.json({ success: true });

    const clientName = String(form.get("client_name") || "").trim();
    const text = String(form.get("text") || "").trim();
    const rating = Number(form.get("rating") || 5);
    const photo = form.get("photo");

    if (clientName.length < 2 || clientName.length > 80) {
      return NextResponse.json({ error: "Informe um nome válido." }, { status: 400 });
    }
    if (text.length < 5 || text.length > 700) {
      return NextResponse.json({ error: "O comentário precisa ter entre 5 e 700 caracteres." }, { status: 400 });
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Escolha de 1 a 5 estrelas." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    let photoUrl: string | null = null;

    if (photo instanceof File && photo.size > 0) {
      const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);
      if (!allowed.has(photo.type)) {
        return NextResponse.json({ error: "A foto precisa ser JPG, PNG ou WEBP." }, { status: 400 });
      }
      if (photo.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: "A foto pode ter no máximo 5 MB." }, { status: 400 });
      }

      const bucket = "bella-media";
      const bucketInfo = await supabase.storage.getBucket(bucket);
      if (bucketInfo.error) {
        const created = await supabase.storage.createBucket(bucket, { public: true, fileSizeLimit: 10485760 });
        if (created.error) throw created.error;
      }

      const extension = photo.name.split(".").pop()?.toLowerCase() || "jpg";
      const safeExtension = ["jpg", "jpeg", "png", "webp"].includes(extension) ? extension : "jpg";
      const path = `reviews/${new Date().getFullYear()}/${Date.now()}-${crypto.randomUUID()}.${safeExtension}`;
      const bytes = await photo.arrayBuffer();
      const { error: uploadError } = await supabase.storage.from(bucket).upload(path, bytes, {
        contentType: photo.type,
        upsert: false
      });
      if (uploadError) throw uploadError;
      photoUrl = supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
    }

    const { data: maxRows } = await supabase.from("reviews").select("sort_order").order("sort_order", { ascending: false }).limit(1);
    const sortOrder = Number(maxRows?.[0]?.sort_order || 0) + 1;

    const { error } = await supabase.from("reviews").insert({
      client_name: clientName,
      text,
      rating,
      photo_url: photoUrl,
      source: "public",
      active: false,
      sort_order: sortOrder
    });
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Erro ao enviar avaliação." }, { status: 500 });
  }
}
