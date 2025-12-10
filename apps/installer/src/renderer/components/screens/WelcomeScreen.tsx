import React from 'react'

interface WelcomeScreenProps {
  platform?: string
  version?: string
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ platform = 'web', version = '98.0.1998' }) => {
  return (
    <div className="screen welcome-screen">
      <div className="welcome-title">Welcome to the PostHog 3000 Setup Wizard</div>

      <p className="welcome-text">
        This wizard will guide you through the installation of <strong>PostHog 3000</strong>,
        the premier analytics platform for engineers who appreciate classic software design.
      </p>

      <p className="welcome-text">
        PostHog 3000 provides product analytics, session replay, feature flags, A/B testing,
        and more - all with the timeless elegance of 1998 software aesthetics.
      </p>

      <p className="welcome-text">
        It is recommended that you close all other applications before continuing.
        This will make it possible to update relevant system files without having to
        reboot your computer.
      </p>

      <p className="welcome-text">
        Click <strong>Next</strong> to continue, or <strong>Cancel</strong> to exit Setup.
      </p>

      <fieldset style={{ marginTop: '30px', padding: '10px' }}>
        <legend>System Information</legend>
        <div style={{ fontSize: '11px' }}>
          <div>Platform: {platform}</div>
          <div>Version: {version}</div>
          <div>Free Disk Space: 420 MB (estimated)</div>
        </div>
      </fieldset>
    </div>
  )
}

export default WelcomeScreen
