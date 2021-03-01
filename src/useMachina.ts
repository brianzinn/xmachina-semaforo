import { useEffect, useState } from 'react';
import { IMachina, Machina, MachinaState, NodeState, Nullable, Transition } from 'xmachina';
import { EventData } from 'xmachina/dist/types/subscriptions/EventData';
import { NotificationType } from 'xmachina';

export type SubscriptionOptions<S, T> = {
  notificationType: NotificationType
  valueFilter: S | T
}

type HookState<S, E, T extends Transition<S, E>> = {
  machina: IMachina<S, E, T>
  state: MachinaState<S, E, T>
  eventData: Nullable<EventData<S | E>>
}

export function useMachina<
  S,
  E,
  T extends Transition<S, E>
>(
  initialState: S,
  machinaMap: Map<S, NodeState<S, E, T>>,
  subscriptionOptions?: SubscriptionOptions<S, E>,
  name?: string
): [
  IMachina<S, E, T>,
  MachinaState<S, E, T>,
  Nullable<EventData<S | E>>
] {
  const [state, setState] = useState<HookState<S, E, T>>(() => {
    const machina = new Machina<S, E, T>(initialState, machinaMap, name);

    return {
      machina,
      state: machina.state,
      eventData: null
    }
  });

  useEffect(() => {
    const notificationType: NotificationType = subscriptionOptions === undefined ? NotificationType.All : subscriptionOptions.notificationType;
    const valueFilter: S | E | undefined = subscriptionOptions === undefined ? undefined : subscriptionOptions.valueFilter;
    const observer = state.machina.subscribe((eventData: EventData<S | E>) => {
      setState({
        machina: state.machina,
        state: state.machina.state,
        eventData: eventData
      })
    }, notificationType, valueFilter);
    console.log('starting machina:', state.machina.name);
    state.machina.start();

    return () => {
      state.machina.unsubscribe(observer);
    }
  }, []);

  return [state?.machina, state.state, state.eventData];
}