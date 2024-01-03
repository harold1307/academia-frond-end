import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useMutateSearchParams() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();

	const replaceSet = (param: string, value: string) => {
		const newParams = new URLSearchParams(searchParams);
		newParams.set(param, value);

		router.replace(pathname + "?" + newParams.toString());
	};

	const replaceDelete = (param: string) => {
		const newParams = new URLSearchParams(searchParams);
		newParams.delete(param);

		router.replace(pathname + "?" + newParams.toString());
	};

	return {
		replaceSet,
		replaceDelete,
		router,
		searchParams,
		pathname,
	};
}
