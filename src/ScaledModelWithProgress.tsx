import React, { useContext } from 'react'
import { Vector3, Matrix, Color3 } from '@babylonjs/core/Maths/math'

import { SceneLoaderContext } from 'react-babylonjs';

export type FallbackProgressType = {
  name: string
  scaleTo: number
  center: Vector3,
  rotation: Vector3
  progressBarColor: Color3
}

export const ProgressFallback = (props: FallbackProgressType) => {
  const sceneLoaderContext = useContext(SceneLoaderContext);

  let loadProgress = 0;
  if (sceneLoaderContext?.lastProgress) {
    const progress = sceneLoaderContext.lastProgress;
    loadProgress = progress.lengthComputable
      ? progress.loaded / progress.total
      : progress.loaded / 10000; // TODO: provide option to input file size for proper loading.
  }

  return (
    <transformNode name={`{props.name}-fallback-transform`} rotation={props.rotation} position={props.center}>
      <box key='progress' name={`${props.name}-box-progress`} height={props.scaleTo / 15} width={props.scaleTo} depth={props.scaleTo / 30} scaling={new Vector3(loadProgress, 1, 1)}
        position={new Vector3(props.scaleTo / 2, 0, props.scaleTo / 60)}
        setPivotMatrix={[Matrix.Translation(-props.scaleTo, 0, 0)]}
        setPreTransformMatrix={[Matrix.Translation(-props.scaleTo / 2, 0, 0)]}>
        <standardMaterial name={`${props.name}-progress-mat`} diffuseColor={props.progressBarColor} specularColor={Color3.Black()} />
      </box>
      <box key='back' name={`${props.name}-box-back`} height={props.scaleTo / 15} width={props.scaleTo} depth={props.scaleTo / 30}
        position={new Vector3(0, 0, props.scaleTo / -60)}
      />
    </transformNode>
  )
}
