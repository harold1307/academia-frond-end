import * as React from "react";
const FileUpload = ({ ...props }) => (
	<svg
		width='50'
		height='50'
		viewBox='0 0 50 50'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
        {...props}
	>
		<g clip-path='url(#clip0_223_4118)'>
			<path
				d='M18.75 33.3333H31.25V20.8333H39.5833L25 6.25L10.4167 20.8333H18.75V33.3333ZM10.4167 37.5H39.5833V41.6667H10.4167V37.5Z'
				fill='white'
			/>
		</g>
		<defs>
			<clipPath id='clip0_223_4118'>
				<rect width='50' height='50' fill='white' />
			</clipPath>
		</defs>
	</svg>
);
export default FileUpload;
