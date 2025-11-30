import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { GlassCard } from './components/GlassCard';
import { ModelType, OutputType, BusinessFormData, HistoryItem } from './types';
import { generateMarketingContent } from './services/geminiService';
import { MarkdownRenderer } from './components/MarkdownRenderer';

// Icons
const Spinner = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const App: React.FC = () => {
  // Global State
  const [apiKey, setApiKey] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<ModelType>(ModelType.GEMINI_2_5_FLASH);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Form State
  const [formData, setFormData] = useState<BusinessFormData>({
    businessName: '',
    industry: '',
    products: '',
    targetAudience: '',
    painPoints: '',
    goals: '',
    competitors: '',
    usp: '',
    marketingDetails: '',
    selectedOutput: OutputType.PERSONAS
  });

  // Load History from LocalStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('mobius_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history");
      }
    }
  }, []);

  // Save History Helper
  const saveToHistory = (content: string, data: BusinessFormData) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      formData: { ...data },
      content,
      model: selectedModel
    };
    const updated = [newItem, ...history];
    setHistory(updated);
    localStorage.setItem('mobius_history', JSON.stringify(updated));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    if (!apiKey) {
      alert("Please enter your Google GenAI API Key.");
      return;
    }

    setIsLoading(true);
    setGeneratedContent(null);

    try {
      const content = await generateMarketingContent(apiKey, selectedModel, formData);
      setGeneratedContent(content);
      saveToHistory(content, formData);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (format: 'txt' | 'md') => {
    if (!generatedContent) return;
    const blob = new Blob([generatedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MobiusPrime_Output_${Date.now()}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent);
      alert("Copied to clipboard!");
    }
  };

  const loadHistoryItem = (item: HistoryItem) => {
    setFormData(item.formData);
    setGeneratedContent(item.content);
    setShowHistory(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper for input fields
  const InputGroup = ({ label, name, placeholder, textarea = false }: { label: string, name: keyof BusinessFormData, placeholder: string, textarea?: boolean }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-purple-200 mb-1">{label}</label>
      {textarea ? (
        <textarea
          name={name}
          value={formData[name]}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 h-24 transition-all resize-y placeholder-gray-500"
        />
      ) : (
        <input
          type="text"
          name={name}
          value={formData[name]}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder-gray-500"
        />
      )}
      <div className="text-right mt-1">
        <button 
          onClick={() => setFormData(prev => ({ ...prev, [name]: 'AI to answer' }))}
          className="text-xs text-teal-400 hover:text-teal-300 underline cursor-pointer"
        >
          Use AI to answer
        </button>
      </div>
    </div>
  );

  return (
    <Layout>
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-teal-400">
            MobiusPrime
          </h1>
          <p className="text-gray-400 mt-1">Your AI Powered Marketing TeamMate</p>
        </div>
        <div className="flex gap-4 items-center">
             <button 
            onClick={() => setShowHistory(true)}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/20 hover:bg-white/10 transition text-sm"
          >
            History
          </button>
          <div className="flex flex-col items-end gap-2">
            <input
              type="password"
              placeholder="Enter Gemini API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-black/30 border border-white/10 rounded px-3 py-1.5 text-sm w-48 focus:border-teal-500 outline-none"
            />
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as ModelType)}
              className="bg-black/30 border border-white/10 rounded px-3 py-1.5 text-sm w-48 focus:border-teal-500 outline-none"
            >
              <option value={ModelType.GEMINI_2_5_FLASH}>Gemini 2.5 Flash</option>
              <option value={ModelType.GEMINI_2_5_PRO}>Gemini 2.5 Pro</option>
              <option value={ModelType.GEMINI_3_PRO}>Gemini 3.0 Pro</option>
            </select>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: Questionnaire */}
        <div className="lg:col-span-5 space-y-6">
          <GlassCard>
            <h2 className="text-xl font-semibold mb-6 border-b border-white/10 pb-2">Business Profile</h2>
            
            <InputGroup label="1. Business Name" name="businessName" placeholder="e.g. Karma Kitchen Marrakech" />
            <InputGroup label="2. Type / Industry" name="industry" placeholder="e.g. Gift Economy Restaurant" />
            <InputGroup label="3. Products / Services" name="products" placeholder="e.g. Volunteer driven meals..." textarea />
            <InputGroup label="4. Target Audience" name="targetAudience" placeholder="Who are your ideal customers?" textarea />
            <InputGroup label="5. Customer Pain Points" name="painPoints" placeholder="What keeps them up at night?" textarea />
            <InputGroup label="6. Business Goals" name="goals" placeholder="e.g. 1000 customers in 3 months" />
            <InputGroup label="7. Competitors" name="competitors" placeholder="Local and online competitors" textarea />
            <InputGroup label="8. Unique Selling Proposition" name="usp" placeholder="What makes you remarkable?" textarea />
            <InputGroup label="9. Marketing Details" name="marketingDetails" placeholder="Channels, budget, existing assets..." textarea />
            
            <div className="mt-8 border-t border-white/10 pt-6">
               <label className="block text-sm font-medium text-purple-200 mb-2">What do you need?</label>
               <select 
                  value={formData.selectedOutput}
                  onChange={(e) => setFormData(prev => ({...prev, selectedOutput: e.target.value as OutputType}))}
                  className="w-full bg-purple-900/20 border border-purple-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 mb-6"
               >
                 {Object.values(OutputType).map((opt) => (
                   <option key={opt} value={opt} className="bg-gray-900">{opt}</option>
                 ))}
               </select>

               <button
                onClick={handleGenerate}
                disabled={isLoading}
                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex justify-center items-center transition-all ${
                  isLoading 
                    ? 'bg-gray-600 cursor-not-allowed opacity-70' 
                    : 'bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-500 hover:to-teal-400 hover:scale-[1.02]'
                }`}
               >
                 {isLoading ? <><Spinner /> Generating Strategy...</> : 'Generate with MobiusPrime'}
               </button>
            </div>
          </GlassCard>
        </div>

        {/* Right Col: Output */}
        <div className="lg:col-span-7">
          <GlassCard className="min-h-[800px] flex flex-col">
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
              <h2 className="text-xl font-semibold text-teal-300">
                {generatedContent ? 'Strategic Output' : 'Awaiting Input'}
              </h2>
              {generatedContent && (
                <div className="flex gap-2">
                  <button onClick={copyToClipboard} className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-xs transition">Copy</button>
                  <button onClick={() => handleDownload('txt')} className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-xs transition">Download .txt</button>
                  <button onClick={() => handleDownload('md')} className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-xs transition">Download .md</button>
                </div>
              )}
            </div>

            <div className="flex-grow">
              {generatedContent ? (
                <MarkdownRenderer content={generatedContent} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                    <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                  </div>
                  <p className="text-center max-w-sm">
                    Fill out the business profile on the left and let MobiusPrime generate your differentiated marketing strategy.
                  </p>
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* History Sidebar Overlay */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowHistory(false)}></div>
          <div className="relative w-full max-w-md bg-[#1a2336] h-full shadow-2xl p-6 border-l border-white/10 overflow-y-auto transform transition-transform">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Strategy History</h3>
              <button onClick={() => setShowHistory(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            
            <div className="space-y-4">
              {history.length === 0 && <p className="text-gray-500">No history yet.</p>}
              {history.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => loadHistoryItem(item)}
                  className="p-4 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 hover:border-purple-500/50 transition group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-purple-300">{item.formData.businessName || 'Unnamed Project'}</span>
                    <span className="text-xs text-gray-500">{new Date(item.timestamp).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">{item.formData.selectedOutput}</p>
                  <div className="text-xs text-teal-500/70 group-hover:text-teal-400 transition">
                    Model: {item.model}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </Layout>
  );
};

export default App;
