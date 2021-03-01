import React from 'react';
import { IMachina, Transition } from 'xmachina';
import { LightStateMap } from './MachinaTypes';

type ChangeTransitionButtonProps<S, E> = {
  machina: IMachina<S, E, Transition<S, E>>
  transition: Transition<S, E>
}

export const ChangeTransitionButton: React.FC<ChangeTransitionButtonProps<any, any>> = (props: ChangeTransitionButtonProps<any, any>) => {
  const onButtonClick = () => props.machina.transition(props.transition.on);
  return (
    <button onClick={onButtonClick} style={{backgroundColor: LightStateMap.get(props.transition.nextState)}}>click here to {props.transition.description ?? props.transition.on}</button>
  )
}

type NextStateButtonsProps = {
  machina: IMachina<any, any, Transition<any, any>>
}

export const NextStateButtons: React.FC<NextStateButtonsProps> = (props: NextStateButtonsProps) => {
  return (<>
  {
    props.machina.state.possibleTransitions.map((t: Transition<any, any>) =>
      <ChangeTransitionButton machina={props.machina} transition={t} />
    )
  }
  </>);
}