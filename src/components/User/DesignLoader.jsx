import * as fabric from 'fabric'
import { useEffect } from 'react';

export default function DesignLoader({ jsonData, onExport }) {
  useEffect(() => {
    if (!jsonData) return

    console.log("🎨 DesignLoader: JSON data received, starting load...")

    // Hidden canvas element
    const hiddenCanvasEl = document.createElement('canvas')
    hiddenCanvasEl.width = 750
    hiddenCanvasEl.height = 700
    const canvas = new fabric.Canvas(hiddenCanvasEl, { crossOrigin: 'anonymous' })

    canvas.loadFromJSON(jsonData, () => {
      console.log("✅ JSON structure loaded into fabric canvas")

      // Layer-wise color mapping object
      const appliedColors = {}

      canvas.getObjects().forEach(obj => {
        // Assign color from JSON or fallback
        let fillColor = obj.fill || '#ffffff'
        obj.set({
          stroke: null,
          shadow: null,
          opacity: 1,
          fillRule: 'nonzero',
          fill: fillColor
        })

        // Save applied color for this layer
        appliedColors[obj.type || obj.fill || 'unknown'] = fillColor

        // Proportional scaling & centering
        const scaleX = canvas.width / (obj.width * obj.scaleX)
        const scaleY = canvas.height / (obj.height * obj.scaleY)
        const scale = Math.min(scaleX, scaleY)
        obj.scaleX *= scale
        obj.scaleY *= scale
        obj.left = (canvas.width - obj.width * obj.scaleX) / 2
        obj.top = (canvas.height - obj.height * obj.scaleY) / 2
        obj.setCoords()
      })

      // Transparent background
      canvas.backgroundColor = null
      canvas.renderAll()

      // Console log applied colors for verification
      console.log("🎨 Applied colors per layer:", appliedColors)

      // Export PNG after small delay
      setTimeout(() => {
        const pngData = canvas.toDataURL({
          format: 'png',
          quality: 1,
          multiplier: 1,
          enableRetinaScaling: false,
        })
        console.log("🎉 PNG export complete")
        onExport(pngData, appliedColors) // appliedColors object-ஐ கூட return பண்ணலாம்
      }, 300)
    })
  }, [jsonData, onExport])

  return null
}
