import BaseEventEmitter from 'events';

type EventMap = Record<string, any>;

type EventKey<T extends EventMap> = keyof T;

type Event<
  T extends EventMap,
  K extends EventKey<T>,
  E extends EventEmitter<T, E>
> = {
  target: E;
  data: T[K];
  preventDefault: () => void;
  defaultPrevented: () => boolean;
};

type EventListener<
  T extends EventMap,
  K extends EventKey<T>,
  E extends EventEmitter<T, E>
> = (event: Event<T, K, E>) => void;

export class EventEmitter<T extends EventMap, E extends EventEmitter<T, E>> {
  private readonly emitter = new BaseEventEmitter();

  protected emit<K extends EventKey<T>>(eventName: K, eventData: T[K]) {
    let prevented = false;

    const preventDefault = () => {
      prevented = true;
    };

    const defaultPrevented = () => prevented;

    this.emitter.emit(eventName.toString(), {
      target: this,
      data: eventData,
      preventDefault,
      defaultPrevented,
    });

    return prevented;
  }

  public addEventListener<K extends EventKey<T>>(
    eventName: K,
    listener: EventListener<T, K, E>
  ) {
    this.emitter.addListener(eventName.toString(), listener);
  }

  public removeEventListener<K extends EventKey<T>>(
    eventName: K,
    listener: EventListener<T, K, E>
  ) {
    this.emitter.removeListener(eventName.toString(), listener);
  }

  public removeAllEventListeners<K extends EventKey<T>>(eventName: K) {
    this.emitter.removeAllListeners(eventName.toString());
  }
}
