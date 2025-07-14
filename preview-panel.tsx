"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useDebounce } from "use-debounce"

interface PreviewPanelProps {
  initialStyle: React.CSSProperties
  onChange: (style: React.CSSProperties) => void
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ initialStyle, onChange }) => {
  const [style, setStyle] = useState<React.CSSProperties>(initialStyle)

  useEffect(() => {
    setStyle(initialStyle)
  }, [initialStyle])

  const debouncedStyle = useDebounce(style, 500)[0]

  useEffect(() => {
    onChange(debouncedStyle)
  }, [debouncedStyle, onChange])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setStyle((prevStyle) => ({
      ...prevStyle,
      [name]: value,
    }))
  }

  return (
    <div>
      <label htmlFor="backgroundColor">Background Color:</label>
      <input
        type="text"
        id="backgroundColor"
        name="backgroundColor"
        value={(style.backgroundColor as string) || ""}
        onChange={handleChange}
      />

      <label htmlFor="color">Text Color:</label>
      <input type="text" id="color" name="color" value={(style.color as string) || ""} onChange={handleChange} />

      <label htmlFor="fontSize">Font Size:</label>
      <input
        type="text"
        id="fontSize"
        name="fontSize"
        value={(style.fontSize as string) || ""}
        onChange={handleChange}
      />
    </div>
  )
}

export default PreviewPanel
