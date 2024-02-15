import * as React from "react";
const LupaIcon = ({ ...props }) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		width='100%'
		height='100%'
		fill='none'
		viewBox='0 0 17 17'
		{...props}
	>
		<circle cx={6.25} cy={6.25} r={5.25} stroke='#fff' strokeWidth={2} />
		<path stroke='#fff' strokeWidth={2} d='m10.707 10.543 5 5' />
	</svg>
);
export default LupaIcon;
