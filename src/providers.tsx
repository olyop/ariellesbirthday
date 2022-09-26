import { load } from "js-yaml";
import { Status, Wrapper as GoogleMapsWrapper, WrapperProps } from "@googlemaps/react-wrapper";
import { createElement, FC, Fragment, PropsWithChildren, useEffect, useState } from "react";

import { Config as ConfigType } from "./config-type";
import { ConfigProvider } from "./config-content";

export const Config: FC<PropsWithChildren> = ({ children }) => {
	const [config, setConfig] = useState<ConfigType>();

	const handleConfigLoad = async () => {
		const result = await fetch("/config.yaml");
		const body = await result.text();
		const yaml = (await load(body)) as ConfigType;
		setConfig(yaml);
	};

	useEffect(() => {
		void handleConfigLoad();
	}, []);

	return config ? <ConfigProvider value={config}>{children}</ConfigProvider> : null;
};

const googleMapsRenderer: WrapperProps["render"] = status => {
	if (status === Status.LOADING) {
		return <p className="ParagraphOne">Loading...</p>;
	} else if (status === Status.FAILURE) {
		return <p className="ParagraphOne">Error loading map...</p>;
	} else {
		return <Fragment />;
	}
};

export const GoogleMaps: FC<PropsWithChildren> = ({ children }) => (
	<GoogleMapsWrapper apiKey={process.env.GOOGLE_MAPS_API_KEY} render={googleMapsRenderer}>
		{children}
	</GoogleMapsWrapper>
);
