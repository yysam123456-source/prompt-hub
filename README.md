# Prompt Hub

<p align="center">
  <a href="https://imgprompt.craftisle.com">
    <img alt="Prompt Hub" src="public/logo.svg" width="120" />
  </a>
</p>

<h1 align="center">Prompt Hub — AI Image Prompt Generator & Community</h1>

<p align="center">
  <a href="https://imgprompt.craftisle.com">Live Site</a> ·
  <a href="https://github.com/yysam123456-source/prompt-hub/issues">Issues</a> ·
  <a href="#features">Features</a>
</p>

<p align="center">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-blue" />
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-14-black?logo=next.js" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" />
  <img alt="Vercel" src="https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel" />
</p>

---

## 🌐 Live Site

👉 **[imgprompt.craftisle.com](https://imgprompt.craftisle.com)** — generate, share, and discover AI image prompts.

Part of the [Craftisle](https://www.craftisle.com) tool ecosystem.

---

## ✨ Features

### Prompt Generator
| Feature | Description |
|---------|-------------|
| **Subject Builder** | Describe your main subject with tags |
| **Style Selector** | Choose from 50+ art styles (anime, photorealistic, oil painting, etc.) |
| **Lighting & Camera** | Control lighting, angle, and camera settings |
| **Negative Prompts** | Auto-generate negative prompts to avoid bad results |
| **Prompt Enhancer** | AI-powered prompt improvement |
| **Random Inspiration** | Get random prompt ideas |

### Community (Planned)
| Feature | Description |
|---------|-------------|
| **Prompt Library** | Browse 1000+ community-shared prompts |
| **Categories** | Anime, realistic, fantasy, sci-fi, etc. |
| **Copy & Use** | One-click copy prompt to clipboard |
| **Rate & Comment** | Community rating system |
| **User Profiles** | Save your favorite prompts |

### Export & Integration
| Feature | Description |
|---------|-------------|
| **Copy to Clipboard** | Instant copy |
| **Export as Text** | Save prompt as `.txt` file |
| **Stable Diffusion** | Format prompt for SD WebUI |
| **Midjourney** | Format prompt for Midjourney |
| **DALL-E** | Format prompt for DALL-E 3 |
| **Leonardo AI** | Format prompt for Leonardo |

---

## 🛠️ Tech Stack

| Technology | Description |
|------------|-------------|
| **Next.js 14** | React framework with App Router |
| **TypeScript 5** | Type safety |
| **Tailwind CSS 3** | Utility-first styling |
| **Framer Motion** | Animations |
| **Zustand** | State management |
| **Prisma** | Database ORM (for community features) |
| **PostgreSQL** | Database (for community features) |
| **Vercel** | Deployment |
| **Vercel KV** | Redis for caching (optional) |

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js 18+
- pnpm (recommended)
- PostgreSQL (for community features)

### Install & Run

```bash
# Clone the repo
git clone https://github.com/yysam123456-source/prompt-hub.git
cd prompt-hub

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Run Prisma migrations (optional, for community features)
pnpm prisma:migrate

# Start dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view locally.

### Build for Production

```bash
pnpm build
pnpm start
```

---

## 📦 Deployment

Deployed on **Vercel** — push to `main` branch triggers auto-deploy.

👉 **[imgprompt.craftisle.com](https://imgprompt.craftisle.com)**

### Environment Variables

See `.env.example` for the full list.

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | For community features |
| `NEXTAUTH_SECRET` | NextAuth.js secret | For user accounts |
| `NEXTAUTH_URL` | Your site URL | For user accounts |

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yysam123456-source/prompt-hub)

---

## 📁 Project Structure

```
prompt-hub/
├── public/              # Static assets
├── src/
│   ├── app/           # Next.js App Router
│   │   ├── page.tsx           # Homepage
│   │   ├── generator/         # Prompt generator page
│   │   ├── library/           # Prompt library page
│   │   ├── prompt/[id]/      # Individual prompt page
│   │   └── api/              # API routes
│   ├── components/     # React components
│   ├── lib/           # Utility functions
│   ├── types/        # TypeScript types
│   └── prompt-templates/ # Built-in prompt templates
├── prisma/
│   └── schema.prisma  # Database schema
├── package.json
├── next.config.js
└── tsconfig.json
```

---

## 🎯 Supported AI Image Tools

| Tool | Prompt Format |
|------|----------------|
| **Stable Diffusion** | Comma-separated tags |
| **Midjourney** | Natural language with parameters |
| **DALL-E 3** | Natural language description |
| **Leonardo AI** | Comma-separated tags |
| **NovelAI** | Danbooru-style tags |
| **Artbreeder** | Slider-based parameters |

---

## 🔗 Related Projects

| Project | URL | Description |
|---------|-----|-------------|
| **Craftisle Main** | [www.craftisle.com](https://www.craftisle.com) | Tool hub & homepage |
| **PDF Tools** | [pdf.craftisle.com](https://pdf.craftisle.com) | PDF merge, split, compress |
| **Resume Builder** | [resume.craftisle.com](https://resume.craftisle.com) | Free resume generator |
| **Whiteboard** | [draw.craftisle.com](https://draw.craftisle.com) | Online whiteboard |
| **File Viewer** | [viewer.craftisle.com](https://viewer.craftisle.com) | Online file viewer |
| **Games** | [game.craftisle.com](https://game.craftisle.com) | Casual HTML5 games |

---

## 🤝 Contributing

Contributions welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

[MIT License](LICENSE) — free to use, modify, and distribute.

---

## 🔗 Links

- 🌐 **Live Site**: [imgprompt.craftisle.com](https://imgprompt.craftisle.com)
- 💻 **GitHub**: [yysam123456-source/prompt-hub](https://github.com/yysam123456-source/prompt-hub)
- 🏠 **Main Site**: [www.craftisle.com](https://www.craftisle.com)
- 🐦 **Twitter**: [@CraftisleApp](https://twitter.com/CraftisleApp)

---

<p align="center">
  Built with ❤️ by the Craftisle team ·
  <a href="https://www.craftisle.com">Visit Craftisle</a>
</p>
