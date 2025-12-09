// Electron API type definitions

export interface DVDDrive {
  path: string
  name: string
  isOptical: boolean
}

export interface DVDCheckResult {
  success: boolean
  drives: DVDDrive[]
  error?: string
}

export interface FileCheckResult {
  exists: boolean
  drivePath?: string
  filePath?: string
  error?: string
}

export interface ElectronAPI {
  platform: NodeJS.Platform
  version: string

  // DVD Detection methods
  detectDVDDrives: () => Promise<DVDCheckResult>
  getAllVolumes: () => Promise<DVDCheckResult>
  checkDVDFile: (drivePath: string, fileName: string) => Promise<FileCheckResult>
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI
  }
}

export {}
