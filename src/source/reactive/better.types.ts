import { AbstractConstructor, Constructor } from './constructor';

type _MethodDescriptor<Instance, Type> = Type extends (this: Instance, ...args: any[]) => any ? TypedPropertyDescriptor<Type> : never;

// type AbstractInstanceType<T> = T extends AbstractConstructor<infer R> ? R : unknown;
// type ConstructorArguments<T> = T extends Constructor<any, infer A> ? A : unknown;

export type ClassDecorator<T extends Constructor = Constructor> = <Target extends T>(target: Target) => Target | void;
export type AbstractClassDecorator<T extends AbstractConstructor = AbstractConstructor> = <Target extends T>(target: Target) => Target | void;

export type PropertyDecorator<Name extends string | symbol = string | symbol> = <Target extends {}, Key extends keyof Target & Name>(target: Target, propertyKey: Key, descriptor?: TypedPropertyDescriptor<Target[Key]>) => any;
export type DeclaredPropertyDecorator<Name extends string | symbol = string | symbol> = <Target extends {}, Key extends keyof Target & Name>(target: Target, propertyKey: Key, descriptor?: undefined) => TypedPropertyDescriptor<Target[Key]> | void;
export type DefinedPropertyDecorator<Value> = <Target extends {}, Key extends keyof Target>(target: Target, propertyKey: Key, descriptor: Target[Key] extends Value ? TypedPropertyDescriptor<Target[Key]> : never) => PropertyDescriptor | void;

// export type MethodDecorator<Name extends string | symbol = string | symbol> = <Target extends {}, Key extends keyof Target & Name>(target: Target, propertyKey: Key, descriptor: TypedPropertyDescriptor<Target[Key] & Function>) => TypedPropertyDescriptor<Target[Key] & Function> | void;

// export type TypedPropertyDecorator = <Target extends {}, Key extends keyof Target, Value>(target: Target, propertyKey: Key, descriptor?: TypedPropertyDescriptor<Value>) => any;
// export

// function CreateClassMutator(): ClassDecorator {
//   return (target) => {
//     return class extends target {
//       public constructor(...args: any[]) {
//         super(...args);
//       }
//     };
//   };
// }
//
// function TestClassDecorator(): AbstractClassDecorator {
//   return (target) => {};
// }
//
// function TestPropertyDecorator(): PropertyDecorator {
//   return (target, propertyKey, descriptor) => {
//
//   };
// }
//
// // function TestMethodDecorator(): MethodDecorator {
// //   return (target, propertyKey, descriptor) => {
// //     const v = target[propertyKey];
// //     if (typeof v === 'function') {
// //
// //       const M: typeof v = (...args: any): ReturnType<typeof v> => {
// //         return null as ReturnType<typeof v>;
// //       };
// //
// //       return {
// //         value: M,
// //       };
// //     }
// //   };
// // }
// //
// // class MyValue {
// //
// // }
// //
// // function TestTypedPropertyDecorator<InstanceType>(cls: Constructor<InstanceType>): StrictPropertyDecorator<InstanceType> {
// //   return (target, propertyKey, descriptor) => {
// //
// //   }
// // }
// //
// //
// // const X: AbstractClassDecorator  = null as any;
// // // const Y: KeyPropertyDecorator = null as any;
// //
// // @TestClassDecorator()
// // abstract class Test {
// //   @TestPropertyDecorator()
// //   public prop: number;
// //
// //   @TestTypedPropertyDecorator(MyValue)
// //   public get prop2(): string {
// //     return '';
// //   }
// //
// //   @TestMethodDecorator()
// //   public test(): void {
// //
// //   }
// //
// //   @TestMethodDecorator()
// //   public prop3: number;
// //
// //   @TestMethodDecorator()
// //   public get prop4(): () => void {
// //     return () => undefined;
// //   }
// // }
