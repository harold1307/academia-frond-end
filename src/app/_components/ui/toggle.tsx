"use client";
import React, { useState } from "react";
import * as Toggle from "@radix-ui/react-toggle";

const ToggleSwitch = ({ value }: { value: string | string[] | undefined }) => {
	const [check, setCheck] = useState(value);

	const ChangeValue = () => {
		if (check === "SI") {
			setCheck("NO");
		} else {
			setCheck("SI");
		}
	};

	return (
		<Toggle.Root
			onPressedChange={ChangeValue}
			value={check}
			className='flex h-8 items-center justify-center rounded-md border border-slate-500 p-2 text-base text-slate-400 ring-slate-400 focus:ring'
		>
			{check === "SI" ? "SI" : "NO"}
		</Toggle.Root>
	);
};

export default ToggleSwitch;
