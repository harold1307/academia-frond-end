import { InstitucionClass } from "./institucion";

export type APIResponse<D> = {
	data: D;
	message: string;
};
export type SimpleAPIResponse = {
	message: string;
};

export class APIClass {
	constructor(private apiUrl: string) {}

	get instituciones() {
		return new InstitucionClass(this.apiUrl);
	}
}

export class APIError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "APIError";
	}
}
