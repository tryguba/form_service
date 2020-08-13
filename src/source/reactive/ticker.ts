import {EventEmitter} from 'events';
import { setTimeout, clearTimeout } from 'timers';
import { TypedEmitter } from './typed.emitter';

interface TickerEventMap {
  tick: [];
  start: [];
  stop: [];
}

export interface Ticker extends TypedEmitter<TickerEventMap> {
  start(): void;
  stop(): void;
  readonly running: boolean;
}

export class Timer extends EventEmitter implements Ticker {
  private readonly _timeout: number;
  private _last: number;
  private _timer?: NodeJS.Timeout;

  private _start(): boolean {
    if (!this._timer) {
      const now = Date.now();
      if (this._last + this._timeout < now) {
        this._timer = setTimeout(this._tick.bind(this), 1);
      } else {
        this._timer = setTimeout(this._tick.bind(this), this._timeout);
      }
      this._timer.unref();
      return true;
    } else {
      return false;
    }
  }

  private _stop(): boolean {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = undefined;
      return true;
    } else {
      return false;
    }
  }

  protected _tick() {
    this._stop();
    this._last = Date.now();
    this.emit('tick');
  }

  public constructor(timeout: number) {
    super();
    this._timeout = timeout;
    this._last = 0;
  }

  public get running(): boolean {
    return this._timer !== undefined;
  }

  public start(): void {
    if (this._start()) {
      this.emit('start');
    }
  }

  public stop(): void {
    if (this._stop()) {
      this.emit('stop');
    }
  }
}
//
// const timer = new Timer(1000);
// timer.on('start', () => {
//   console.log('start');
// });
// timer.on('stop', () => {
//   console.log('stop');
// });
// timer.on('tick', () => {
//   console.log('tick', (new Date()).toJSON());
//   setTimeout(() => {
//     timer.start();
//   }, 2000).unref();
// });
// setTimeout(() => {}, 5000);
// timer.start();
