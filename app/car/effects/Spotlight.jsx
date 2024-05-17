'use client'
import React from 'react'
import { SpotLight } from '@react-three/drei'
import { editable as e } from '@theatre/r3f'

export function Spotlight(...props) {
  return <SpotLight castShadow penumbra={1} decay={2} intensity={100} position={[5, 5, 15]} {...props} />
}
