export type ReplaceDateToString<Obj> = {
	[K in keyof Obj]: Obj[K] extends Date ? string : Obj[K];
};
