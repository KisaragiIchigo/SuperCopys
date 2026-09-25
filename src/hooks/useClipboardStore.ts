import { useState, useCallback, useEffect } from 'react';

export function useClipboardStore() {
  const [history, setHistory] = useState<string[]>([]);
  const [lastItem, setLastItem] = useState<string>('');

  const add = useCallback((rawText: string) => {
    if (!rawText) return;
    
    // バグ修正: 改行文字を取り除き、スペースで連結して1行にする
    const cleanText = rawText.split(/\r?\n/).join(' ').trim();
    if (!cleanText) return;

    setHistory((prev) => {
      // 連続重複や既存重複をスキップ
      if (cleanText === lastItem) return prev;
      if (prev.includes(cleanText)) {
        setLastItem(cleanText);
        return prev;
      }
      setLastItem(cleanText);
      return [...prev, cleanText];
    });
  }, [lastItem]);

  const clear = useCallback(() => {
    setHistory([]);
    setLastItem('');
  }, []);

  const copyAll = useCallback(() => {
    if (history.length === 0) return;
    const textToCopy = history.join('\n');
    window.api.copyText(textToCopy);
  }, [history]);

  useEffect(() => {
    if (window.api) {
      const cleanup = window.api.onClipboardChanged((text) => {
        add(text);
      });
      return cleanup;
    }
  }, [add]);

  return { history, clear, copyAll };
}
