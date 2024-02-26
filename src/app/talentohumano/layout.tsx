import React from "react";
import { fontPlay } from "../_components/ui/fonts";

export default function TalentoHumanoLayout({ children }: React.PropsWithChildren) {
	return (
		<div>
			<div>
				<h1
					className={`${fontPlay.className} w-100 text-center text-4xl antialiased`}
				>
					Talento Humano
				</h1>
			</div>
			{children}
		</div>
	);
}