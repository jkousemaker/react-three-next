'use client'
import { useRef, Suspense, useEffect, useState } from 'react'
import { Canvas, useLoader, useThree, Text, useFrame } from '@react-three/fiber'
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
  Loader,
  Text3D,
  Center,
  Float,
  useMatcapTexture,
} from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { useControls } from 'leva'
import { RGBELoader } from 'three-stdlib'
import { getProject, val } from '@theatre/core'
import studio from '@theatre/studio'
import extension from '@theatre/r3f/dist/extension'
import { editable as e, SheetProvider, PerspectiveCamera, useCurrentSheet } from '@theatre/r3f'
import Sheet from './Moissanite-Sheet.json'
if (process.env.NODE_ENV === 'development') {
  studio.initialize()
  studio.extend(extension)
}
const moissaniteSheet = getProject('Moissanite', { state: Sheet }).sheet('Content')
function Diamond({ props, finished }) {
  const ref = useRef()
  const { nodes } = useGLTF('/dflat.glb')
  // Use a custom envmap/scene-backdrop for the diamond material
  // This way we can have a clear BG while cube-cam can still film other objects
  const texture = useLoader(
    RGBELoader,
    'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr',
  )
  // Optional config
  const config = useControls({
    bounces: { value: 3, min: 0, max: 8, step: 1 },
    aberrationStrength: { value: 0.01, min: 0, max: 0.1, step: 0.01 },
    ior: { value: 2.75, min: 0, max: 10 },
    fresnel: { value: 1, min: 0, max: 1 },
    stoneColor: 'white',
  })
  useFrame((_, delta) => {
    //if (finished) ref.current.rotation.y += delta * 0.1
  })
  return (
    <CubeCamera resolution={256} frames={1} envMap={texture}>
      {(texture) => (
        <e.mesh theatreKey='Stone' castShadow ref={ref} geometry={nodes.Diamond_1_0.geometry} {...props}>
          <MeshRefractionMaterial envMap={texture} {...config} toneMapped={false} />
        </e.mesh>
      )}
    </CubeCamera>
  )
}

function Scene({ props, finished }) {
  const ref = useRef()

  const { width: w, height: h } = useThree((state) => state.viewport)
  const config = useControls(
    {
      height: { value: 0, min: 0, max: 1, step: 0.01 },
      letterSpacing: { value: 0.07, min: -0.5, max: 0.5, step: 0.01 },
      lineHeight: { value: 2.3, min: 0, max: 10, step: 0.1 },
      size: { value: 0.26, min: 0, max: 2, step: 0.01 },
      curveSegments: 32,
      bevelEnabled: true,
      bevelThickness: { value: 0.05, min: 0, max: 0.5, step: 0.01 },
      bevelSize: { value: 0.05, min: 0, max: 1, step: 0.01 },
      bevelOffset: { value: 0, min: 0, max: 0.25, step: 0.001 },
      bevelSegments: { value: 3, min: 0, max: 8, step: 1 },
      textColor: 'black',
    },
    { hidden },
  )

  return (
    <>
      <PerspectiveCamera theatreKey='Camera' makeDefault fov={50} />
      <color attach='background' args={['#f0f0f0']} />
      <ambientLight intensity={0.5 * Math.PI} />
      <spotLight decay={0} position={[5, 5, -10]} angle={0.15} penumbra={1} />
      <pointLight decay={0} position={[-10, -10, -10]} />
      <e.group theatreKey='Text'>
        <Text3D {...config} font='/Roboto_Bold.json'>
          {`Moissanite:\nUnparalleled fire`}
          <meshNormalMaterial />
        </Text3D>
      </e.group>
      <Diamond finished={finished} />
      {/* <OrbitControls makeDefault autoRotate autoRotateSpeed={0.1} minPolarAngle={0} maxPolarAngle={Math.PI / 2} /> */}
      <EffectComposer>
        <Bloom luminanceThreshold={1} intensity={2} levels={9} mipmapBlur />
      </EffectComposer>
    </>
  )
}

export default function App() {
  const [finished, setFinished] = useState(false)
  useEffect(() => {
    moissaniteSheet.project.ready.then(() => moissaniteSheet.sequence.play({}).then(() => setFinished(true)))
  }, [])
  return (
    <main className='min-h-screen bg-white'>
      <section className='h-screen'>
        <Canvas shadows gl={{ preserveDrawingBuffer: true }} className='!h-full'>
          <Suspense fallback={null}>
            <SheetProvider sheet={moissaniteSheet}>
              <Scene finished={finished} />
            </SheetProvider>
          </Suspense>
        </Canvas>
        <Loader />
      </section>
    </main>
  )
}
