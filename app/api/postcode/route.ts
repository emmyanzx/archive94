import { NextResponse } from "next/server";
import { supabaseServer } from "../../../lib/supabase/server";
export async function GET(req: Request) {
  const { data: { user } } = await (await supabaseServer()).auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const sp = new URL(req.url).searchParams;
  const lat = Number(sp.get("lat")), lng = Number(sp.get("lng"));
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180)
    return NextResponse.json({ error: "Invalid location." }, { status: 400 });
  if (!process.env.NIPOST_API_KEY) return NextResponse.json({ error: "Postcode lookup isn't set up yet." }, { status: 503 });
  const r = await fetch(`https://api.postcode.gov.ng/v1/search/reverse?lat=${lat}&lng=${lng}&max_distance_m=100`, {
    headers: { "X-API-Key": process.env.NIPOST_API_KEY }, cache: "no-store",
  });
  if (!r.ok) return NextResponse.json({ error: "Could not look up your postcode right now." }, { status: 502 });
  const d = (await r.json()).data;
  if (!d?.found || !d.unit) return NextResponse.json({ found: false, error: "No postcode found at your location. Type your address instead." });
  return NextResponse.json({ found: true, display: d.unit.display, address: d.unit.address ?? null });
}
