import * as THREE from 'three'
import { useGLTF, useTexture } from '@react-three/drei'
import { useEffect } from 'react'

export default function JerseyModel({selectedLayer,selectedColor, userDesign }) {
  const { scene } = useGLTF('/models/bike_taupo_mens_trail_jersey.glb')

  // Always call both hooks
  const defaultTexture = useTexture('/textures/sample.png')
  const userTexture = useTexture(userDesign || '/textures/sample.png')

  const textureToUse = userDesign ? userTexture : defaultTexture

  useEffect(() => {
    if (!textureToUse) return

    textureToUse.encoding = THREE.sRGBEncoding
    textureToUse.flipY = false
    textureToUse.center.set(0.5, 0.5)
    textureToUse.offset.set(0, 0)
    textureToUse.repeat.set(1, 1)
    textureToUse.rotation = Math.PI * 3
    textureToUse.needsUpdate = true
    textureToUse.minFilter = THREE.LinearMipmapLinearFilter
    textureToUse.magFilter = THREE.LinearFilter

    scene.traverse((child) => {
      if (child.isMesh && child.material && child.material.isMeshStandardMaterial) {
        // console.log('🧱 Mesh Name:', child.name)
        // console.log('📐 Geometry:', child.geometry)
        // console.log('🗺️ UV Mapping:', child.geometry.attributes.uv)
        // console.log('🎨 Material:', child.material?.map?.image?.src)
        
        if (userDesign) {
          // If design selected → apply texture to all
          child.material.map = textureToUse
          child.material.color.set('#ffffff')
        } 
        else {
          // Color change only for matching layer
          if (child.name.toLowerCase().includes(selectedLayer.toLowerCase())) {
            child.material.color.set(selectedColor)
            child.material.map = null // remove texture if only color
          }}
        // child.material.map = textureToUse
        // child.material.color.set('#ffffff')
        child.material.roughness = 0.8
        child.material.metalness = 0.1
        child.material.needsUpdate = true
      }
    })
  }, [scene, textureToUse,selectedColor, selectedLayer, userDesign])

  return (
    <primitive
      object={scene}
      scale={[7, 7, 7]}
      position={[0, -1.5, 0]}
      rotation={[0, Math.PI, 0]}
    />
  )
}
