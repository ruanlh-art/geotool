import { GoogleGenAI, Type } from "@google/genai";
import { SEOInput, Market } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const SYSTEM_INSTRUCTION = `You are a top-tier SEO and GEO (Generative Engine Optimization) expert specializing in Filmora content for PT-BR, ES-MX, ES-ES, KO-KR, and EN-US markets.
Your task is to optimize HTML content, keywords, and titles to be highly crawlable by AI engines like Google SGE and ChatGPT.
Always follow localized rules:
- PT-BR (Brazil): Friendly, practical, uses "Você", "Como fazer", "Passo a passo", "Grátis".
- ES-MX (Mexico): Neutral-warm, uses "Computadora", "Cómo descargar", "Mejor software de...", "Fácil", "Rápido".
- ES-ES (Spain): Professional, direct, uses "Ordenador", "Vídeo", "Mejores aplicaciones", "Tutorial oficial".
- KO-KR (South Korea): Polite, technical, uses "방법", "무료 다운로드", "최고의 편집 프로그램", "가이드".
- EN-US (USA): Direct, benefit-driven, uses "How to", "Best software for", "Free download", "Step-by-step".
Strictly adhere to the original HTML classes (e.g., class="ws-article-des-sub", class="ws-article-img").
CRITICAL: Adapt the generated HTML to the EXACT format and style of the original article provided. Do not invent new structures or use fixed templates if they conflict with the existing style.
CRITICAL: DO NOT use markdown bold (e.g., ** or *) in HTML outputs. Use <strong> tags instead.
IMPORTANT: 
- Use the provided "Today's Date" and "URL" for all relevant optimizations. 
- Ensure years are current (e.g., use 2026 if the date is in 2026).
- Output ONLY the requested code, HTML, or JSON. Do not include conversational filler.`;

export async function optimizeIntro(input: SEOInput) {
  const prompt = `
  Button 1: Introduction Direct Answer Optimization
  Language/Market: ${input.market}
  Current H1: ${input.h1}
  Target Keywords: ${input.keywords}
  Original HTML: ${input.html}
  Today's Date: ${input.date}
  Other Notes: ${input.notes}

  Logic: Generate two paragraphs under H1.
  - 1st Para: Direct definition of the tool/topic (Direct Answer), starting with "[Topic] is (é/es/se trata de/입니다/is)...". Include core keywords.
  - 2nd Para: Summarize article value (e.g., step-by-step tutorial, alternatives).
  Requirements: Remove background fluff. Be direct.
  HTML Adaptation: Use the same HTML tags and classes found in the original intro of the provided HTML. 
  CRITICAL: Bold key terms and keywords using <strong> tags (NOT <b> and NEVER use markdown ** or *).
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: { systemInstruction: SYSTEM_INSTRUCTION }
  });
  return response.text;
}

export async function optimizeH2(input: SEOInput) {
  const prompt = `
  Button 2: H2 & Navigation Questionizer (GEO Expert Mode)
  Language/Market: ${input.market}
  Target Keywords: ${input.keywords}
  Original HTML: ${input.html}
  Today's Date: ${input.date}
  URL: ${input.url}
  Other Notes: ${input.notes}

  Logic: Convert all H2 titles and navigation text into search-oriented question format.
  Ensure any year mentioned is updated to the year in ${input.date}.
  
  HTML Adaptation: Strictly follow the HTML structure, tags, and classes of the original H2s and navigation list in the provided HTML.
  
  Standard Template Reference:
  - Original H2: <h2><a name="part1"></a>Parte 1: O que é o Gravador de Voz Vocaroo?</h2>
  - Optimized H2: <h2><a name="part1"></a>Parte 1: O que é e para que serve o Gravador de Voz Vocaroo?</h2>

  Execution Instructions:
  - MUST retain <a name="partX"></a> anchor tags and <span> numbers.
  - Localization:
    - PT-BR: Use "O que é e para que serve...", "Como usar o... passo a passo".
    - ES-MX/ES-ES: Use "¿Qué es e para qué sirve...?", "¿Cómo utilizar... passo a passo?".
    - KO-KR: Use "...란 무엇인가요?", "... 사용하는 방법 (단계별 가이드)".
    - EN-US: Use "What is... and how does it work?", "How to use... step-by-step".
  
  Output Format:
  1. Optimization Comparison Table (Markdown).
  2. Complete Navigation HTML Fragment.
  3. Optimized H2 HTML lines.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: { systemInstruction: SYSTEM_INSTRUCTION }
  });
  return response.text;
}

export async function generateTable(input: SEOInput) {
  const prompt = `
  Button 3: 对比表格 (GEO Comparison Table Assistant)
  Language/Market: ${input.market}
  Article Content: ${input.html}
  Today's Date: ${input.date}

  System Role: GEO Data Analyst.提炼核心差异点，并生成一个高信息密度的 HTML 对比表格。
  HTML Adaptation: Adapt the table's visual style (colors, borders, fonts) to match the overall aesthetic of the provided article HTML.

  Execution Logic & Rules:
  1. Three-Column Principle: Fixed 3 columns (Tool Name | Core Feature | Ideal For).
  2. GEO Question Header: Followed immediately by an H2 question.
  3. Data Extraction: Max 15 words per cell. Cover main tool + alternatives.
  4. HTML Styling: Use inline styles for visual consistency with the article.
  5. Responsive: Wrap in <div style="overflow-x: auto; margin-bottom: 20px;">.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: { systemInstruction: SYSTEM_INSTRUCTION }
  });
  return response.text;
}

export async function generateSchema(input: SEOInput) {
  const prompt = `
  Button 4: Structured Data (Schema) & FAQ Content Assistant
  Language/Market: ${input.market}
  Article H1: ${input.h1}
  Original HTML: ${input.html}
  Today's Date: ${input.date}
  URL: ${input.url}
  Logo URL: https://neveragain.allstatics.com/2019/assets/icon/logo/filmora-9-square.svg

  Logic: Generate independent structured data blocks AND missing FAQ content.
  
  Part A: FAQ Content Generation
  - Scan the Original HTML for an FAQ section (H2 with "FAQ" or "Perguntas Frequentes", etc.).
  - If MISSING: Generate a high-quality FAQ HTML section (H2 + 3-4 Q&As) based on the article content.
  - Placement: Instruct that this should be placed after the Conclusion.
  - HTML Style: Use the same classes and tags as the rest of the article (e.g., <h2 class="ws-article-h2">, <p class="ws-article-des-sub">).
  
  Part B: Structured Data (Schema)
  - CRITICAL: Every schema block MUST be wrapped in <script type="application/ld+json"> tags.
  - Article & Breadcrumb: headline, author, publisher, logo, dates, mainEntity.
  - How-to: Extract steps with anchor URLs.
  - FAQ Schema: Based on the generated or existing FAQ.
  - ItemList: Mandatory if the article is a "Top X" or "Best X" list.
  - AggregateRating: Fixed high rating (4.8/5, 15779 votes).

  Output Format:
  1. ### 📝 Generated FAQ HTML (If missing in original)
     [The HTML code for the FAQ section]
  2. ### 🟢 Article & Breadcrumb Schema
     <script type="application/ld+json">...</script>
  3. ### 🟢 FAQ Schema
     <script type="application/ld+json">...</script>
  4. ### 🟢 How-to Schema (If applicable)
     <script type="application/ld+json">...</script>
  5. ### 🟢 ItemList Schema (If Toplist)
     <script type="application/ld+json">...</script>
  6. ### 🟢 AggregateRating Schema
     <script type="application/ld+json">...</script>
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: { systemInstruction: SYSTEM_INSTRUCTION }
  });
  return response.text;
}

export async function optimizeCTR(input: SEOInput) {
  const prompt = `
  Button 5: TDK Optimization
  Language/Market: ${input.market}
  Current Title: ${input.title}
  Current Meta: ${input.meta}
  Current H1: ${input.h1}
  Target Keywords: ${input.keywords}
  Today's Date: ${input.date}
  Other Notes: ${input.notes}

  Logic: Optimize Title, Description (Meta), and Keywords (H1).
  Ensure years are updated to the year in ${input.date}.
  Requirements: 
  - Title: Include numbers/brackets/power words.
  - Description: Compelling + CTA.
  - H1: Search-intent aligned + core keywords.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: { systemInstruction: SYSTEM_INSTRUCTION }
  });
  return response.text;
}
