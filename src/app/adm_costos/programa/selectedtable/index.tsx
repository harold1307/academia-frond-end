"use client";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import React from "react";
import ModalFallback from "@/app/_components/modals/modal-fallback";
import { Button } from "@/app/_components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/app/_components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/app/_components/ui/form";
import { FormInputFile } from "@/app/_components/ui/form-input-file";
import { Input } from "@/app/_components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/app/_components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/app/_components/ui/select";
import { Textarea } from "@/app/_components/ui/textarea";
import { ToggleSwitch } from "@/app/_components/ui/toggle";
import { API } from "@/core/api-client";
import { useMutateModule } from "@/hooks/use-mutate-module";
import { useRouter, useSearchParams } from "next/navigation";
import { PlusCircle } from "lucide-react";
import { ROUTES } from "@/core/routes";
import { useQuery } from "@tanstack/react-query";

export default function SelectedProgramaTable({ programa }: { programa: any }) {
	return (
		<section className='my-2'>
			<div className="flex flex-row items-center gap-4">
				<h2 className='my-4 text-xl'>Costos</h2>
				<section className='flex flex-row gap-2'>
					<div className='rounded-md bg-blue-900 p-2 text-sm'>
						EN LINEA-DOMINGO-MATUTINO-VALIDANDO
					</div>
					<div className='rounded-md bg-blue-900 p-2 text-sm'>
						EN LINEA-JORNADA1-LMMJV-REGULAR
					</div>
				</section>
			</div>
			<DataTable columns={columns} data={programa} />
		</section>
	);
}

const fields = [
	{
		name: "nombre",
		inputType: "text",
		placeholder: "",
		label: "Nombre",
	},
];
