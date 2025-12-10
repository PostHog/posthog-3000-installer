import React, { useState, useCallback } from 'react'
import InstallerWindow from './components/InstallerWindow'
import Sidebar from './components/Sidebar'
import Navigation from './components/Navigation'
import WelcomeScreen from './components/screens/WelcomeScreen'
import LicenseScreen from './components/screens/LicenseScreen'
import DVDScreen from './components/screens/DVDScreen'
import DirectoryScreen from './components/screens/DirectoryScreen'
import ComponentsScreen from './components/screens/ComponentsScreen'
import ConfigurationScreen from './components/screens/ConfigurationScreen'
import InstallingScreen from './components/screens/InstallingScreen'
import FinishScreen from './components/screens/FinishScreen'
import type { ConfigData, DVDState } from '../types'

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState(0)
  const [licenseAccepted, setLicenseAccepted] = useState(false)
  const [installPath, setInstallPath] = useState('C:\\Program Files\\PostHog3000')
  const [selectedComponents, setSelectedComponents] = useState(['analytics'])
  const [configData, setConfigData] = useState<ConfigData>({
    projectName: '',
    instanceType: 'cloud',
    apiKey: ''
  })
  const [installComplete, setInstallComplete] = useState(false)
  const [logoClickCount, setLogoClickCount] = useState(0)
  const [dvdState, setDvdState] = useState<DVDState>({
    selectedDrive: null,
    driveName: null,
    fileVerified: false,
    checking: false,
    error: null
  })
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  const totalScreens = 8

  // Determine if we can proceed to next screen
  const canProceed = useCallback(() => {
    switch (currentScreen) {
      case 0: // Welcome
        return true
      case 1: // License
        return licenseAccepted
      case 2: // DVD
        return dvdState.fileVerified
      case 3: // Directory
        return installPath && installPath.length > 0
      case 4: // Components
        return selectedComponents.length > 0
      case 5: // Configuration
        return true
      case 6: // Installing
        return installComplete
      case 7: // Finish
        return true
      default:
        return false
    }
  }, [currentScreen, licenseAccepted, dvdState.fileVerified, installPath, selectedComponents, installComplete])

  const goNext = () => {
    if (currentScreen === totalScreens - 1) {
      // Finish button clicked
      window.close()
    } else if (canProceed()) {
      setCurrentScreen(prev => prev + 1)
    }
  }

  const goBack = () => {
    if (currentScreen > 0) {
      setCurrentScreen(prev => prev - 1)
    }
  }

  const handleCancel = () => {
    setShowCancelDialog(true)
  }

  const handleCancelConfirm = () => {
    window.close()
  }

  const handleCancelDismiss = () => {
    setShowCancelDialog(false)
  }

  const handleLogoClick = () => {
    setLogoClickCount(prev => {
      const newCount = prev + 1
      if (newCount >= 10) {
        alert('🦔 You found the secret hedgehog! Easter eggs are a Windows 98 tradition.')
        return 0
      }
      return newCount
    })
  }

  const handleComponentToggle = (componentId: string, checked: boolean) => {
    if (checked) {
      if (!selectedComponents.includes(componentId)) {
        setSelectedComponents(prev => [...prev, componentId])
      }
    } else {
      setSelectedComponents(prev => prev.filter(id => id !== componentId))
    }
  }

  const handleConfigChange = (field: keyof ConfigData, value: string) => {
    setConfigData(prev => ({ ...prev, [field]: value }))
  }

  const handleDVDVerified = () => {
    setDvdState(prev => ({
      ...prev,
      fileVerified: true,
      checking: false,
      error: null
    }))
  }

  const handleInstallComplete = useCallback(() => {
    setInstallComplete(true)
    // Auto-advance to finish screen
    setTimeout(() => {
      setCurrentScreen(7)
    }, 1500)
  }, [])

  const renderScreen = () => {
    switch (currentScreen) {
      case 0:
        return <WelcomeScreen />
      case 1:
        return (
          <LicenseScreen
            licenseAccepted={licenseAccepted}
            onLicenseChange={setLicenseAccepted}
          />
        )
      case 2:
        return (
          <DVDScreen
            dvdState={dvdState}
            onDVDVerified={handleDVDVerified}
          />
        )
      case 3:
        return (
          <DirectoryScreen
            installPath={installPath}
            onPathChange={setInstallPath}
          />
        )
      case 4:
        return (
          <ComponentsScreen
            selectedComponents={selectedComponents}
            onComponentToggle={handleComponentToggle}
          />
        )
      case 5:
        return (
          <ConfigurationScreen
            configData={configData}
            onConfigChange={handleConfigChange}
          />
        )
      case 6:
        return (
          <InstallingScreen
            installPath={installPath}
            installComplete={installComplete}
            onInstallComplete={handleInstallComplete}
          />
        )
      case 7:
        return (
          <FinishScreen
            installPath={installPath}
            selectedComponents={selectedComponents}
            configData={configData}
          />
        )
      default:
        return null
    }
  }

  const isInstalling = currentScreen === 6 && !installComplete
  const isFinished = currentScreen === 7

  return (
    <div className="installer-container">
      <InstallerWindow
        onClose={handleCancel}
        showCancelDialog={showCancelDialog}
        onCancelConfirm={handleCancelConfirm}
        onCancelDismiss={handleCancelDismiss}
      >
        <div className="installer-layout">
          <Sidebar onLogoClick={handleLogoClick} />
          <div className="installer-content">
            <div id="screen-container">
              {renderScreen()}
            </div>
            <Navigation
              currentScreen={currentScreen}
              totalScreens={totalScreens}
              canProceed={canProceed()}
              onBack={goBack}
              onNext={goNext}
              onCancel={handleCancel}
              isInstalling={isInstalling}
              isFinished={isFinished}
            />
          </div>
        </div>
      </InstallerWindow>
    </div>
  )
}

export default App
