import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { CryptoService, CryptoServiceError, ListingsResponse, QuotesResponse } from './service/cryptoService'

const cryptoService = new CryptoService()
let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  // En développement
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    // En production
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// Helper function to handle errors in IPC handlers
function handleServiceError(error: unknown): { error: string; originalError?: string } {
  console.error('Service error:', error)

  if (error instanceof CryptoServiceError) {
    return {
      error: error.message,
      originalError: error.originalError?.message
    }
  }

  return {
    error: error instanceof Error ? error.message : 'Unknown error occurred'
  }
}

// Gestionnaires IPC
ipcMain.handle('crypto:getListings', async (event, limit?: number): Promise<ListingsResponse | { error: string; originalError?: string }> => {
  try {
    return await cryptoService.getLatestListings(limit)
  } catch (error) {
    return handleServiceError(error)
  }
})

ipcMain.handle('crypto:getQuotes', async (event, symbols: string[]): Promise<QuotesResponse | { error: string; originalError?: string }> => {
  try {
    return await cryptoService.getCryptoQuote(symbols)
  } catch (error) {
    return handleServiceError(error)
  }
})

// Événements de cycle de vie de l'application
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
