"use client";
import { createColumnHelper } from "@tanstack/react-table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { Button } from "@/app/_components/ui/button";
import { Lock, FileSignature, Download, Equal, PlusCircle } from "lucide-react";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { PlazasDepartamentosSchema } from "../add-plazas";
import { useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ROUTES } from "@/core/routes";

export type PlazasDepartamentosTableItem = PlazasDepartamentosSchema;

const helper = createColumnHelper<PlazasDepartamentosTableItem>();

export const PlazasDepartamentosColumns = [
	helper.accessor("cargo", {
		header: "Cargo",
	}),
	helper.accessor("id", { header: "ID" }),
	helper.accessor("persona", {
		header: "Persona",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.display({
		id: "permisos",
		cell: ({ row }) => {
			const id = row.getValue("id") as string;
			const nombre = "Permisos";
			return <GenericButton plazasDepartamentosId={id} nombre={nombre} />;
		},
	}),
	helper.display({
		id: "grupos",
		cell: ({ row }) => {
			const id = row.getValue("id") as string;
			const nombre = "Grupos";
			return <GenericButton plazasDepartamentosId={id} nombre={nombre} />;
		},
	}),
	helper.display({
		id: "funciones",
		cell: ({ row }) => {
			const id = row.getValue("id") as string;
			const nombre = "Funciones";
			return <GenericButton plazasDepartamentosId={id} nombre={nombre} />;
		},
	}),
	helper.display({
		id: "contratos",
		cell: ({ row }) => {
			const id = row.getValue("id") as string;
			const nombre = "Contratos";
			return <GenericButton plazasDepartamentosId={id} nombre={nombre} />;
		},
	}),
	helper.accessor("responsable", {
		header: "Responsable",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("tienecontrato", {
		header: "Tiene Contrato",
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

			return <Actions plazasDepartamentosId={id} />;
		},
	}),
];

function DownloadButton() {
	return (
		<Button className='m-2 h-8 w-8 border border-current bg-transparent p-2 text-current hover:text-black'>
			{/* falta agregar el Link para decargar el archivo, cuando haya archivo */}
			<Download />
		</Button>
	);
}

function GenericButton({
	plazasDepartamentosId,
	nombre,
}: {
	plazasDepartamentosId: string;
	nombre: string;
}) {
	const router = useRouter();

	const pathname = usePathname();

	function redireccion(plazasDepartamentosId: string) {
		router.push(
			pathname + ROUTES.talentoHumano.plazas(plazasDepartamentosId),
		);
	}

	return (
		<Button
			className='m-2 h-8 w-fit border border-current bg-transparent p-2 text-current hover:text-black'
			onClick={() => {
				redireccion(plazasDepartamentosId);
			}}
		>
			<Equal /> {nombre} - 2
		</Button>
	);
}

function Switcher({ value }: { value: boolean }) {
	const [valor, setValor] = useState(value);

	return (
		<Button
			className='m-2 h-8 w-8 border border-current bg-transparent p-2 text-current hover:text-black'
			onClick={() => setValor(!valor)}
		>
			{valor ? "SI" : "NO"}
		</Button>
	);
}

export const plazasDepartamentosParams = {
	add: "adicionarPlazasDepartamentos",
	update: "actualizarPlazasDepartamentos",
	deactivate: "desactivarPlazasDepartamentos",
};

function Actions({ plazasDepartamentosId }: { plazasDepartamentosId: string }) {
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
						replaceSet(plazasDepartamentosParams.add, plazasDepartamentosId)
					}
				>
					<PlusCircle className='mr-2 h-4 w-4' />
					<span>Asignar</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() =>
						replaceSet(plazasDepartamentosParams.update, plazasDepartamentosId)
					}
				>
					<FileSignature className='mr-2 h-4 w-4' />
					<span>Editar</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() =>
						replaceSet(
							plazasDepartamentosParams.deactivate,
							plazasDepartamentosId,
						)
					}
				>
					<Lock className='mr-2 h-4 w-4' />
					<span>Eliminar</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
