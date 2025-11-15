import { useEffect, useState } from 'react'

export default function CustomCursor({ mousePosition }) {
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const cursor = document.getElementById('custom-cursor')
    if (!cursor) return

    cursor.style.left = `${mousePosition.x}px`
    cursor.style.top = `${mousePosition.y}px`

    // Check if hovering over interactive elements
    const elementBelow = document.elementFromPoint(mousePosition.x, mousePosition.y)
    const isInteractive = elementBelow && (
      elementBelow.tagName === 'BUTTON' ||
      elementBelow.tagName === 'INPUT' ||
      elementBelow.tagName === 'LABEL' ||
      elementBelow.closest('button') ||
      elementBelow.closest('input') ||
      elementBelow.closest('label')
    )
    
    setIsHovering(!!isInteractive)
  }, [mousePosition])

  return (
    <div
      id="custom-cursor"
      style={{
        position: 'fixed',
        width: isHovering ? '40px' : '20px',
        height: isHovering ? '40px' : '20px',
        borderRadius: '50%',
        background: isHovering 
          ? 'rgba(255, 255, 255, 0.4)' 
          : 'rgba(255, 255, 255, 0.6)',
        pointerEvents: 'none',
        transform: 'translate(-50%, -50%)',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), height 0.3s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s ease',
        zIndex: 9999,
        mixBlendMode: 'difference',
        left: `${mousePosition.x}px`,
        top: `${mousePosition.y}px`,
        willChange: 'transform',
      }}
    />
  )
}

