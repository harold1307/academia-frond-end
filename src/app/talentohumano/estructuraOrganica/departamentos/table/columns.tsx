"use client";
import { createColumnHelper } from "@tanstack/react-table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { Button } from "@/app/_components/ui/button";
import { Lock, FileSignature, Equal } from "lucide-react";
import { useState } from "react";
import { type DepartamentosSchema } from "../add-departamentos";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { usePathname, useRouter } from "next/navigation";
import { ROUTES } from "@/core/routes";

export type DepartamentosTableItem = DepartamentosSchema;

const helper = createColumnHelper<DepartamentosTableItem>();

export const DepartamentosColumns = [
	helper.accessor("nivel", {
		header: "Nivel",
	}),
	helper.accessor("departamento", {
		header: "Departamento",
	}),
	helper.accessor("id", {
		header: "ID",
	}),
	helper.accessor("subordinado", {
		header: "Subordinado/a",
		cell: ({ getValue }) => {
			const nombres = getValue();
			return <Asignados nombres={nombres} />;
		},
	}),
	helper.accessor("responsable", {
		header: "Responsable",
	}),
	helper.accessor("plazas", {
		header: "Plazas",
		cell: ({ row, getValue }) => {
			const id = row.getValue("id") as string;
			const value = getValue();
			return <ButtonPlazas departamentosId={id} value={value} />;
		},
	}),
	helper.accessor("activo", {
		header: "Activo",
		cell: ({ getValue }) => {
			const value = getValue();
			return <Switcher value={value} />;
		},
	}),

	helper.display({
		id: "actions",
		cell: ({ row }) => {
			const id = row.getValue("id") as string;

			return <Actions departamentosId={id} />;
		},
	}),
];

function Switcher({ value }: { value: boolean }) {
	const [valor, setValor] = useState(value);

	return (
		<Button
			className='m-4 h-8 w-8 border border-current bg-transparent p-2 text-current hover:text-black'
			onClick={() => setValor(!valor)}
		>
			{valor ? "SI" : "NO"}
		</Button>
	);
}

export const departamentosParams = {
	update: "actualizardepartamentos",
	deactivate: "desactivardepartamentos",
};

function Asignados({ nombres }: { nombres: string[] }) {
	return (
		<div className='w-full p-2'>
			{nombres.map(nombre => (
				<p className='w-full' key={nombre}>{nombre}</p>
			))}
		</div>
	);
}

function ButtonPlazas({
	departamentosId,
	value,
}: {
	departamentosId: string;
	value: string;
}) {
	const router = useRouter();

	const pathname = usePathname();

	function redireccion(departamentosId: string) {
		router.push(pathname + ROUTES.talentoHumano.plazas(departamentosId));
	}

	return (
		<Button
			className='m-2 h-8 w-fit border border-current bg-transparent p-2 text-current hover:text-black'
			onClick={() => {
				redireccion(departamentosId);
			}}
		>
			<Equal /> Plazas - {value}
		</Button>
	);
}

function Actions({ departamentosId }: { departamentosId: string }) {
	const { replaceSet } = useMutateSearchParams();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button className='hover:bg-slate-300 hover:text-slate-800'>
					Acciones
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				<DropdownMenuItem
					onClick={() =>
						replaceSet(departamentosParams.update, departamentosId)
					}
				>
					<FileSignature className='mr-2 h-4 w-4' />
					<span>Editar</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() =>
						replaceSet(departamentosParams.deactivate, departamentosId)
					}
				>
					<Lock className='mr-2 h-4 w-4' />
					<span>Eliminar</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
