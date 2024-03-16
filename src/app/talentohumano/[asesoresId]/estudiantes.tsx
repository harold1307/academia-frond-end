import React from "react";
import EstudiantesTableServer from "./table/server";
import { useMutateModule } from "@/hooks/use-mutate-module";
import ShowModal from "@/app/_components/modals/show-modal";

export default function EstudiantesTableModal() {
	const { form, mutation, open, setOpen } = useMutateModule({

		mutationFn: async data => {},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
		},
	});
	console.log(form.formState.errors);
	return (
		<section>
			<ShowModal
				dialogProps={{
					open,
					onOpenChange: setOpen,
				}}
				title={`Estudiantes`}
				withTrigger
				triggerLabel='Estudiantes'
			>
				<EstudiantesTableServer />
			</ShowModal>
		</section>
	);
}
