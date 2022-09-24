import { createBEM } from "@oly_op/bem";
import { createElement, FC, useEffect, useRef, useState } from "react";

const bem = createBEM("Information");

const MAP_OPTIONS: google.maps.MapOptions = {
	zoom: 18,
	fullscreenControl: false,
	panControl: false,
	mapTypeControl: true,
	mapTypeControlOptions: {
		mapTypeIds: [],
		position: null,
		style: null,
	},
	mapTypeId: "satellite",
	center: {
		lat: -33.901496,
		lng: 151.241619,
	},
};

const PartyLocationMap: FC<google.maps.MapOptions> = options => {
	const ref = useRef<HTMLDivElement | null>(null);
	const [map, setMap] = useState<google.maps.Map>();

	useEffect(() => {
		if (ref.current && !map) {
			setMap(
				new window.google.maps.Map(ref.current, {
					...MAP_OPTIONS,
					...options,
				}),
			);
		}
	}, [ref, map]);

	return <div ref={ref} className={bem("location")} />;
};

export default PartyLocationMap;
