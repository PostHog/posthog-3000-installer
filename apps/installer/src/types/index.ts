// Shared type definitions for the installer

export interface DVDState {
  selectedDrive: string | null
  driveName: string | null
  fileVerified: boolean
  checking: boolean
  error: string | null
}

export interface InstallerState {
  currentScreen: number
  licenseAccepted: boolean
  installPath: string
  selectedComponents: string[]
  configData: ConfigData
  installComplete: boolean
  logoClickCount: number
  dvdState: DVDState
}

export interface ConfigData {
  projectName: string
  instanceType: 'cloud' | 'self-hosted'
  apiKey: string
}

export interface Screen {
  render(state: InstallerState): HTMLElement
  setupListeners?(
    state: InstallerState,
    updateNav: () => void,
    goNext: () => void
  ): void
  canProceed?(state: InstallerState): boolean
  onNext?(state: InstallerState): void
}

export interface Component {
  id: string
  name: string
  description: string
  size: string
  required: boolean
}
