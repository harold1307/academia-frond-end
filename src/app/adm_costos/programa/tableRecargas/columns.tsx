import { createColumnHelper } from "@tanstack/react-table";
import { FileSignature, XCircle } from "lucide-react";

import { Button } from "@/app/_components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { ToggleSwitch } from "@/app/_components/ui/toggle";
import { FormField } from "@/app/_components/ui/form";
import { useMutateModule } from "@/hooks/use-mutate-module";
import { Input } from "@/app/_components/ui/input";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/core/routes";

const helper = createColumnHelper<any>();

export const columns = [
	helper.accessor("id", {}),
	helper.accessor("tipo", {
		header: "Tipo matricula",
	}),
	helper.accessor("porcentaje", {
		header: "Porcentaje",
		cell: ({ row }) => {
			const valor: number = row.getValue("valorExtra");

			return <InputValor valor={valor} />;
		},
	}),
	helper.accessor("valor", {
		header: "Valor",
		cell: ({ row }) => {
			const valor: number = row.getValue("valor");

			return <InputValor valor={valor} />;
		},
	}),
];

const InputValor = ({ valor }: { valor: number }) => {
	const {
		mutation: { mutate, isPending },
		form,
	} = useMutateModule({
		mutationFn: async data => {
			//return API.periodos.create(data);
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
		},
	});

	return (
		<span>
			<FormField
				control={form.control}
				name='valor'
				key={"valor"}
				render={({ field }) => {
					return (
						<Input
							defaultValue={parseFloat(valor)}
							onChange={e => field.onChange(+e.target.value)}
							type={"number"}
							className='w-20 text-white'
						/>
					);
				}}
			/>
		</span>
	);
};
