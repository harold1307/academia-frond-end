"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/app/_components/ui/dialog";
import { Button } from "../ui/button";

type ShowModalProps =
	| {
			dialogProps: Parameters<typeof Dialog>[0];
			title: string;
			withTrigger?: false;
			triggerLabel?: undefined;
	  }
	| {
			dialogProps: Parameters<typeof Dialog>[0];
			title: string;
			withTrigger: true;
			triggerLabel: string | React.ReactNode;
	  };

/**
 *
 * @param children FormFields
 */
export default function ShowModal({
	dialogProps,
	title,
	children,
	triggerLabel,
	withTrigger,
}: React.PropsWithChildren<ShowModalProps>) {
	return (
		<Dialog {...dialogProps}>
			{withTrigger && (
				<DialogTrigger asChild>
					<Button className='m-2 h-8 w-fit border border-current bg-transparent p-4 text-current hover:text-black'>
						{triggerLabel}
					</Button>
				</DialogTrigger>
			)}
			<DialogContent className='max-h-[80%] max-w-max overflow-y-auto sm:max-w-[425px] md:max-w-[80%]'>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					{children}
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}
