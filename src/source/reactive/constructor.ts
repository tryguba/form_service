export interface Constructor<Type = any, Args extends any[] = any[]> {
	new (...args: Args): Type;
}

export interface AbstractConstructor<Type = any> extends Function {
	prototype: Type
}
