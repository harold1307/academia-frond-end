"use client";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { type ChangeEvent, ReactEventHandler, useState } from "react";

type ContenidoProps = {
	materia: string;
};

export default function Contenido({ materia }: ContenidoProps) {
	const [content, setContent] = useState({
		tema: "",
		estrategia: "",
		obs: "",
	});

	const contentHandler = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		setContent({
			...content,
			[e.target.name]: e.target.value,
		});
	};

	const saveContent = () => {
		console.log("Save", content);
	};
	return (
		<section className='flex w-full flex-col items-start justify-center gap-4 p-4'>
			<span>Materia: {materia}</span>
			<div className='h-32 w-full'>
				<span>Tema y Subtema</span>
				<Input
					className='m-0 h-28'
					onChange={e => contentHandler(e)}
					type='custom-text-area'
					name='tema'
					placeholder='Sin Contenido'
				/>
			</div>
			<div className='h-32 w-full'>
				<span>Estrategias Metodológicas</span>
				<Input
					className='m-0 h-28'
					onChange={e => contentHandler(e)}
					type='custom-text-area'
					name='estrategia'
					placeholder='Sin Contenido'
				/>
			</div>
			<div className='h-36 w-full'>
				<span>Observaciones</span>
				<Input
					className='m-0 h-28'
					onChange={e => contentHandler(e)}
					type='custom-text-area'
					name='obs'
					placeholder='Sin Observaciones'
				/>
			</div>
			<Button onClick={saveContent}>Guardar</Button>
		</section>
	);
}
