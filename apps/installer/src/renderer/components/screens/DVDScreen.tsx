import React, { useState } from 'react'
import type { DVDState } from '../../../types'

interface DVDScreenProps {
  dvdState: DVDState
  onDVDVerified: () => void
}

const DVDScreen: React.FC<DVDScreenProps> = ({ dvdState, onDVDVerified }) => {
  const [selectedDrive, setSelectedDrive] = useState<string>('')

  const getStatusMessage = () => {
    if (dvdState.checking) {
      return 'Checking DVD...'
    }
    if (dvdState.error) {
      return `Error: ${dvdState.error}`
    }
    if (dvdState.fileVerified) {
      return '✓ Valid PostHog 3000 Installation DVD detected!'
    }
    if (dvdState.selectedDrive) {
      return 'Drive selected. Click "Check DVD" to verify.'
    }
    return 'Please select a drive and insert the PostHog 3000 DVD.'
  }

  const getStatusClass = () => {
    if (dvdState.fileVerified) return 'status-success'
    if (dvdState.error) return 'status-error'
    return 'status-pending'
  }

  const handleCheckDVD = () => {
    // Simplified: Just mark as verified after a short delay
    setTimeout(() => {
      onDVDVerified()
    }, 1000)
  }

  return (
    <div className="screen dvd-screen">
      <div className="welcome-title">Insert Installation DVD</div>

      <p className="welcome-text">
        Please insert the <strong>PostHog 3000 Installation DVD</strong> into your optical drive.
        The installer will verify the disc contains the required installation files.
      </p>

      <fieldset style={{ marginTop: '20px', padding: '15px' }}>
        <legend>DVD Drive Selection</legend>

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="drive-select">Select Drive:</label>
          <select
            id="drive-select"
            value={selectedDrive}
            onChange={(e) => setSelectedDrive(e.target.value)}
            style={{ width: '100%', marginTop: '5px', padding: '4px' }}
          >
            <option value="">-- Select a drive --</option>
            <option value="D:">D: CD-ROM Drive</option>
            <option value="E:">E: DVD Drive</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button style={{ flex: 1 }}>Refresh Drives</button>
          <button
            style={{ flex: 1 }}
            disabled={!selectedDrive}
            onClick={handleCheckDVD}
          >
            Check DVD
          </button>
        </div>
      </fieldset>

      <fieldset style={{ marginTop: '20px', padding: '15px' }}>
        <legend>Verification Status</legend>
        <div
          className={getStatusClass()}
          style={{
            minHeight: '60px',
            padding: '10px',
            background: '#fff',
            border: '1px inset'
          }}
        >
          {getStatusMessage()}
        </div>
      </fieldset>

      <p className="welcome-text" style={{ marginTop: '20px', fontSize: '11px', color: '#666' }}>
        <strong>Note:</strong> The installer will look for the file <code>posthog_dvd.png</code>
        on the selected drive to verify it is a valid PostHog installation disc.
      </p>
    </div>
  )
}

export default DVDScreen
