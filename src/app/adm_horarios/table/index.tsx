"use client";
import React from "react";
import {
	type HorariosAdminSchema,
	type HorariosAdminTableItem,
	horariosAdminColumns,
	horariosParams,
} from "./columns";
import { DataTable } from "./data-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMutateModule } from "@/hooks/use-mutate-module";
import ModalFallback from "@/app/_components/modals/modal-fallback";
import MutateModal from "@/app/_components/modals/mutate-modal";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/app/_components/ui/select";
import DeleteModal from "@/app/_components/modals/delete-modal";
import { type Field } from "@/utils/forms";

interface HorariosAdminTableProps {
	data: HorariosAdminSchema[];
}

export default function HorariosAdminTable({ data }: HorariosAdminTableProps) {
	const horarios = React.useMemo(() => {
		return data?.map(
			horario =>
				({
					...horario,
				}) satisfies HorariosAdminTableItem,
		);
	}, [data]);

	return (
		<section className=''>
			<DataTable columns={horariosAdminColumns} data={horarios} />
			<SendMessage horarios={horarios} />
		</section>
	);
}

function SendMessage({ horarios }: { horarios: HorariosAdminSchema[] }) {
	
	console.log(horarios)

	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { form, mutation } = useMutateModule({
		// schema,
		mutationFn: async () => {},
		onSuccess: response => {
			console.log(response);
		},
		onError: error => {
			console.log(error);
		},
	});

	const dismissModal = () => {
		const newParams = new URLSearchParams(searchParams);
		newParams.delete(horariosParams.mensaje);

		router.replace(pathname + "?" + newParams.toString());
	};

	const horariosId = React.useMemo(
		() => searchParams.get(horariosParams.mensaje),
		[searchParams],
	);

	const selectedCosto = horarios.find(i => i.id === horariosId);
	if (!horariosId) return null;

	if (!selectedCosto) {
		return <ModalFallback action='update' redirectTo={() => dismissModal()} />;
	}
	return (
		<section>
			<MutateModal
				dialogProps={{
					open: true,
					onOpenChange: open => {
						// if (mutation.isPending) return;
						if (!open) {
							dismissModal();
							return;
						}
					},
				}}
				disabled={mutation.isPending}
				form={form}
				onSubmit={form.handleSubmit(
					data => console.log("Falta implementar lógica", data),
					// mutation.mutate(data)
				)}
				title={`Nuevo mensaje`}
				withTrigger
				triggerLabel='enviar mensaje'
			>
				<div className='flex w-full flex-col items-start justify-start gap-8 px-8'>
					{mensajesFields.map(f => (
						<FormField
							control={form.control}
							name={f.name}
							key={f.name}
							render={({ field }) => {
								return (
									<FormItem className='flex w-full items-center justify-start gap-2'>
										<FormLabel className='text-md col-span-3 w-[12%] text-start'>
											{f.label}
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												value={
													typeof field.value === "boolean"
														? undefined
														: field.value || undefined
												}
												type={f.inputType}
											/>
										</FormControl>
									</FormItem>
								);
							}}
						/>
					))}
				</div>
			</MutateModal>
		</section>
	);
}
type Mensajes = {
	contacto: string;
	destinatario: string;
	asunto: string;
	contenido: string;
};
const mensajesFields = [
	{
		name: "contacto",
		inputType: "text",
		label: "Contacto",
	},
	{
		name: "destinatario",
		inputType: "text",
		label: "Destinatario",
	},
	{
		name: "asunto",
		inputType: "text",
		label: "Asunto",
	},
	{
		name: "contenido",
		inputType: "custom-text-area",
		label: "Contenido",
	},
] satisfies Field<keyof Mensajes>[];
