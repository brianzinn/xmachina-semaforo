export enum TrafficLightState {
  Green = 'Green',
  Amber = 'Amber',
  Red = 'Red'
}

export enum TrafficLightTransition {
  TurnGreen = 'TurnGreen',
  TurnAmber = 'TurnAmber',
  TurnRed = 'TurnRed'
}

export enum PedestrianLightState {
  Walk = 'Walk',
  Wait = 'Wait',
  Stop = 'Stop'
}

export enum PedestrianLightTransition {
  AllowWalking = 'AllowWalking',
  ToWaiting = 'ToWaiting',
  ToStop = 'ToStop'
}

export const LightStateMap: Map<TrafficLightState, string> = new Map([
  [TrafficLightState.Red, '#cc3232'],
  [TrafficLightState.Amber, '#e7b416'],
  [TrafficLightState.Green, '#2dc937']
]);