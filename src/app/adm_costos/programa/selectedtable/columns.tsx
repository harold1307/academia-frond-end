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
	helper.accessor("inscripcion", {
		header: "Inscripción",
		cell: ({ row }) => {
			const valor = row.getValue("inscripcion");

			return <InputValor valor={valor} />;
		},
	}),
	helper.accessor("matricula", {
		header: "Matricula",
		cell: ({ row }) => {
			const valor = row.getValue("matricula");

			return <InputValor valor={valor} />;
		},
	}),
	helper.accessor("modulo", {
		header: "Modulo",
		cell: ({ row }) => {
			const valor = row.getValue("modulo");

			return <InputValor valor={valor} />;
		},
	}),
	helper.accessor("segundaMatricula", {
		header: "% Segunda matricula",
		cell: ({ row }) => {
			const valor = row.getValue("segundaMatricula");

			return <InputValor valor={valor} />;
		},
	}),
	helper.accessor("valorSegunda", {
		header: "Valor Segunda Matricula",
		cell: ({ row }) => {
			const valor = row.getValue("valorSegunda");

			return <InputValor valor={valor} />;
		},
	}),
	helper.accessor("terceraMatricula", {
		header: "% Tercera Matricula",
		cell: ({ row }) => {
			const valor = row.getValue("terceraMatricula");

			return <InputValor valor={valor} />;
		},
	}),
	helper.accessor("valorTercera", {
		header: "Valor Tercera Matricula",
		cell: ({ row }) => {
			const valor = row.getValue("valorTercera");

			return <InputValor valor={valor} />;
		},
	}),
	helper.accessor("MatriculaExtra", {
		header: "% Matricula Extra",
		cell: ({ row }) => {
			const valor = row.getValue("MatriculaExtra");

			return <InputValor valor={valor} />;
		},
	}),
	helper.accessor("matriculaEspecial", {
		header: "% Matricula especial",
		cell: ({ row }) => {
			const valor = row.getValue("matriculaEspecial");

			return <InputValor valor={valor} />;
		},
	}),
	helper.accessor("valorMatriculaEspecial", {
		header: "Valor matricula especial",
		cell: ({ row }) => {
			const valor = row.getValue("valorMatriculaEspecial");

			return <InputValor valor={valor} />;
		},
	}),
	helper.accessor("primerArancel", {
		header: "% Primer Arancel",
		cell: ({ row }) => {
			const valor = row.getValue("primerArancel");

			return <InputValor valor={valor} />;
		},
	}),
	helper.accessor("recargoMatricula", {
		header: "Recargo Matricula",
		cell: ({ row }) => {
			const valor = row.getValue("recargoMatricula") as boolean;

			return <ToggleTable valor={valor} />;
		},
	}),
	helper.accessor("valorRecargoMatricula", {
		header: "Valor Recargo Matricula",
		cell: ({ row }) => {
			const valor = row.getValue("valorRecargoMatricula");

			return <InputValor valor={valor} />;
		},
	}),
	helper.accessor("recargoArancel", {
		header: "Recargo Arancel",
		cell: ({ row }) => {
			const valor = row.getValue("recargoArancel") as boolean;

			return <ToggleTable valor={valor} />;
		},
	}),
	helper.accessor("valorRecargoArancel", {
		header: "Valor Recargo Arancel",
		cell: ({ row }) => {
			const valor = row.getValue("valorRecargoArancel");

			return <InputValor valor={valor} />;
		},
	}),
	helper.accessor("recargoOtros", {
		header: "Recargo Otros",
		cell: ({ row }) => {
			const valor = row.getValue("recargoOtros") as boolean;

			return <ToggleTable valor={valor} />;
		},
	}),
	helper.accessor("valorRecargoOtros", {
		header: "Valor Recargo Otros",
		cell: ({ row }) => {
			const valor = row.getValue("valorRecargoOtros");

			return <InputValor valor={valor} />;
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
							type={"text"}
							className='w-20'
						/>
					);
				}}
			/>
		</span>
	);
};

/* function Actions(props: { gruoCostoId: string }) {
	const { replaceSet } = useMutateSearchParams();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button>Acciones</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				<DropdownMenuItem
					onClick={() =>
						replaceSet(grupoCostosParams.update, props.gruoCostoId)
					}
				>
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
} */
