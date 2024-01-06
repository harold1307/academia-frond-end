import MallaPageTabs from "./tabs";

export default function MallaLayout({ children }: React.PropsWithChildren) {
	return (
		<>
			<MallaPageTabs />
			{children}
		</>
	);
}
