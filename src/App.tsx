import { useEffect, useState } from 'react';
import { Minus, Square, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClipboardStore } from './hooks/useClipboardStore';
import { ReadmeDialog } from './components/ReadmeDialog';
import { twMerge } from 'tailwind-merge';

function App() {
  const { history, clear, copyAll } = useClipboardStore();
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    if (window.api) {
      window.api.getIsMaximized().then(setIsMaximized).catch(console.error);
      const cleanup = window.api.onWindowMaximized(setIsMaximized);
      return cleanup;
    } else {
      console.error("window.api is undefined! Preload script might have failed.");
    }
  }, []);

  return (
    <div className={twMerge(
      "flex flex-col h-screen w-screen overflow-hidden transition-colors duration-300",
      !isMaximized 
        ? "bg-background-acrylic backdrop-blur-md border border-action-primary/30 rounded-2xl shadow-glow" 
        : "bg-background-base rounded-none"
    )}>
      {/* Title Bar */}
      <div className="drag-region flex items-center justify-between px-4 py-2 border-b border-border-subtle bg-black/20">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-bold text-text-primary">SuperCopy</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <ReadmeDialog />
          <button 
            onClick={() => window.api.windowMin()} 
            className="no-drag p-1.5 text-[#FFD600] hover:bg-white/10 rounded-md transition-colors"
          >
            <Minus size={16} />
          </button>
          <button 
            onClick={() => window.api.windowMax()} 
            className="no-drag p-1.5 text-[#00C853] hover:bg-white/10 rounded-md transition-colors"
          >
            <Square size={14} />
          </button>
          <button 
            onClick={() => window.api.windowClose()} 
            className="no-drag p-1.5 text-[#FF0000] hover:bg-action-danger/20 rounded-md transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-4 overflow-hidden gap-3">
        <div className="text-xs font-medium text-text-muted">履歴一覧</div>
        
        <div className="flex-1 bg-white/95 rounded-lg border border-gray-400 overflow-y-auto p-1 shadow-inner">
          <ul className="flex flex-col gap-1">
            <AnimatePresence initial={false}>
              {history.map((text, idx) => (
                <motion.li
                  key={`${text}-${idx}`}
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  className="px-3 py-2 text-sm text-black bg-white rounded hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-colors cursor-default truncate"
                  title={text}
                >
                  {text}
                </motion.li>
              ))}
              {history.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="p-4 text-center text-gray-400 text-sm"
                >
                  コピー履歴はありません
                </motion.div>
              )}
            </AnimatePresence>
          </ul>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-2 mt-2">
          <button
            onClick={copyAll}
            className="flex-1 bg-action-primary hover:bg-action-hover text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-action-primary focus:ring-offset-2 focus:ring-offset-background-base"
          >
            一括コピー
          </button>
          <button
            onClick={clear}
            className="flex-1 bg-white/10 hover:bg-white/20 text-text-primary font-medium py-2 px-4 rounded-lg transition-colors border border-border-subtle focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            クリア
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
