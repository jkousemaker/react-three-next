'use client'
import { useFrame, useLoader } from '@react-three/fiber'
import { useEffect } from 'react'
import { RepeatWrapping, TextureLoader } from 'three'
import { useTexture } from '@react-three/drei'

export function FloatingGrid() {
  const [map] = useTexture(['/car/textures/grid-texture.png'])
  useEffect(() => {
    map.wrapS = RepeatWrapping
    map.wrapT = RepeatWrapping
    map.anisotropy = 4
    map.repeat.set(30, 30)
    map.offset.set(0, 0)
  }, [map])

  useFrame((state, delta) => {
    let t = -state.clock.getElapsedTime() * 0.68
    map.offset.set(0, t)
  })

  return (
    <>
      <mesh rotation-x={-Math.PI * 0.5} position={[0, 0.425, 0]}>
        <planeGeometry args={[35, 35]} />
        <meshBasicMaterial color={[1, 1, 1]} opacity={0.15} map={map} alphaMap={map} transparent={true} />
      </mesh>
    </>
  )
}
