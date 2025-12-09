import { contextBridge, ipcRenderer } from 'electron'
import type { ElectronAPI, DVDCheckResult, FileCheckResult } from '../types/electron'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
const electronAPI: ElectronAPI = {
  platform: process.platform,
  version: '98.0.1998',

  // DVD Detection methods
  detectDVDDrives: (): Promise<DVDCheckResult> => {
    return ipcRenderer.invoke('detect-dvd-drives')
  },

  getAllVolumes: (): Promise<DVDCheckResult> => {
    return ipcRenderer.invoke('get-all-volumes')
  },

  checkDVDFile: (drivePath: string, fileName: string): Promise<FileCheckResult> => {
    return ipcRenderer.invoke('check-dvd-file', drivePath, fileName)
  }
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)
