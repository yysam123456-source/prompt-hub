export async function onRequestGet(context) {
  const { params } = context;
  const slug = params.slug;
  
  try {
    // slug 已经是 URL 编码的（Cloudflare 解码后传递），直接拼 URL
    const apiUrl = `https://prompts.sorry.ink/api/prompts/${slug}`;
    
    const resp = await fetch(apiUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    
    if (!resp.ok) {
      return new Response(JSON.stringify({error: 'Not found', upstream_status: resp.status}), {status: 404});
    }

    const data = await resp.json();

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=300',
      }
    });
  } catch(e) {
    return new Response(JSON.stringify({error: e.message}), {status: 500});
  }
}
