import {EventEmitter} from 'events';
type ToArray<T> = T extends any[] ? T : any[];
type TypedFunction<Args extends any[], Result> = (...args: Args) => Result;

export interface TypedEmitter<EventMap = Record<string | symbol, any[]>> extends EventEmitter {
  addListener<Event extends keyof EventMap>(
    event: Event,
    listener: TypedFunction<ToArray<EventMap[Event]>, void>,
  ): this;
  addListener(event: string | symbol, listener: TypedFunction<any[], void>): this;

  on<Event extends keyof EventMap>(
    event: Event,
    listener: TypedFunction<ToArray<EventMap[Event]>, void>,
  ): this;
  on(event: string | symbol, listener: TypedFunction<any[], void>): this;

  off<Event extends keyof EventMap>(
    event: Event,
    listener: TypedFunction<ToArray<EventMap[Event]>, void>,
  ): this;
  off(event: string | symbol, listener: TypedFunction<any[], void>): this;

  once<Event extends keyof EventMap>(
    event: Event,
    listener: TypedFunction<ToArray<EventMap[Event]>, void>,
  ): this;
  once(event: string | symbol, listener: TypedFunction<any[], void>): this;

  prependListener<Event extends keyof EventMap>(
    event: Event,
    listener: TypedFunction<ToArray<EventMap[Event]>, void>,
  ): this;
  prependListener(event: string | symbol, listener: TypedFunction<any[], void>): this;

  prependOnceListener<Event extends keyof EventMap>(
    event: Event,
    listener: TypedFunction<ToArray<EventMap[Event]>, void>,
  ): this;
  prependOnceListener(event: string | symbol, listener: TypedFunction<any[], void>): this;

  removeListener<Event extends keyof EventMap>(
    event: Event,
    listener: TypedFunction<ToArray<EventMap[Event]>, void>,
  ): this;
  removeListener(event: string | symbol, listener: TypedFunction<any[], void>): this;

  emit<Event extends keyof EventMap>(
    event: Event,
    ...args: ToArray<EventMap[Event]>
  ): boolean;
  emit(event: string | symbol, ...args: any[]): boolean;
}
