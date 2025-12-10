import React, { useMemo } from 'react'
import type { Component } from '../../../types'

interface ComponentsScreenProps {
  selectedComponents: string[]
  onComponentToggle: (componentId: string, checked: boolean) => void
}

const COMPONENTS: Component[] = [
  {
    id: 'analytics',
    name: 'Analytics & Product Analytics',
    description: 'Core analytics engine. Track events, analyze user behavior, and visualize data.',
    size: '12.5 MB',
    required: true
  },
  {
    id: 'session-replay',
    name: 'Session Replay',
    description: 'Record and replay user sessions to understand how users interact with your product.',
    size: '8.2 MB',
    required: false
  },
  {
    id: 'feature-flags',
    name: 'Feature Flags',
    description: 'Roll out features gradually with powerful targeting and experimentation.',
    size: '5.1 MB',
    required: false
  },
  {
    id: 'ab-testing',
    name: 'A/B Testing',
    description: 'Run experiments to optimize your product decisions with statistical significance.',
    size: '6.8 MB',
    required: false
  },
  {
    id: 'data-pipeline',
    name: 'Data Pipeline',
    description: 'Transform and export data to your data warehouse or other tools.',
    size: '7.4 MB',
    required: false
  },
  {
    id: 'notebooks',
    name: 'Notebooks',
    description: 'Create beautiful, collaborative analysis notebooks with live data.',
    size: '4.2 MB',
    required: false
  }
]

const ComponentsScreen: React.FC<ComponentsScreenProps> = ({ selectedComponents, onComponentToggle }) => {
  const totalSize = useMemo(() => {
    let total = 0
    COMPONENTS.forEach(component => {
      if (selectedComponents.includes(component.id)) {
        total += parseFloat(component.size)
      }
    })
    return total.toFixed(1)
  }, [selectedComponents])

  return (
    <div className="screen components-screen">
      <h2>Select Components</h2>

      <p>Select the components you want to install. Clear the components you do not want to install.</p>

      <div className="components-list">
        {COMPONENTS.map(component => (
          <div key={component.id} className="component-item">
            <div className="field-row">
              <input
                type="checkbox"
                id={`component-${component.id}`}
                checked={selectedComponents.includes(component.id)}
                disabled={component.required}
                onChange={(e) => onComponentToggle(component.id, e.target.checked)}
              />
              <label htmlFor={`component-${component.id}`}></label>
            </div>
            <div className="component-info">
              <div className="component-name">
                {component.name}{component.required ? ' (Required)' : ''}
              </div>
              <div className="component-description">{component.description}</div>
            </div>
            <div className="component-size">{component.size}</div>
          </div>
        ))}
      </div>

      <fieldset style={{ marginTop: '20px', padding: '10px' }}>
        <legend>Space Requirements</legend>
        <div style={{ fontSize: '11px' }}>
          <div><strong>Total Size:</strong> {totalSize} MB</div>
          <div><strong>Available Space:</strong> 420.0 MB</div>
        </div>
      </fieldset>
    </div>
  )
}

export default ComponentsScreen
