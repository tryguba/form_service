import { Stack } from './stack';

export class ArrayStack<ValueType> implements Stack<ValueType> {
	public constructor(initial?: Iterable<ValueType>, compare?: (a: ValueType, b: ValueType) => boolean) {
		this._container = [];
		this._compare = compare || Object.is;
		if (initial) {
			for (const value of initial) {
				this.push(value);
			}
		}
	}

	public get size(): number {
		return this._container.length;
	}

	public get empty(): boolean {
		return this.size === 0;
	}

	public get top(): ValueType | undefined {
		return !this.empty ? this._container[this._container.length - 1] : undefined;
	}

	public push(value: ValueType): void {
		this._container.push(value);
	}

	public pop(): ValueType | undefined {
		return this._container.pop();
	}

	public popOrFail(): ValueType {
		if (this.empty) {
			throw new Error('Empty');
		}
		return this.pop()!;
	}

	public [Symbol.iterator](): Iterator<ValueType> {
		return this._container[Symbol.iterator]();
	}

	public reversed(): Iterable<ValueType> {
		const container = this._container;
		return {
			[Symbol.iterator](): Iterator<ValueType> {
				let index = container.length;
				return {
					next(): IteratorResult<ValueType, any> {
						if (index >= 0) {
							--index;
							return {
								value: container[index],
								done: false,
							};
						} else {
							return {
								value: undefined as any,
								done: true,
							};
						}
					},
				};
			},
		}
	}

	private readonly _container: ValueType[];
	private readonly _compare: (a: ValueType, b: ValueType) => boolean;
}
