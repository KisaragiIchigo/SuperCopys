import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  onClipboardChanged: (callback: (text: string) => void) => {
    const handler = (_event: any, text: string) => callback(text);
    ipcRenderer.on('clipboard-changed', handler);
    return () => {
      ipcRenderer.removeListener('clipboard-changed', handler);
    };
  },
  onWindowMaximized: (callback: (isMaximized: boolean) => void) => {
    const handler = (_event: any, isMaximized: boolean) => callback(isMaximized);
    ipcRenderer.on('window-maximized', handler);
    return () => {
      ipcRenderer.removeListener('window-maximized', handler);
    };
  },
  windowMin: () => ipcRenderer.send('window-min'),
  windowMax: () => ipcRenderer.send('window-max'),
  windowClose: () => ipcRenderer.send('window-close'),
  copyText: (text: string) => ipcRenderer.send('copy-text', text),
  getIsMaximized: () => ipcRenderer.invoke('is-maximized'),
});
