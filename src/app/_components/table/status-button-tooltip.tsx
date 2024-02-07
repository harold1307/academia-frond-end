import { Button } from "@/app/_components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/app/_components/ui/tooltip";

type StatusButtonTooltipProps = {
	status: boolean;
	hoverTitle: string;
};

export default function StatusButtonTooltip({
	hoverTitle,
	status,
}: StatusButtonTooltipProps) {
	return (
		<TooltipProvider delayDuration={300}>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button variant='outline'>{status ? "SI" : "NO"}</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p>{hoverTitle}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
