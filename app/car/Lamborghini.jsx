'use client'
import * as THREE from 'three'
import { useMemo } from 'react'
import { applyProps } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

/*
Author: Steven Grey (https://sketchfab.com/Steven007)
License: CC-BY-NC-4.0 (http://creativecommons.org/licenses/by-nc/4.0/)
Source: https://sketchfab.com/3d-models/lamborghini-urus-2650599973b649ddb4460ff6c03e4aa2
Title: Lamborghini Urus
*/
export function Lamborghini(props) {
  const { scene, nodes, materials } = useGLTF('/car/lambo.glb')

  return <primitive object={scene} {...props} />
}
