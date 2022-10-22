import { createContext, useContext } from "react";

import { Config } from "./config-type";

const createBaseContext = <A extends unknown | null>() => {
	const context = createContext<A | undefined>(undefined);
	const useBaseContext = () => {
		const c = useContext(context);
		if (c === undefined) {
			throw new Error("useCtx must be inside a Provider with a value");
		}
		return c;
	};
	return [useBaseContext, context.Provider] as const;
};

export const [useConfig, ConfigProvider] = createBaseContext<Config>();
