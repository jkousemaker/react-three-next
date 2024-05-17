'use client'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { CubeCamera, Environment, OrbitControls, Loader, ScrollControls, useScroll } from '@react-three/drei'
import { getProject, val } from '@theatre/core'
import studio from '@theatre/studio'
import extension from '@theatre/r3f/dist/extension'
import { editable as e, SheetProvider, PerspectiveCamera, useCurrentSheet } from '@theatre/r3f'
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing'
import { ToneMappingMode, BlendFunction } from 'postprocessing'
import { LensFlare } from '@react-three/postprocessing'
import { Planet } from './Planet'
import { Ground } from './Ground'

import { Car } from './Car'

import { Lightformers } from './effects/Lightformers'

if (process.env.NODE_ENV === 'development') {
  studio.initialize()
  studio.extend(extension)
}

const sequenceOnScroll = false
const orbitControls = false
const spotlight = true
const ambientLight = true
const lightFormers = false

function Scene() {
  const sheet = useCurrentSheet()
  const data = useScroll()
  console.log(sheet, data)

  useFrame(() => {
    if (!sequenceOnScroll) return

    const sequenceLength = val(sheet.sequence.pointer.length)
    sheet.sequence.position = data.offset * sequenceLength >= 0 ? data.offset * sequenceLength : 0
  })
  return (
    <>
      {orbitControls && <OrbitControls />}

      <PerspectiveCamera theatreKey='Camera' makeDefault fov={50} position={[0, 2.5, 13]} />
      {spotlight && <e.spotLight theatreKey='Spotlight' color='#fff' />}
      {ambientLight && <ambientLight intensity={1.5} />}
      {lightFormers && <Lightformers />}
      <color args={['#09090a']} attach='background' />
      <CubeCamera resolution={256} frames={Infinity}>
        {(texture) => (
          <>
            <Environment map={texture} />
            <Car dataScroll={data} />
          </>
        )}
      </CubeCamera>
      <Planet />
      <Ground />

      <EffectComposer disableNormalPass>
        <Bloom mipmapBlur luminanceThreshold={1} blendFunction={BlendFunction.SCREEN} levels={8} intensity={0.4 * 4} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </>
  )
}

export default function CarPage() {
  const sheet = getProject('Rolls Royce').sheet('Content')

  return (
    <main className='min-h-screen bg-[#09090a]'>
      <section className='h-screen'>
        <Canvas shadows gl={{ preserveDrawingBuffer: true }} className='!h-full'>
          <Suspense fallback={null}>
            <ScrollControls enabled={sequenceOnScroll} pages={5} damping={0.4} maxSpeed={0.3} on>
              <SheetProvider sheet={sheet}>
                <Scene />
              </SheetProvider>
            </ScrollControls>
          </Suspense>
        </Canvas>
        <Loader />
      </section>
    </main>
  )
}
