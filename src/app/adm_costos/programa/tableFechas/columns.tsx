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
	helper.accessor("creditos", {
		header: "Creditos",
		cell: ({ row }) => {
			const valor: number = row.getValue("creditos");

			return <InputValor valor={valor} />;
		},
	}),
	helper.accessor("cuotas", {
		header: "Cuotas",
		cell: ({ row }) => {
			const valor: number = row.getValue("cuotas");

			return <InputValor valor={valor} />;
		},
	}),
	helper.accessor("id", {
		id: "actions",
		cell: ({ row }) => {
			const id = row.getValue("id") as string;

			return <Actions idFecha={id} />;
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
							defaultValue={valor}
							onChange={e => field.onChange(e.target.value)}
							type={"text"}
							className='w-20 text-white'
						/>
					);
				}}
			/>
		</span>
	);
};

function Actions(props: { idFecha: string }) {
	const { replaceSet } = useMutateSearchParams();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button>Acciones</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				<DropdownMenuItem>
					<FileSignature className='mr-2 h-4 w-4' />
					<span>Editar</span>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<XCircle className='mr-2 h-4 w-4' />
					<span>Eliminar</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
