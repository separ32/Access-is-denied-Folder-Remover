import React, { useState, useEffect } from 'react';
import { ScriptType, AnalysisResult, Language } from './types';
import { generateCleanupScript, generateRegistryFile } from './utils/generators';
import { analyzePathSafety } from './services/geminiService';
import { CodeBlock } from './components/CodeBlock';
import { SafetyBadge } from './components/SafetyBadge';
import { translations } from './utils/translations';
import { Trash2, Download, AlertOctagon, Terminal, MousePointer2, Languages, HelpCircle, X } from 'lucide-react';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [path, setPath] = useState<string>('C:\\scratchdir');
  const [scriptType, setScriptType] = useState<ScriptType>(ScriptType.POWERSHELL);
  const [generatedScript, setGeneratedScript] = useState<string>('');
  const [regContent, setRegContent] = useState<string>('');
  const [showGuide, setShowGuide] = useState(false);
  
  // AI Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const t = translations[lang];

  useEffect(() => {
    // Update document direction and language
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    document.body.dir = lang === 'fa' ? 'rtl' : 'ltr';
  }, [lang]);

  useEffect(() => {
    setGeneratedScript(generateCleanupScript(path, scriptType));
    setRegContent(generateRegistryFile(path)); // For registry preview
  }, [path, scriptType]);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    const result = await analyzePathSafety(path, lang);
    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'fa' : 'en');
  };

  const downloadFile = (filename: string, content: string, mimeType: string) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: mimeType });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto pb-20">
      
      {/* Header */}
      <header className="mb-10 text-center space-y-4 relative">
        <div className="absolute top-0 w-full flex justify-between px-2 md:px-0">
          <button 
             onClick={() => setShowGuide(true)}
             className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-900/50 text-emerald-400 hover:bg-emerald-900 hover:text-emerald-300 text-sm font-medium transition-colors border border-emerald-800"
          >
            <HelpCircle size={16} />
            {t.btn_guide}
          </button>

          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-sm font-medium transition-colors"
          >
            <Languages size={16} />
            {t.lang_toggle}
          </button>
        </div>

        <div className="inline-flex items-center justify-center p-4 bg-slate-800 rounded-full ring-1 ring-slate-700 shadow-2xl mb-2 mt-12 md:mt-4">
          <Trash2 className="w-8 h-8 text-red-500 mx-3" />
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Force<span className="text-red-500">Delete</span> Assistant
          </h1>
        </div>
        <p className="text-slate-400 max-w-xl mx-auto leading-relaxed px-4">
          {lang === 'fa' ? (
            <>
              ابزاری برای تولید کدهای حذف اجباری فایل‌ها و پوشه‌های قفل شده در ویندوز.
              این ابزار دستورات <code className="bg-slate-800 px-1 rounded text-cyan-400">takeown</code> و <code className="bg-slate-800 px-1 rounded text-cyan-400">icacls</code> را ترکیب می‌کند.
            </>
          ) : (
            <>
              A utility to generate Windows scripts and registry keys for forcing deletion of locked files and folders.
              Combines <code className="bg-slate-800 px-1 rounded text-cyan-400">takeown</code> and <code className="bg-slate-800 px-1 rounded text-cyan-400">icacls</code>.
            </>
          )}
        </p>
      </header>

      {/* Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowGuide(false)}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowGuide(false)} className="absolute top-4 ltr:right-4 rtl:left-4 text-slate-400 hover:text-white">
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <HelpCircle className="text-emerald-500" />
              {t.guide_title}
            </h2>
            <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
              <div className="bg-slate-800 p-4 rounded-lg">
                <ol className="list-decimal ltr:pl-5 rtl:pr-5 space-y-2">
                  <li>{t.guide_step1}</li>
                  <li>{t.guide_step2}</li>
                </ol>
              </div>
              
              <h3 className="font-bold text-white pt-2">{t.guide_reg_title}</h3>
              <div className="bg-indigo-900/20 border border-indigo-500/20 p-4 rounded-lg">
                <ol className="list-decimal ltr:pl-5 rtl:pr-5 space-y-2">
                  <li>{t.guide_reg_step1}</li>
                  <li>{t.guide_reg_step2}</li>
                  <li>{t.guide_reg_step3}</li>
                  <li>{t.guide_reg_step4}</li>
                  <li className="font-semibold text-indigo-300">{t.guide_reg_step5}</li>
                </ol>
              </div>
            </div>
            <button 
              onClick={() => setShowGuide(false)}
              className="mt-6 w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Input & Configuration */}
        <div className="space-y-6">
          
          {/* Path Input Section */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {t.pathLabel}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                dir="ltr"
                value={path}
                onChange={(e) => setPath(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-mono text-sm"
                placeholder={t.pathPlaceholder}
              />
            </div>
            
            {/* Safety Check Button */}
            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !path}
                className="text-sm flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                <AlertOctagon size={16} />
                {t.analyzeBtn}
              </button>
            </div>
            
            <SafetyBadge 
              result={analysisResult} 
              loading={isAnalyzing}
              labels={{
                analyzing: t.safety_analyzing,
                safeTitle: t.safety_safe,
                mediumTitle: t.safety_medium,
                highTitle: t.safety_high
              }}
            />
          </div>

          {/* Script Type Selection */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Terminal size={20} className="text-emerald-400" />
              {t.scriptType}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setScriptType(ScriptType.POWERSHELL)}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  scriptType === ScriptType.POWERSHELL
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                }`}
              >
                <span className="font-bold">PowerShell (.ps1)</span>
                <span className="text-xs opacity-70">{t.powershellDesc}</span>
              </button>
              <button
                onClick={() => setScriptType(ScriptType.BATCH)}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  scriptType === ScriptType.BATCH
                    ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                }`}
              >
                <span className="font-bold">Batch (.bat)</span>
                <span className="text-xs opacity-70">{t.batchDesc}</span>
              </button>
            </div>
          </div>

          {/* Download Action */}
          <button
            onClick={() => downloadFile(
              scriptType === ScriptType.POWERSHELL ? 'ForceDelete.ps1' : 'ForceDelete.bat',
              generatedScript,
              'text/plain'
            )}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-3 transition-all active:scale-95"
          >
            <Download size={20} />
            {t.downloadScript}
          </button>

        </div>

        {/* Right Column: Previews & Context Menu */}
        <div className="space-y-6">
          
          {/* Script Preview */}
          <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-1">
             <CodeBlock 
               title={`${t.preview}: ${scriptType === ScriptType.POWERSHELL ? "POWERSHELL" : "BATCH"}`} 
               code={generatedScript}
               copyLabel={t.copy}
               copiedLabel={t.copied}
             />
          </div>

          {/* Context Menu Generator */}
          <div className="bg-slate-800/80 border border-slate-600 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 ltr:left-0 rtl:right-0 w-1 h-full bg-indigo-500"></div>
            
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <MousePointer2 className="text-indigo-400" />
              {t.addToContextMenu}
            </h3>
            
            <p className="text-slate-300 text-sm mb-4 leading-relaxed">
              {t.contextMenuDesc}
            </p>

            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4 mb-4">
              <p className="text-xs text-indigo-300 mb-1">{t.registryGenerated}</p>
              <div className="font-mono text-xs text-indigo-200 opacity-70 truncate" dir="ltr">
                [HKEY_CLASSES_ROOT\*\shell\ForceDelete\command] ...
              </div>
            </div>

            <button 
              onClick={() => downloadFile('AddContextMenu.reg', regContent, 'text/plain')}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Download size={18} />
              {t.downloadReg}
            </button>
            
            <p className="text-xs text-slate-500 mt-3 text-center">
              {t.regNote}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;