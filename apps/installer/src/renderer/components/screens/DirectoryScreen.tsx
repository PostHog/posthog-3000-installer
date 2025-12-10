import React, { useState } from 'react'

interface DirectoryScreenProps {
  installPath: string
  onPathChange: (path: string) => void
}

const DirectoryScreen: React.FC<DirectoryScreenProps> = ({ installPath, onPathChange }) => {
  const [showDialog, setShowDialog] = useState(false)

  const handleBrowseClick = () => {
    setShowDialog(true)
  }

  const handleDialogOk = () => {
    setShowDialog(false)
  }

  const handleDialogCancel = () => {
    setShowDialog(false)
  }

  return (
    <>
      <div className="screen directory-screen">
        <h2>Select Installation Directory</h2>

        <p>Setup will install PostHog 3000 in the following folder.</p>

        <p>To install in a different folder, click Browse and select another folder.</p>

        <div className="directory-input-group">
          <input
            type="text"
            id="install-path"
            value={installPath}
            onChange={(e) => onPathChange(e.target.value)}
            style={{ flex: 1 }}
          />
          <button onClick={handleBrowseClick} style={{ minWidth: '80px' }}>Browse...</button>
        </div>

        <div className="space-info">
          <div className="space-info-row">
            <span>Destination Drive:</span>
            <span><strong>C:\</strong></span>
          </div>
          <div className="space-info-row">
            <span>Space Required:</span>
            <span>42.0 MB</span>
          </div>
          <div className="space-info-row">
            <span>Space Available:</span>
            <span>420.0 MB</span>
          </div>
        </div>

        <p style={{ marginTop: '20px', fontSize: '11px', color: '#000080' }}>
          Note: PostHog 3000 requires at least 16MB of RAM and a 486DX processor.
          Pentium processor recommended for optimal hedgehog rendering.
        </p>
      </div>

      {showDialog && (
        <div className="dialog-overlay">
          <div className="window dialog-window" style={{ width: '500px' }}>
            <div className="title-bar">
              <div className="title-bar-text">Browse For Folder</div>
            </div>
            <div className="window-body">
              <p>Select the folder where you want to install PostHog 3000:</p>
              <div style={{ margin: '15px 0', padding: '10px', background: 'white', border: '2px inset #808080', height: '200px', overflowY: 'auto' }}>
                <ul className="tree-view" style={{ listStyle: 'none', paddingLeft: 0 }}>
                  <li>🖥️ My Computer</li>
                  <li style={{ paddingLeft: '20px' }}>💾 (C:) Local Disk
                    <ul style={{ listStyle: 'none', paddingLeft: '20px' }}>
                      <li>📁 Program Files</li>
                      <li>📁 Windows</li>
                      <li>📁 My Documents</li>
                      <li style={{ background: '#000080', color: 'white' }}>📁 PostHog3000</li>
                    </ul>
                  </li>
                  <li style={{ paddingLeft: '20px' }}>💿 (D:) CD-ROM</li>
                </ul>
              </div>
              <div className="dialog-buttons">
                <button onClick={handleDialogOk}>OK</button>
                <button onClick={handleDialogCancel}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default DirectoryScreen
