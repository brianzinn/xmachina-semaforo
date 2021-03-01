import React, { Suspense } from 'react';
import { Color3, Color4, Vector3 } from '@babylonjs/core/Maths/math';
import { Scene, Engine, SceneLoaderContextProvider } from 'react-babylonjs';

import './App.css';
import Semaforo, { PedestrianLightsToShow } from './Semaforo';
import { ProgressFallback } from './ScaledModelWithProgress';
import { Transition } from 'xmachina';
import { useMachina } from './useMachina';
import { LightStateMap, TrafficLightState, TrafficLightTransition } from './MachinaTypes';
import { NextStateButtons } from './NextStateButtons';

const Manual = () => {
  const [trafficLightMachina, trafficLightState, trafficLightEvent] = useMachina<TrafficLightState, TrafficLightTransition, Transition<TrafficLightState, TrafficLightTransition>>(TrafficLightState.Green, new Map([
    [
      TrafficLightState.Green,
      {
        outEdges: [{
          on: TrafficLightTransition.TurnAmber,
          description: 'turn amber',
          nextState: TrafficLightState.Amber
        }],
      }
    ],
    [
      TrafficLightState.Amber,
      {
        outEdges: [{
          on: TrafficLightTransition.TurnRed,
          description: 'turn red',
          nextState: TrafficLightState.Red
        }],
      }
    ],
    [
      TrafficLightState.Red,
      {
        outEdges: [{
          on: TrafficLightTransition.TurnGreen,
          description: 'turn green',
          nextState: TrafficLightState.Green
        }]
      }
    ]
  ]));

  return (
    <div>
      <p style={{padding: 6}}>
        <h3><strong>xmachina + babylonjs</strong> (Manual)</h3>
        <div>Light Currently: <span style={{color: LightStateMap.get(trafficLightState.current)}}>{trafficLightState.current}</span></div>
        <NextStateButtons machina={trafficLightMachina} />
        {trafficLightEvent !== null &&
          <div>Last Event <strong>{trafficLightEvent.event}</strong> from <strong>{trafficLightEvent.value.old ?? 'n/a'}</strong> to: <strong>{trafficLightEvent.value.new}</strong>.</div>
        }
      </p>
      <Engine antialias adaptToDeviceRatio canvasId='babylonJS'>
        <Scene clearColor={new Color4(0.2, 0.4, 0.75, 1.0)}>
          <arcRotateCamera name="arc" target={new Vector3(0, 1, 0)}
            alpha={7 * Math.PI / 8} beta={3 * Math.PI/8}
            radius={3} minZ={0.001} wheelPrecision={50}
            lowerRadiusLimit={0.25} upperRadiusLimit={8} upperBetaLimit={Math.PI / 2}
          />
          <hemisphericLight name='hemi' direction={Vector3.Up()} intensity={0.8} />
          <SceneLoaderContextProvider>
            <Suspense fallback={<ProgressFallback name='lights-fallback' progressBarColor={Color3.Red()} rotation={new Vector3(0, -3 * Math.PI / 8, 0)} center={new Vector3(0, 0.75, 0)} scaleTo={1} />}>
              <Semaforo trafficLightState={trafficLightState} pedestrianLightsToShow={trafficLightState.current === TrafficLightState.Red ? PedestrianLightsToShow.Walk : PedestrianLightsToShow.Wait} showDebug={false} />
            </Suspense>
          </SceneLoaderContextProvider>
        </Scene>
      </Engine>
    </div>
  );
}

export default Manual;
