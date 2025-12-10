// Logs viewer main script
import "98.css"
import "./styles.css"

interface LogEntry {
  timestamp: string
  type: "stdout" | "stderr" | "system"
  message: string
}

let logCount = 0

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init)
} else {
  init()
}

function init(): void {
  const closeBtn = document.getElementById("close-btn")
  const clearBtn = document.getElementById("clear-btn")
  const scrollBtn = document.getElementById("scroll-btn")
  const logsOutput = document.getElementById("logs-output")
  const logCountEl = document.getElementById("log-count")
  const stackStatus = document.getElementById("stack-status")

  // Close window
  closeBtn?.addEventListener("click", () => {
    window.close()
  })

  // Clear logs
  clearBtn?.addEventListener("click", async () => {
    await window.launcherAPI.clearLogs()
    if (logsOutput) logsOutput.innerHTML = ""
    logCount = 0
    updateLogCount()
  })

  // Scroll to bottom
  scrollBtn?.addEventListener("click", () => {
    scrollToBottom()
  })

  // Load existing logs
  loadLogs()

  // Update stack status
  updateStackStatus()

  // Listen for new log entries
  window.launcherAPI.onLogEntry((entry) => {
    appendLogEntry(entry)
  })

  // Poll for stack status updates
  setInterval(updateStackStatus, 2000)

  async function loadLogs(): Promise<void> {
    const logs = await window.launcherAPI.getLogs()
    logCount = logs.length

    if (logsOutput) {
      logsOutput.innerHTML = ""
      logs.forEach((entry) => {
        appendLogEntry(entry, false)
      })
      scrollToBottom()
    }

    updateLogCount()
  }

  async function updateStackStatus(): Promise<void> {
    const state = await window.launcherAPI.getStackState()
    if (stackStatus) {
      const statusMap: Record<string, string> = {
        stopped: "⚫ Stopped",
        starting: "🟡 Starting...",
        running: "🟢 Running",
        stopping: "🟡 Stopping...",
      }
      stackStatus.textContent = statusMap[state] || state
    }
  }

  function appendLogEntry(entry: LogEntry, autoScroll = true): void {
    if (!logsOutput) return

    const line = document.createElement("div")
    line.className = `log-line log-${entry.type}`

    const timestamp = new Date(entry.timestamp)
    const timeStr = timestamp.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })

    const typeLabel = {
      stdout: "OUT",
      stderr: "ERR",
      system: "SYS",
    }[entry.type]

    line.innerHTML = `<span class="log-time">[${timeStr}]</span> <span class="log-type">[${typeLabel}]</span> <span class="log-message">${escapeHtml(entry.message)}</span>`

    logsOutput.appendChild(line)
    logCount++
    updateLogCount()

    if (autoScroll) {
      scrollToBottom()
    }
  }

  function scrollToBottom(): void {
    const container = document.querySelector(".logs-output-container")
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }

  function updateLogCount(): void {
    if (logCountEl) {
      logCountEl.textContent = `${logCount} ${logCount === 1 ? "entry" : "entries"}`
    }
  }

  function escapeHtml(text: string): string {
    const div = document.createElement("div")
    div.textContent = text
    return div.innerHTML
  }
}

