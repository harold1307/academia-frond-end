import { ZodFetcher } from "zod-fetch";

export class admCostosClass {
	constructor(
		private apiUrl: string,
		private fetcher: ZodFetcher<typeof fetch>,
	) {}

	/* async update({ data, id }) {
		return 200;
	} */
}
