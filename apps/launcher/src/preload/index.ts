// Preload script for PostHog 3000 Launcher
// Exposes safe APIs to renderer process

import { contextBridge, ipcRenderer } from "electron"

// Log entry type
interface LogEntry {
  timestamp: string
  type: "stdout" | "stderr" | "system"
  message: string
}

// Expose minimal API for About window and Logs viewer
contextBridge.exposeInMainWorld("launcherAPI", {
  platform: process.platform,
  version: "98.0.1998",
  closeWindow: () => {
    window.close()
  },
  // Logs API
  getLogs: (): Promise<LogEntry[]> => ipcRenderer.invoke("get-logs"),
  clearLogs: (): Promise<boolean> => ipcRenderer.invoke("clear-logs"),
  getStackState: (): Promise<string> => ipcRenderer.invoke("get-stack-state"),
  onLogEntry: (callback: (entry: LogEntry) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, entry: LogEntry) => {
      callback(entry)
    }
    ipcRenderer.on("log-entry", handler)
    // Return cleanup function
    return () => {
      ipcRenderer.removeListener("log-entry", handler)
    }
  },
})

// Type declaration for TypeScript
declare global {
  interface Window {
    launcherAPI: {
      platform: NodeJS.Platform
      version: string
      closeWindow: () => void
      getLogs: () => Promise<LogEntry[]>
      clearLogs: () => Promise<boolean>
      getStackState: () => Promise<string>
      onLogEntry: (callback: (entry: LogEntry) => void) => () => void
    }
  }
}
