import { createBEM } from "@oly_op/bem";
import Button from "@oly_op/react-button";
import { FC, Fragment, createElement, useEffect, useState } from "react";

import { useConfig } from "../../config-content";
import { GoogleMaps } from "../../providers";
import { Map, Marker } from "../google-maps";
import Section from "../section";
import "./index.scss";
import InformationItem from "./item";

const determineInformationRightTop = (index: number) => {
	const gapHeight = "var(--row-gap)";
	const buttonHeight = "var(--space-half) + var(--button-dimension)";
	if (index === 0) {
		return undefined;
	} else if (index === 1) {
		return `calc(${buttonHeight} + ${gapHeight})`;
	} else {
		return `calc(2 * (${buttonHeight} + ${gapHeight}))`;
	}
};

const getLocation = () =>
	new Promise<google.maps.LatLngLiteral>((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(position => {
			resolve({
				lat: position.coords.latitude,
				lng: position.coords.longitude,
			});
		}, reject);
	});

const createGoogleMapsDirectionsURL = (
	location: google.maps.LatLngLiteral,
	destination: google.maps.LatLngLiteral,
) => {
	// Reference: https://developer.apple.com/library/archive/featuredarticles/iPhoneURLScheme_Reference/MapLinks/MapLinks.html
	const url = new URL("https://maps.apple.com");
	url.searchParams.append("dirflg", "d");
	url.searchParams.append("saddr", `${location.lat},${location.lng}`);
	url.searchParams.append("daddr", `${destination.lat},${destination.lng}`);
	return url;
};

const bem = createBEM("Information");

const Information: FC = () => {
	const config = useConfig();

	const [expanded, setExpanded] = useState<number>(0);
	const [directionsLoading, setDirectionsLoading] = useState(false);
	const [getDirectionsLabel, setGetDirectionsLabel] = useState("Get Directions");

	const handleExpandClick = (index: number) => () => {
		setExpanded(index);
	};

	const getDirections = async () => {
		try {
			const location = await getLocation();
			const destination = config.location;
			const url = createGoogleMapsDirectionsURL(location, destination);
			window.open(url);
			setGetDirectionsLabel("Get Directions");
		} catch (error) {
			setGetDirectionsLabel(error instanceof GeolocationPositionError ? error.message : "Error");
		} finally {
			setDirectionsLoading(false);
		}
	};

	const handleGetDirections = () => {
		setGetDirectionsLabel("Getting Directions...");
		setDirectionsLoading(true);
	};

	useEffect(() => {
		if (directionsLoading) {
			void getDirections();
		}
	}, [directionsLoading]);

	return (
		<Section id="information" className={bem("")} contentClassName="FlexColumnGapHalf">
			<p className="ParagraphOne LightColor">Click the boxes to view more information.</p>
			<div className={bem("content")}>
				<div className={bem("left")}>
					{config.information.sections.map((section, index) => (
						<Fragment key={section.name}>
							<InformationItem
								tabIndex={index + 1}
								isExpanded={expanded === index}
								name={section.name}
								label={section.label}
								onSelect={handleExpandClick(index)}
							/>
							<div className={bem(expanded === index && "left-gap")} />
						</Fragment>
					))}
				</div>
				<div
					className={bem("right-expanded", "right", "FlexColumnGapHalf")}
					style={{ marginTop: determineInformationRightTop(expanded) }}
				>
					{config.information.sections[expanded]?.paragraphs?.map((paragraph, index) => (
						<p
							key={paragraph}
							className={bem(
								index === 0 && "right-paragraph-first",
								index === 0 ? "HeadingFive" : "ParagraphOne",
							)}
						>
							{paragraph}
						</p>
					))}
					{config.information.sections[expanded]?.timeline?.map(event => (
						<p key={event.time} className={bem("", "ParagraphOne")}>
							<span className={bem("right-event-time")}>{event.time}</span>
							<Fragment> </Fragment>
							{event.text}
						</p>
					))}
					{expanded === 0 && (
						<Fragment>
							<GoogleMaps>
								<Map
									zoom={16}
									panControl
									mapTypeControl
									fullscreenControl
									controlSize={30}
									streetViewControl={false}
									className={bem("right-location")}
									zoomControlOptions={{
										position: 8,
									}}
									mapTypeControlOptions={{
										mapTypeIds: ["satellite", "roadmap"],
										position: 5,
									}}
									mapTypeId="roadmap"
									center={{
										lat: config.location.lat,
										lng: config.location.lng,
									}}
								>
									<Marker
										position={{
											lat: config.location.lat,
											lng: config.location.lng,
										}}
									/>
								</Map>
							</GoogleMaps>
							<Button icon="directions" onClick={handleGetDirections} text={getDirectionsLabel} />
						</Fragment>
					)}
				</div>
			</div>
		</Section>
	);
};

export default Information;
