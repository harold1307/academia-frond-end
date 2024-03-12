import { useToast } from "@/app/_components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	useMutation,
	useQueryClient,
	type QueryKey,
} from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

type UseMutateModuleProps<T extends z.ZodType, R, P> = {
	schema?: T;
	hookFormProps?: Parameters<typeof useForm<z.infer<T>>>[0];
	invalidateQueryKey?: QueryKey;
	mutationFn: (data: P extends undefined ? z.infer<T> : P) => Promise<R>;
	onSuccess: (response: R) => void;
	onError?: (error: any) => void;
};

export function useMutateModule<T extends z.ZodType, R, P = undefined>({
	schema,
	invalidateQueryKey,
	mutationFn,
	onSuccess,
	onError,
	hookFormProps,
}: UseMutateModuleProps<T, R, P>) {
	const { toast } = useToast();
	const [open, setOpen] = React.useState(false);
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationKey: invalidateQueryKey,
		mutationFn,
		onError:
			onError ||
			(err => {
				toast({
					title: "Error",
					description: err.message,
					variant: "destructive",
				});
			}),
		onSuccess: async response => {
			await queryClient.invalidateQueries({
				queryKey: invalidateQueryKey,
			});
			queryClient.removeQueries({ queryKey: invalidateQueryKey });
			onSuccess(response);
			setOpen(false);
		},
	});

	const form = useForm<z.infer<T>>({
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
