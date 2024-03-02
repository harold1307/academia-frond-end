"use client";
import { createColumnHelper } from "@tanstack/react-table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { Button } from "@/app/_components/ui/button";
import { Lock, FileSignature, Download, Equal } from "lucide-react";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { ModeloDeContratoSchema } from "../add-modeloDeContrato";
import { useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ROUTES } from "@/core/routes";

export type ModeloDeContratoTableItem = ModeloDeContratoSchema;

const helper = createColumnHelper<ModeloDeContratoTableItem>();

export const ModeloDeContratoColumns = [
	helper.accessor("id", { header: "ID" }),
	helper.accessor("nombredescripcion", {
		header: "Nombre/Descripcion",
	}),
	helper.accessor("paraprofesores", {
		header: "Para Profesores",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("archivo", {
		header: "Archivo",
		cell: ({ getValue }) => (getValue() ? <DownloadButton /> : null),
	}),
	helper.accessor("campos", {
		header: "Campos",
		cell: ({ row, getValue }) => {
			const id = row.getValue("id") as string;
			const value = getValue();
			return <ButtonCampos modeloDeContratoId={id} value={value} />;
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

			return <Actions modeloDeContratoId={id} />;
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

function ButtonCampos({
	modeloDeContratoId,
	value,
}: {
	modeloDeContratoId: string;
	value: string;
}) {
	const router = useRouter();

	const pathname = usePathname();

	function redireccion(modeloDeContratoId: string) {
		router.push(
			pathname + ROUTES.talentoHumano.modeloCampos(modeloDeContratoId),
		);
	}

	return (
		<Button
			className='m-2 h-8 w-fit border border-current bg-transparent p-2 text-current hover:text-black'
			onClick={() => {
				redireccion(modeloDeContratoId);
			}}
		>
			<Equal /> Campos - {value}
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

export const modeloDeContratoParams = {
	update: "actualizarModeloDeContrato",
	deactivate: "desactivarModeloDeContrato",
};

function Actions({ modeloDeContratoId }: { modeloDeContratoId: string }) {
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
						replaceSet(modeloDeContratoParams.update, modeloDeContratoId)
					}
				>
					<FileSignature className='mr-2 h-4 w-4' />
					<span>Editar</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() =>
						replaceSet(modeloDeContratoParams.deactivate, modeloDeContratoId)
					}
				>
					<Lock className='mr-2 h-4 w-4' />
					<span>Eliminar</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
