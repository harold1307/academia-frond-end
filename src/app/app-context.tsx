import { useQuery } from "@tanstack/react-query";
import React from "react";

import { API } from "@/core/api-client";
import type { PeriodoLectivoFromAPI } from "@/core/api/periodos-lectivos";
import { PERIODOS_KEYS } from "./periodos/query_keys";

export type AppContextType = {
	selectedPeriodoId: string | null;
	selectPeriodo: (id: string) => void;
	periodos: PeriodoLectivoFromAPI[] | null;
	selectedPeriodo: PeriodoLectivoFromAPI | undefined;
};

const AppContext = React.createContext<AppContextType>({
	selectedPeriodoId: null,
	selectPeriodo: () => {},
	periodos: null,
	selectedPeriodo: undefined,
});

export function AppProvider({ children }: React.PropsWithChildren) {
	const [selectedPeriodoId, setSelectedPeriodoId] = React.useState<
		string | null
	>(null);

	const { data } = useQuery({
		queryKey: PERIODOS_KEYS.lists(),
		queryFn: () => {
			return API.periodos.getMany();
		},
	});

	React.useEffect(() => {
		if (selectedPeriodoId) return;
		if (!data?.data.length) return;

		setSelectedPeriodoId(data.data.at(0)?.id || null);
	}, [data, selectedPeriodoId]);

	function selectPeriodo(id: string) {
		setSelectedPeriodoId(id);
	}

	return (
		<AppContext.Provider
			value={{
				selectedPeriodoId,
				selectPeriodo,
				periodos: data?.data || null,
				selectedPeriodo: data?.data?.find(p => p.id === selectedPeriodoId),
			}}
		>
			{children}
		</AppContext.Provider>
	);
}

export function useAppContext() {
	const values = React.useContext(AppContext);

	return values;
}
