import { useEffect, useRef, useState } from 'react'
import ElementsPanel from './ElementsPanel' // correct path use pannunga
import { useNavigate, useLocation } from 'react-router-dom'

export default function DesignEditor({ userImage, setSelectedDesignURL }) {
  const canvasRef = useRef(null)
  const [canvas, setCanvas] = useState(null)
  const [fabricInstance, setFabricInstance] = useState(null)
  const [history, setHistory] = useState([])
  const [redoStack, setRedoStack] = useState([])
  const [cropRect, setCropRect] = useState(null)
  const [isErasing, setIsErasing] = useState(false)
  const [activeImage, setActiveImage] = useState(null)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [editorImage, setEditorImage] = useState(null)
  const [isModified, setIsModified] = useState(false)
  
  const navigate = useNavigate()
  const location = useLocation()

  const { sport, fit, style } = location.state || {}


  // Save to history
  const saveToHistory = () => {
    if (!canvas) return
    const current = canvas.toJSON()
    setHistory(prev => [...prev, current])
    setRedoStack([])
  }

 
// Canvas init
useEffect(() => {
  const init = async () => {
    const fabricModule = await import('fabric')
    const fabric = fabricModule.fabric || fabricModule.default || fabricModule
    window.fabric = fabric

    setFabricInstance(fabric)

    if (canvasRef.current && canvasRef.current.__fabricCanvas) {
      canvasRef.current.__fabricCanvas.dispose()
    }

    const newCanvas = new fabric.Canvas(canvasRef.current, {
      width: 750,
      height: 700,
      backgroundColor: '#fff',
    })

    canvasRef.current.__fabricCanvas = newCanvas
    setCanvas(newCanvas)

    // 👉 Mask image load
    const bgImg = new Image()
    bgImg.crossOrigin = 'anonymous'
    bgImg.src = '/textures/sample.png'
    bgImg.onload = () => {
      const fabricBg = new fabric.Image(bgImg, {
        left: 0,
        top: 0,
        scaleX: newCanvas.width / bgImg.width,
        scaleY: newCanvas.height / bgImg.height,
        angle: 180,  // ✅ bg rotate
        originX: 'center',
        originY: 'center',
        left: newCanvas.width / 2,  // center align
        top: newCanvas.height / 2,   // center align
        selectable: false,
        evented: false,
        absolutePositioned: true // ✅ clipping works properly
      })

      // 👉 Apply as clipPath
      newCanvas.clipPath = fabricBg

      // 👉 Optional: Add as background image visually
        newCanvas.backgroundImage = fabricBg
        newCanvas.requestRenderAll()

      newCanvas.renderAll()
      saveToHistory()
    }
  }

  init()
}, [])




const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        const imgData = reader.result // base64 format
        setEditorImage(imgData)
      }
      reader.readAsDataURL(file)
    }
  }


  
  // Load User Image jjk
useEffect(() => {
  const imageToUse = editorImage || userImage

  if (fabricInstance && canvas && imageToUse) {
    console.log("🟡 Step 1: fabricInstance, canvas, userImage available")
    console.log("🔹 userImage =", userImage)
    

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = imageToUse

    img.onload = () => {
      console.log("✅ Step 2: HTML <img> loaded")
      console.log("📏 Image size =", img.width, img.height)


      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = img.width
      tempCanvas.height = img.height

      const ctx = tempCanvas.getContext('2d')
      ctx.drawImage(img, 0, 0)

      const scale = Math.min(canvas.width / img.width, canvas.height / img.height)
      const left = (canvas.width - img.width * scale) / 2
      const top = (canvas.height - img.height * scale) / 2

      console.log("📐 Calculated position & scale:", { scale, left, top })

      const fabricImg = new window.fabric.Image(img, {
        left,
        top,
        scaleX: scale,
        scaleY: scale,
        hasBorders: true,
        hasControls: true,
        selectable: true,
        opacity: 0.7 ,
      })
        console.log("🔍 testImg type =", fabricImg.type)
        console.log("🔍 testImg instanceof fabric.Image =", fabricImg instanceof window.fabric.Image)

      fabricImg._tempCanvas = tempCanvas
      fabricImg._tempCtx = ctx
      console.log("🧪 attaching tempCanvas:", !!tempCanvas)
      console.log("🧪 attaching ctx:", !!ctx)
      console.log("🧪 attached to fabricImg:", fabricImg._tempCanvas, fabricImg._tempCtx)

      canvas.add(fabricImg)
      canvas.setActiveObject(fabricImg)
      // canvas.remove(fabricImg)
      // canvas.add(fabricImg)   

      canvas.renderAll()
      setIsImageLoaded(true)

      setActiveImage(fabricImg)
      saveToHistory()

      console.log("🎉 Step 3: Fabric image added to canvas and ready!")
      console.log("🧪 fabricImg type =", fabricImg.type)
      console.log("🧪 has moveTo =", typeof fabricImg.bringToFront)

    }

    img.onerror = () => {
      console.error('❌ Image load error! Check CORS or base64 issues.')
    }
  }
}, [userImage, canvas, fabricInstance,editorImage])

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const isShapeOverTransparentArea = async (shape, maskImage) => {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = maskImage.src

    img.onload = () => {
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = img.width
      tempCanvas.height = img.height
      const ctx = tempCanvas.getContext('2d')
      ctx.drawImage(img, 0, 0)

      const shapeLeft = shape.left
      const shapeTop = shape.top
      const shapeRight = shapeLeft + shape.width * shape.scaleX
      const shapeBottom = shapeTop + shape.height * shape.scaleY

      // Scale factor: canvas size vs mask image size
      const scaleX = img.width / 750 // your canvas width
      const scaleY = img.height / 700 // your canvas height

      let isOverTransparent = false

      for (let y = shapeTop; y < shapeBottom; y += 2) {
        for (let x = shapeLeft; x < shapeRight; x += 2) {
          const pixel = ctx.getImageData(x * scaleX, y * scaleY, 1, 1).data
          const alpha = pixel[3]

          if (alpha < 10) {
            isOverTransparent = true
            resolve(true)
            return
          }
        }
      }

      resolve(false)
    }

    img.onerror = () => {
      console.error('❌ Failed to load mask image')
      resolve(false)
    }
  })
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  // ✏️ Eraser
const handleErase = () => {
  if (!canvas || !fabricInstance || !activeImage || !isImageLoaded) {
    console.warn("❌ Cannot erase: Missing required setup (canvas/fabricInstance/activeImage/imageLoaded).")
    return
  }

  const active = activeImage
  console.log("🧪 Erase triggered")
  console.log("📌 Canvas exists?", !!canvas)
  console.log("📌 Fabric instance exists?", !!fabricInstance)
  console.log("📌 Active Image exists?", !!active)
  console.log("📌 tempCanvas attached?", !!active._tempCanvas)
  console.log("📌 tempCtx attached?", !!active._tempCtx)

  if (!active._tempCanvas || !active._tempCtx) {
    console.warn("⚠️ Cannot erase: tempCanvas or ctx missing")
    return
  }

  setIsErasing(true)
  canvas.selection = false
  canvas.discardActiveObject()
  canvas.defaultCursor = 'crosshair'
  active.selectable = false

  let lastPoint = null
  const radius = 15

  const moveHandler = (opt) => {
    if (!isErasing) return

    const pointer = canvas.getPointer(opt.e)
    const ctx = active._tempCtx

    const x = (pointer.x - active.left) / active.scaleX
    const y = (pointer.y - active.top) / active.scaleY

    console.log("🎯 Pointer on canvas:", pointer)
    console.log("🎯 Image position and scale:", active.left, active.top, active.scaleX, active.scaleY)
    console.log("🎯 Final calculated (x, y):", x, y)

    if (lastPoint) {
      const dx = x - lastPoint.x
      const dy = y - lastPoint.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      const steps = Math.floor(dist / 2)

      for (let i = 0; i < steps; i++) {
        const px = lastPoint.x + (dx * i) / steps
        const py = lastPoint.y + (dy * i) / steps

        ctx.save()
        ctx.beginPath()
        ctx.arc(px, py, radius, 0, 2 * Math.PI)
        ctx.clip()
        ctx.clearRect(px - radius, py - radius, radius * 2, radius * 2)
        ctx.restore()


      }

      const updatedURL = active._tempCanvas.toDataURL()
      console.log("🔄 Updated image base64 size:", updatedURL.length)

      active.setSrc(updatedURL, () => {
        console.log("✅ Image updated with erased data")
        canvas.renderAll()
      })
    }

    lastPoint = { x, y }
  }

  const downHandler = () => {
    console.log("🖱️ Mouse Down - Start Drawing Erase")
    lastPoint = null
    canvas.on('mouse:move', moveHandler)
  }

  const upHandler = () => {
    console.log("🖱️ Mouse Up - Stop Drawing Erase")
    canvas.off('mouse:move', moveHandler)
    active.selectable = true
    canvas.selection = true
    canvas.defaultCursor = 'default'
    setIsErasing(false)
    saveToHistory()
    console.log("🛑 Erase mode stopped")
  }

  canvas.on('mouse:down', downHandler)
  canvas.on('mouse:up', upHandler)

  console.log("👆 moveHandler attached")
}

const handleStopErase = () => {
  setIsErasing(false)
  if (!canvas) return
  canvas.selection = true
  canvas.defaultCursor = 'default'
  canvas.off('mouse:move')
  canvas.off('mouse:down')
  canvas.off('mouse:up')
  if (activeImage) activeImage.selectable = true
  console.log("🛑 Erase mode stopped")
}
  

  // ✂️ Crop
  const handleStartCrop = () => {
    const active = canvas.getActiveObject()
    if (!active || active.type !== 'image') return

    const rect = new fabricInstance.Rect({
      left: active.left + 30,
      top: active.top + 30,
      width: active.width * active.scaleX * 0.5,
      height: active.height * active.scaleY * 0.5,
      fill: 'rgba(0,0,0,0.2)',
      stroke: 'blue',
      strokeWidth: 1,
      hasBorders: true,
      hasControls: true,
    })

    setCropRect(rect)
    canvas.add(rect)
    canvas.setActiveObject(rect)
    canvas.renderAll()
  }

  const handleApplyCrop = () => {
    if (!cropRect || !canvas) return
    const image = canvas.getObjects('image').find(obj => obj !== cropRect)
    if (!image) return

    const cropX = cropRect.left - image.left
    const cropY = cropRect.top - image.top

    image.set({
      cropX: cropX / image.scaleX,
      cropY: cropY / image.scaleY,
      width: cropRect.width / image.scaleX,
      height: cropRect.height / image.scaleY,
    })

    canvas.remove(cropRect)
    setCropRect(null)
    canvas.setActiveObject(image)
    canvas.renderAll()
    saveToHistory()
  }

  const handleDelete = () => {
    const active = canvas.getActiveObject()
    if (active) {
      canvas.remove(active)
      canvas.renderAll()
      saveToHistory()
    }
  }

  const handleUndo = () => {
    if (history.length < 2) return
    const prev = [...history]
    prev.pop()
    const last = prev[prev.length - 1]
    setRedoStack(r => [...r, canvas.toJSON()])
    setHistory(prev)
    canvas.loadFromJSON(last, () => canvas.renderAll())
  }

  const handleRedo = () => {
    if (redoStack.length === 0) return
    const last = redoStack.pop()
    setRedoStack([...redoStack])
    setHistory(h => [...h, last])
    canvas.loadFromJSON(last, () => canvas.renderAll())
  }

//Apply Design (just update the state and 3D model)
const handleApplyDesign = () => {
  if (canvas) {
    canvas.discardActiveObject()
    canvas.renderAll()

    const dataURL = canvas.toDataURL({ format: 'png', quality: 1 })
    setSelectedDesignURL(dataURL)
    setIsModified(false)

    console.log("🎨 Design applied to 3D view!")
    console.log("🟢 Objects before save:", canvas.getObjects().map(o => ({type: o.type, fill: o.fill, layer: o.layerName})))

    const jsonData = JSON.stringify(
      canvas.toJSON(["layerName"]),
      null,
      2
    )

    console.log(jsonData)


  }
}

// Save Design (and go to order-form)
const handleSaveDesign = async () => {
  if (!canvas) return;

  const maskImg = new Image();
  maskImg.crossOrigin = 'anonymous';
  maskImg.src = '/textures/sample.png';

  maskImg.onload = async () => {
    const objects = canvas.getObjects();
    const shapesToRemove = [];
    console.log("🟢 Objects before save:", canvas.getObjects().map(o => ({type: o.type, fill: o.fill, layer: o.layerName})))

    // for (let obj of objects) {
    //   if (obj.type !== 'image') {
    //     const isInvalid = await isShapeOverTransparentArea(obj, maskImg);
    //     if (isInvalid) {
    //       shapesToRemove.push(obj);
    //     }
    //   }
    // }

    // shapesToRemove.forEach(obj => canvas.remove(obj));
    

    canvas.discardActiveObject();
    canvas.renderAll();

    // PNG (for preview / 3D)
    const pngData = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2
    });
    

    // JSON (for editing later)
    const jsonData = JSON.stringify(
      canvas.toJSON(["layerName"]),
      null,
      2
    )

    console.log(jsonData)

    // 🔹 Trigger JSON download
    const blob = new Blob([jsonData], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'design.json';
    link.click();

    // Navigate (still send PNG for preview)
    navigate('/order-form', {
      state: {
        designImage: pngData,
        sport,
        fit,
        style
      }
    });
  };
};




  const [showElementsPanel, setShowElementsPanel] = useState(false)

  const addShape = (type) => {
    if (!canvas || !fabricInstance) return

    let shape
    let uniqueId = Date.now() + "_" + type 

    switch (type) {
      case 'rect':
        shape = new fabricInstance.Rect({
          left: 100,
          top: 100,
          width: 100,
          height: 60,
          fill: 'white',
          stroke: 'black',
          strokeWidth: 0,
          layerName: uniqueId 
        })
        break
      case 'circle':
        shape = new fabricInstance.Circle({
          left: 120,
          top: 120,
          radius: 40,
          fill: 'lightgreen',
          stroke: 'black',
          strokeWidth: 0,
          layerName: uniqueId 
        })
        break
      case 'triangle':
        shape = new fabricInstance.Triangle({
          left: 140,
          top: 140,
          width: 80,
          height: 80,
          fill: 'orange',
          stroke: 'black',
          strokeWidth: 0,
          layerName: uniqueId 
        })
        break
      case 'line':
        shape = new fabricInstance.Line([50, 50, 150, 50], {
          left: 160,
          top: 160,
          stroke: 'black',
          strokeWidth: 3,
          layerName: uniqueId 
        })
        break
      default:
        return
    }

    canvas.add(shape)
    canvas.setActiveObject(shape)
    canvas.renderAll()
    saveToHistory()
    setIsModified(true)

  }

  

  return (
    <div>
      <canvas ref={canvasRef} width={750} height={700} />
      <div className="mt-4 flex flex-wrap gap-2">
      <div className="mb-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4" 
      />
    </div>


      <button
        onClick={() => setShowElementsPanel(!showElementsPanel)}
        className="bg-purple-500 text-white px-3 py-1 rounded"
      >
        Elements
      </button>

      {showElementsPanel && (
        <ElementsPanel onAddShape={addShape} />
      )}

      <input
        type="color"
        onChange={(e) => {
          const activeObject = canvas.getActiveObject()
          if (activeObject && activeObject.set) {
            activeObject.set('fill', e.target.value)
            canvas.renderAll()
          }
        }}
      />

      <button
        onClick={handleErase}
        disabled={!isImageLoaded}
        className={`px-3 py-1 rounded ${
          isImageLoaded ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'
        }`}
      >
        Erase
      </button>


        <button onClick={handleDelete} className="bg-red-700 text-white px-3 py-1 rounded">Delete Image</button>
        <button onClick={handleUndo} className="bg-gray-600 text-white px-3 py-1 rounded">Undo</button>
        <button onClick={handleRedo} className="bg-gray-400 text-white px-3 py-1 rounded">Redo</button>
        {
          isModified ? (
            <>
              <button
                onClick={handleApplyDesign}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Apply Design
              </button>

              <button
                onClick={handleSaveDesign}
                className="bg-green-600 text-white px-3 py-1 rounded"
                disabled={!editorImage}
              >
                Save Design
              </button>
            </>
          ) : (
            <button
              onClick={handleSaveDesign}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Save Design
            </button>
          )
        }

      </div>
      <div className="flex items-center gap-2 mt-4">
      <label htmlFor="opacitySlider">Opacity</label>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        onChange={(e) => {
          const opacity = parseFloat(e.target.value)
          const activeObject = canvas.getActiveObject()
          if (activeObject) {
            activeObject.set('opacity', opacity)
            canvas.renderAll()
          }
        }}
      />
    </div>
    </div>
  )
}
