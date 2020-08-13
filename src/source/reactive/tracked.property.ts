import 'reflect-metadata';
import { PropertyDecorator } from './better.types';
import { ReactiveProperty, ReactivePropertyOptions } from './reactive.metadata';
import { ReactiveStorage } from './reactive.storage';

export function TrackedProperty(options: Readonly<Partial<ReactivePropertyOptions>> = {}): PropertyDecorator<string> {
  const decorator = ReactiveProperty(options);
  return (target, propertyKey) => {
    Reflect.decorate([decorator as any], target, propertyKey);
    return {
      get(this: typeof target) {
        const storage = ReactiveStorage.persist(this);
        return storage.get(propertyKey);
      },
      set(this: typeof target, value: (typeof target)[typeof propertyKey]) {
        const storage = ReactiveStorage.persist(this);
        storage.update(propertyKey, value);
      }
    };
  };
}
