import React from "react";
import { fontPlay } from "../_components/ui/fonts";

export default function HorariosLayout({ children }: React.PropsWithChildren) {
	return (
		<div>
			<div>
				<h1
					className={`${fontPlay.className} w-100 text-center text-4xl antialiased`}
				>
					Horarios (profesor)
				</h1>
			</div>
			{children}
		</div>
	);
}
