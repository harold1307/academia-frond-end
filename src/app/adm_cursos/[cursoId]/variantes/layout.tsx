import { fontPlay } from "@/app/_components/ui/fonts";

export default function VarianteLayout({ children }: React.PropsWithChildren) {
	return (
		<div>
			<h5
				className={` ${fontPlay.className} w-100 text-center text-xl antialiased`}
			>
				Variantes
			</h5>
			{children}
		</div>
	);
}
