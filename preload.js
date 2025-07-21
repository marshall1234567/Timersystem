const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods to renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  getAnalysis: () => ipcRenderer.invoke('get-analysis'),
  updateData: (data) => ipcRenderer.invoke('update-data', data),
  getTimerAnalysis: () => ipcRenderer.invoke('get-timer-analysis'),
  getTimerUsageData: () => ipcRenderer.invoke('get-timer-usage-data')
});
