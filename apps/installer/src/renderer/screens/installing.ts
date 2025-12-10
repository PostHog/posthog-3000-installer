import { advanceFromInstalling } from "../main"
import type { Screen, InstallerState } from "../../types"

const FAKE_FILES: string[] = [
  "posthog-core.dll",
  "analytics-engine.exe",
  "event-processor.sys",
  "session-replay.ocx",
  "replay-player.dll",
  "feature-flags.exe",
  "flag-evaluator.dll",
  "hedgehog-icon.ico",
  "posthog3000-demo.exe",
  "readme.txt",
  "license.txt",
]

const INSTALL_PATH = "C:\\Program Files\\PostHog3000"

export const installingScreen: Screen = {
  render(): HTMLElement {
    const screen = document.createElement("div")
    screen.className = "screen installing-screen"
    screen.innerHTML = `
      <h2>Installing PostHog 3000 Demo</h2>

      <p>Please wait while Setup installs the PostHog 3000 Demo on your computer.</p>

      <div class="progress-container">
        <div class="progress-label">Installation Progress:</div>
        <progress id="install-progress" max="100" value="0"></progress>
      </div>

      <div class="file-list" id="file-list">
        <div style="color: #808080;">Preparing installation...</div>
      </div>

      <div class="status-text" id="status-text">
        Initializing setup routines...
      </div>
    `
    return screen
  },

  setupListeners(state: InstallerState, _updateNav: () => void): void {
    // Start the fake installation process
    setTimeout(() => {
      startFakeInstallation(state)
    }, 500)
  },

  canProceed(state: InstallerState): boolean {
    return state.installComplete
  },
}

function startFakeInstallation(state: InstallerState): void {
  const progressBar = document.getElementById(
    "install-progress"
  ) as HTMLProgressElement
  const fileList = document.getElementById("file-list")!
  const statusText = document.getElementById("status-text")!

  let currentFile = 0

  const statuses: string[] = [
    "Extracting files...",
    "Copying files to destination...",
    "Registering COM components...",
    "Creating program shortcuts...",
    "Configuring PostHog 3000 Demo...",
    "Finalizing installation...",
  ]

  let statusIndex = 0

  fileList.innerHTML = ""

  const interval = setInterval(() => {
    if (currentFile < FAKE_FILES.length) {
      // Add file to list
      const fileItem = document.createElement("div")
      fileItem.className = "file-item"

      const actions: string[] = [
        "Extracting:",
        "Copying:",
        "Installing:",
        "Registering:",
      ]
      const action = actions[Math.floor(Math.random() * actions.length)]

      fileItem.textContent = `${action} ${INSTALL_PATH}\\${FAKE_FILES[currentFile]}`
      fileList.appendChild(fileItem)

      // Scroll to bottom
      fileList.scrollTop = fileList.scrollHeight

      // Update progress
      const progress = Math.floor(((currentFile + 1) / FAKE_FILES.length) * 100)
      progressBar.value = progress

      // Update status occasionally
      if (currentFile % 2 === 0 && statusIndex < statuses.length) {
        statusText.textContent = statuses[statusIndex]
        statusIndex++
      }

      currentFile++
    } else {
      // Installation complete
      clearInterval(interval)

      statusText.textContent = "Installation complete!"

      const completeItem = document.createElement("div")
      completeItem.className = "file-item"
      completeItem.style.color = "#008000"
      completeItem.style.fontWeight = "bold"
      completeItem.textContent = "Setup completed successfully."
      fileList.appendChild(completeItem)

      fileList.scrollTop = fileList.scrollHeight

      state.installComplete = true

      // Auto-advance to finish screen after a short delay
      setTimeout(advanceFromInstalling, 1500)
    }
  }, 200) // Install a file every 200ms
}
