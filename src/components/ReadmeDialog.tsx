import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ReadmeDialog() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="no-drag text-text-secondary hover:text-text-primary text-sm font-medium px-2 py-1 transition-colors">
          ReadMe
        </button>
      </Dialog.Trigger>
      
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-45%" }}
                animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
                exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-45%" }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed z-50 left-[50%] top-[50%] w-[90vw] max-h-[85vh] max-w-xl bg-[#151515] rounded-xl border border-border-subtle shadow-ambient p-5 flex flex-col no-drag focus:outline-none"
              >
                <div className="flex justify-between items-center mb-3 shrink-0">
                  <Dialog.Title className="text-base font-bold text-text-primary">
                    SuperCopy ©️2025 KisaragiIchigo
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button className="text-text-secondary hover:text-action-danger transition-colors p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-border-focus">
                      <X size={18} />
                    </button>
                  </Dialog.Close>
                </div>
                
                <div className="bg-[#222] p-4 rounded-lg text-text-secondary text-sm leading-relaxed max-h-[60vh] overflow-y-auto">
                  <h3 className="text-text-primary font-bold mb-2">概要</h3>
                  <ul className="list-disc pl-5 mb-4 space-y-1">
                    <li>クリップボードを監視して履歴を自動収集</li>
                    <li>履歴一覧のみでシンプル操作</li>
                    <li>改行コードが含まれていても自動で1行に整形</li>
                    <li>「一括コピー」でリスト全体をコピー</li>
                  </ul>
                  <p className="text-xs text-text-muted mt-4 pt-4 border-t border-border-subtle">
                    Remade with ❤️ using React + Electron
                  </p>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
