"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('api', {
    onClipboardChanged: (callback) => {
        const handler = (_event, text) => callback(text);
        electron_1.ipcRenderer.on('clipboard-changed', handler);
        return () => {
            electron_1.ipcRenderer.removeListener('clipboard-changed', handler);
        };
    },
    onWindowMaximized: (callback) => {
        const handler = (_event, isMaximized) => callback(isMaximized);
        electron_1.ipcRenderer.on('window-maximized', handler);
        return () => {
            electron_1.ipcRenderer.removeListener('window-maximized', handler);
        };
    },
    windowMin: () => electron_1.ipcRenderer.send('window-min'),
    windowMax: () => electron_1.ipcRenderer.send('window-max'),
    windowClose: () => electron_1.ipcRenderer.send('window-close'),
    copyText: (text) => electron_1.ipcRenderer.send('copy-text', text),
    getIsMaximized: () => electron_1.ipcRenderer.invoke('is-maximized'),
});
