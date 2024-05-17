'use client'

import { useEffect, useState } from 'react'
import { FaceLandmarker, FaceLandmarkerOptions, FilesetResolver } from '@mediapipe/tasks-vision'
import { Color, Euler, Matrix4 } from 'three'
import { Canvas, useFrame, useGraph } from '@react-three/fiber'
import { Text, useGLTF } from '@react-three/drei'
import { useDropzone } from 'react-dropzone'
import { FaceLandmarkerDefaults } from '@react-three/drei'
import { MotionCanvas, motion as motion3d } from 'framer-motion-3d'
import { MotionConfig, motion } from 'framer-motion'
const visionBasePath = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@x.y.z/wasm'
const modelAssetPath =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task'

export default function Page() {
  const faceLandmarkerOptions = { ...FaceLandmarkerDefaults.options }
  faceLandmarkerOptions.baseOptions.modelAssetPath = modelAssetPath
  return (
    <main className=''>
      <MotionConfig transition={{ type: 'spring' }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
          <MotionCanvas>
            <Text color='black' fontSize={1} position={[0, 0, 0]} rotation={[0, 0, 0]}>
              Update image or give us permission to use your webcam
            </Text>
            <Face basePath={visionBasePath} options={faceLandmarkerOptions} />
          </MotionCanvas>
        </motion.div>
      </MotionConfig>
    </main>
  )
}

function Face({ basePath, options }) {
  return <FaceLandmarker basePath={basePath} options={options} />
}
