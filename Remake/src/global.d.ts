export interface ElectronAPI {
  onClipboardChanged: (callback: (text: string) => void) => () => void;
  onWindowMaximized: (callback: (isMaximized: boolean) => void) => () => void;
  windowMin: () => void;
  windowMax: () => void;
  windowClose: () => void;
  copyText: (text: string) => void;
  getIsMaximized: () => Promise<boolean>;
}

declare global {
  interface Window {
    api: ElectronAPI;
  }
}
