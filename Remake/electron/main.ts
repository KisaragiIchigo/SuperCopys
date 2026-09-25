import { app, BrowserWindow, ipcMain, clipboard } from 'electron';
import * as path from 'path';

let mainWindow: BrowserWindow | null = null;
let clipboardInterval: NodeJS.Timeout | null = null;
let lastClipboardText = '';

const createWindow = () => {
  const iconPath = app.isPackaged 
    ? path.join(__dirname, '../dist/supercopy.ico') 
    : path.join(__dirname, '../public/supercopy.ico');

  const windowOptions: any = {
    width: 700,
    height: 300,
    minWidth: 50,
    minHeight: 50,
    frame: false,
    transparent: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  };

  const fs = require('fs');
  if (fs.existsSync(iconPath)) {
    windowOptions.icon = iconPath;
  }

  mainWindow = new BrowserWindow(windowOptions);

  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  } else {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  
  // 最大化状態の変更をRendererに通知
  mainWindow.on('maximize', () => mainWindow?.webContents.send('window-maximized', true));
  mainWindow.on('unmaximize', () => mainWindow?.webContents.send('window-maximized', false));
};

app.whenReady().then(() => {
  createWindow();

  // クリップボードポーリング
  clipboardInterval = setInterval(() => {
    const currentText = clipboard.readText();
    // 前回のテキストと異なる場合のみ送信
    if (currentText && currentText !== lastClipboardText) {
      lastClipboardText = currentText;
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('clipboard-changed', currentText);
      }
    }
  }, 500);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  if (clipboardInterval) clearInterval(clipboardInterval);
});

// --- IPC ハンドラー ---

ipcMain.on('window-min', () => mainWindow?.minimize());
ipcMain.on('window-max', () => {
  if (!mainWindow) return;
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});
ipcMain.on('window-close', () => mainWindow?.close());

ipcMain.on('copy-text', (_, text: string) => {
  clipboard.writeText(text);
  lastClipboardText = text; // 自信で書き込んだものはポーリングスキップ用にする
});

ipcMain.handle('is-maximized', () => {
  return mainWindow?.isMaximized() || false;
});
