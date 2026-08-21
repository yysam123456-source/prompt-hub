// SEO content for category cornerstone (pillar) pages.
// Each entry holds a category-specific intro (2-3 real, concrete paragraphs)
// and 4 FAQ Q&As. Keyed by the 16 category slugs in src/lib/categories.ts.
// These are static, hand-written guides — no placeholders.

export interface CategoryFaq {
  q: string
  a: string
}

export interface CategoryContent {
  intro: string[]
  faq: CategoryFaq[]
}

export const CATEGORY_CONTENT: Record<string, CategoryContent> = {
  other: {
    intro: [
      'The Other category collects every prompt that does not fit neatly into a single discipline — mixed-media experiments, one-off creative ideas, and hybrid concepts that blend multiple styles. If you are exploring AI image generation without a fixed brief, this is the best place to browse broadly and discover unexpected directions.',
      'Because the prompts here are diverse, the most reliable way to get a good result is to lead with a clear subject and a concrete visual style, then let the model fill in the details. A short but specific prompt such as "a surreal floating library made of glass, soft volumetric light, cinematic wide shot" will outperform a vague one every time.',
      'Use this category to test new ideas before committing to a dedicated style. Once you find a direction you like, jump to a more specific category such as Illustration or Graphic Design to refine it further.',
    ],
    faq: [
      { q: 'What kinds of prompts belong in the Other category?', a: 'Any prompt that mixes styles, experiments with form, or does not clearly map to a single discipline such as photography or product design. It is the catch-all hub for creative one-offs.' },
      { q: 'How do I write a good open-ended prompt?', a: 'Start with a concrete subject, add a lighting and mood descriptor, and finish with a composition keyword like "close-up", "wide shot", or "flat lay". Specificity beats length.' },
      { q: 'Can I use these prompts in Midjourney and DALL-E?', a: 'Yes. All prompts on Prompt Hub are plain-text descriptions that work across GPT Image 2, Midjourney, DALL-E, and Stable Diffusion with minor wording tweaks.' },
      { q: 'Where should I go after finding a style I like here?', a: 'Follow the related category links on this page to move into a focused silo such as Illustration, Anime & Game, or Graphic Design for deeper results.' },
    ],
  },
  graphic_design: {
    intro: [
      'Graphic Design prompts help you generate posters, social media cards, flyers, banners, and editorial layouts with a consistent visual system. This category is built for marketers, designers, and content creators who need production-ready artwork rather than fine art.',
      'The strongest design prompts specify the format first (A4 poster, 1080x1080 Instagram post, story banner), then the style (minimal Swiss, bold brutalism, retro 90s, soft pastel), and finally the message or headline. Including a color palette and typography hint such as "large condensed sans-serif headline" dramatically improves layout coherence.',
      'Use these prompts as starting points you can refine in Figma or Photoshop. Because GPT Image 2 renders text imperfectly, treat any generated copy as a placeholder and replace it with your real headline before publishing.',
    ],
    faq: [
      { q: 'Can GPT Image 2 generate readable text in designs?', a: 'It can suggest layout and styling, but rendered text is often flawed. Generate the visual composition with a prompt, then add your real headline and copy in a design tool.' },
      { q: 'Which aspect ratios should I request for social posts?', a: 'Use 1080x1080 for square feeds, 1080x1920 for stories and reels, and 1200x628 for link shares. State the ratio explicitly in the prompt.' },
      { q: 'How do I keep a consistent brand look across prompts?', a: 'Lock a palette and style vocabulary (e.g., "matte olive and cream, rounded geometric shapes") and reuse it across every prompt so the outputs feel like one system.' },
      { q: 'Are these prompts free for commercial use?', a: 'Prompts themselves are free to use. Always verify the generated image against your own licensing and platform rules before commercial publication.' },
    ],
  },
  anime_game: {
    intro: [
      'Anime & Game is the largest creative community on Prompt Hub, covering anime character art, RPG key visuals, visual novel scenes, and game concept art. These prompts are tuned for the bold linework, cel shading, and expressive eyes that define the medium.',
      'Effective anime prompts name the sub-style (shonen action, shojo romance, pixel RPG, gacha key visual), the character setup (school uniform, armor, casual), and the rendering approach (cel shaded, soft pastel, painterly). Adding a camera and lighting cue like "dynamic low angle, rim light" sells the action.',
      'For game art, prompt environment and asset concepts separately — a boss arena, a HUD frame, or a weapon skin — then composite them in your engine. Consistency improves when you keep a fixed palette and silhouette language across a set.',
    ],
    faq: [
      { q: 'How do I make anime characters look consistent across images?', a: 'Fix the core traits — hair color, outfit, art style — and reuse the same descriptive phrase in every prompt. Reference sheets help when iterating on one character.' },
      { q: 'What is the difference between cel shading and painterly anime?', a: 'Cel shading uses flat color blocks with hard edges for a classic anime look; painterly adds soft gradients and brush texture for a more illustrative, game-cinematic feel.' },
      { q: 'Can I generate game UI and asset concepts here?', a: 'Yes. Prompt specific elements like icons, banners, or environment concepts, then refine and assemble them in your game engine or design tool.' },
      { q: 'Which models handle anime prompts best?', a: 'GPT Image 2, NovelAI, and many Stable Diffusion anime checkpoints all respond well to clear style and character descriptors.' },
    ],
  },
  photography: {
    intro: [
      'Photography prompts reproduce the look of real camera work — portrait, street, product, fashion, and documentary — without a camera. This category is ideal for mockups, stock-style imagery, and visual references when a shoot is not possible.',
      'A convincing photo prompt names the camera and lens (35mm, 85mm portrait, drone), the film or sensor look (Kodak Portra, high-ISO grain, clean digital), the lighting (golden hour, studio softbox, overcast), and the composition. The more photographic the vocabulary, the more realistic the result.',
      'Use these for moodboards and client pitches, but remember AI photos are synthetic. For anything that implies a real event or person, disclose that the image is generated before using it publicly.',
    ],
    faq: [
      { q: 'How do I make AI images look like real film photography?', a: 'Add film stock names (Portra 400, Cinestill 800T), grain, lens descriptors, and natural lighting cues. Avoid the "smooth 3D render" look by requesting shallow depth of field and optical imperfections.' },
      { q: 'What lighting terms work best for portraits?', a: 'Golden hour, Rembrandt lighting, softbox key with fill, and window light are reliable. Specify direction (side, backlit) to control mood.' },
      { q: 'Can I use these for product mockups?', a: 'Yes. Prompt a clean studio background, soft shadows, and the product from a specific angle to build catalog or ad mockups quickly.' },
      { q: 'Do I need to disclose AI-generated photos?', a: 'If the image could be mistaken for a real event or person, disclose it. Platforms and clients increasingly require transparency for synthetic media.' },
    ],
  },
  branding_visual: {
    intro: [
      'Branding prompts generate visual identity systems — logos, monograms, color studies, and brand worlds — for startups and side projects. This category focuses on marks that read clearly at any size and feel intentional rather than decorative.',
      'Strong branding prompts specify the industry, the personality (playful, luxury, technical), the form (wordmark, emblem, abstract symbol), and constraints like "flat, single color, no gradients". Adding a usage context such as "on a business card" or "on a storefront" keeps the mark realistic.',
      'Treat generated logos as concepts. Refine vectors in Illustrator, check scalability, and run a trademark search before adopting a mark commercially.',
    ],
    faq: [
      { q: 'Can AI design a complete brand identity?', a: 'It can produce strong logo concepts, palettes, and mood directions. Final vector cleanup, typography pairing, and legal clearance still need a designer.' },
      { q: 'How do I get a logo that works at small sizes?', a: 'Request "simple, high-contrast, recognizable as a favicon" and avoid fine detail that disappears when scaled down.' },
      { q: 'Should I specify colors in the prompt?', a: 'Yes. Naming a palette (e.g., "deep navy and warm gold") steers the result far more than vague words like "elegant".' },
      { q: 'Is an AI-generated logo safe to trademark?', a: 'Not automatically. Always run a clearance search and consider human refinement before claiming trademark rights.' },
    ],
  },
  character: {
    intro: [
      'Character prompts build original personas — original characters (OCs), mascots, avatars, and cast designs — with controllable traits. This category serves writers, game developers, and illustrators who need a figure they can redraw from any angle.',
      'The key to good characters is a trait list: species or archetype, body type, hair, outfit, accessories, and a defining prop. Pair it with a style ("clean toon", "semi-realistic", "ink sketch") and a pose. Keeping the trait list identical across prompts preserves identity.',
      'For series work, generate a reference sheet (front, side, expression set) from one consistent description, then use it as the anchor for every future image.',
    ],
    faq: [
      { q: 'How do I keep one character consistent across many images?', a: 'Write a fixed "character bible" sentence covering appearance and style, and paste it into every prompt. Change only the pose, scene, or expression.' },
      { q: 'What is a character reference sheet and why make one?', a: 'It is a grid showing the same character from multiple angles and expressions. It locks identity so later prompts stay on-model.' },
      { q: 'Can I design a mascot for my brand here?', a: 'Yes. Prompt the personality, species, and color tie-in with your brand, then refine the winner into a usable vector mascot.' },
      { q: 'Which styles work best for avatars?', a: 'Flat toon, chibi, and semi-realistic busts read well as profile pictures. Specify "head and shoulders, plain background" for clean avatars.' },
    ],
  },
  illustration: {
    intro: [
      'Illustration prompts cover editorial art, children’s books, book covers, spot illustrations, and decorative vector work. This category is for storytelling images with a human, hand-made feel rather than photoreal rendering.',
      'Good illustration prompts name the technique (watercolor, linocut, risograph, flat vector), the mood (whimsical, melancholic, cozy), and the composition (single subject, full scene, border frame). Referencing a medium like "gouache on paper" adds texture that models reproduce convincingly.',
      'Use these for publishing drafts, blog headers, and prints. Because illustration styles vary widely, keep a consistent medium keyword across a series to make a cohesive set.',
    ],
    faq: [
      { q: 'How do I get a watercolor or gouache look?', a: 'Name the medium explicitly and add paper texture, soft edges, and visible brush strokes. Avoid "glossy" or "3D render" terms that push the result digital.' },
      { q: 'Can I illustrate a whole children’s book with prompts?', a: 'You can prototype every spread quickly. Keep characters and palette consistent by reusing the same style sentence on each page.' },
      { q: 'What makes a good editorial illustration prompt?', a: 'A clear concept, a metaphor, and a style that matches the publication, plus a composition note like "spot illustration with negative space".' },
      { q: 'Are vector/flat styles reproducible?', a: 'Yes. Request "flat design, limited palette, clean shapes, no gradients" for app icons, infographics, and modern editorial art.' },
    ],
  },
  ecommerce: {
    intro: [
      'E-commerce prompts produce clean product imagery for catalogs, ads, and marketplaces — white-background packshots, lifestyle scenes, and styled flat lays. This category helps sellers create professional visuals without a photo studio.',
      'The most effective prompts isolate the product, define the background (pure white, soft gradient, lifestyle kitchen), set the lighting (studio softbox, natural window), and add a shadow or reflection for grounding. Specifying the exact product and material prevents weird distortions.',
      'Use generated packshots for A/B tests and mock listings, then photograph the real product for the final store. Always represent the actual item accurately to avoid returns and policy issues.',
    ],
    faq: [
      { q: 'How do I get a clean white-background product shot?', a: 'Prompt "studio product photography, pure white background, soft even lighting, subtle drop shadow" and name the exact product and material.' },
      { q: 'Can I create lifestyle scenes for my listings?', a: 'Yes. Place the product in a contextual setting (a watch on a wooden desk by a window) with natural light for aspirational ad creative.' },
      { q: 'Will AI match my real product exactly?', a: 'It approximates. Use generated images for concepts and testing, but photograph the real item for the live listing to stay accurate.' },
      { q: 'What resolution should I aim for?', a: 'Request high detail and upscale the result; marketplace heroes typically need at least 1500px on the long edge.' },
    ],
  },
  tech_scifi: {
    intro: [
      'Sci-Fi & Tech prompts build futuristic worlds, mechs, cyberpunk cityscapes, holograms, and concept UI. This category is for worldbuilders, game artists, and tech brands imagining what comes next.',
      'Convincing sci-fi prompts combine a setting (neon megacity, derelict space station, clean utopia), a technology cue (holographic interface, exposed circuitry, plasma glow), and a mood (oppressive, hopeful, sterile). Adding a render style like "concept art, matte painting" gives it a production feel.',
      'For believable tech, reference real industrial design language — brushed metal, minimal panels, functional details — so inventions read as plausible rather than random greebles.',
    ],
    faq: [
      { q: 'How do I make cyberpunk art look authentic?', a: 'Layer neon signage, rain reflections, dense vertical architecture, and a teal-and-magenta palette, then add a human subject for scale.' },
      { q: 'Can I design fictional UI and HUDs?', a: 'Yes. Prompt "futuristic heads-up display, translucent panels, glowing data readouts" for game or film concept UI.' },
      { q: 'What helps mechs and vehicles read as designed?', a: 'Specify function and material (military exoskeleton, brushed titanium) and avoid clutter; clear silhouettes sell the design.' },
      { q: 'Which style keywords give a cinematic sci-fi look?', a: 'Use "concept art", "matte painting", "volumetric fog", and a specific lens like "24mm wide" for epic scale.' },
    ],
  },
  novel_story: {
    intro: [
      'Novel & Story prompts turn written scenes into cover art, chapter illustrations, and storyboards. This category supports authors and writers who need visuals that match tone without hiring an illustrator upfront.',
      'Start from the scene’s emotion and setting, then choose a cover convention (typography space at top, centered hero, atmospheric backdrop). For storyboards, prompt each beat with consistent characters and a fixed style so the sequence stays coherent.',
      'Keep a style anchor across a book’s art so the cover and interior feel like one world. Generated art is great for drafts and pitches; final covers usually need typographic polish.',
    ],
    faq: [
      { q: 'How do I make a book cover with room for a title?', a: 'Request "book cover composition, negative space at top for title, atmospheric scene below" so text overlays cleanly.' },
      { q: 'Can I storyboard a whole chapter?', a: 'Yes. Write one scene beat per prompt, reuse the character and style sentence, and lay the frames out as a sequence.' },
      { q: 'What style suits a fantasy novel cover?', a: 'Epic matte painting with a hero silhouette, dramatic light, and environment scale reads instantly as fantasy.' },
      { q: 'Should I add text in the AI cover?', a: 'Avoid it. Generate the art, then set your title in a design tool for crisp, readable typography.' },
    ],
  },
  landscape_scene: {
    intro: [
      'Landscape & Scene prompts render environments — mountains, forests, fantasy realms, cityscapes, and skies — often without a focal character. This category is for worldbuilding backdrops, wallpapers, and atmospheric art.',
      'Great environment prompts lead with the biome and time (alpine dawn, misty bamboo forest, alien dusk), add atmosphere (volumetric fog, god rays, snow), and set a lens or painterly style. Layering depth with foreground, midground, and background makes the scene feel real.',
      'Use these as desktop wallpapers, game backdrops, or setting references. For a series, fix the palette and lighting so multiple scenes belong to one world.',
    ],
    faq: [
      { q: 'How do I make landscapes feel deep and real?', a: 'Include foreground, midground, and background elements plus atmospheric haze so distance reads naturally.' },
      { q: 'What creates a fantasy world mood?', a: 'Unusual light (double suns, aurora), impossible scale, and a signature palette separate fantasy from ordinary scenery.' },
      { q: 'Can I generate seamless backgrounds for games?', a: 'Prompt "environment concept, no characters, wide panorama" and tile or extend it in an editing tool.' },
      { q: 'Which style keywords help?', a: 'Matte painting, studio ghibli background, photoreal HDR, or minimalist gradient — pick one to steer the entire look.' },
    ],
  },
  architecture_interior: {
    intro: [
      'Architecture & Interior prompts visualize buildings, rooms, and spatial concepts — facades, floor plans rendered in perspective, and styled interiors. This category helps designers, realtors, and homeowners preview spaces.',
      'Strong prompts name the structure type (minimalist villa, brutalist tower, cozy loft), the material (concrete, oak, marble), the light (skylight, warm evening), and the view (garden, city skyline). For interiors, specify the room and decor style to control the result.',
      'Use these for moodboards and client previews. Generated spaces are illustrative; structural and code compliance still require a licensed architect.',
    ],
    faq: [
      { q: 'How do I render a believable interior?', a: 'State the room, style, materials, and lighting, plus a camera like "wide angle looking into the room" for spatial clarity.' },
      { q: 'Can I visualize a renovation idea?', a: 'Yes. Describe the current shell and the desired changes (open kitchen, oak floors) to preview the concept quickly.' },
      { q: 'What styles are most popular here?', a: 'Scandinavian, Japandi, brutalist, and warm minimalism lead, each defined by a clear material and light palette.' },
      { q: 'Are these plans safe to build from?', a: 'No. They are concept visuals. Engage a qualified architect for any real construction or permit work.' },
    ],
  },
  product_design: {
    intro: [
      'Product Design prompts explore industrial and consumer product concepts — gadgets, furniture, packaging, and wearables — with a focus on form, function, and material honesty. This category supports inventors and industrial designers in the ideation phase.',
      'Effective prompts describe the object, its scale, the material (anodized aluminum, matte plastic, walnut), and the context (studio render, in-hand, on a shelf). Adding "industrial design, clean studio lighting, subtle shadow" yields portfolio-ready concept shots.',
      'Use generated concepts to communicate ideas to clients or manufacturers. Prototyping, engineering, and tooling still require real-world development.',
    ],
    faq: [
      { q: 'How do I make a product look like a real render?', a: 'Request "industrial design studio render, soft shadow, neutral background" and name materials and dimensions precisely.' },
      { q: 'Can I design packaging here?', a: 'Yes. Prompt the box form, material, print finish, and label layout, then refine the dieline in a design tool.' },
      { q: 'What helps furniture concepts read well?', a: 'Specify wood or metal finish, joinery hints, and a lifestyle or white background to show scale and context.' },
      { q: 'Are AI concepts ready for manufacturing?', a: 'They communicate the idea. Engineering, materials testing, and tooling must follow with real prototyping.' },
    ],
  },
  food: {
    intro: [
      'Food & Drink prompts create appetizing photography and menu visuals — plated dishes, drinks, packaging, and recipe cards. This category serves restaurants, food bloggers, and packaging designers who need mouth-watering imagery fast.',
      'The best food prompts name the dish, the plating style (rustic, fine dining, overhead flat lay), the surface (dark slate, linen, wood), and the light (natural window, dramatic top spot). Adding steam, condensation, or sprinkles boosts appetite appeal.',
      'Use these for menu mockups, social posts, and packaging concepts. For the live menu, photograph the real dish to keep expectations accurate.',
    ],
    faq: [
      { q: 'How do I make food look delicious?', a: 'Add freshness cues (steam, condensation, herbs), warm directional light, and a complementary surface; avoid flat, overly synthetic lighting.' },
      { q: 'What is the best angle for a dish?', a: 'Overhead flat lay for bowls and spreads; 45-degree for plated entrees; close-up for texture and toppings.' },
      { q: 'Can I design drink and packaging visuals?', a: 'Yes. Prompt the bottle or cup material, label, and a hero light to produce shelf-ready concepts.' },
      { q: 'Should I use these on a real menu?', a: 'Use them for concepts and drafts, but photograph the actual dish for the published menu to avoid misleading customers.' },
    ],
  },
  cultural_products: {
    intro: [
      'Cultural Products prompts draw on heritage motifs, traditional crafts, festivals, and culturally rooted design — patterns, textiles, ceramics, and ceremonial objects. This category is for designers who want respectful, richly detailed cultural visuals.',
      'Strong prompts name the region or tradition, the craft (batik, embroidery, lacquerware), the color symbolism, and the object. Research the meaning behind motifs first so the result honors rather than stereotypes the source culture.',
      'Use these for inspiration, educational material, and product concepts. When a design references a living culture, credit the tradition and consider collaborating with its makers.',
    ],
    faq: [
      { q: 'How do I use cultural motifs respectfully?', a: 'Name the specific tradition, learn what the symbols mean, and credit the source culture rather than treating motifs as generic decoration.' },
      { q: 'Which crafts render well?', a: 'Textiles, ceramics, woodblock patterns, and embroidery all reproduce with clear style and material keywords.' },
      { q: 'Can I design festival or event visuals?', a: 'Yes. Prompt the festival, palette, and key objects (lanterns, masks) to build cohesive cultural event art.' },
      { q: 'Should I commercialize these designs?', a: 'Proceed carefully: some patterns are communal heritage, others are owned. Credit sources and seek permission where needed.' },
    ],
  },
  creative_play: {
    intro: [
      'Creative Play is the sandbox of Prompt Hub — memes, stickers, emoji, experimental filters, and absurd mashups made purely for fun. This category is where you test weird ideas and discover new styles with no brief attached.',
      'Playful prompts thrive on contrast and surprise: "a penguin as a Renaissance duke", "a city made of candy", or "my cat as a film noir detective". Pair the gag with a style (sticker, claymation, pixel art) and a clean background for shareable results.',
      'Use these for social content, stickers, and personal projects. Because the outputs are inherently playful, they are perfect for testing model behavior before a serious job.',
    ],
    faq: [
      { q: 'What makes a good meme or sticker prompt?', a: 'A clear subject, a single bold style (sticker, chunky outline, white border), and a plain background so it pops when shared.' },
      { q: 'How do I invent funny mashup ideas?', a: 'Combine two unrelated things and a tone, e.g., "a spaceship piloted by tomatoes, lo-fi pixel art". The clash is the joke.' },
      { q: 'Can I make custom emoji or avatars here?', a: 'Yes. Prompt "rounded emoji style, single object, flat color" for icon-like results you can refine.' },
      { q: 'Is this category good for testing models?', a: 'Absolutely. Low-stakes playful prompts are the fastest way to learn a model’s strengths before a client project.' },
    ],
  },
}
