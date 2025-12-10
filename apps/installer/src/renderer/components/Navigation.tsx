import React from 'react'

interface NavigationProps {
  currentScreen: number
  totalScreens: number
  canProceed: boolean
  onBack: () => void
  onNext: () => void
  onCancel: () => void
  isInstalling: boolean
  isFinished: boolean
}

const Navigation: React.FC<NavigationProps> = ({
  currentScreen,
  totalScreens,
  canProceed,
  onBack,
  onNext,
  onCancel,
  isInstalling,
  isFinished
}) => {
  const showBack = currentScreen > 0 && !isInstalling && !isFinished
  const showNext = currentScreen < totalScreens - 1 && !isInstalling
  const showFinish = isFinished

  return (
    <div className="installer-nav">
      {showBack && (
        <button id="back-btn" onClick={onBack}>
          &lt; Back
        </button>
      )}
      <div className="nav-spacer"></div>
      {showNext && (
        <button id="next-btn" onClick={onNext} disabled={!canProceed}>
          Next &gt;
        </button>
      )}
      {showFinish && (
        <button id="next-btn" onClick={onNext}>
          Finish
        </button>
      )}
      {!isFinished && (
        <button id="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
      )}
    </div>
  )
}

export default Navigation
