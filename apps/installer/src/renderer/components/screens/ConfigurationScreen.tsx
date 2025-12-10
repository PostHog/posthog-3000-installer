import React, { useState } from 'react'
import type { ConfigData } from '../../../types'

interface ConfigurationScreenProps {
  configData: ConfigData
  onConfigChange: (field: keyof ConfigData, value: string) => void
}

const ConfigurationScreen: React.FC<ConfigurationScreenProps> = ({ configData, onConfigChange }) => {
  const [showApiDialog, setShowApiDialog] = useState(false)
  const [enableAutocapture, setEnableAutocapture] = useState(true)
  const [capturePageview, setCapturePageview] = useState(true)
  const [enableTurbo, setEnableTurbo] = useState(false)

  return (
    <>
      <div className="screen configuration-screen">
        <h2>Configure PostHog 3000</h2>

        <p>Please provide the following information to configure your PostHog installation.</p>

        <div className="config-form">
          <div className="form-group">
            <label htmlFor="project-name">Project Name:</label>
            <input
              type="text"
              id="project-name"
              value={configData.projectName}
              placeholder="My Awesome Project"
              onChange={(e) => onConfigChange('projectName', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="instance-type">Instance Type:</label>
            <select
              id="instance-type"
              value={configData.instanceType}
              onChange={(e) => onConfigChange('instanceType', e.target.value as 'cloud' | 'self-hosted')}
            >
              <option value="cloud">PostHog Cloud (Recommended)</option>
              <option value="self-hosted">Self-Hosted</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="api-key">API Key:</label>
            <div className="input-with-button">
              <input
                type="text"
                id="api-key"
                value={configData.apiKey}
                placeholder="phc_..."
                onChange={(e) => onConfigChange('apiKey', e.target.value)}
              />
              <button onClick={() => setShowApiDialog(true)}>...</button>
            </div>
            <div style={{ fontSize: '10px', marginTop: '5px', color: '#808080' }}>
              Optional: Get your API key from app.posthog.com
            </div>
          </div>

          <details className="advanced-section">
            <summary>Advanced Settings</summary>
            <div style={{ marginTop: '10px' }}>
              <div className="field-row">
                <input
                  type="checkbox"
                  id="enable-autocapture"
                  checked={enableAutocapture}
                  onChange={(e) => setEnableAutocapture(e.target.checked)}
                />
                <label htmlFor="enable-autocapture">Enable Autocapture</label>
              </div>
              <div className="field-row">
                <input
                  type="checkbox"
                  id="capture-pageview"
                  checked={capturePageview}
                  onChange={(e) => setCapturePageview(e.target.checked)}
                />
                <label htmlFor="capture-pageview">Capture Page Views</label>
              </div>
              <div className="field-row">
                <input
                  type="checkbox"
                  id="enable-turbo"
                  checked={enableTurbo}
                  onChange={(e) => setEnableTurbo(e.target.checked)}
                />
                <label htmlFor="enable-turbo">Enable Turbo Mode (Y2K Compatible)</label>
              </div>
            </div>
          </details>
        </div>

        <p style={{ marginTop: '20px', fontSize: '11px', color: '#000080' }}>
          Note: You can change these settings later in the PostHog 3000 Control Panel.
        </p>
      </div>

      {showApiDialog && (
        <div className="dialog-overlay">
          <div className="window dialog-window" style={{ width: '450px' }}>
            <div className="title-bar">
              <div className="title-bar-text">API Key Help</div>
            </div>
            <div className="window-body">
              <div className="dialog-content">
                <p><strong>Where to find your API Key:</strong></p>
                <ol style={{ margin: '10px 0', paddingLeft: '25px' }}>
                  <li>Visit <strong>app.posthog.com</strong></li>
                  <li>Click on your project settings</li>
                  <li>Navigate to "Project API Key"</li>
                  <li>Copy the key (starts with "phc_")</li>
                </ol>
                <p style={{ marginTop: '15px', fontSize: '10px', color: '#808080' }}>
                  Note: API key is optional for this demo installer.
                  In a real installation, you would connect to your PostHog instance.
                </p>
              </div>
              <div className="dialog-buttons">
                <button onClick={() => setShowApiDialog(false)}>OK</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ConfigurationScreen
