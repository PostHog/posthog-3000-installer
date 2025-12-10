import React, { useEffect, useState } from 'react'

interface InstallingScreenProps {
  installPath: string
  installComplete: boolean
  onInstallComplete: () => void
}

const FAKE_FILES = [
  'posthog-core.dll',
  'analytics-engine.exe',
  'event-processor.sys',
  'session-replay.ocx',
  'replay-player.dll',
  'feature-flags.exe',
  'flag-evaluator.dll',
  'ab-testing.dll',
  'experiment-engine.sys',
  'data-pipeline.exe',
  'transformer.dll',
  'exporter.ocx',
  'notebooks.exe',
  'notebook-renderer.dll',
  'hedgehog-icon.ico',
  'posthog3000.exe',
  'uninstall.exe',
  'readme.txt',
  'license.txt'
]

const STATUSES = [
  'Extracting files...',
  'Copying files to destination...',
  'Registering COM components...',
  'Creating program shortcuts...',
  'Updating system registry...',
  'Configuring PostHog 3000...',
  'Finalizing installation...'
]

const InstallingScreen: React.FC<InstallingScreenProps> = ({ installPath, installComplete, onInstallComplete }) => {
  const [progress, setProgress] = useState(0)
  const [files, setFiles] = useState<string[]>(['Preparing installation...'])
  const [status, setStatus] = useState('Initializing setup routines...')

  useEffect(() => {
    // Don't start installation if already complete
    if (installComplete) return

    let currentFile = 0
    let statusIndex = 0
    const actions = ['Extracting:', 'Copying:', 'Installing:', 'Registering:']

    const interval = setInterval(() => {
      if (currentFile < FAKE_FILES.length) {
        const action = actions[Math.floor(Math.random() * actions.length)]
        const filePath = `${action} ${installPath}\\${FAKE_FILES[currentFile]}`

        setFiles(prev => [...prev.slice(currentFile === 0 ? 1 : 0), filePath])
        setProgress(Math.floor(((currentFile + 1) / FAKE_FILES.length) * 100))

        if (currentFile % 3 === 0 && statusIndex < STATUSES.length) {
          setStatus(STATUSES[statusIndex])
          statusIndex++
        }

        currentFile++
      } else {
        clearInterval(interval)
        setStatus('Installation complete!')
        setFiles(prev => [...prev, 'Setup completed successfully.'])

        setTimeout(() => {
          onInstallComplete()
        }, 1500)
      }
    }, 200)

    return () => clearInterval(interval)
  }, [installPath, installComplete]) // Removed onInstallComplete from dependencies

  return (
    <div className="screen installing-screen">
      <h2>Installing PostHog 3000</h2>

      <p>Please wait while Setup installs PostHog 3000 on your computer.</p>

      <div className="progress-container">
        <div className="progress-label">Installation Progress:</div>
        <progress id="install-progress" max="100" value={progress}></progress>
      </div>

      <div className="file-list">
        {files.map((file, index) => (
          <div
            key={index}
            className="file-item"
            style={
              file.startsWith('Setup completed')
                ? { color: '#008000', fontWeight: 'bold' }
                : file === 'Preparing installation...'
                ? { color: '#808080' }
                : { color: '#000080' }
            }
          >
            {file}
          </div>
        ))}
      </div>

      <div className="status-text">{status}</div>
    </div>
  )
}

export default InstallingScreen
