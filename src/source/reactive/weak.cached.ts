interface CachedFunction<A extends Object, R> extends WeakMap<A, R> {
  (a: A): R;
}

export function weakCached<A extends Object, R>(processor: (a: A) => R): CachedFunction<A, R> {
  const cache = new WeakMap<A, () => R>();
  const result: CachedFunction<A, R> = function (key) {
    let item = cache.get(key);
    if (!item) {
      try {
        const value = processor(key);
        cache.set(key, item = () => value);
      } catch (e) {
        cache.set(key, item = () => { throw e; });
      }
    }
    return item();
  } as CachedFunction<A, R>;

  result.delete = cache.delete.bind(cache);
  result.has = cache.delete.bind(cache);
  result.set = function (this: CachedFunction<A, R>, key, value) {
    cache.set(key, () => value);
    return this;
  };
  result.get = function (key) {
    const func = cache.get(key);
    return func ? func() : undefined;
  };
  Object.defineProperty(result, Symbol.toStringTag, {
    get() {
      return cache[Symbol.toStringTag];
    }
  });

  return result;
}
