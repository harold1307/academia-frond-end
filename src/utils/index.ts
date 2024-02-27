import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type GetParamNameParams = {
	module: "Asignatura" | "Institucion" | "Malla" | "Curso";
	action: "actualizar" | "eliminar";
};

export function getParamName({ action, module }: GetParamNameParams) {
	return action + module;
}

export function formatDate(
	d: string | Date,
	options: Intl.DateTimeFormatOptions,
) {
	let date = d;

	if (typeof date === "string") {
		date = new Date(date);
	}

	return new Intl.DateTimeFormat(undefined, options).format(date);
}
