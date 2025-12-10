import React, { useState } from 'react'
import type { InstallerState } from '../../../types'

interface FinishScreenProps {
  installPath: string
  selectedComponents: string[]
  configData: {
    projectName: string
    instanceType: string
  }
}

const FinishScreen: React.FC<FinishScreenProps> = ({ installPath, selectedComponents, configData }) => {
  const [launchPostHog, setLaunchPostHog] = useState(true)
  const [viewReadme, setViewReadme] = useState(false)

  return (
    <div className="screen finish-screen">
      <div className="finish-icon">🏁</div>

      <div className="finish-message">
        Completing the PostHog 3000 Setup Wizard
      </div>

      <p>
        Setup has finished installing PostHog 3000 on your computer.
        The application may be launched by selecting the installed shortcuts.
      </p>

      <p>
        Click <strong>Finish</strong> to exit Setup.
      </p>

      <div className="finish-options">
        <div className="field-row">
          <input
            type="checkbox"
            id="launch-posthog"
            checked={launchPostHog}
            onChange={(e) => setLaunchPostHog(e.target.checked)}
          />
          <label htmlFor="launch-posthog">Launch PostHog 3000 now</label>
        </div>
        <div className="field-row">
          <input
            type="checkbox"
            id="view-readme"
            checked={viewReadme}
            onChange={(e) => setViewReadme(e.target.checked)}
          />
          <label htmlFor="view-readme">View the README file</label>
        </div>
      </div>

      <fieldset style={{ marginTop: '30px', padding: '10px' }}>
        <legend>Installation Summary</legend>
        <div style={{ fontSize: '11px', lineHeight: 1.6 }}>
          <div><strong>Installation Path:</strong> {installPath}</div>
          <div><strong>Components Installed:</strong> {selectedComponents.length}</div>
          <div><strong>Project Name:</strong> {configData.projectName || 'Not configured'}</div>
          <div><strong>Instance Type:</strong> {configData.instanceType === 'cloud' ? 'PostHog Cloud' : 'Self-Hosted'}</div>
        </div>
      </fieldset>

      <p style={{ marginTop: '20px', fontSize: '10px', color: '#808080' }}>
        Thank you for installing PostHog 3000! For support, documentation, and updates,
        visit <strong>posthog.com</strong>
      </p>

      <p style={{ marginTop: '10px', fontSize: '9px', color: '#808080', textAlign: 'center' }}>
        © 1998 PostHog Corp. All rights reserved.<br />
        PostHog 3000 is a trademark of PostHog Corp.<br />
        Windows is a trademark of Microsoft Corporation.
      </p>
    </div>
  )
}

export default FinishScreen
