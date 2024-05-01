'use client'
import React, { useEffect, useLayoutEffect } from 'react'
import { useFrame, useLoader, applyProps } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { editable as e } from '@theatre/r3f'
// based on "Chevrolet Corvette (C7)" (https://sketchfab.com/3d-models/chevrolet-corvette-c7-2b509d1bce104224b147c81757f6f43a)
// by Martin Trafas (https://sketchfab.com/Bexxie) licensed under CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
export function Car(props) {
  const { scene, nodes, materials } = useGLTF('models/car/scene.gltf')
  console.log(nodes)
  useFrame((state, delta) => {
    let t = state.clock.getElapsedTime() * 8

    let group = scene.children[0].children[0].children[0]

    group.children[0].rotation.x = t
    group.children[2].rotation.x = t
    group.children[4].rotation.x = t
    group.children[6].rotation.x = t
  })
  useLayoutEffect(() => {
    Object.values(nodes).forEach((node) => node.isMesh && (node.receiveShadow = node.castShadow = true))
    applyProps(materials.Rubber, { color: '#222', roughness: 0.6, roughnessMap: null, normalScale: [4, 4] })
    applyProps(materials.Windows, { color: 'black', roughness: 0, clearcoat: 0.1 })
    applyProps(materials.Tail_Lights_Red_Cover, { color: '#ff0000', intensity: 50 })
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
      <primitive object={scene} {...props}></primitive>
    </e.mesh>
  )
}
