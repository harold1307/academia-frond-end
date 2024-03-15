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

const helper = createColumnHelper<any>();

export const columns = [
	helper.accessor("id", {}),
	helper.accessor("nombre", {
		header: "Nombre",
	}),
	helper.accessor("iva", {
		header: "IVA",
	}),
	helper.accessor("costo", {
		header: "Costo",
		cell: ({ row }) => {
			const valor: number = row.getValue("costo");

			return <InputValor valor={valor} />;
		},
	}),
	helper.accessor("costoBase", {
		header: "Costo Base",
		cell: ({ row }) => {
			const valor: number = row.getValue("costoBase");

			return <InputValor valor={valor} />;
		},
	}),
	helper.accessor("horaLim", {
		header: "Hora limite",
	}),
	helper.accessor("activo", {
		header: "Activo",
		cell: ({ row }) => {
			const valor = row.getValue("activo") as boolean;

			return <ToggleTable valor={valor} />;
		},
	}),
	helper.display({
		id: "actions",
		cell: ({ row }) => {
			const id = row.getValue("id") as string;

			return <Actions especieId={id} />;
		},
	}),
];

const ToggleTable = ({ valor }: { valor: boolean }) => {
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
				name='activo'
				key={"activo"}
				render={({ field }) => {
					return (
						<ToggleSwitch
							checked={field.value as boolean}
							defaultChecked={valor as boolean}
							onCheckedChange={field.onChange}
						/>
					);
				}}
			/>
		</span>
	);
};

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
							onChange={e => field.onChange(+e.target.value)}
							type={"number"}
							className='w-20'
						/>
					);
				}}
			/>
		</span>
	);
};

function Actions(props: { especieId: string }) {
	const { replaceSet } = useMutateSearchParams();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button>Acciones</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				<DropdownMenuItem>
					<FileSignature className='mr-2 h-4 w-4' />
					<span>Aceptar</span>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<XCircle className='mr-2 h-4 w-4' />
					<span>Rechazar</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
