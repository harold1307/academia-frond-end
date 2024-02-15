"use client";
import { Button } from "@/app/_components/ui/button";
import { useState } from "react";

//Obtener la semana actual
const currentDate = new Date();
const first = currentDate.getDate() - (currentDate.getDay() - 1);

export default function HorariosTableHandler() {
	const [dates, setDates] = useState({
		first: new Date(currentDate.setDate(first)).toUTCString(),
		last: new Date(currentDate.setDate(first + 6)).toUTCString(),
	});

	const goBackOneWeek = () => {
		const currDate = new Date(dates.first);
		const firstOfWeek = currDate.getDate() - 7;
		const datesToFetch = {
			first: new Date(currDate.setDate(firstOfWeek)).toUTCString(),
			last: new Date(currDate.setDate(firstOfWeek + 6)).toUTCString(),
		};
		console.log(
			"fetch data entre ",
			datesToFetch.first,
			" - ",
			datesToFetch.last,
		);
		setDates(datesToFetch);
	};
	const goForwardOneWeek = () => {
		const currDate = new Date(dates.first);
		const firstOfWeek = currDate.getDate() + 7;
		const datesToFetch = {
			first: new Date(currDate.setDate(firstOfWeek)).toUTCString(),
			last: new Date(currDate.setDate(firstOfWeek + 6)).toUTCString(),
		};
		console.log(
			"fetch data entre ",
			datesToFetch.first,
			" - ",
			datesToFetch.last,
		);
		setDates(datesToFetch);
	};

	return (
		<div className=' flex w-full items-center justify-start gap-4 px-8'>
			<Button onClick={goBackOneWeek}>{`<`}</Button>
			<Button onClick={goForwardOneWeek}>{`>`}</Button>
		</div>
	);
}
