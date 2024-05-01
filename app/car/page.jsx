'use client'
import * as THREE from 'three'
import React, { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { getProject } from '@theatre/core'
import studio from '@theatre/studio'
import extension from '@theatre/r3f/dist/extension'
import { editable as e, SheetProvider, PerspectiveCamera } from '@theatre/r3f'
import { Environment, Lightformer, ContactShadows, OrbitControls, useTexture } from '@react-three/drei'
import { Effects } from './Effects'
import { Lamborghini } from './Lamborghini'

studio.initialize()
studio.extend(extension)

export default function CarPage() {
  return (
    <Canvas
      gl={{ logarithmicDepthBuffer: true, antialias: false, preserveDrawingBuffer: true }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 15], fov: 25 }}
    >
      <Scene />
    </Canvas>
  )
}

export function Scene() {
  return (
    <>
      <SheetProvider sheet={getProject('Lambo showcase').sheet('Lambo showcase')}>
        <color attach='background' args={['#15151a']} />
        <Moon />
        <Lamborghini rotation={[0, Math.PI / 1.5, 0]} scale={0.015} />
        <hemisphereLight intensity={0.5} />
        <ContactShadows
          resolution={1024}
          frames={1}
          position={[0, -1.16, 0]}
          scale={15}
          blur={0.5}
          opacity={1}
          far={20}
        />
        <mesh scale={4} position={[3, -1.161, -1.5]} rotation={[-Math.PI / 2, 0, Math.PI / 2.5]}>
          <ringGeometry args={[0.9, 1, 4, 1]} />
          <meshStandardMaterial color='white' roughness={0.75} />
        </mesh>
        <mesh scale={4} position={[-3, -1.161, -1]} rotation={[-Math.PI / 2, 0, Math.PI / 2.5]}>
          <ringGeometry args={[0.9, 1, 3, 1]} />
          <meshStandardMaterial color='white' roughness={0.75} />
        </mesh>
        {/* We're building a cube-mapped environment declaratively.
          Anything you put in here will be filmed (once) by a cubemap-camera
          and applied to the scenes environment, and optionally background. */}
        <Environment resolution={512}>
          {/* Ceiling */}
          <Lightformer intensity={20} rotation-x={Math.PI / 2} position={[0, 4, -9]} scale={[10, 1, 1]} />
          <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, -6]} scale={[10, 1, 1]} />
          <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, -3]} scale={[10, 1, 1]} />
          <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, 0]} scale={[10, 1, 1]} />
          <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, 3]} scale={[10, 1, 1]} />
          <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, 6]} scale={[10, 1, 1]} />
          <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, 9]} scale={[10, 1, 1]} />
          {/* Sides */}
          <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-50, 2, 0]} scale={[100, 2, 1]} />
          <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[50, 2, 0]} scale={[100, 2, 1]} />
          {/* Key */}
          <Lightformer
            form='ring'
            color='red'
            intensity={10}
            scale={2}
            position={[10, 5, 10]}
            onUpdate={(self) => self.lookAt(0, 0, 0)}
          />
        </Environment>
        <Effects />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 2.2}
          maxPolarAngle={Math.PI / 2.2}
        />
      </SheetProvider>
    </>
  )
}

const Moon = ({ props }) => {
  const [colorMap, displacementMap, normalMap] = useTexture([
    '/earth/color.jpg',
    '/earth/occlusion.jpg',
    '/earth/normal.png',
  ])
  return (
    <e.mesh theatreKey='Moon' position={[0, 0, -540]} {...props}>
      <sphereGeometry args={[10, 10, 10]} />
      <meshStandardMaterial map={colorMap} normalMap={normalMap} occlusionMap={displacementMap} />
    </e.mesh>
  )
}
