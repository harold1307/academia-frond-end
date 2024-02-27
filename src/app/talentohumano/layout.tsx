import React from "react";
import { fontPlay } from "../_components/ui/fonts";
import TalentoHumanoNavLinks from "./navLinks";

export default function TalentoHumanoLayout({
	children,
}: React.PropsWithChildren) {
	return (
		<div>
			<div>
				<h1
					className={`${fontPlay.className} w-100 text-center text-4xl antialiased`}
				>
					Talento Humano
				</h1>
				<TalentoHumanoNavLinks />
			</div>
			{children}
		</div>
	);
}