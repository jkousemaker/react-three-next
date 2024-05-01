'use client'
import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'

export function CameraRig({ v = new Vector3() }) {
  return useFrame((state) => {
    const t = state.clock.elapsedTime
    state.camera.position.lerp(v.set(Math.sin(t / 5), 0, 12 + Math.cos(t / 5) / 2), 0.05)
    state.camera.lookAt(0, 0, 0)
  })
}
