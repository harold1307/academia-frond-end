import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/app/_components/ui/dialog";
import { Button } from "../ui/button";

type ModalFallbackProps = {
	redirectTo: () => void;
	action: "update" | "delete" | "clonar";
};

const config: Record<ModalFallbackProps["action"], string> = {
	update: "Actualizar",
	delete: "Eliminar",
	clonar: "Clonar",
} as const;

export default function ModalFallback({
	redirectTo,
	action,
}: ModalFallbackProps) {
	const actionTitle = config[action];

	return (
		<Dialog defaultOpen={true} onOpenChange={redirectTo}>
			<DialogContent className='max-h-[80%] max-w-xs sm:max-w-[425px] md:max-w-2xl'>
				<DialogHeader>
					<DialogTitle>{actionTitle} modulo</DialogTitle>
					<DialogDescription>
						No se ha encontrado el modulo a {actionTitle.toLowerCase()}, por
						favor intente de nuevo.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogClose asChild>
						<Button type='button' variant='info'>
							Ok
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
