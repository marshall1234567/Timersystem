const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Analysis = require('./Analysis');

// Create analyzer instance
const analyzer = new Analysis();
analyzer.loadData([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load analysis page by default
  win.loadFile('analysis.html');

  // Send initial analysis data to renderer
  win.webContents.on('did-finish-load', () => {
    win.webContents.send('analysis-results', {
      basicStats: analyzer.calculateBasicStats(),
      timeSeries: analyzer.analyzeTimeSeries()
    });
  });
}

// Handle IPC communications
ipcMain.handle('get-timer-analysis', async () => {
  const timerData = await require('./js/timersystem.js').getTimerUsageData();
  analyzer.loadTimerData(timerData);
  return analyzer.analyzeTimerUsage();
});

ipcMain.handle('get-analysis', () => {
  return {
    basicStats: analyzer.calculateBasicStats(),
    timeSeries: analyzer.analyzeTimeSeries()
  };
});

ipcMain.handle('update-data', (event, newData) => {
  analyzer.loadData(newData);
  return {
    basicStats: analyzer.calculateBasicStats(),
    timeSeries: analyzer.analyzeTimeSeries()
  };
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
