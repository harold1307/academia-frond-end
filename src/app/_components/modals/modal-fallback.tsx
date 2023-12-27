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
	action: "update" | "delete";
};

export default function ModalFallback({
	redirectTo,
	action,
}: ModalFallbackProps) {
	return (
		<Dialog defaultOpen={true} onOpenChange={redirectTo}>
			<DialogContent className='max-h-[80%] max-w-xs sm:max-w-[425px] md:max-w-2xl'>
				<DialogHeader>
					<DialogTitle>
						{action === "update" ? "Actualizar" : "Eliminar"} modulo
					</DialogTitle>
					<DialogDescription>
						No se ha encontrado el modulo a{" "}
						{action === "update" ? "actualizar" : "eliminar"}, por favor intente
						de nuevo.
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
