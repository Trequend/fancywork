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
  private listeners: Record<string, ((data: any) => void)[] | undefined> = {};

  protected emit<K extends EventKey<T>>(eventName: K, eventData: T[K]) {
    let prevented = false;

    const preventDefault = () => {
      prevented = true;
    };

    const defaultPrevented = () => prevented;

    const data = {
      target: this,
      data: eventData,
      preventDefault,
      defaultPrevented,
    };

    const eventListeners = this.listeners[eventName.toString()];
    if (eventListeners) {
      eventListeners.forEach((listener) => {
        listener(data);
      });
    }

    return prevented;
  }

  public addEventListener<K extends EventKey<T>>(
    eventName: K,
    listener: EventListener<T, K, E>
  ) {
    const eventListeners = this.listeners[eventName.toString()];
    if (eventListeners) {
      const index = eventListeners.findIndex((value) => value === listener);
      if (index === -1) {
        eventListeners.push(listener);
      }
    } else {
      this.listeners[eventName.toString()] = [listener];
    }
  }

  public removeEventListener<K extends EventKey<T>>(
    eventName: K,
    listener: EventListener<T, K, E>
  ) {
    const eventListeners = this.listeners[eventName.toString()];
    if (eventListeners) {
      const index = eventListeners.findIndex((value) => value === listener);
      if (index !== -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  public removeAllEventListeners<K extends EventKey<T>>(eventName: K) {
    delete this.listeners[eventName.toString()];
  }
}
