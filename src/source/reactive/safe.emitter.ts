import {EventEmitter} from 'events';
import { weakCached } from './weak.cached';

export type Listener = (...args: any[]) => void;

const getWrappedListener = weakCached((listener: Listener): Listener => {
  return (...args: any[]): void => {
    try {
      listener(...args);
    } catch (e) {
    }
  }
});

export class SafeEmitter extends EventEmitter {
  addListener(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.addListener(event, getWrappedListener(listener));
  }
  on(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.on(event, getWrappedListener(listener));
  }
  once(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.once(event, getWrappedListener(listener));
  }
  removeListener(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.removeListener(event, getWrappedListener(listener));
  }
  off(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.off(event, getWrappedListener(listener));
  }
  prependListener(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.prependListener(event, getWrappedListener(listener));
  }
  prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.prependOnceListener(event, getWrappedListener(listener));
  }
}
