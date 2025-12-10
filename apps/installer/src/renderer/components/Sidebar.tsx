import React from 'react'
import sidebarImage from '../assets/sidebar-image.jpg'

interface SidebarProps {
  onLogoClick: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ onLogoClick }) => {
  return (
    <div className="installer-sidebar" onClick={onLogoClick} id="logo">
      <img src={sidebarImage} alt="PostHog 3000" className="sidebar-image" />
    </div>
  )
}

export default Sidebar
