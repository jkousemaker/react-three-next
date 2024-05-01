'use client'
import React, { Suspense, useRef } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import {
  CubeCamera,
  Environment,
  OrbitControls,
  useDepthBuffer,
  Loader,
  ScrollControls,
  useScroll,
} from '@react-three/drei'
import { getProject, val } from '@theatre/core'
import studio from '@theatre/studio'
import extension from '@theatre/r3f/dist/extension'
import { editable as e, SheetProvider, PerspectiveCamera, useCurrentSheet } from '@theatre/r3f'
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing'
import { ToneMappingMode, BlendFunction } from 'postprocessing'

import { Planet } from './Planet'
import { Ground } from './Ground'
import { FloatingGrid } from './FloatingGrid'
import { Car } from './Car'
import { Rings } from './Rings'
import { Boxes } from './Boxes'

import { Spotlight } from './effects/Spotlight'
import { Lightformers } from './effects/Lightformers'
import { CameraRig } from './effects/CameraRig'

studio.initialize()
studio.extend(extension)

const sequenceOnScroll = false
const spotlight = false
const ambientLight = true
const lightFormers = false

function Scene() {
  const depthBuffer = useDepthBuffer({ frames: 1, size: 1000 })
  const sheet = useCurrentSheet()
  const scroll = useScroll()

  useFrame(() => {
    if (!sequenceOnScroll) return
    const sequenceLength = val(sheet.sequence.pointer.length)
    sheet.sequence.position = scroll.offset * sequenceLength >= 0 ? scroll.offset * sequenceLength : 0
  })
  return (
    <>
      {!sequenceOnScroll && <OrbitControls />}

      <PerspectiveCamera theatreKey='Camera' makeDefault fov={50} position={[3, 2, 5]} />

      <color args={[0, 0, 0]} attach='background' />
      <CubeCamera resolution={256} frames={Infinity}>
        {(texture) => (
          <>
            <Environment map={texture} />
            <Car />
          </>
        )}
      </CubeCamera>

      {spotlight && <Spotlight depthBuffer={depthBuffer} color='#fff' position={[2, 4, 0]} />}
      {ambientLight && <ambientLight intensity={0.5} />}
      {lightFormers && <Lightformers />}
      <Ground />
      <Planet />

      {/*
      <CameraRig />
      */}
      <EffectComposer disableNormalPass>
        <Bloom mipmapBlur luminanceThreshold={1} blendFunction={BlendFunction.LIGHTEN} levels={8} intensity={0.4 * 4} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </>
  )
}

export default function CarPage() {
  const sheet = getProject('Car Page').sheet('Content')
  return (
    <main className='h-screen bg-[#15151a]'>
      <Canvas shadows gl={{ preserveDrawingBuffer: true }}>
        <Suspense fallback={null}>
          <ScrollControls enabled={sequenceOnScroll} pages={5} damping={0.4} maxSpeed={0.3}>
            <SheetProvider sheet={sheet}>
              <Scene />
            </SheetProvider>
          </ScrollControls>
        </Suspense>
      </Canvas>

      <Loader />
    </main>
  )
}
