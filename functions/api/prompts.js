export async function onRequestGet(context) {
  const { request } = context;
  const url = new URL(request.url);
  const page = url.searchParams.get('page') || '1';
  const pageSize = url.searchParams.get('pageSize') || '20';
  const category = url.searchParams.get('category') || '';
  const sort = url.searchParams.get('sort') || '';
  const q = url.searchParams.get('q') || '';

  let apiUrl = `https://prompts.sorry.ink/api/prompts?page=${page}&pageSize=${pageSize}`;
  if (category) apiUrl += `&category=${encodeURIComponent(category)}`;
  if (sort) apiUrl += `&sort=${encodeURIComponent(sort)}`;
  if (q) apiUrl += `&q=${encodeURIComponent(q)}`;

  try {
    const resp = await fetch(apiUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(8000)  // 8秒超时
    });
    const data = await resp.json();

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=60',
      }
    });
  } catch(e) {
    return new Response(JSON.stringify({error: e.message, items: []}), {status: 500});
  }
}
