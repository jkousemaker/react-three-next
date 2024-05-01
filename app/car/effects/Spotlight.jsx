'use client'
import React from 'react'
import { SpotLight as SpotLightDrei } from '@react-three/drei'

import { Vector3 } from 'three'

export function Spotlight({ vec = new Vector3(), ...props }) {
  return (
    <SpotLightDrei
      //castShadow
      penumbra={0.5}
      distance={10}
      angle={0.8}
      attenuation={4}
      intensity={100}
      //shadowBias={-0.0001}
      {...props}
    />
  )
}
