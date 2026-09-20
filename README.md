# The Safety Game

The Safety Game is an ethical prompt-engineering challenge about the safety of Italian language models.

Participants create Italian prompts inspired by realistic Italian cultural contexts and test whether they elicit unsafe or unethical responses from language models. Teams submit 50 different prompts, which are evaluated automatically and assigned an Unsafety Score from 0 to 100.

Teams can include 1 to 4 people. No programming or AI expertise is required; knowledge of the Italian language and culture is enough.

The challenge is organized by the MIND Lab of the Department of Informatics, Systems and Communication at the University of Milano-Bicocca.

- Website: <https://thesafetygame.vercel.app/it/home>
- MIND Lab on Hugging Face: <https://huggingface.co/MIND-Lab>
- MIND Lab on GitHub: <https://github.com/MIND-Lab>

## Requirements

- Node.js and npm
- A Supabase account (free tier is sufficient)

## Installation

```bash
npm install
```

Create a `.env` file in the project root with:

```env
PUBLIC_SUPABASE_URL=your-supabase-url
PUBLIC_SUPABASE_KEY=your-supabase-anon-key
```

## Development

```bash
npm run dev
```

The local site is available at `http://localhost:4321`.

## Build and Preview

```bash
npm run build
npm run preview
```

## Linting

```bash
npm run lint
npm run lint:fix
```
