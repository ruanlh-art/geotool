# GEO & SEO Content Optimization Master

A specialized tool for optimizing Filmora content for GEO (Generative Engine Optimization) and SEO across PT-BR, ES-MX, ES-ES, KO-KR, and EN-US markets.

## Deployment Instructions

### Netlify
1. Connect your repository to Netlify.
2. Set **Build command** to `npm run build`.
3. Set **Publish directory** to `dist`.
4. Add the following **Environment Variables** in the Netlify UI:
   - `GEMINI_API_KEY`: Your Google Gemini API key.
   - `APP_URL`: Your Netlify site URL (e.g., `https://your-site.netlify.app`).

### Vercel
1. Connect your repository to Vercel.
2. Vercel should automatically detect the Vite project.
3. Ensure **Build command** is `npm run build` and **Output directory** is `dist`.
4. Add the following **Environment Variables** in the Vercel UI:
   - `GEMINI_API_KEY`: Your Google Gemini API key.
   - `APP_URL`: Your Vercel site URL (e.g., `https://your-site.vercel.app`).

## Local Development
1. Clone the repository.
2. Install dependencies: `npm install`.
3. Create a `.env` file based on `.env.example` and add your `GEMINI_API_KEY`.
4. Start the development server: `npm run dev`.
