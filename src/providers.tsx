import { load } from "js-yaml";
import { Status, Wrapper as GoogleMapsWrapper, WrapperProps } from "@googlemaps/react-wrapper";
import { createElement, FC, Fragment, PropsWithChildren, useEffect, useState } from "react";

import { ConfigProvider } from "./config-content";
import { ConfigContext } from "./types";

export const Config: FC<PropsWithChildren> = ({ children }) => {
	const [config, setConfig] = useState<ConfigContext>();

	const handleConfigLoad = async () => {
		const result = await fetch("/config.yaml");
		const body = await result.text();
		const yaml = (await load(body)) as ConfigContext;
		setConfig(yaml);
	};

	useEffect(() => {
		void handleConfigLoad();
	}, []);

	return config ? <ConfigProvider value={config}>{children}</ConfigProvider> : null;
};

const googleMapsRenderer: WrapperProps["render"] = status => {
	if (status === Status.LOADING) return <p className="ParagraphTwo">{status} ..</p>;
	if (status === Status.FAILURE) return <p className="ParagraphTwo">{status} ...</p>;
	return <Fragment />;
};

export const GoogleMaps: FC<PropsWithChildren> = ({ children }) => (
	<GoogleMapsWrapper apiKey={process.env.GOOGLE_MAPS_API_KEY} render={googleMapsRenderer}>
		{children}
	</GoogleMapsWrapper>
);
