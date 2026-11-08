// Cloudflare Worker para Mis Fanfics: solo permite AO3, Wattpad y FanFiction.net (no es un proxy abierto).
const OK = ['archiveofourown.org', 'www.wattpad.com', 'www.fanfiction.net', 'm.fanfiction.net'];
export default {
  async fetch(req) {
    const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET' };
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
    const t = new URL(req.url).searchParams.get('url');
    let u; try { u = new URL(t); } catch { return new Response('URL inválida', { status: 400, headers: cors }); }
    if (u.protocol !== 'https:' || !OK.includes(u.hostname)) return new Response('Sitio no permitido', { status: 403, headers: cors });
    const r = await fetch(u.toString(), { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MisFanfics)' } });
    return new Response(r.body, { status: r.status, headers: { ...cors, 'Content-Type': r.headers.get('Content-Type') || 'text/html' } });
  }
};
