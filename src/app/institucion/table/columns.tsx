import type { Institucion } from "@prisma/client";
import { createColumnHelper } from "@tanstack/react-table";
import { FileSignature, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/app/_components/ui/button";
import { ROUTES } from "@/core/routes";

export type InstitucionTableItem = Omit<Institucion, "createdAt"> & {
	isUsed: boolean;
};

const columnHelper = createColumnHelper<InstitucionTableItem>();

export const columns = [
	columnHelper.accessor("id", {}),
	columnHelper.accessor("nombre", {
		header: "Nombre",
	}),
	columnHelper.accessor("tipo", {
		header: "Tipo",
	}),
	columnHelper.accessor("pais", {
		header: "Pais",
	}),
	columnHelper.accessor("provincia", {
		header: "Provincia",
	}),
	columnHelper.accessor("canton", {
		header: "Canton",
	}),
	columnHelper.accessor("codigo", {
		header: "Codigo",
	}),
	// TODO: esto debe ser dependiendo si la institucion esta en uso - como una institucion esta en uso??
	columnHelper.accessor("isUsed", {
		header: "En uso",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	columnHelper.display({
		id: "actions",
		cell: ({ row }) => {
			const id = row.getValue("id") as string;
			const isUsed = row.getValue("isUsed") as boolean;
			return <Actions institucionId={id} showDelete={!isUsed} />;
		},
	}),
];

function Actions(props: { institucionId: string; showDelete: boolean }) {
	const router = useRouter();
	return (
		<>
			<Button
				size='icon'
				variant='info'
				className='mr-2'
				onClick={() =>
					router.replace(
						ROUTES.institucion +
							`?actualizarInstitucion=${props.institucionId}`,
					)
				}
			>
				<FileSignature className='h-4 w-4' />
			</Button>
			{props.showDelete && (
				<Button
					size='icon'
					variant='destructive'
					onClick={() =>
						router.replace(
							ROUTES.institucion +
								`?eliminarInstitucion=${props.institucionId}`,
						)
					}
				>
					<X className='h-4 w-4' />
				</Button>
			)}
		</>
	);
}
