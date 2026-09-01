/**
 * Sovereign Helix production worker
 * Static site from ./public + /api/* via Workers AI + /health
 * Geohash: #AAC.11.11.1992
 */

const SP_GENERATE = `You are Quetzalcoatl, an elite AI app and site maker. Given a user's description, generate a COMPLETE, self-contained, production-quality HTML file with embedded CSS and JavaScript. The output must be a single index.html that renders a beautiful, functional web app.

Rules:
- Output ONLY valid HTML. Start with <!DOCTYPE html> and end with </html>.
- All CSS must be in <style> tags. All JS must be in <script> tags.
- The design must be modern, responsive, and polished.
- Include realistic placeholder content.
- Add interactivity with vanilla JavaScript where appropriate.
- Do NOT use any external CDN resources, frameworks, or libraries.
- Do NOT wrap the HTML in markdown code fences. Output raw HTML only.`;

const SP_AUDIT = `You are Quetzalcoatl, an expert site and UI/UX auditor. Return ONLY JSON: {"score":0-100,"summary":"","findings":[{"title":"","description":"","severity":"high|mid|low","recommendation":""}]}. Check accessibility, UX, SEO, performance, content gaps, security.`;

const SP_THREAD = `You are Quetzalcoatl, a conversation thread auditor. Return ONLY JSON: {"findings":[{"type":"Missing Info|Unanswered Question|Context Gap|Incomplete Response|Dropped Follow-up","title":"","description":"","severity":"high|medium|low","recommendation":""}]}.`;

const SP_ACADEMY = `You are Quetzalcoatl, an expert entrepreneur coach. Return ONLY JSON: {"title":"","body":"html","keyInsight":"","quiz":{"question":"","options":["A","B","C","D"],"correct":0,"explanation":""}}.`;

const SP_BUSINESS = `You are Quetzalcoatl, an expert business strategist. Return ONLY JSON: {"ideas":[{"name":"","tagline":"","problem":"","solution":"","targetMarket":"","revenueModel":"","marketSize":"","competition":"","techStack":"","mvpFeatures":[""],"differentiator":"","feasibility":"low|medium|high","timeToMVP":"","startupCost":""}]}. Generate 3-5 ideas.`;

const MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';
const VERSION = '0.1.0';

function extractJSON(text) {
  let c = text.trim().replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  const f = c.indexOf('{'), l = c.lastIndexOf('}');
  if (f !== -1 && l !== -1 && l > f) c = c.substring(f, l + 1);
  return JSON.parse(c);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (url.pathname === '/health' || url.pathname === '/api/health') {
      return Response.json(
        { ok: true, service: 'sovereign-helix', version: VERSION, geohash: '#AAC.11.11.1992', ai: Boolean(env.AI) },
        { headers: { ...cors, 'Content-Type': 'application/json' } },
      );
    }
    if (url.pathname.startsWith('/api/')) return handleAPI(request, env, url.pathname, cors);
    if (env.ASSETS) return env.ASSETS.fetch(request);
    return new Response('Sovereign Helix worker online. Add public/ assets.', { status: 200 });
  },
};

async function handleAPI(request, env, path, cors) {
  const jh = { ...cors, 'Content-Type': 'application/json' };
  try {
    if (!env.AI) return Response.json({ error: 'Workers AI binding missing. Add binding name AI.' }, { status: 503, headers: jh });
    if (path === '/api/generate' && request.method === 'POST') {
      const { prompt } = await request.json();
      if (!prompt?.trim()) return Response.json({ error: 'No prompt provided' }, { status: 400, headers: jh });
      const ai = await env.AI.run(MODEL, { messages: [{ role: 'system', content: SP_GENERATE }, { role: 'user', content: `Generate a complete web app for: ${prompt}` }], max_tokens: 8000 });
      let html = (ai.response || '').replace(/```html\s*/gi, '').replace(/```\s*/g, '').trim();
      if (!html.toLowerCase().startsWith('<!doctype')) {
        const i = html.toLowerCase().indexOf('<!doctype');
        if (i > 0) html = html.substring(i);
      }
      const slug = prompt.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().split(/\s+/).slice(0, 4).join('-');
      return Response.json({ code: html, html, title: prompt.slice(0, 60), slug: slug || 'app' }, { headers: jh });
    }
    if (path === '/api/audit' && request.method === 'POST') {
      const { content } = await request.json();
      if (!content?.trim()) return Response.json({ error: 'No content provided' }, { status: 400, headers: jh });
      const ai = await env.AI.run(MODEL, { messages: [{ role: 'system', content: SP_AUDIT }, { role: 'user', content: `Audit this site:\n\n${content.slice(0, 12000)}` }], max_tokens: 4000 });
      try { return Response.json(extractJSON(ai.response || ''), { headers: jh }); }
      catch { return Response.json({ score: 0, summary: 'Unable to parse audit results', findings: [{ title: 'Parse Error', description: 'The AI response could not be parsed', severity: 'low', recommendation: 'Try again' }] }, { headers: jh }); }
    }
    if (path === '/api/audit-thread' && request.method === 'POST') {
      const { thread } = await request.json();
      if (!thread?.trim()) return Response.json({ error: 'No thread provided' }, { status: 400, headers: jh });
      const ai = await env.AI.run(MODEL, { messages: [{ role: 'system', content: SP_THREAD }, { role: 'user', content: `Audit this conversation thread:\n\n${thread.slice(0, 12000)}` }], max_tokens: 4000 });
      try { return Response.json(extractJSON(ai.response || ''), { headers: jh }); }
      catch { return Response.json({ findings: [{ type: 'Error', title: 'Parse Error', description: 'The AI response could not be parsed', severity: 'low', recommendation: 'Try again' }] }, { headers: jh }); }
    }
    if (path === '/api/academy' && request.method === 'POST') {
      const { topic } = await request.json();
      if (!topic?.trim()) return Response.json({ error: 'No topic provided' }, { status: 400, headers: jh });
      const ai = await env.AI.run(MODEL, { messages: [{ role: 'system', content: SP_ACADEMY }, { role: 'user', content: `Create an entrepreneur lesson about: ${topic}` }], max_tokens: 6000 });
      try { return Response.json(extractJSON(ai.response || ''), { headers: jh }); }
      catch { return Response.json({ title: topic, body: '<p>Could not generate lesson. Try rephrasing.</p>', keyInsight: '', quiz: { question: 'What would you like to learn?', options: ['Try again', 'Different topic'], correct: 0, explanation: '' } }, { headers: jh }); }
    }
    if (path === '/api/business' && request.method === 'POST') {
      const { prompt } = await request.json();
      if (!prompt?.trim()) return Response.json({ error: 'No prompt provided' }, { status: 400, headers: jh });
      const ai = await env.AI.run(MODEL, { messages: [{ role: 'system', content: SP_BUSINESS }, { role: 'user', content: `Generate innovative AI-powered business ideas for: ${prompt}` }], max_tokens: 6000 });
      try { return Response.json(extractJSON(ai.response || ''), { headers: jh }); }
      catch { return Response.json({ ideas: [{ name: 'Unable to parse', tagline: 'Try again', problem: '', solution: '', targetMarket: '', revenueModel: '', marketSize: '', competition: '', techStack: '', mvpFeatures: [], differentiator: '', feasibility: 'low', timeToMVP: '', startupCost: '' }] }, { headers: jh }); }
    }
    return Response.json({ error: 'Unknown API endpoint' }, { status: 404, headers: jh });
  } catch (err) {
    return Response.json({ error: err.message || 'Internal error' }, { status: 500, headers: jh });
  }
}
