import PeriodosPageTabs from "./tabs";

export default function MallaLayout({ children }: React.PropsWithChildren) {
	return (
		<>
			<PeriodosPageTabs />
			{children}
		</>
	);
}
