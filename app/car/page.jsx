'use client'
import * as THREE from 'three'
import React, { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { getProject, val } from '@theatre/core'
import studio from '@theatre/studio'
import extension from '@theatre/r3f/dist/extension'
import { editable as e, SheetProvider, PerspectiveCamera, useCurrentSheet } from '@theatre/r3f'
import {
  Environment,
  Lightformer,
  ContactShadows,
  OrbitControls,
  useTexture,
  ScrollControls,
  useScroll,
  Billboard,
  Loader,
  Stars,
  MeshReflectorMaterial,
  CubeCamera,
  Eff,
} from '@react-three/drei'
import { Suspense } from 'react'
import { EffectComposer, DepthOfField, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { suspend } from 'suspend-react'
import { Effects } from './Effects'
import { Lamborghini } from './Lamborghini'
import { FloatingGrid } from './FloatingGrid'
import Ground from './Ground'
const city = import('@pmndrs/assets/hdri/city.exr').then((module) => module.default)
studio.initialize()
studio.extend(extension)

const sequenceOnScroll = false

export default function CarPage() {
  const sheet = getProject('Lambo Landing').sheet('Content')
  return (
    <main className='h-screen bg-[#15151a]'>
      <Suspense fallback={null}>
        <Canvas
          gl={{ logarithmicDepthBuffer: true, antialias: false, preserveDrawingBuffer: true }}
          shadows
          className=''
        >
          <ScrollControls enabled={sequenceOnScroll} pages={5} damping={0.4} maxSpeed={0.3}>
            <SheetProvider sheet={sheet}>
              <Scene />
            </SheetProvider>
          </ScrollControls>
        </Canvas>
      </Suspense>
      <Loader />
    </main>
  )
}

export function Scene() {
  const sheet = useCurrentSheet()
  const scroll = useScroll()

  useFrame(() => {
    if (!sequenceOnScroll) return
    const sequenceLength = val(sheet.sequence.pointer.length)
    sheet.sequence.position = scroll.offset * sequenceLength >= 0 ? scroll.offset * sequenceLength : 0
  })
  return (
    <>
      <color attach='background' args={[0, 0, 0]} />
      <PerspectiveCamera theatreKey='Camera' makeDefault position={[0, 0, 70]} fov={50} />
      <CubeCamera resolution={256} frames={Infinity}>
        {(texture) => (
          <>
            <Environment map={texture} />
            <Lamborghini scale={0.005} />
          </>
        )}
      </CubeCamera>
      <Ground />
      <e.spotLight
        theatreKey='SpotLight1'
        color={[1, 0.25, 0.7]}
        intensity={1.5}
        angle={0.6}
        penumbra={0.5}
        position={[5, 5, 0]}
        castShadow
        shadow-bias={-0.0001}
      />
      <e.spotLight
        theatreKey='SpotLight2'
        color={[0.14, 0.5, 1]}
        intensity={2}
        angle={0.6}
        penumbra={0.5}
        position={[-5, 5, 0]}
        castShadow
        shadow-bias={-0.0001}
      />
      <FloatingGrid />
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
