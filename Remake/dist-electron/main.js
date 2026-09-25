"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = require("path");
let mainWindow = null;
let clipboardInterval = null;
let lastClipboardText = '';
const createWindow = () => {
    const iconPath = electron_1.app.isPackaged
        ? path.join(__dirname, '../dist/supercopy.ico')
        : path.join(__dirname, '../public/supercopy.ico');
    const windowOptions = {
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
    mainWindow = new electron_1.BrowserWindow(windowOptions);
    if (electron_1.app.isPackaged) {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }
    else {
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
electron_1.app.whenReady().then(() => {
    createWindow();
    // クリップボードポーリング
    clipboardInterval = setInterval(() => {
        const currentText = electron_1.clipboard.readText();
        // 前回のテキストと異なる場合のみ送信
        if (currentText && currentText !== lastClipboardText) {
            lastClipboardText = currentText;
            if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.webContents.send('clipboard-changed', currentText);
            }
        }
    }, 500);
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('will-quit', () => {
    if (clipboardInterval)
        clearInterval(clipboardInterval);
});
// --- IPC ハンドラー ---
electron_1.ipcMain.on('window-min', () => mainWindow?.minimize());
electron_1.ipcMain.on('window-max', () => {
    if (!mainWindow)
        return;
    if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
    }
    else {
        mainWindow.maximize();
    }
});
electron_1.ipcMain.on('window-close', () => mainWindow?.close());
electron_1.ipcMain.on('copy-text', (_, text) => {
    electron_1.clipboard.writeText(text);
    lastClipboardText = text; // 自信で書き込んだものはポーリングスキップ用にする
});
electron_1.ipcMain.handle('is-maximized', () => {
    return mainWindow?.isMaximized() || false;
});
