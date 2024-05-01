'use client'
import { useRef, useEffect, useState } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import {
  useGLTF,
  Caustics,
  CubeCamera,
  Environment,
  OrbitControls,
  RandomizedLight,
  AccumulativeShadows,
  MeshRefractionMaterial,
  MeshTransmissionMaterial,
} from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { useControls } from 'leva'
import { RGBELoader } from 'three-stdlib'
import { getProject } from '@theatre/core'
import studio from '@theatre/studio'
import extension from '@theatre/r3f/dist/extension'
import { editable as e, SheetProvider, PerspectiveCamera } from '@theatre/r3f'

import diamondState from './state.json'
import { Diamond } from './Diamond'

if (process.env.NODE_ENV === 'development') {
  studio.initialize()
  studio.extend(extension)
}
const diamondSheet = getProject('Diamond landingpage', { state: diamondState }).sheet('Diamond landingpage')
export default function DiamondPage() {
  return (
    <Canvas shadows gl={{ preserveDrawingBuffer: true }}>
      <Scene />
    </Canvas>
  )
}

export function Scene() {
  const [finished, setFinished] = useState(false)
  useEffect(() => {
    function load() {
      diamondSheet.project.ready.then(() =>
        diamondSheet.sequence.play({ iterationCount: 1 }).then(() => console.log('done')),
      )
    }
    load()
  }, [])
  return (
    <SheetProvider sheet={diamondSheet}>
      <color attach='background' args={['#f0f0f0']} />
      <e.ambientLight theatreKey='ambientLight' intensity={0.5 * Math.PI} />
      <e.pointLight theatreKey='pointLight' decay={0} position={[-10, -10, -10]} />
      <PerspectiveCamera theatreKey='Camera' makeDefault position={[5, 5, -5]} fov={75} />
      <Diamond rotation={[0, 0, 0.715]} position={[0, -0.175 + 0.5, 0]} />
      <Caustics
        color='#FF8F20'
        position={[0, -0.5, 0]}
        lightSource={[5, 5, -10]}
        worldRadius={0.01}
        ior={1.2}
        intensity={0.005}
      >
        <e.mesh theatreKey='sphere1' castShadow receiveShadow position={[-2, 0.5, -1]} scale={0.5}>
          <sphereGeometry args={[1, 64, 64]} />
          <MeshTransmissionMaterial resolution={1024} distortion={0.25} color='#FF8F20' thickness={1} anisotropy={1} />
        </e.mesh>
      </Caustics>
      <e.mesh theatreKey='sphere2' castShadow receiveShadow position={[1.75, 0.25, 1]} scale={0.75}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial color='hotpink' />
      </e.mesh>
      <AccumulativeShadows
        temporal
        frames={100}
        color='orange'
        colorBlend={2}
        toneMapped={true}
        alphaTest={0.7}
        opacity={1}
        scale={12}
        position={[0, -0.5, 0]}
      >
        <RandomizedLight amount={8} radius={10} ambient={0.5} position={[5, 5, -10]} bias={0.001} />
      </AccumulativeShadows>
      <Environment files='https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr' />
      <OrbitControls enabled={finished} />
      <EffectComposer>
        <Bloom luminanceThreshold={1} intensity={2} levels={9} mipmapBlur />
      </EffectComposer>
    </SheetProvider>
  )
}
