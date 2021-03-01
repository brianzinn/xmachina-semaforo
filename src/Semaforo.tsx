import React from 'react';
import { ILoadedModel, useSceneLoader, useScene } from "react-babylonjs";
// for side-effects
import '@babylonjs/loaders/OBJ';
import '@babylonjs/inspector';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { MachinaState, Transition } from 'xmachina';
import { TrafficLightState, TrafficLightTransition } from './MachinaTypes';

export enum PedestrianLightsToShow {
  None,
  Walk,
  Wait
}

type SemaforoProps = {
  trafficLightState: MachinaState<TrafficLightState, TrafficLightTransition, Transition<TrafficLightState, TrafficLightTransition>>
  pedestrianLightsToShow: PedestrianLightsToShow
  showDebug: boolean
}

const Semaforo = (props: SemaforoProps) => {
  const scene = useScene()!;
  if (props.showDebug) {
    scene.debugLayer.show();
  }

  const loadedModel = useSceneLoader('models/semaforo/', 'semaforo.obj', undefined, {
    reportProgress: true,
    scaleToDimension: 2,
    receiveShadows: true
  });

  return (
    <>
      <abstractMesh name='red' fromInstance={loadedModel.meshes?.find(m => m.name === 'mesh_mm2')}>
        <standardMaterial name='red-mat' assignFrom='material' disableLighting={props.trafficLightState.current === TrafficLightState.Red} />
        {props.trafficLightState.current === TrafficLightState.Red &&
          <spotLight name='red-light' direction={new Vector3(0, 0, Math.PI)} intensity={8} angle={102} exponent={5}
              diffuse={Color3.Red()}
              specular={Color3.Red()}
              position={new Vector3(0, 5, 0)}
          />
        }
      </abstractMesh>
      <abstractMesh name='amber' fromInstance={loadedModel.meshes?.find(m => m.name === 'mesh_mm1' && m.material?.name==='ambar')}>
        <standardMaterial name='amber-mat' assignFrom='material' disableLighting={props.trafficLightState.current === TrafficLightState.Amber} />
        {props.trafficLightState.current === TrafficLightState.Amber &&
          <spotLight name='amber-light' direction={new Vector3(0, 0, Math.PI)} intensity={8} angle={102} exponent={5}
              diffuse={Color3.FromInts(231,180,22)}
              specular={Color3.FromInts(231,180,22)}
              position={new Vector3(0, 4.55, 0)}
          />
        }
      </abstractMesh>
      <abstractMesh name='green' fromInstance={loadedModel.meshes?.find(m => m.name === 'lights_Sphere.008')}>
        <standardMaterial name='green-mat' assignFrom='material' disableLighting={props.trafficLightState.current === TrafficLightState.Green} />
        {props.trafficLightState.current === TrafficLightState.Green &&
          <spotLight name='green-light' direction={new Vector3(0, 0, Math.PI)} intensity={8} angle={102} exponent={5}
              diffuse={Color3.FromInts(45,201,55)}
              specular={Color3.FromInts(45,201,55)}
              position={new Vector3(0, 4.1, 0)}
          />
        }
      </abstractMesh>
      <abstractMesh name='walk' fromInstance={loadedModel.meshes?.find(m => m.name === 'mesh_mm1' && m.material?.name==='go')}>
        <standardMaterial name='walk-mat' assignFrom='material' emissiveColor={props.pedestrianLightsToShow === PedestrianLightsToShow.Walk ? Color3.White() : Color3.Black()} />
      </abstractMesh>
      <abstractMesh name='stop' fromInstance={loadedModel.meshes?.find(m => m.name === 'humans_Cube.007')}>
        <standardMaterial name='stop-mat' assignFrom='material' emissiveColor={props.pedestrianLightsToShow === PedestrianLightsToShow.Wait ? Color3.White() : Color3.Black()} />
      </abstractMesh>

      <box name='traffic-base' position={new Vector3(0, 0, 0)} height={0.01} />
    </>
  )
}

export default Semaforo;