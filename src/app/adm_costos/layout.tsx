import CostosPageTabs from "./tabs";

function CostosLayout({ children }: React.PropsWithChildren) {
	return (
		<div>
			<CostosPageTabs />
			{children}
		</div>
	);
}

export default CostosLayout;
