import { FC, useEffect, useState } from "react";

export const Marker: FC<google.maps.MarkerOptions> = options => {
	const [marker, setMarker] = useState<google.maps.Marker>();

	useEffect(() => {
		if (!marker) {
			setMarker(new google.maps.Marker(options));
		}

		// remove marker from map on unmount
		return () => {
			if (marker) {
				marker.setMap(null);
			}
		};
	}, [marker]);

	useEffect(() => {
		if (marker) {
			marker.setOptions(options);
		}
	}, [marker, options]);

	return null;
};
