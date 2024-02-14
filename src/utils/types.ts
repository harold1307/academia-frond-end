import type { z } from "zod";

export type Prettify<T> = {
	[K in keyof T]: T[K];
	// eslint-disable-next-line @typescript-eslint/ban-types
} & {};

type PickNullable<T> = {
	[P in keyof T as null extends T[P] ? P : never]: T[P];
};

type PickNotNullable<T> = {
	[P in keyof T as null extends T[P] ? never : P]: T[P];
};

type OptionalNullable<T> = {
	[K in keyof PickNullable<T>]?: Exclude<T[K], null>;
} & {
	[K in keyof PickNotNullable<T>]: T[K];
};

export type ReplaceDateToString<Obj> = {
	[K in keyof Obj]: IsNullable<Obj[K]> extends true
		? Exclude<Obj[K], null> extends Date
			? string | null
			: Obj[K]
		: Obj[K] extends Date
			? string
			: Obj[K] extends object
				? ReplaceDateToString<Obj[K]>
				: Obj[K];
};

export type ReplaceNullableToOptional<Obj> = Prettify<OptionalNullable<Obj>>;

export type Equals<X, Y> = (<T>() => T extends X ? 1 : 2) extends <
	T,
>() => T extends Y ? 1 : 2
	? true
	: false;

// type NonUndefined<T> = Exclude<T, undefined>;

type IsNullable<T> = null extends T ? true : false;
type IsOptional<T> = undefined extends T ? true : false;

type IsNullableOrOptional<T> = null extends T
	? true
	: undefined extends T
		? true
		: false;

export type ZodInferSchema<T extends object> = {
	[Key in keyof T]-?: IsNullableOrOptional<T[Key]> extends true
		? IsNullable<T[Key]> extends true
			? IsOptional<T[Key]> extends true
				? z.ZodOptional<z.ZodNullable<z.ZodType<T[Key]>>>
				: z.ZodNullable<z.ZodType<T[Key]>>
			: IsOptional<T[Key]> extends true
				? z.ZodOptional<z.ZodType<T[Key]>>
				: z.ZodType<T[Key]>
		: z.ZodType<T[Key]>;
};

export type NonNullableObject<T extends object> = {
	[K in keyof T]: Exclude<T[K], null>;
};

type ASd = ReplaceDateToString<{ date: Date | null }>;
