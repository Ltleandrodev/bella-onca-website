import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAdmin(request);
    if (!user) return NextResponse.json({ error: "Acesso negado." }, { status: 403 });

    const supabase = getSupabaseAdmin();
    const [services, models, beforeAfter, reviews, gallery, certificates, highlights, faqs, settings] = await Promise.all([
      supabase.from("services").select("*").order("sort_order"),
      supabase.from("models").select("*").order("sort_order"),
      supabase.from("before_after").select("*").order("sort_order"),
      supabase.from("reviews").select("*").order("sort_order"),
      supabase.from("gallery").select("*").order("sort_order"),
      supabase.from("certificates").select("*").order("sort_order"),
      supabase.from("highlights").select("*").order("sort_order"),
      supabase.from("faqs").select("*").order("sort_order"),
      supabase.from("site_settings").select("*").eq("id", 1).maybeSingle()
    ]);

    const firstError = services.error || models.error || beforeAfter.error || reviews.error || gallery.error || certificates.error || highlights.error || faqs.error || settings.error;
    if (firstError) return NextResponse.json({ error: firstError.message }, { status: 500 });

    return NextResponse.json({
      services: services.data || [],
      models: models.data || [],
      beforeAfter: beforeAfter.data || [],
      reviews: reviews.data || [],
      gallery: gallery.data || [],
      certificates: certificates.data || [],
      highlights: highlights.data || [],
      faqs: faqs.data || [],
      settings: settings.data || null
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Erro interno." }, { status: 500 });
  }
}
