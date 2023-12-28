import { zodResolver } from "@hookform/resolvers/zod";
import {
	useMutation,
	useQueryClient,
	type QueryKey,
} from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

type UseMutateModuleProps<T extends object, R, P> = {
	schema?: z.ZodType<T>;
	hookFormProps?: Parameters<typeof useForm<T>>[0];
	invalidateQueryKey: QueryKey;
	mutationFn: (data: P extends undefined ? T : P) => Promise<R>;
	onSuccess: (response: R) => void;
	onError: (error: any) => void;
};

export function useMutateModule<T extends object, R, P = undefined>({
	schema,
	invalidateQueryKey,
	mutationFn,
	onSuccess,
	onError,
	hookFormProps,
}: UseMutateModuleProps<T, R, P>) {
	const [open, setOpen] = React.useState(false);
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn,
		onError,
		onSuccess: response => {
			onSuccess(response);
			queryClient.invalidateQueries({
				queryKey: invalidateQueryKey,
			});
			setOpen(false);
		},
	});

	const form = useForm<T>({
		...hookFormProps,
		resolver: schema ? zodResolver(schema) : undefined,
		disabled: mutation.isPending,
		shouldUnregister: true,
	});

	return {
		form,
		mutation,
		open,
		setOpen,
	};
}
