import { fontPlay } from "@/app/_components/ui/fonts";

export default function ProgramasLayout({ children }: React.PropsWithChildren) {
	return (
		<div>
			<h5
				className={` ${fontPlay.className} w-100 text-center text-xl antialiased`}
			>
				Programas
			</h5>
			{children}
		</div>
	);
}
