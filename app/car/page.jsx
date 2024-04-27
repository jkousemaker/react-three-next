'use client'
import * as THREE from 'three'
import React, { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { getProject } from '@theatre/core'
import studio from '@theatre/studio'
import extension from '@theatre/r3f/dist/extension'
import { editable as e, SheetProvider, PerspectiveCamera } from '@theatre/r3f'
studio.initialize()
studio.extend(extension)
import {
  Environment,
  RoundedBox,
  PresentationControls,
  GradientTexture,
  useSpriteLoader,
  useTexture,
} from '@react-three/drei'

export default function CarPage() {
  return (
    <Canvas gl={{ preserveDrawingBuffer: true }}>
      <Scene />
    </Canvas>
  )
}

export function Scene() {
  const [colorMap, displacementMap, normalMap] = useTexture([
    '/earth/color.jpg',
    '/earth/occlusion.jpg',
    '/earth/normal.png',
  ])

  return (
    <>
      <SheetProvider sheet={getProject('Demo Project').sheet('Demo Sheet')}>
        <PerspectiveCamera theatreKey='MainCamera' makeDefault position={[0, 0, 100]} />
        <e.ambientLight theatreKey='AmbientLight' intensity={1} />
        <e.directionalLight theatreKey='DirectionalLight' position={[0, 0, 5]} intensity={1} />
        <e.mesh theatreKey='Box'>
          <boxGeometry args={[100, 100, 10]} />
          <meshBasicMaterial color='white' />
        </e.mesh>
        <e.mesh theatreKey='Road'>
          <boxGeometry args={[10, 10, 1]} />
          <meshStandardMaterial color='orange' />
        </e.mesh>
        <e.mesh theatreKey='Moon'>
          <sphereGeometry args={[100, 100, 100]} />
          <meshStandardMaterial map={colorMap} normalMap={normalMap} occlusionMap={displacementMap} />
        </e.mesh>
      </SheetProvider>
    </>
  )
}

const Moon = ({ props }) => {}
