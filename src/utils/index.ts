import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type GetParamNameParams = {
	module: "Asignatura" | "Institucion" | "Malla";
	action: "actualizar" | "eliminar";
};

export function getParamName({ action, module }: GetParamNameParams) {
	return action + module;
}
