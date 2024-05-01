'use client'
import { MeshStandardMaterial } from 'three'
import React, { useEffect, useLayoutEffect } from 'react'
import { useFrame, useLoader, applyProps } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { editable as e } from '@theatre/r3f'
import { motion } from 'framer-motion-3d'
// based on "Chevrolet Corvette (C7)" (https://sketchfab.com/3d-models/chevrolet-corvette-c7-2b509d1bce104224b147c81757f6f43a)
// by Martin Trafas (https://sketchfab.com/Bexxie) licensed under CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)

function switchMaterial(node, material) {
  node.traverse((o) => {
    if (o.isMesh) o.material = material
  })
}

export function Car(props) {
  const { scene, nodes, materials } = useGLTF('models/car/scene.gltf')
  const dayLightCover = scene.getObjectByName('CarBody_2_Daylight_Cover_0')
  const blinkerGlassCover = scene.getObjectByName('CarBody_2_Blinker_Glass_Cover_0')
  const tailLightsCover = scene.getObjectByName('CarBody_2_Tail_Lights_Red_Cover_2_0')
  let group = scene.children[0].children[0].children[0]

  useFrame((state, delta) => {
    let t = state.clock.getElapsedTime() * 8

    group.children[0].rotation.x = t
    group.children[2].rotation.x = t
    group.children[4].rotation.x = t
    group.children[6].rotation.x = t
  })
  useLayoutEffect(() => {
    const newHeadlights = new MeshStandardMaterial({
      color: '#b7c0d7',
      emissive: '#b7c0d7',
      emissiveIntensity: 10.5,
      toneMapped: false,
    })
    const newTailLights = new MeshStandardMaterial({
      color: '#ff0000',
      emissive: '#ff0000',
      emissiveIntensity: 10,
      toneMapped: false,
    })
    switchMaterial(dayLightCover, newHeadlights)
    switchMaterial(blinkerGlassCover, newHeadlights)
    switchMaterial(tailLightsCover, newTailLights)
    Object.values(nodes).forEach((node) => node.isMesh && (node.receiveShadow = node.castShadow = true))
    applyProps(materials.Rubber, { color: '#222', roughness: 0.6, roughnessMap: null, normalScale: [4, 4] })
    applyProps(materials.Windows, { color: 'black', roughness: 0, clearcoat: 0.1 })
    applyProps(materials.Chrome, { envMapIntensity: 4, roughness: 0.5, metalness: 1 })
    applyProps(materials.Car_Paint, { envMapIntensity: 2, roughness: 0.45, metalness: 0.8, color: '#555' })
  }, [nodes, materials])
  return (
    <e.mesh
      theatreKey='Car'
      scale={[0.005, 0.005, 0.005]}
      position={[0, -0.035, 0]}
      castShadow
      receiveShadow
      envMapIntensity={20}
    >
      <primitive object={scene} {...props}>
        <meshStandardMaterial envMapIntensity={0.5} />
      </primitive>
    </e.mesh>
  )
}
