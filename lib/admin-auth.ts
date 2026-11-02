import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "./supabase-admin";

export async function requireAdmin(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  if (!authorization?.startsWith("Bearer ") || !adminEmail) {
    return null;
  }

  const token = authorization.slice("Bearer ".length);
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user?.email) return null;
  if (data.user.email.toLowerCase() !== adminEmail) return null;

  return data.user;
}
