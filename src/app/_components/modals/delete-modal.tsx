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

type DeleteModalProps = {
	dialogProps: Parameters<typeof Dialog>[0];
	disabled: boolean;
	title: string;
	description: string;
	onDelete: () => void;
	onClose: () => void;
};

export default function DeleteModal({
	dialogProps,
	disabled,
	onClose,
	onDelete,
	title,
	description,
}: DeleteModalProps) {
	return (
		<Dialog {...dialogProps}>
			<DialogContent className='max-h-[80%] max-w-xs sm:max-w-[425px] md:max-w-2xl'>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						type='button'
						variant='destructive'
						onClick={onDelete}
						disabled={disabled}
					>
						Eliminar
					</Button>
					<DialogClose asChild>
						<Button
							variant='info'
							type='button'
							onClick={onClose}
							disabled={disabled}
						>
							Cancelar
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
