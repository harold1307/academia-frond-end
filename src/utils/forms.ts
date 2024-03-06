export const NIVELES_PREFIXES = [
	"1ER",
	"2DO",
	"3ER",
	"4TO",
	"5TO",
	"6TO",
	"7MO",
	"8VO",
	"9NO",
	"10MO",
] as const;

export type Field<K> =
	| FieldDefault<K>
	| FieldSelect<K>
	| FieldDate<K>
	| FieldTextArea<K>
	| FieldDummy<K>
	| FieldReference<K>
	| FieldToggle<K>
	| FieldCombobox<K>;

type FieldDefault<K> = {
	name: K;
	inputType: Exclude<React.HTMLInputTypeAttribute, object>;
	placeholder?: string;
	dependsOn?: K | `reference-${string}` | `dummy-${string}`;
	label: string;
};

type FieldDate<K> = {
	name: K;
	inputType: "custom-date";
	placeholder?: string;
	dependsOn?: K | `reference-${string}` | `dummy-${string}`;
	label: string;
};

type FieldSelect<K> = {
	name: K;
	inputType: "custom-select";
	options: string[] | { label: string; value: string }[] | K | "custom";
	placeholder?: string;
	dependsOn?: K | `reference-${string}` | `dummy-${string}`;
	label: string;
};

type FieldCombobox<K> = {
	name: K;
	inputType: "custom-combobox";
	options: string[] | { label: string; value: string }[] | K | "custom";
	placeholder?: string;
	dependsOn?: K | `reference-${string}` | `dummy-${string}`;
	label: string;
};

type FieldToggle<K> = {
	name: K;
	inputType: "custom-toggle";
	placeholder?: string;
	dependsOn?: K | `reference-${string}` | `dummy-${string}`;
	label: string;
};

// campo que se usa como computed values
type FieldReference<K> = {
	name: `reference-${string}`;
	inputType: Exclude<React.HTMLInputTypeAttribute, object>;
	placeholder?: string;
	dependsOn?: K | `dummy-${string}` | `reference-${string}`;
	label: string;
};

// campo que es usado para la activacion de otros
type FieldDummy<K> = {
	name: `dummy-${string}`;
	inputType: "checkbox" | "custom-toggle";
	label: string;
	dependsOn?: K | `dummy-${string}` | `reference-${string}`;
	placeholder?: undefined;
};

// const CUSTOM_FIELDS = [
// 	"custom-date",
// 	"custom-select",
// 	"custom-text-area",
// ] as const;

type FieldTextArea<K> = {
	name: K;
	inputType: "custom-text-area";
	placeholder?: string;
	label: string;
};

export function assertReferenceInput(
	name: string,
): name is `reference-${string}` {
	return name.includes("reference-");
}

export function assertDummyInput(name: string): name is `dummy-${string}` {
	return name.includes("dummy-");
}
