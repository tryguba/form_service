import 'reflect-metadata';
import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsEmail, IsInt, IsNumber, IsPositive, IsString, Min, MinLength, validateSync } from 'class-validator';

function sealed(constructor: Function): void {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

function property(name: string): PropertyDecorator {
  return (target: Object, propertyKey: string | symbol, descriptor?: PropertyDescriptor): PropertyDescriptor | void => {
    console.log(`property(${name})`, target.constructor.name,  propertyKey, descriptor);
    if (descriptor) {
      const newDescriptor: PropertyDescriptor = {
        get(this: Object) {
          console.log(`GET ${propertyKey.toString()}`);
          if (typeof descriptor.get === 'function') {
            return descriptor.get.call(this);
          } else {
            return descriptor.value;
          }
        },
        set(this: Object, value: any) {
          console.log(`SET ${propertyKey.toString()}`, value);
          if (typeof descriptor.set === 'function') {
            descriptor.set.call(this, value);
          } else {
            descriptor.value = value;
          }
        },
        configurable: false,
        enumerable: true,
      };
      return newDescriptor;
    }
  };
}

function method(name: string): MethodDecorator {
  return <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => {
    const prev = descriptor.value as any as Function;
    return {
      value: (function (this: Object, ...args: any[]): any {
        console.log('BEFORE CALLING %o', propertyKey);
        console.log('ARGS %o', args);
        try {
          const result = prev.apply(this, args);
          console.log('RESULT %o', result);
          return result;
        } catch (e) {
          console.log('ERROR %s', e);
          throw e;
        }
      }) as any,
      configurable: descriptor.configurable,
      enumerable: descriptor.enumerable,
      writable: descriptor.writable,
    };
    console.log(`method(${name})`, target.constructor.name,  propertyKey, descriptor);
  };
}

function cls(name: string): ClassDecorator {
  return <T extends Function>(cls: T) => {
    console.log(`cls(${name})`, name);
    const wrapped = (class extends (cls as any) {
      constructor(...args: any[]) {
        super(...args);
        console.log('CREATED', cls.name);
      }
    } as any as T);
    Object.defineProperty(wrapped, 'name', {
      value: `wrapped[${cls.name}]`,
      enumerable: false,
      configurable: false,
      writable: false,
    });
    return wrapped;
  };
}

function param(name: string): ParameterDecorator {
  return (target: Object | Function, propertyKey: string | symbol | undefined, parameterIndex: number) => {
    if (typeof target === 'function' && propertyKey === undefined) {
      console.log(`param(${name})`, target.name, parameterIndex);
    } else if (propertyKey !== undefined) {
      console.log(`param(${name})`, target.constructor.name, propertyKey, parameterIndex);
    }

  };
}


function logTime(): MethodDecorator {
  return <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => {
    const prev = descriptor.value as any as Function;
    return {
      value: (function (this: Object): any {
        const start = process.hrtime();
        function _finally() {
          const [secs, nsecs] = process.hrtime(start);
          console.log(`${target.constructor.name}.${propertyKey.toString()}: ${Math.floor(secs * 1e3 + nsecs * 1e-6)}`);
        }
        try {
          const result = prev.apply(this, arguments);
          if (result instanceof Promise) {
            result.then(_finally, _finally);
          } else {
            _finally();
          }
          return result;
        } catch (e) {
          _finally();
          throw e;
        }
      }) as any,
      configurable: descriptor.configurable,
      enumerable: descriptor.enumerable,
      writable: descriptor.writable,
    };
  };
}


@Exclude()
class SomeArgument {
  @Expose()
  @IsString()
  @MinLength(1)
  password: string;

  @Expose()
  @IsString()
  @IsEmail()
  email: string;

  public testAccount(correctEmail: string, correctPassword: string): void {
    if (this.email !== correctEmail || this.password !== correctPassword) {
      throw new Error('Invalid account');
    }
  }
}

@Exclude()
class SomeResult {
  @Expose()
  @IsNumber()
  @IsInt()
  @Min(0)
  messages: number;
}

function ValidateMethod(): MethodDecorator {
  return <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => {
    const prev = descriptor.value as any as Function;
    const paramtypes = Reflect.getMetadata('design:paramtypes', target, propertyKey);
    const returntype = Reflect.getMetadata('design:returntype', target, propertyKey);

    function validateSyncOrReject(arg: any): void {
      const errors = validateSync(arg);
      if (errors.length) {
        throw errors[0];
      }
    }

    return {
      value: (function (this: Object, ...rawArgs: any[]): any {
        const args = rawArgs.map((arg, index) => {
          const cls = paramtypes[index];
          if (!(arg instanceof cls)) {
            return plainToClass(cls, arg);
          } else {
            return arg;
          }
        });
        args.forEach(validateSyncOrReject);
        let result = prev.apply(this, args);
        if (!(result instanceof returntype)) {
          result = plainToClass(returntype, result);
        }
        validateSyncOrReject(result);
        return result;
      }) as any,
      configurable: descriptor.configurable,
      enumerable: descriptor.enumerable,
      writable: descriptor.writable,
    };
  };
}


@sealed
@cls('a')
@cls('b')
class Greeter {
  @property('greeting')
  @property('hello')
  greeting: string;

  set something(value: string) {

  }

  @property('something')
  get something(): string {
    return '';
  }

  constructor(@param('a') message: string, @param('b') x: Array<any>) {
    this.greeting = message;
  }

  @method('greet')
  greet(@param('question') question: string) {
    return "Hello, " + this.greeting;
  }

  @logTime()
  someMethod() {
    for (let i = 0; i !== 1e8; ++i) {
      Math.random();
    }
  }

  @logTime()
  somePromiseMethod(x: number): Promise<number> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('DONE');
        resolve(x * x);
      }, 1000);
    })
  }

  @ValidateMethod()
  public getMessageBoxSize(account: SomeArgument): SomeResult {
    account.testAccount('bla@temabit.com', '123456');
    return {
      messages: -100500,
    };
  }
}


const g = new Greeter('message', []);
// const {something} = g;
// g.something = '10';
// g.greet('hello');
//
// console.log('Greeter: PARAMETERS = %o', Reflect.getMetadata('design:paramtypes', Greeter));
// g.someMethod();
// g.somePromiseMethod(100);
const messageBoxSize = g.getMessageBoxSize({
  email: 'bla@temabit.com',
  password: '123456',
} as any);
console.log('MESSAGE BOX', messageBoxSize);

export  {};
