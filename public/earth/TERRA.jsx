/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.16 TERRA.glb 
*/

import React, { useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'

export function Model(props) {
  const group = useRef()
  const { nodes, materials, animations } = useGLTF('/TERRA.glb')
  const { actions } = useAnimations(animations, group)
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Armature">
          <primitive object={nodes.Bone} />
        </group>
        <mesh name="EARTH" geometry={nodes.EARTH.geometry} material={materials['Material.003']} />
      </group>
    </group>
  )
}

useGLTF.preload('/TERRA.glb')