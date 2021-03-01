import React, { Suspense, useState, useEffect } from 'react';
import { Color3, Color4, Vector3 } from '@babylonjs/core/Maths/math';
import { Scene, Engine, SceneLoaderContextProvider } from 'react-babylonjs';

import './App.css';
import Semaforo, { PedestrianLightsToShow } from './Semaforo';
import { ProgressFallback } from './ScaledModelWithProgress';
import { NodeState, Transition } from 'xmachina';
import { useMachina } from './useMachina';
import { LightStateMap, PedestrianLightState, PedestrianLightTransition, TrafficLightState, TrafficLightTransition } from './MachinaTypes';

const GREEN_LIGHT_DURATION_MILLIS = 2500;
const AMBER_LIGHT_DURATION_MILLIS = 700;
const WALK_DURATION_MILLIS = 3500;
const WAIT_DURATION_MILLIS = 4000;

const Automated = () => {
  const [pedestrianLightsToShow, setPedestrianLightsToShow] = useState<PedestrianLightsToShow>(PedestrianLightsToShow.Wait);

  const [pedestrianLightMachina, pedestrianLightState] = useMachina<PedestrianLightState, PedestrianLightTransition, Transition<PedestrianLightState, PedestrianLightTransition>>(PedestrianLightState.Stop, new Map([
    [
      PedestrianLightState.Wait,
      {
        outEdges: [{
          on: PedestrianLightTransition.ToStop,
          description: 'Stop Walking',
          nextState: PedestrianLightState.Stop
        }],
        onEnter: async (_, machina) => {
          // we need to do some "flashing here based on the timeout to stop".
          const flashDuration = WAIT_DURATION_MILLIS / 5;
          setPedestrianLightsToShow(PedestrianLightsToShow.Wait);
          setTimeout(() => {
            setPedestrianLightsToShow(PedestrianLightsToShow.None);
            setTimeout(() => {
              setPedestrianLightsToShow(PedestrianLightsToShow.Wait);
              setTimeout(() => {
                setPedestrianLightsToShow(PedestrianLightsToShow.None);
                setTimeout(() => {
                  setPedestrianLightsToShow(PedestrianLightsToShow.Wait);
                }, flashDuration)
              }, flashDuration)
            }, flashDuration)
          }, flashDuration);
          
          setTimeout(() => {
            machina.transition(PedestrianLightTransition.ToStop);
          }, WAIT_DURATION_MILLIS);
        }
      }
    ], [
      PedestrianLightState.Stop,
      {
        outEdges: [{
          on: PedestrianLightTransition.AllowWalking,
          description: 'start walking',
          nextState: PedestrianLightState.Walk
        }],
        onEnter: async (_, machina) => {
          setPedestrianLightsToShow(PedestrianLightsToShow.Wait);
          if (machina.parent === null || !machina.parent.isStarted === true) {
            console.log(`not linked as nested machine yet (or not started ${machina.parent === null ? null : machina.parent.isStarted}'`);
          } else {
            await machina.parent.transition(TrafficLightTransition.TurnGreen);
          }
        }
      }, 
    ], [
      PedestrianLightState.Walk,
      {
        outEdges: [{
          on: PedestrianLightTransition.ToWaiting,
          description: 'stop walking',
          nextState: PedestrianLightState.Wait
        }],
        onEnter: async (_, machina) => {
          setPedestrianLightsToShow(PedestrianLightsToShow.Walk);
          setTimeout(() => {
            machina.transition(PedestrianLightTransition.ToWaiting);
          }, WALK_DURATION_MILLIS);
        }
      }
    ]
  ]), undefined, 'pedestrian-machina')

  const [_, trafficLightState, trafficLightEvent] = useMachina<TrafficLightState, TrafficLightTransition, Transition<TrafficLightState, TrafficLightTransition>>(TrafficLightState.Green, new Map<TrafficLightState, NodeState<TrafficLightState ,TrafficLightTransition, Transition<TrafficLightState, TrafficLightTransition>>>([
    [
      TrafficLightState.Green,
      {
        outEdges: [{
          on: TrafficLightTransition.TurnAmber,
          description: 'turn amber',
          nextState: TrafficLightState.Amber
        }],
        onEnter: async (nodeState, machina) => {
          setTimeout(() => machina.transition(TrafficLightTransition.TurnAmber), GREEN_LIGHT_DURATION_MILLIS);
        }
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
        onEnter: async (nodeState, machina) => {
          setTimeout(() => machina.transition(TrafficLightTransition.TurnRed), AMBER_LIGHT_DURATION_MILLIS);
        }
      }
    ],
    [
      TrafficLightState.Red,
      {
        outEdges: [{
          on: TrafficLightTransition.TurnGreen,
          description: 'turn green',
          nextState: TrafficLightState.Green
        }],
        nestedMachinas: [pedestrianLightMachina],
        onEnter: async (_, machina) => {
          const { nestedMachinas } = machina.state;
          setPedestrianLightsToShow(PedestrianLightsToShow.None);
          await nestedMachinas[0].transition(PedestrianLightTransition.AllowWalking);
        }
      }
    ]
  ]), undefined, 'light-machina');

  useEffect(() => {
    console.log('Traffic light switched to:', trafficLightState.current);
  }, [trafficLightState.current]);

  return (
    <div>
      <p style={{padding: 6}}>
        <h3><strong>xmachina + babylonjs</strong> (Automated)</h3>
        <div>Light Currently: <span style={{backgroundColor: LightStateMap.get(trafficLightState.current)}}><strong>{trafficLightState.current}</strong></span></div>
        <div>Pedestrian Currently: {pedestrianLightState.current}</div>
        {trafficLightEvent !== null &&
          <div>Last Traffic Light (semáforo) Event <strong>{trafficLightEvent.event}</strong> from <strong>{trafficLightEvent.value.old ?? 'n/a'}</strong> to: <strong>{trafficLightEvent.value.new}</strong>.</div>
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
              <Semaforo trafficLightState={trafficLightState} pedestrianLightsToShow={pedestrianLightsToShow} showDebug={false} />
            </Suspense>
          </SceneLoaderContextProvider>
        </Scene>
      </Engine>
    </div>
  );
}

export default Automated;
