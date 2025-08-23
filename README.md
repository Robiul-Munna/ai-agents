# Healthcare AI Agent Web App

This is a full-stack, AI-powered healthcare conversational web app built with Next.js, using only free and open-source tools. It is ready for deployment on Vercel and designed for beginners.

## Features
- Conversational healthcare agent (chat interface)
- Uses open-source LLMs via Hugging Face
- Modular code for easy extension (EMR/EHR integration)
- Provenance: answers cite trusted sources (NIH, PubMed, WHO)
- Free to use, no paid APIs

## Getting Started

### 1. Prerequisites
- [GitHub account](https://github.com/)
- [Vercel account](https://vercel.com/)

### 2. Clone the Repository
```
git clone https://github.com/YOUR_GITHUB_USERNAME/healthcare-ai-agent.git
cd healthcare-ai-agent
```

### 3. Install Dependencies
```
npm install
```

### 4. Set Up Environment Variables
- Copy `.env.example` to `.env` and add your Hugging Face API key (free from [Hugging Face](https://huggingface.co/settings/tokens)):
```
cp .env.example .env
```

### 5. Run Locally
```
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Deploy to Vercel
- Push your code to GitHub.
- Go to [Vercel](https://vercel.com/) and import your GitHub repo.
- Vercel will auto-detect Next.js and deploy your app.

## Provenance & Sources
- All answers cite trusted healthcare sources (NIH, PubMed, WHO).
- See `/lib/agent.js` for logic and citation code.

## Extending the App
- Modular code: add new components in `/components` and new logic in `/lib`.
- For EMR/EHR integration, see comments in `/lib/agent.js`.

## Support
If you get stuck, open an issue on GitHub or ask in the Vercel community.

---

**Ready to deploy!**
