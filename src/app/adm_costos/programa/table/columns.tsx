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
	helper.accessor("nombre", {
		header: "Nombre",
	}),
	helper.accessor("detalle", {
		header: "Detalle",
		cell: ({ row }) => {
			const id = row.getValue("id");

			return <Details id={id} />;
		},
	}),
	helper.accessor("creditos", {
		header: "Creditos",
	}),
	helper.accessor("valorMatricula", {
		header: "Valor matricula",
		cell: ({ row }) => {
			const valor: number = row.getValue("valorMatricula");

			return <InputValor valor={valor} />;
		},
	}),
	helper.accessor("porcentajeMatricula", {
		header: "% Matricula",
		cell: ({ row }) => {
			const valor: number = row.getValue("porcentajeMatricula");

			return <InputValor valor={valor} />;
		},
	}),
	helper.accessor("arancel", {
		header: "Arancel",
		cell: ({ row }) => {
			const valor: number = row.getValue("arancel");

			return <InputValor valor={valor} />;
		},
	}),
	helper.accessor("primerArancel", {
		header: "% Primer arancel",
		cell: ({ row }) => {
			const valor: number = row.getValue("primerArancel");

			return <InputValor valor={valor} />;
		},
	}),
	helper.accessor("otros", {
		header: "Otros",
	}),
	helper.accessor("total", {
		header: "Total",
		cell: ({ row }) => {
			const valor = row.getValue("total") as boolean;

			return <ToggleTable valor={valor} />;
		},
	}),
	helper.accessor("cuotas", {
		header: "Cuotas",
		cell: ({ row }) => {
			const valor: number = row.getValue("cuotas");

			return <InputValor valor={valor} />;
		},
	}),
	helper.accessor("meses", {
		header: "Meses",
		cell: ({ row }) => {
			const valor: number = row.getValue("meses");

			return <InputValor valor={valor} />;
		},
	}),
	helper.accessor("fechaInicial", {
		header: "Fecha inicial nivel",
		cell: ({ row }) => {
			const valor = row.getValue("fechaInicial") as boolean;

			return <ToggleTable valor={valor} />;
		},
	}),
	helper.accessor("fecha", {
		header: "fecha",
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
							type={"text"}
							className='w-20'
						/>
					);
				}}
			/>
		</span>
	);
};

function Actions(props: { gruoCostoId: string }) {
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

function Details(props: { id: string }) {
	const { replaceSet, replaceDelete } = useMutateSearchParams();
	const id = props.id;
	const router = useRouter();

	return (
		<div className='flex flex-col gap-2'>
			<button
				onClick={() =>
					router.replace(ROUTES.admCostos.programa() + "&materias=" + id)
				}
				className='rounded-md bg-green-500 p-1'
			>
				Materias
			</button>
			<button
				onClick={() =>
					router.replace(ROUTES.admCostos.programa() + "&rubros=" + id)
				}
				className='rounded-md bg-green-500 p-1'
			>
				Otros rubros
			</button>
			<button
				onClick={() =>
					router.replace(ROUTES.admCostos.programa() + "&descuentos=" + id)
				}
				className='rounded-md bg-green-500 p-1'
			>
				Descuentos
			</button>
			<button
				onClick={() =>
					router.replace(ROUTES.admCostos.programa() + "&recargas=" + id)
				}
				className='rounded-md bg-green-500 p-1'
			>
				Recargas
			</button>
			<button
				onClick={() =>
					router.replace(ROUTES.admCostos.programa() + "&fechas=" + id)
				}
				className='rounded-md bg-green-500 p-1'
			>
				Fechas
			</button>
		</div>
	);
}
