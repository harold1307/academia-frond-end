"use client";
import MutateModal from "@/app/_components/modals/mutate-modal";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { useMutateModule } from "@/hooks/use-mutate-module";
import type { Field } from "@/utils/forms";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/_components/ui/select";

type AddMateriaProps = {
	varianteId: string;
};

//Schema de Mockup hasta tener el esquema de Prisma
export type MateriaSchema = {
	id:string	
	asginatura: string //select
	lms: string //select
    plantillaLms: string //select
    validaParaCreditos: boolean
    validaParaPromedios: boolean
    horas: number
    horasDocencia: number
    horasColaborativas: number
    horasAsistidasPorDocente: number
    horasOrganizacionAprendizaje: number
    horasAutonomas:number
    horasPracticas:number
    creditos:number
    requeridaAprobar: boolean
    sumaHoras: boolean
    calificar: boolean
    modeloEvaluativo?: string //select
    notaMaxima?: number
    notaParaAprobar?: number
    cantidadDecimales?: number
    asistenciaAprobar: number
}

// export const MateriaSchema = z.object<ZodInferSchema<MateriaSchema>>()

export default function AddMateria({ varianteId }: AddMateriaProps) {
	const { form, mutation, open, setOpen } = useMutateModule({
		// schema: MateriaSchema,
		mutationFn: async data => {

        },
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
		},
        hookFormProps: {
            defaultValues: {
                calificar: false
            }
        }
	});

	console.log(form.formState.errors);
	return (
		<section>
			<MutateModal
				dialogProps={{
					open,
					onOpenChange: setOpen,
				}}
				disabled={mutation.isPending}
				form={form}
				onSubmit={form.handleSubmit(data => 
					console.log('Falta implementar lógica', data)
					// mutation.mutate(data)
				)}
				title={`Adicionar Materia en variante de curso ${varianteId}`}
				withTrigger
				triggerLabel='Adicionar Materia en variante de curso'
			>
				<div className='flex items-start justify-start flex-wrap gap-8 w-full px-8'>
					{materiaFields.map(f => (
						f.inputType === 'checkbox' ?
                        (
                            <FormField
                                control={form.control}
                                name={f.name}
                                key={f.name}
                                defaultValue={false}
                                render={({ field }) => {
                                    return(
                                    <FormItem
                                     className='flex justify-between items-center gap-4 space-y-0 border-2 rounded-2xl w-60 h-16 p-4'
                                     style={{
                                        boxShadow: '0 0 20px rgba(67, 84, 234, .7)'
                                     }}
                                    >
                                        <FormLabel className='col-span-3 text-start'>
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
                                    )
                                }}
                            />
                        )
						: (
                            f.inputType === 'custom-select'? 
                            (
                                (f.name === 'modeloEvaluativo' && form.getValues('calificar') === true) || f.name !== 'modeloEvaluativo' ? (
                                    <FormField
                                            control={form.control}
                                            name={f.name}
                                            key={f.name}
                                            render={({ field }) => {
                                                const options = f.options ? f.options : ['A', 'B']
                                                return(
                                                    <FormItem className='grid grid-cols-12 items-center gap-4 space-y-0 w-full'>
                                                        <FormLabel className='col-span-3 text-end w-2/12'>
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
                                                                {options.map(o =>
                                                                    typeof o === "string" ? (
                                                                        <SelectItem value={o} key={o}>
                                                                            {o}
                                                                        </SelectItem>
                                                                    ) : (
                                                                        <SelectItem value={o} key={o}>
                                                                            {o}
                                                                        </SelectItem>
                                                                    ),
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    </FormItem>
                                                )
                                            }}
                                    />

                                ) : null
                            ) : 
                            (
                                (['notaParaAprobar', 'notaMaxima', 'cantidadDecimales'].includes(f.name)  && form.getValues('calificar') === true) ||
                                !['notaParaAprobar', 'notaMaxima', 'cantidadDecimales'].includes(f.name) ? 
                                (
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

                                ) : null
                            )
                        )
					))}
                    {
                        form.getValues('calificar') === true ? <h1>ola</h1> : null
                    }
				</div>
			</MutateModal>
		</section>
	);
}


export const materiaFields = [
	{
		name: "asginatura",
		inputType: "custom-select",
        placeholder: '-----',
        options: ['asignatura1', 'asignatura2', 'asignatura3'],
		label: "Asignatura",
	},
    {
		name: "lms",
		inputType: "custom-select",
        placeholder: '-----',
        options: ['Lms1', 'Lms2', 'Lms3'],
		label: "Lms",
	},
    {
		name: "plantillaLms",
		inputType: "custom-select",
        placeholder: '-----',
        options: ['PlantillaLms1', 'PlantillaLms2', 'PlantillaLms3'],
		label: "Plantilla Lms",
	},
    {
        name: "validaParaCreditos",
        inputType: 'checkbox',
        label: 'Valida para Créditos'
    },
    {
        name: "validaParaPromedios",
        inputType: 'checkbox',
        label: 'Valida para Promedios'
    },
	{
		name: "horas",
		inputType: "number",
		label: "Horas",
	},
    {
        name: "horasDocencia",
        inputType: 'number',
        label: 'Horas Docencia'
    },
    {
        name: "horasColaborativas",
        inputType: 'number',
        label: 'Horas Colaborativas'
    },
    {
        name: "horasAsistidasPorDocente",
        inputType: 'number',
        label: 'Horas asistidas por el docente'
    },
    {
        name: "horasOrganizacionAprendizaje",
        inputType: 'number',
        label: 'Horas Oragnización Aprendizaje'
    },
    {
        name: "horasAutonomas",
        inputType: 'number',
        label: 'Horas Autónomas'
    },
    {
        name: "horasPracticas",
        inputType: 'number',
        label: 'Horas Prácticas'
    },
    {
        name: "creditos",
        inputType: "number",
        label: "Créditos",
    },
    {
        name:'requeridaAprobar',
        inputType: 'checkbox',
        label: 'Requerida'
    },
    {
        name:'sumaHoras',
        inputType: 'checkbox',
        label: 'Suma Horas'
    },
    {
        name:'calificar',
        inputType: 'checkbox',
        label: 'Califica'
    },
    {
        name:"modeloEvaluativo",
        inputType: 'custom-select',
        options: ['modelo1', 'modelo2', 'modelo3'],
        placeholder: '------',
        label: 'Modelo Evaluativo'
    },
    {
        name:'notaMaxima',
        inputType: 'number',
        label: 'Nota Máxima'
    },
    {
        name:'notaParaAprobar',
        inputType: 'number',
        label: 'Nota Aprobar'
    },
    {
        name:'cantidadDecimales',
        inputType: 'number',
        label: 'Cantidad de Decimales'
    },
    {
        name:'asistenciaAprobar',
        inputType: 'number',
        label: 'Asistencia'
    },
] satisfies Field<keyof MateriaSchema>[];
