export interface Stack<ValueType> extends Iterable<ValueType> {
	readonly size: number;
	readonly empty: boolean;
	readonly top: ValueType | undefined;
	reversed(): Iterable<ValueType>;
	push(value: ValueType): void;
	pop(): ValueType | undefined;
	popOrFail(): ValueType;
}
