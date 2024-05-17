'use client'
import { useRef } from 'react'
import { useLoader } from '@react-three/fiber'
import { useGLTF, Caustics, CubeCamera, MeshRefractionMaterial } from '@react-three/drei'
import { RGBELoader } from 'three-stdlib'

export default function Diamond(props) {
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
    color: 'white',
  })
  return (
    <CubeCamera resolution={256} frames={1} envMap={texture}>
      {(texture) => (
        <Caustics
          backfaces
          color={config.color}
          position={[0, -0.5, 0]}
          lightSource={[5, 5, -10]}
          worldRadius={0.1}
          ior={1.8}
          backfaceIor={1.1}
          intensity={0.1}
        >
          <mesh castShadow ref={ref} geometry={nodes.Diamond_1_0.geometry} {...props}>
            <MeshRefractionMaterial envMap={texture} {...config} toneMapped={false} />
          </mesh>
        </Caustics>
      )}
    </CubeCamera>
  )
}
