// components/Customisation.jsx

import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import JerseyModel from './JerseyModel'
import { OrbitControls } from '@react-three/drei'
import SidebarPanel from './SidebarPanel'
import MeshLayerMapper from './mapFabricLayersToMeshNames'
import DesignLoader from './DesignLoader'
export default function Customisation() {
  const [selectedColor, setSelectedColor] = useState('#5C78CC')
  const [userDesign, setUserDesign] = useState(null)
  const [selectedDesignURL, setSelectedDesignURL] = useState(null)
  const [selectedLayer, setSelectedLayer] = useState('layer1')
  const [selectedDesignJSON, setSelectedDesignJSON] = useState(null) // JSON data


  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Left: Canvas 3D */}
      <div style={{ width: '50vw', background: '#f0f0f0' }}>
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={0.8}  />
          <directionalLight 
            position={[-5, 5, -5]} 
            intensity={0.5} // fill light
          />
          <JerseyModel selectedColor={selectedColor} userDesign={userDesign}  selectedLayer={selectedLayer}
 />
          <OrbitControls />
          <MeshLayerMapper />
        </Canvas>
      </div>

      {/* Right: Sidebar */}
      <div style={{ width: '50vw', padding: '20px', overflowY: 'auto' }}>
        <SidebarPanel
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          selectedDesignURL={selectedDesignURL}
          setSelectedDesignURL={setSelectedDesignURL}
          setUserDesign={setUserDesign} 
          selectedLayer={selectedLayer}
          setSelectedDesignJSON={setSelectedDesignJSON} 
          setSelectedLayer={setSelectedLayer}
          // ✅ ADD THIS LINE

        />
      </div>
            {/* JSON load பண்ணும் hidden processor */}
      {selectedDesignJSON && (
        <DesignLoader
          jsonData={selectedDesignJSON}
          onExport={(pngData) => {
              console.log("📤 Exported PNG received in Customisation, length:", pngData.length)

            setUserDesign(pngData)}}
        />
      )}
    </div>
  )
}
