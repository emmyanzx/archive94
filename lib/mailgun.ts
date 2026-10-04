type Order = { number: string; total: number; name: string; address: string; items: { name: string; size: string; price: number }[]; paid?: boolean };
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
const naira = (n: number) => "₦" + n.toLocaleString("en-NG");
export async function sendOrderEmail(to: string, o: Order) {
  const rows = o.items.map((i) => `<tr><td>${esc(i.name)} (${esc(i.size ?? "")})</td><td align="right">${naira(i.price)}</td></tr>`).join("");
  const html = `<div style="font-family:Arial,sans-serif;max-width:480px"><h2>Archive94</h2><p>Thanks ${esc(o.name)}, order <b>${o.number}</b> is confirmed.</p><table width="100%">${rows}<tr><td><b>Total</b></td><td align="right"><b>${naira(o.total)}</b></td></tr></table><p>Delivering to: ${esc(o.address)}<br>${o.paid ? "Paid online. Thank you." : "Payment: on delivery."}</p></div>`;
  const res = await fetch(`${process.env.MAILGUN_API_BASE ?? "https://api.mailgun.net"}/v3/${process.env.MAILGUN_DOMAIN}/messages`, {
    method: "POST",
    headers: { Authorization: "Basic " + Buffer.from("api:" + process.env.MAILGUN_API_KEY).toString("base64") },
    body: new URLSearchParams({ from: process.env.MAILGUN_FROM!, to, subject: `Archive94 order ${o.number}`, html }),
  });
  if (!res.ok) throw new Error(await res.text());
}
