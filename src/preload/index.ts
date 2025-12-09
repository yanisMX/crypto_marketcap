import { contextBridge, ipcRenderer } from 'electron';

export type CryptoAPI = {
  getListings: (limit?: number) => Promise<any>;
  getQuotes: (symbols: string[]) => Promise<any>;
};

const cryptoAPI: CryptoAPI = {
  getListings: (limit?: number) => ipcRenderer.invoke('crypto:getListings', limit),
  getQuotes: (symbols: string[]) => ipcRenderer.invoke('crypto:getQuotes', symbols)
};

contextBridge.exposeInMainWorld('cryptoAPI', cryptoAPI);
