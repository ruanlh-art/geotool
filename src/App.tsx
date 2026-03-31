import { useState } from 'react';
import { 
  Globe, 
  Type, 
  Table as TableIcon, 
  Code, 
  MousePointerClick, 
  Copy, 
  Check, 
  Loader2, 
  Sparkles,
  Search,
  FileText,
  Languages
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { cn } from './lib/utils';
import { Market, SEOInput, SEOOutput } from './types';
import * as gemini from './services/geminiService';

export default function App() {
  const [input, setInput] = useState<SEOInput>({
    market: 'PT-BR',
    h1: '',
    title: '',
    meta: '',
    keywords: '',
    html: '',
    date: '2026-03-31',
    url: '',
    notes: ''
  });

  const [output, setOutput] = useState<SEOOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleAction = async (type: SEOOutput['type']) => {
    if (!input.h1 && !input.html) return;
    setLoading(true);
    setOutput(null);
    try {
      let result = '';
      switch (type) {
        case 'intro': result = await gemini.optimizeIntro(input); break;
        case 'h2': result = await gemini.optimizeH2(input); break;
        case 'table': result = await gemini.generateTable(input); break;
        case 'schema': result = await gemini.generateSchema(input); break;
        case 'ctr': result = await gemini.optimizeCTR(input); break;
      }
      setOutput({ type, content: result });
    } catch (error) {
      console.error(error);
      setOutput({ type, content: 'Error generating content. Please check your API key and input.' });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text?: string) => {
    const contentToCopy = text || output?.content;
    if (!contentToCopy) return;
    navigator.clipboard.writeText(contentToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans selection:bg-[#3B82F6] selection:text-white">
      {/* Header */}
      <header className="border-b border-[#E2E8F0] p-6 flex justify-between items-center bg-white sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#3B82F6] flex items-center justify-center rounded-lg shadow-blue-200 shadow-lg">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-sans font-bold text-xl leading-none tracking-tight text-[#0F172A]">GEO & SEO 优化大师</h1>
            <p className="text-[10px] uppercase tracking-widest opacity-50 font-mono mt-1">Filmora 内容优化套件 v1.2</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 border border-[#3B82F6]/20 bg-blue-50 rounded-full text-[11px] font-mono text-[#3B82F6]">
            <span className="w-2 h-2 bg-[#3B82F6] rounded-full animate-pulse" />
            ENGINE_CONNECTED
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-[400px_1fr] min-h-[calc(100vh-89px)]">
        {/* Sidebar - Inputs */}
        <aside className="border-r border-[#E2E8F0] p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-89px)] bg-white">
          <section className="space-y-4">
            <div className="flex items-center gap-2 opacity-70">
              <Languages className="w-4 h-4" />
              <span className="text-[13px] uppercase font-mono tracking-wider">市场 / 语言</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {(['PT-BR', 'ES-MX', 'ES-ES', 'KO-KR', 'EN-US'] as Market[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setInput({ ...input, market: m })}
                  className={cn(
                    "py-2 text-[12px] font-mono border transition-all rounded-md",
                    input.market === m 
                      ? "bg-[#3B82F6] text-white border-[#3B82F6] shadow-md shadow-blue-100" 
                      : "bg-white border-[#E2E8F0] text-[#64748B] hover:border-[#3B82F6] hover:text-[#3B82F6]"
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 opacity-70">
              <FileText className="w-4 h-4" />
              <span className="text-[13px] uppercase font-mono tracking-wider">文章元数据</span>
            </div>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[12px] uppercase font-mono opacity-70">当前 H1</label>
                <input
                  value={input.h1}
                  onChange={(e) => setInput({ ...input, h1: e.target.value })}
                  placeholder="例如：Como gravar a tela no PC"
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-md focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none px-3 py-2 text-base font-mono transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[12px] uppercase font-mono opacity-70">目标关键词</label>
                <input
                  value={input.keywords}
                  onChange={(e) => setInput({ ...input, keywords: e.target.value })}
                  placeholder="核心词, 长尾词, 次要词"
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-md focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none px-3 py-2 text-base font-mono transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[12px] uppercase font-mono opacity-70">今日日期</label>
                <input
                  value={input.date}
                  onChange={(e) => setInput({ ...input, date: e.target.value })}
                  placeholder="例如：2026-03-31"
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-md focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none px-3 py-2 text-base font-mono transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[12px] uppercase font-mono opacity-70">完整 URL</label>
                <input
                  value={input.url}
                  onChange={(e) => setInput({ ...input, url: e.target.value })}
                  placeholder="https://filmora.wondershare.com.br/..."
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-md focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none px-3 py-2 text-base font-mono transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[12px] uppercase font-mono opacity-70">其他备注</label>
                <input
                  value={input.notes}
                  onChange={(e) => setInput({ ...input, notes: e.target.value })}
                  placeholder="例如：强调 Filmora 14 新功能"
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-md focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none px-3 py-2 text-base font-mono transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[12px] uppercase font-mono opacity-70">标题 / Meta</label>
                <textarea
                  value={input.title}
                  onChange={(e) => setInput({ ...input, title: e.target.value })}
                  placeholder="当前标题和 Meta..."
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-md focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none p-3 text-base font-mono h-24 resize-none transition-all"
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 opacity-70">
              <Code className="w-4 h-4" />
              <span className="text-[13px] uppercase font-mono tracking-wider">原始 HTML 内容</span>
            </div>
            <textarea
              value={input.html}
              onChange={(e) => setInput({ ...input, html: e.target.value })}
              placeholder="在此处粘贴完整 HTML..."
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-md focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none p-3 text-base font-mono h-[300px] resize-none transition-all"
            />
          </section>

          <div className="grid grid-cols-2 gap-2 pt-4">
            <button
              onClick={() => setInput({
                market: 'PT-BR',
                h1: 'Como gravar a tela no PC com áudio (Grátis)',
                title: 'Como gravar a tela no PC with áudio em 2026 (Guia Completo)',
                meta: 'Aprenda como gravar a tela no PC com áudio de forma fácil e rápida. Confira o passo a passo completo e as melhores ferramentas gratuitas.',
                keywords: 'gravar tela pc, gravador de tela com áudio, filmora screen recorder',
                html: '<h1 class="ws-article-h1">Como gravar a tela no PC com áudio (Grátis)</h1>\n<p class="ws-article-des-sub">Neste artigo, vamos explorar as melhores maneiras de capturar sua tela...</p>\n<h2 class="ws-article-h2"><a name="part1"></a>Passo 1: Escolha sua ferramenta</h2>\n<p class="ws-article-des-sub">Existem muitas opções no mercado...</p>\n<div class="ws-article-anchor-list"><div><span>01</span><a href="#part1">Passo 1: Escolha sua ferramenta</a></div></div>',
                date: '2026-03-31',
                url: 'https://filmora.wondershare.com.br/screen-recorder/how-to-record-pc-screen.html',
                notes: '强调 Filmora 14 的 AI 录屏功能'
              })}
              className="py-2 text-[12px] font-mono border border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white transition-all rounded-md"
            >
              加载示例
            </button>
            <button
              onClick={() => setInput({ market: 'PT-BR', h1: '', title: '', meta: '', keywords: '', html: '', date: '2026-03-31', url: '', notes: '' })}
              className="py-2 text-[12px] font-mono border border-red-200 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all rounded-md"
            >
              重置所有
            </button>
          </div>
        </aside>

        {/* Main Content - Actions & Results */}
        <div className="p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-89px)]">
          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <ActionButton
              icon={<Globe className="w-4 h-4" />}
              label="Intro 直答优化"
              onClick={() => handleAction('intro')}
              isLoading={loading && output?.type === 'intro'}
            />
            <ActionButton
              icon={<Type className="w-4 h-4" />}
              label="H2 问句优化"
              onClick={() => handleAction('h2')}
              isLoading={loading && output?.type === 'h2'}
            />
            <ActionButton
              icon={<TableIcon className="w-4 h-4" />}
              label="对比表格"
              onClick={() => handleAction('table')}
              isLoading={loading && output?.type === 'table'}
            />
            <ActionButton
              icon={<Code className="w-4 h-4" />}
              label="结构化数据"
              onClick={() => handleAction('schema')}
              isLoading={loading && output?.type === 'schema'}
            />
            <ActionButton
              icon={<MousePointerClick className="w-4 h-4" />}
              label="TDK 优化"
              onClick={() => handleAction('ctr')}
              isLoading={loading && output?.type === 'ctr'}
            />
          </div>

          {/* Results Area */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-20 gap-4"
                >
                  <Loader2 className="w-10 h-10 animate-spin text-[#3B82F6]" />
                  <p className="font-mono text-[13px] uppercase tracking-widest text-[#3B82F6]">正在分析内容并进行 GEO 优化...</p>
                </motion.div>
              ) : output ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#3B82F6] rounded-full" />
                      <h2 className="font-bold text-lg capitalize text-[#0F172A]">
                        {output.type === 'intro' ? 'Intro 优化' : 
                         output.type === 'h2' ? 'H2 问句优化' : 
                         output.type === 'table' ? '对比表格' : 
                         output.type === 'schema' ? '结构化数据' : 'TDK 优化'} 结果
                      </h2>
                    </div>
                    <button
                      onClick={() => copyToClipboard()}
                      className="flex items-center gap-2 px-4 py-1.5 bg-[#3B82F6] text-white text-[13px] font-mono hover:bg-[#2563EB] transition-all rounded-md shadow-sm"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied ? '已复制' : '复制代码'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {output.type === 'schema' ? (
                      <div className="space-y-6">
                        {output.content.split(/###\s+/).filter(Boolean).map((section, idx) => {
                          const lines = section.trim().split('\n');
                          const title = lines[0];
                          const content = lines.slice(1).join('\n').trim();
                          
                          return (
                            <div key={idx} className="space-y-3">
                              <div className="flex items-center justify-between">
                                <h3 className="font-mono text-sm font-bold text-[#3B82F6]">### {title}</h3>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(content);
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 2000);
                                  }}
                                  className="flex items-center gap-2 px-3 py-1 bg-[#F1F5F9] text-[#475569] text-[10px] font-mono hover:bg-[#E2E8F0] transition-all rounded border border-[#CBD5E1]"
                                >
                                  <Copy className="w-3 h-3" />
                                  复制此部分
                                </button>
                              </div>
                              <div className="bg-[#0F172A] text-[#F8FAFC] p-6 rounded-lg font-mono text-sm overflow-x-auto whitespace-pre-wrap border border-[#1E293B] shadow-lg">
                                {content.includes('```') ? (
                                  content.split('```').map((part, i) => {
                                    if (i % 2 === 1) {
                                      const codeLines = part.split('\n');
                                      const code = codeLines.slice(1).join('\n');
                                      return <code key={i} className="block text-[#38BDF8]">{code}</code>;
                                    }
                                    return <span key={i} className="opacity-70">{part}</span>;
                                  })
                                ) : (
                                  content
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="bg-[#0F172A] text-[#F8FAFC] p-6 rounded-lg font-mono text-sm overflow-x-auto whitespace-pre-wrap border border-[#1E293B] relative group shadow-xl">
                        {output.content.includes('```') ? (
                          output.content.split('```').map((part, i) => {
                            if (i % 2 === 1) {
                              // This is the code block
                              const lines = part.split('\n');
                              const code = lines.slice(1).join('\n');
                              return <code key={i} className="block text-[#38BDF8]">{code}</code>;
                            }
                            return <span key={i} className="opacity-70">{part}</span>;
                          })
                        ) : (
                          output.content
                        )}
                      </div>
                    )}
                    
                    <div className="prose prose-sm max-w-none border-t border-[#E2E8F0] pt-6">
                      <div className="flex items-center gap-2 mb-4 opacity-70">
                        <Search className="w-4 h-4 text-[#3B82F6]" />
                        <span className="text-[13px] uppercase font-mono tracking-wider text-[#3B82F6]">GEO 策略笔记</span>
                      </div>
                      <div className="font-sans text-[#475569] leading-relaxed bg-blue-50/50 p-6 rounded-lg border border-blue-100 text-sm">
                        <p className="mb-4">
                          此输出已针对 <strong>{input.market}</strong> 搜索行为进行了优化。
                          结构优先考虑 <strong>直接回答</strong> 模式，以最大限度地提高在 AI 驱动的搜索结果 (SGE) 中的可见性。
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-[13px]">
                          <li>本地化术语：{input.market === 'PT-BR' ? 'Você, Grátis' : input.market === 'ES-MX' ? 'Computadora, Fácil' : 'Ordenador, Tutorial'}</li>
                          <li>HTML 类：保留以确保 Filmora CMS 兼容性</li>
                          <li>关键词：策略性地放置在语义标题和加粗标签中</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-10">
                  <Search className="w-16 h-16" />
                  <p className="font-mono text-[11px] uppercase tracking-widest">等待输入以进行优化</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0] p-4 text-center bg-white">
        <p className="text-[10px] uppercase tracking-widest opacity-50 font-mono">
          © 2026 Filmora Content Strategy Team • Optimized for Google SGE & ChatGPT
        </p>
      </footer>
    </div>
  );
}

function ActionButton({ 
  icon, 
  label, 
  onClick, 
  isLoading 
}: { 
  icon: React.ReactNode; 
  label: string; 
  onClick: () => void;
  isLoading?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={cn(
        "flex flex-col items-center justify-center gap-3 p-5 border border-[#E2E8F0] transition-all group relative overflow-hidden rounded-lg bg-white",
        isLoading 
          ? "bg-[#3B82F6] text-white border-[#3B82F6]" 
          : "hover:border-[#3B82F6] hover:text-[#3B82F6] hover:shadow-md hover:shadow-blue-50"
      )}
    >
      <div className={cn("transition-transform duration-300", !isLoading && "group-hover:scale-110")}>
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : icon}
      </div>
      <span className="text-[10px] uppercase font-mono tracking-wider text-center leading-tight font-semibold">
        {label}
      </span>
      {isLoading && (
        <motion.div 
          className="absolute bottom-0 left-0 h-[3px] bg-white/30"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </button>
  );
}
