import { createClient } from "@supabase/supabase-js";
import { demoContent } from "./demo-data";
import type { SiteContent } from "./types";

export async function getSiteContent(): Promise<SiteContent> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) return demoContent;

  try {
    const supabase = createClient(url, anon, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    const [services, models, beforeAfter, reviews, gallery, certificates, highlights, faqs, settings] = await Promise.all([
      supabase.from("services").select("*").eq("active", true).order("sort_order"),
      supabase.from("models").select("*").eq("active", true).order("sort_order"),
      supabase.from("before_after").select("*").eq("active", true).order("sort_order"),
      supabase.from("reviews").select("*").eq("active", true).order("sort_order"),
      supabase.from("gallery").select("*").eq("active", true).order("sort_order"),
      supabase.from("certificates").select("*").eq("active", true).order("sort_order"),
      supabase.from("highlights").select("*").eq("active", true).order("sort_order"),
      supabase.from("faqs").select("*").eq("active", true).order("sort_order"),
      supabase.from("site_settings").select("*").eq("id", 1).maybeSingle()
    ]);

    return {
      services: services.data ?? demoContent.services,
      models: models.data ?? demoContent.models,
      beforeAfter: beforeAfter.data ?? demoContent.beforeAfter,
      reviews: reviews.data ?? demoContent.reviews,
      gallery: gallery.data ?? demoContent.gallery,
      certificates: certificates.data ?? demoContent.certificates,
      highlights: highlights.data ?? demoContent.highlights,
      faqs: faqs.data ?? demoContent.faqs,
      settings: settings.data ? { ...demoContent.settings, ...settings.data } : demoContent.settings
    } as SiteContent;
  } catch {
    return demoContent;
  }
}
