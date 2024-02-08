"use client";
import { columns } from "./colums";
import { DataTable } from "./data-table";
import { zodResolver } from "@hookform/resolvers/zod";
import { TipoDuracion, type MallaCurricular } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon, PlusCircle } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/app/_components/ui/select";
import { API } from "@/core/api-client";
import { cn } from "@/utils";
import { NIVELES_PREFIXES, type Field } from "@/utils/forms";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/app/_components/ui/button";
import { Calendar } from "@/app/_components/ui/calendar";
import { Checkbox } from "@/app/_components/ui/checkbox";
import { Input } from "@/app/_components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/app/_components/ui/popover";
import { Textarea } from "@/app/_components/ui/textarea";
import ModalFallback from "@/app/_components/modals/modal-fallback";
import { traduccionParams } from "../addTraduccion";
import { ROUTES } from "@/core/routes";

export default function TraduccionTable({ mallas }) {
	return (
		<section>
			<DataTable columns={columns} data={mallas} />
			<UpdateTrad traduccion={mallas} />
		</section>
	);
}

function UpdateTrad(props) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const createTradSchema: z.ZodType<z.ZodTypeDef> = z.object({});

	const { mutate: onSubmit, isPending: isSubmitting } = useMutation({
		mutationFn: async ({ data, id }) => {
			return API.traduccion.update({ traduccion: { data, id } });
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			router.replace(ROUTES.periodo.traduccion(props.id));
			router.refresh();
		},
	});

	const form = useForm({
		resolver: zodResolver(createTradSchema),
		defaultValues: {},
		disabled: isSubmitting,
		shouldUnregister: true,
	});

	const paramPeriodoId = React.useMemo(
		() => searchParams.get(traduccionParams.update),
		[searchParams],
	);

	if (!paramPeriodoId) return null;

	const selectedPeriodo = props.traduccion.find(i => i.id === paramPeriodoId);

	if (!selectedPeriodo) {
		return (
			<ModalFallback
				action='update'
				redirectTo={() => router.replace(ROUTES.periodo.traduccion(props.id))}
			/>
		);
	}

	return (
		<Dialog
			defaultOpen={true}
			onOpenChange={open => {
				if (isSubmitting) return;
				if (!open) {
					router.replace(ROUTES.periodo.traduccion(props.id));
					return;
				}
			}}
		>
			<DialogContent className='max-h-[80%] max-w-xs overflow-y-scroll sm:max-w-[425px] md:max-w-2xl'>
				<DialogHeader>
					<DialogTitle>Editar traduccion</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(data => onSubmit(data))}
						className='space-y-8'
					>
						{fields.map(f => (
							<FormField
								control={form.control}
								name={f.name}
								key={f.name.includes("Desde") ? f.name + form.watch() : f.name}
								render={({ field }) => {
									switch (f.inputType) {
										case "custom-date": {
											return (
												<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
													<FormLabel className='col-span-3 text-end'>
														{f.label}
													</FormLabel>
													<Popover>
														<PopoverTrigger asChild>
															<FormControl>
																<Button
																	variant={"outline"}
																	className={cn(
																		"col-span-9 w-[240px] pl-3 text-left font-normal",
																		!field.value && "text-muted-foreground",
																	)}
																	disabled={field.disabled}
																>
																	{field.value ? (
																		format(
																			field.value as unknown as Date,
																			"PPP",
																		)
																	) : (
																		<span>Pick a date</span>
																	)}
																	<CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
																</Button>
															</FormControl>
														</PopoverTrigger>
														<PopoverContent
															className='w-auto p-0'
															align='start'
														>
															<Calendar
																mode='single'
																selected={field.value as unknown as Date}
																onSelect={field.onChange}
																disabled={date =>
																	date < new Date() || !!field.disabled
																}
																initialFocus
															/>
														</PopoverContent>
													</Popover>
												</FormItem>
											);
										}
										case "custom-select": {
											const options =
												f.options === "niveles"
													? NIVELES_PREFIXES.slice(
															0,
															form.getValues().niveles,
														).map(
															v =>
																({
																	value: v,
																	label: `${v} NIVEL`,
																}) satisfies {
																	label: string;
																	value: string;
																},
														)
													: f.options;

											return (
												<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
													<FormLabel className='col-span-3 text-end'>
														{f.label}
													</FormLabel>
													<Select
														onValueChange={field.onChange}
														defaultValue={field.value as string}
														disabled={field.disabled}
													>
														<FormControl>
															<SelectTrigger className='col-span-9'>
																<SelectValue
																	placeholder={f.placeholder}
																	className='w-full'
																/>
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{options?.map(o =>
																typeof o === "string" ? (
																	<SelectItem value={o} key={o}>
																		{o}
																	</SelectItem>
																) : (
																	<SelectItem value={o.value} key={o.value}>
																		{o.label}
																	</SelectItem>
																),
															)}
														</SelectContent>
													</Select>
												</FormItem>
											);
										}
										case "custom-text-area": {
											return (
												<FormItem className='grid grid-cols-12 items-start gap-4 space-y-0'>
													<FormLabel className='col-span-3 text-end'>
														{f.label}
													</FormLabel>
													<FormControl>
														<Textarea
															className='col-span-9 resize-none'
															{...field}
															value={field.value as string}
														/>
													</FormControl>
												</FormItem>
											);
										}
										case "checkbox": {
											return (
												<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
													<FormLabel className='col-span-3 text-end'>
														{f.label}
													</FormLabel>
													<FormControl>
														<Checkbox
															checked={field.value as boolean}
															onCheckedChange={field.onChange}
														/>
													</FormControl>
												</FormItem>
											);
										}
										default: {
											return (
												<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
													<FormLabel className='col-span-3 text-end'>
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
															onChange={e =>
																f.inputType === "number"
																	? field.onChange(+e.target.value)
																	: field.onChange(e.target.value)
															}
															type={f.inputType}
															placeholder={f.placeholder}
															className='col-span-9'
														/>
													</FormControl>
												</FormItem>
											);
										}
									}
								}}
							/>
						))}
						<DialogFooter>
							<Button disabled={isSubmitting} type='submit' variant='success'>
								Guardar
							</Button>
							<Button
								disabled={isSubmitting}
								variant='destructive'
								type='button'
								onClick={() =>
									router.replace(ROUTES.periodo.traduccion(props.id))
								}
							>
								Cancelar
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

const fields = [
	{
		name: "nombre",
		inputType: "text",
		placeholder: "",
		label: "Nombre",
	},
	{
		name: "idioma",
		inputType: "text",
		placeholder: "",
		label: "Idioma",
	},
];
