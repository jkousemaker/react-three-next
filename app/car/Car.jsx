'use client'
import { MeshStandardMaterial } from 'three'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useFrame, useLoader, applyProps } from '@react-three/fiber'
import { useGLTF, ComputedAttribute, useAnimations } from '@react-three/drei'
import { editable as e } from '@theatre/r3f'
import { motion } from 'framer-motion-3d'
import * as THREE from 'three'

function switchMaterial(node, material) {
  node.traverse((o) => {
    if (o.isMesh) o.material = material
  })
}

export function Car({ dataScroll }, props) {
  const { scene, nodes, materials, animations } = useGLTF('rr.glb')
  const { ref, mixer, names, actions, clips } = useAnimations(animations)
  console.log(actions)
  const driverDoor = {
    door: scene.getObjectByName('rrghost_door_FR'),
    mirror: scene.getObjectByName('rrghost_mirror_R'),
    window: scene.getObjectByName('rrghost_doorglass_FR'),
    handle: scene.getObjectByName('rrghost_door_FR_rrghost_main_0'),
  }
  const [dpr, setDpr] = useState(1.5)
  //const doorRotate = useTransform(driverDoor.door.rotation.x, [-1.5707964897155757])
  //const dayLightCover = scene.getObjectByName('CarBody_2_Daylight_Cover_0')
  //const blinkerGlassCover = scene.getObjectByName('CarBody_2_Blinker_Glass_Cover_0')
  //const tailLightsCover = scene.getObjectByName('CarBody_2_Tail_Lights_Red_Cover_2_0')
  //console.log(scene, test)
  /*useFrame((state, delta) => {
    let t = state.clock.getElapsedTime() * 8

    group.children[0].rotation.x = t
    group.children[2].rotation.x = t
    group.children[4].rotation.x = t
    group.children[6].rotation.x = t
  })*/
  useEffect(() => {
    console.log(true)
    setTimeout(() => {
      //actions.EmptyAction.play()
    }, 5000)

    // Optionally, animate the window or other parts
    //driverDoor.window.rotation.y += 0.01
    /*const newHeadlights = new MeshStandardMaterial({
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
    applyProps(materials.Car_Paint, { envMapIntensity: 2, roughness: 0.45, metalness: 0.8, color: '#555' })*/
    //applyProps(driverDoor.window, { color: 'black', roughness: 0, clearcoat: 0.1 })
    //console.log(driverDoor)
  }, [])
  useFrame(() => {
    const newTailLights = new MeshStandardMaterial({
      color: '#ff0000',
      emissive: '#ff0000',
      emissiveIntensity: 10,
      toneMapped: false,
    })

    driverDoor.handle.material.color = new THREE.Color(0xff0000)
    driverDoor.handle.material.emissive = new THREE.Color(0xff0000)
    driverDoor.handle.material.emissiveIntensity = 100
  })
  return (
    <>
      <e.mesh
        ref={ref}
        theatreKey='Car'
        scale={[1, 1, 1]}
        position={[0, -0.035, 0]}
        castShadow
        receiveShadow
        envMapIntensity={20}
      >
        <primitive object={scene} {...props}>
          <meshStandardMaterial envMapIntensity={0.5} />
        </primitive>
      </e.mesh>
    </>
  )
}
