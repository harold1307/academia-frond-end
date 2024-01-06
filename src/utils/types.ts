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
	[K in keyof Obj]: Obj[K] extends Date ? string : Obj[K];
};

export type ReplaceNullableToOptional<Obj> = Prettify<OptionalNullable<Obj>>;

export type Equals<X, Y> = (<T>() => T extends X ? 1 : 2) extends <
	T,
>() => T extends Y ? 1 : 2
	? true
	: false;

type NonUndefined<T> = Exclude<T, undefined>;

export type ZodInferSchema<T extends object> = {
	[Key in keyof T]-?: Equals<T[Key], NonUndefined<T[Key]>> extends false
		?
				| z.ZodOptional<z.ZodType<NonNullable<T[Key]>>>
				| z.ZodPipeline<z.ZodOptional<z.ZodType<any>>, z.ZodType<T[Key]>>
		: z.ZodType<T[Key]> | z.ZodPipeline<z.ZodType<any>, z.ZodType<T[Key]>>;
};
