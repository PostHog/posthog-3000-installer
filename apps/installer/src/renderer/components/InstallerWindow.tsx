import React, { ReactNode } from 'react'

interface InstallerWindowProps {
  children: ReactNode
  onClose: () => void
  showCancelDialog: boolean
  onCancelConfirm: () => void
  onCancelDismiss: () => void
}

const InstallerWindow: React.FC<InstallerWindowProps> = ({
  children,
  onClose,
  showCancelDialog,
  onCancelConfirm,
  onCancelDismiss
}) => {
  return (
    <>
      <div className="installer-window window">
        <div className="title-bar">
          <div className="title-bar-text">PostHog 3000 Setup</div>
          <div className="title-bar-controls">
            <button aria-label="Minimize" disabled></button>
            <button aria-label="Maximize" disabled></button>
            <button aria-label="Close" onClick={onClose} id="close-btn"></button>
          </div>
        </div>

        <div className="window-body">
          {children}
        </div>
      </div>

      {showCancelDialog && (
        <div className="dialog-overlay" id="cancel-dialog">
          <div className="window dialog-window">
            <div className="title-bar">
              <div className="title-bar-text">Exit Setup?</div>
            </div>
            <div className="window-body">
              <div className="dialog-content">
                <p>Setup is not complete. If you exit now, PostHog 3000 will not be installed.</p>
                <p>Exit Setup?</p>
              </div>
              <div className="dialog-buttons">
                <button id="dialog-yes" onClick={onCancelConfirm}>Yes</button>
                <button id="dialog-no" onClick={onCancelDismiss}>No</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default InstallerWindow
