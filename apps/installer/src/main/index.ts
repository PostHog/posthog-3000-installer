import { app, BrowserWindow, ipcMain } from "electron"
import { join } from "path"
import { readdirSync, statSync, existsSync } from "fs"
import { execSync } from "child_process"

let mainWindow: BrowserWindow | null

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: true,
    frame: true, // Keep OS frame for cross-platform compatibility
    backgroundColor: "#c0c0c0", // Windows 98 gray
    title: "PostHog 3000 Setup",
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  // Load the index.html of the app
  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:5173")
    // mainWindow.webContents.openDevTools() // Uncomment for debugging
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"))
  }

  // Prevent navigation away from app
  mainWindow.webContents.on("will-navigate", (event) => {
    event.preventDefault()
  })

  mainWindow.on("closed", () => {
    mainWindow = null
  })
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow()

  app.on("activate", () => {
    // On macOS, re-create window when dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// Quit when all windows are closed (except on macOS)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

// DVD Detection Types
interface DVDDrive {
  path: string
  name: string
  isOptical: boolean
}

interface DVDCheckResult {
  success: boolean
  drives: DVDDrive[]
  error?: string
}

interface FileCheckResult {
  exists: boolean
  drivePath?: string
  filePath?: string
  error?: string
}

// Detect optical drives on macOS
function detectOpticalDrivesMac(): DVDDrive[] {
  const drives: DVDDrive[] = []

  try {
    // On macOS, mounted volumes are in /Volumes
    const volumesPath = "/Volumes"
    const volumes = readdirSync(volumesPath)

    for (const volume of volumes) {
      const volumePath = join(volumesPath, volume)

      try {
        // Use diskutil to check if it's an optical drive
        const diskutilOutput = execSync(`diskutil info "${volumePath}" 2>/dev/null || true`, {
          encoding: "utf-8",
          timeout: 5000
        })

        // Check if it's optical media (CD/DVD)
        const isOptical = diskutilOutput.includes("CD-ROM") ||
                         diskutilOutput.includes("DVD") ||
                         diskutilOutput.includes("Optical") ||
                         diskutilOutput.includes("BD-ROM")

        // Also check protocol type for optical
        const protocolMatch = diskutilOutput.match(/Protocol:\s+(.+)/)
        const isOpticalProtocol = protocolMatch &&
          (protocolMatch[1].includes("Optical") || protocolMatch[1].includes("ATAPI"))

        if (isOptical || isOpticalProtocol) {
          drives.push({
            path: volumePath,
            name: volume,
            isOptical: true
          })
        }
      } catch {
        // If diskutil fails, just skip this volume
      }
    }

    // If no optical drives found via diskutil, check for any non-system volumes
    // that might be DVDs (fallback for testing)
    if (drives.length === 0) {
      for (const volume of volumes) {
        // Skip system volumes
        if (volume === "Macintosh HD" || volume.startsWith(".")) continue

        const volumePath = join(volumesPath, volume)
        try {
          const stat = statSync(volumePath)
          if (stat.isDirectory()) {
            // Check if it looks like a DVD (has typical DVD structure or our marker file)
            const hasPosthogFile = existsSync(join(volumePath, "posthog_dvd.png"))
            if (hasPosthogFile) {
              drives.push({
                path: volumePath,
                name: volume,
                isOptical: true // Treat as optical if it has our marker
              })
            }
          }
        } catch {
          // Skip inaccessible volumes
        }
      }
    }
  } catch (error) {
    console.error("Error detecting optical drives:", error)
  }

  return drives
}

// Get all mounted volumes (for manual selection)
function getAllMountedVolumes(): DVDDrive[] {
  const drives: DVDDrive[] = []

  try {
    const volumesPath = "/Volumes"
    const volumes = readdirSync(volumesPath)

    for (const volume of volumes) {
      if (volume.startsWith(".")) continue // Skip hidden

      const volumePath = join(volumesPath, volume)
      try {
        const stat = statSync(volumePath)
        if (stat.isDirectory()) {
          drives.push({
            path: volumePath,
            name: volume,
            isOptical: false // Will be determined by actual check
          })
        }
      } catch {
        // Skip inaccessible
      }
    }
  } catch (error) {
    console.error("Error listing volumes:", error)
  }

  return drives
}

// IPC Handlers for DVD detection
ipcMain.handle("detect-dvd-drives", async (): Promise<DVDCheckResult> => {
  try {
    if (process.platform === "darwin") {
      const drives = detectOpticalDrivesMac()
      return { success: true, drives }
    } else {
      // For now, only macOS is supported
      return {
        success: false,
        drives: [],
        error: "DVD detection is currently only supported on macOS"
      }
    }
  } catch (error) {
    return {
      success: false,
      drives: [],
      error: `Failed to detect drives: ${error}`
    }
  }
})

ipcMain.handle("get-all-volumes", async (): Promise<DVDCheckResult> => {
  try {
    const drives = getAllMountedVolumes()
    return { success: true, drives }
  } catch (error) {
    return {
      success: false,
      drives: [],
      error: `Failed to list volumes: ${error}`
    }
  }
})

ipcMain.handle("check-dvd-file", async (_event, drivePath: string, fileName: string): Promise<FileCheckResult> => {
  try {
    const filePath = join(drivePath, fileName)
    const exists = existsSync(filePath)

    return {
      exists,
      drivePath,
      filePath: exists ? filePath : undefined
    }
  } catch (error) {
    return {
      exists: false,
      error: `Failed to check file: ${error}`
    }
  }
})
