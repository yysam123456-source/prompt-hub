export async function onRequestGet(context) {
  // 硬编码分类列表（与 prompts.sorry.ink 保持一致）
  const categories = [
    { slug: 'midjourney', name_zh: 'Midjourney', name_en: 'Midjourney' },
    { slug: 'stable-diffusion', name_zh: 'Stable Diffusion', name_en: 'Stable Diffusion' },
    { slug: 'dalle', name_zh: 'DALL-E', name_en: 'DALL-E' },
    { slug: 'portrait', name_zh: '人像摄影', name_en: 'Portrait' },
    { slug: 'landscape', name_zh: '风景', name_en: 'Landscape' },
    { slug: 'scifi', name_zh: '科幻', name_en: 'Sci-Fi' },
    { slug: 'fantasy', name_zh: '奇幻', name_en: 'Fantasy' },
    { slug: 'anime', name_zh: '动漫', name_en: 'Anime' },
    { slug: 'cyberpunk', name_zh: '赛博朋克', name_en: 'Cyberpunk' },
    { slug: 'watercolor', name_zh: '水彩画', name_en: 'Watercolor' },
    { slug: 'oil-painting', name_zh: '油画', name_en: 'Oil Painting' },
    { slug: 'digital-art', name_zh: '数字艺术', name_en: 'Digital Art' },
    { slug: 'photorealistic', name_zh: '照片写实', name_en: 'Photorealistic' },
    { slug: 'concept-art', name_zh: '概念艺术', name_en: 'Concept Art' },
    { slug: '3d-render', name_zh: '3D 渲染', name_en: '3D Render' },
    { slug: 'logo-design', name_zh: 'Logo 设计', name_en: 'Logo Design' },
    { slug: 'other', name_zh: '其他', name_en: 'Other' },
  ];

  return new Response(JSON.stringify(categories), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'max-age=3600',
    }
  });
}
