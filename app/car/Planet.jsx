'use client'
import React from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture, Detailed } from '@react-three/drei'
import { editable as e } from '@theatre/r3f'

export function Planet({ props }) {
  return (
    <>
      <Model props={{ props }} />
    </>
  )
}

function Model({ props }) {
  const [colorMap, displacementMap, normalMap] = useTexture([
    '/earth/color.jpg',
    '/earth/occlusion.jpg',
    '/earth/normal.png',
  ])
  return (
    <Detailed distances={[0, 10, 20]} {...props}>
      <e.mesh theatreKey='Earth' position={[0, 0, 0]} scale={0.01} {...props}>
        <sphereGeometry args={[200, 200, 200]} />
        <meshStandardMaterial map={colorMap} normalMap={normalMap} occlusionMap={displacementMap} />
      </e.mesh>
    </Detailed>
  )
}
