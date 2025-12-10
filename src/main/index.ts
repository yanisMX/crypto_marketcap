import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { CryptoService } from './service/cryptoService';

const cryptoService = new CryptoService();
let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // En développement
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // En production
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Gestionnaires IPC
ipcMain.handle('crypto:getListings', async (event, limit?: number) => {
  return await cryptoService.getLatestListings(limit);
});

ipcMain.handle('crypto:getQuotes', async (event, symbols: string[]) => {
  return await cryptoService.getCryptoQuote(symbols);
});

// Événements de cycle de vie de l'application
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
