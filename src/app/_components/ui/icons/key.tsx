function KeyIcon({ ...props }) {
	return (
		<svg
			width='100%'
			height='100%'
			viewBox='0 0 20 21'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			xmlnsXlink='http://www.w3.org/1999/xlink'
			{...props}
		>
			<rect y='0.5' width='20' height='20' fill='url(#pattern3)' />
			<defs>
				<pattern
					id='pattern3'
					patternContentUnits='objectBoundingBox'
					width='1'
					height='1'
				>
					<use xlinkHref='#image0_771_1182' transform='scale(0.0111111)' />
				</pattern>
				<image
					id='image0_771_1182'
					width='90'
					height='90'
					xlinkHref='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAACoElEQVR4nO3czWoTURiH8fcy7FLsDbhSUGttK9KF19O40q0XIH7gRtfeQ6tLd278WAsiSEEbE+3GRw5OIEpictI577w58/9BIYsmM336Mp05k8ZMRERERGYAtoEHwBvgM/AJeA3cBy7Oeo5kADaBI/7vF/ACOJfz2vL3FB+zvI+a7kzAFvCdfF+BS7nb6yVWj6zYjpEV2zGyYjtGno59ee6G+4RykRXbMfLEt95ONn6RJ9K2tqxP8I88Hfu69QHdRe5PbLqPXH9s4kSeSPuybTUBdoFxoWCnwEFavWu+0uOfSz73BLhiNaBs5ORgxjb3M2NftQqWOseUNXMdOjP2cG1jA+eBL5Q3d8EfuAX8yDhm37B1A7zCx2DBfuRO9jVbF8BN/KSI+y3HXo8rSOApvtKZx+0F+5RzGBkBOxYd8AF/bU92/IuaDi9MTns12c1xriv9iQ28p1ttH0ZGIU/9gCd0r8Rk71okwB4xlJjsWIcR4CXrE3uQ8XqxJps/75vLeUtXZ7GBjczXG4VaYsVnUenMsVcITTNEm9ajZdIzxwbusJoji4R4sQfNFG80j9MZyqriHK+nbmV1eSFTymOLhliT3ZZ3FhH1TfbQogKeUY8Tiwi4R13iHTqoL3Ly0CKhzsiEWtWj3siHFgX1Ro5zCU69kcdhFpWoO/KeRaDIDhTZgSI7UGQHiuxAkR0oct2Rnxe+eTAOc3uqw8h3C9880MUITeSpX3bbsRWZfyIXiK3IzIncYmxFZkHkFmLXH9m6//i2414sdVqZ/b2wxAcSJofpe60Pp3BWdt930juIgLfN/9MMm8ePQt3jS0pGTrr++cKgMBOFdqWJdqLQThTaif7QOVFoJwrtRKGdKLQThXai0E4U2olCi4iIiIiIWL1+A6BEGJFxF7TtAAAAAElFTkSuQmCC'
				/>
			</defs>
		</svg>
	);
}

export default KeyIcon;
