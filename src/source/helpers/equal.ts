import { Comparable, EQUALS_TO_METHOD, isComparable } from './interfaces/comparable';
import { ArrayStack } from './stack';
import {Stack} from "./stack/stack";

interface EqualsStackItem<T extends object = object> {
  left: T;
  right: T;
  ctx: ComparedContext;
}

interface ComparedPair<T extends object = object> {
  source: T;
  target: T;
  value: boolean;
}

export class ComparedContext {
  private readonly _stored: Array<ComparedPair>;

  public static create(): ComparedContext {
    return new ComparedContext();
  }

  public constructor() {
    this._stored = [];
  }

  private _createPredicate<T extends object>(source: T, target: T): (value: ComparedPair) => boolean {
    return (item) => Object.is(item.source, source) && Object.is(item.target, target) || Object.is(item.target, source) && Object.is(item.source, target)
  }

  private _getItem<T extends object>(source: T, target: T): ComparedPair<T> | undefined {
    return this._stored.find(this._createPredicate(source, target)) as (ComparedPair<T> | undefined);
  }

  private _getItemIndex<T extends object>(source: T, target: T): number {
    return this._stored.findIndex(this._createPredicate(source, target));
  }

  public get<T extends object>(source: T, target: T): boolean | undefined {
    const item = this._getItem(source, target);
    return item ? item.value: undefined;
  }

  public store<T extends object>(source: T, target: T, value: boolean): void {
    const item = this._getItem(source, target);
    if (!item) {
      this._stored.push({
        source, target, value,
      });
    } else {
      item.value = value;
    }
  }

  public delete<T extends object>(source: T, target: T): void {
    const index = this._getItemIndex(source, target);
    if (0 <= index && index < this._stored.length) {
      this._stored.splice(index, 1);
    }
  }

  public persist<T extends object>(source: T, target: T, defaultValue: boolean): boolean {
    const item = this._getItem(source, target);
    if (!item) {
      this._stored.push({
        source, target, value: defaultValue
      });
      return defaultValue;
    } else {
      return item.value;
    }
  }
}


const callStack: Stack<EqualsStackItem> = new ArrayStack<EqualsStackItem>();
type Comparator<T extends object = object> = (left: T, right: T, ctx?: ComparedContext) => boolean;
type ComparatorMethod<T extends object = object> = (this: T, right: T, ctx?: ComparedContext) => boolean;

function pushStackItem<T extends object>(left: T, right: T): EqualsStackItem<T> {
  let ctx = callStack.top ? callStack.top.ctx : ComparedContext.create();
  let found: EqualsStackItem<T> = {
    left, right, ctx,
  };
  callStack.push(found);
  return found;
}

function popStackItem<T extends object>(item: EqualsStackItem<T>): void {
  if (Object.is(callStack.top, item)) {
    callStack.pop();
  } else {
    throw new Error('Illegal usage!'); /// @todo explain error
  }
}

export function equals(left: any, right: any): boolean {
  let lc: ComparatorMethod<any> | undefined;
  let rc: ComparatorMethod<any> | undefined;
  if (Object.is(left, right)) {
    return true;
  } else if (typeof left !== typeof right || left == undefined || right == undefined) {
    return false;
  } else if ((lc = getComparatorMethod(left)) === (rc = getComparatorMethod(right)) && typeof lc === 'function') {
    const item = pushStackItem(left, right);
    try {
      let result = item.ctx.get(left, right);
      if (typeof result !== 'boolean') {
        item.ctx.store(left, right, result = true);
        item.ctx.store(left, right, result = Boolean(lc.call(left, right)));
      }
      return result;
    } finally {
      popStackItem(item);
    }
  } else {
    return false;
  }
}

equals.Comparator = function(): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    const method = descriptor.value as any as ComparatorMethod;
    // const comparator: Comparator = (left, right, ctx) => {
    //   return method.call(left, right, ctx);
    // };
    equals.registerMethod(target, method);
  };
}

// equals.Comparable = function(): ClassDecorator {
//   return (target) => {
//     const method = (target.prototype as Comparable).equalsTo;
//     const comparator: Comparator = (left, right, ctx) => {
//       return method.call(left as Comparable, right as Comparable);
//     };
//     equals.register(target.prototype, comparator);
//   }
// };

equals.register = function <T extends object>(target: T, comparator: Comparator<T>): void {
  equals.registerMethod(target, function (this: T, another: T): boolean { return comparator(this, another); });
  // Object.defineProperty(target, EQUALS_TO_METHOD, {
  //   value: function (this: T, another: T): boolean { return comparator(this, another); },
  //   enumerable: false,
  //   configurable: false,
  //   writable: false,
  // })
  // Reflect.defineMetadata(EQUALS_TO_METHOD, target, comparator);
};

equals.registerMethod = function <T extends object>(target: T, comparatorMethod: ComparatorMethod<T>): void {
  Object.defineProperty(target, EQUALS_TO_METHOD, {
    value: comparatorMethod,
    enumerable: false,
    configurable: false,
    writable: false,
  });
  // Reflect.defineMetadata(EQUALS_TO_METHOD, target, comparator);
};

function getComparatorMethod<T extends object>(object: T): T extends (object & Comparable) ? ComparatorMethod<T> : undefined {
  if (isComparable(object)) {
    return object[EQUALS_TO_METHOD] as any;
  } else if (Object.getPrototypeOf(object) === null) {
    return getComparatorMethod(Object.prototype) as any;
  } else {
    return undefined as any;
  }
}

function getPropertyDescriptors(source: Object): Record<string | symbol, PropertyDescriptor> {
  const result: Record<string | symbol, PropertyDescriptor> = Object.create(null);
  const prototypes: Object[] = [];
  for (let o = source; o !== null; o = Object.getPrototypeOf(o)) {
      prototypes.push(o);
  }
  while (prototypes.length) {
    const p = prototypes.pop()!;
    Object.assign(result, Object.getOwnPropertyDescriptors(p));
  }
  return result;
}

equals.register(Array.prototype, (left, right) => {
  let result = true;
  let length = Math.max(left.length, right.length);
  for (let i = 0; result && i !== length; ++i) {
    result = equals(left[i], right[i]);
  }
  return result;
});
equals.register(Function.prototype, () => false);
equals.register(WeakMap.prototype, () => false);
equals.register(WeakSet.prototype, () => false);
equals.register(Map.prototype, (left, right) => {
  const allKeys = new Set([...left.keys(), ...right.keys()]);
  for (const key of allKeys) {
    if (!equals(left.get(key), right.get(key))) {
      return false;
    }
  }
  return true;
});

equals.register(Set.prototype, (left, right) => {
  let result = left.size === right.size;
  let li  = left[Symbol.iterator](), ri = right[Symbol.iterator]();
  for (let lr = li.next(), rr = ri.next(); result && !lr.done && !rr.done; lr = li.next(), rr = ri.next()) {
    result = equals(lr.value, rr.value);
  }
  return result;
});

equals.register(Number.prototype, (left, right) => Object.is(left.valueOf(), right.valueOf()));
equals.register(String.prototype, (left, right) => Object.is(left.valueOf(), right.valueOf()));
equals.register(Date.prototype, (left, right) => Object.is(left.valueOf(), right.valueOf()));
equals.register(BigInt.prototype, (left, right) => Object.is(left.valueOf(), right.valueOf()));
equals.register(Boolean.prototype, (left, right) => Object.is(left.valueOf(), right.valueOf()));


equals.register(Object.prototype, (left, right) => {
  const lDescriptors: Record<string | symbol, PropertyDescriptor> = getPropertyDescriptors(left);
  const rDescriptors: Record<string | symbol, PropertyDescriptor> = getPropertyDescriptors(right);
  const allKeys = new Set([...Object.keys(lDescriptors), ...Object.keys(rDescriptors)]);
  for (const key of allKeys) {
    const ld = lDescriptors[key];
    const rd = rDescriptors[key];
    if (ld === undefined || rd === undefined) {
      return false;
    }
    const lValue = typeof ld.get === 'function' ? ld.get.call(left) : ld.value;
    const rValue = typeof rd.get === 'function' ? rd.get.call(right) : rd.value;
    if (!equals(lValue, rValue)) {
      return false;
    }
  }
  return true;
});

// const A = {
//   number: 1,
//   string: "2",
//   boolean: true,
//   nan: NaN,
//   bigint: 1n,
//   date: new Date(100),
//   array: [1, 2, 3] as any[],
// };
//
// const B = {
//   number: 1,
//   string: "2",
//   boolean: true,
//   nan: NaN,
//   bigint: 1n,
//   date: new Date(100),
//   array: [1, 2, 3] as any[],
// };
//
// Object.assign(B, { recursive: B });
// Object.assign(A, { recursive: A });
// A.array.push(B);
// B.array.push(A);
//
// console.log(equals(A, B));
