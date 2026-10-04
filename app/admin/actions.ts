"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseServer } from "../../lib/supabase/server";
async function admin() {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/");
  const { data } = await sb.from("profiles").select("is_admin").eq("id", user.id).single();
  if (!data?.is_admin) redirect("/");
  return sb;
}
export async function saveProduct(fd: FormData) {
  const sb = await admin();
  const id = String(fd.get("id") || "");
  const urls: string[] = [];
  for (const f of fd.getAll("photos")) {
    if (f instanceof File && f.size > 0) {
      const path = `${crypto.randomUUID()}-${f.name.replace(/[^a-z0-9.]/gi, "_")}`;
      const { error } = await sb.storage.from("products").upload(path, f, { contentType: f.type });
      if (!error) urls.push(sb.storage.from("products").getPublicUrl(path).data.publicUrl);
    }
  }
  const meas: Record<string, number> = {};
  String(fd.get("measurements") || "").split("\n").forEach((l) => {
    const [k, v] = l.split("=");
    if (k?.trim() && v?.trim() && !isNaN(Number(v))) meas[k.trim()] = Number(v);
  });
  const row: Record<string, unknown> = {
    name: fd.get("name"), description: fd.get("description"), price: Number(fd.get("price") || 0),
    category: fd.get("category"), era: fd.get("era"), size: fd.get("size"), condition: fd.get("condition"),
    stock: Number(fd.get("stock") || 0), measurements: meas,
  };
  if (id) await sb.from("products").update({ ...row, images: [...fd.getAll("keep").map(String), ...urls] }).eq("id", id);
  else await sb.from("products").insert({ ...row, images: urls });
  revalidatePath("/");
  redirect("/admin");
}
export async function setStatus(fd: FormData) {
  const sb = await admin();
  await sb.from("orders").update({ status: String(fd.get("status")) }).eq("id", String(fd.get("id")));
  revalidatePath("/admin");
}
