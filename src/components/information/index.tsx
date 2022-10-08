import { createBEM } from "@oly_op/bem";
import Button from "@oly_op/react-button";
import { createElement, FC, Fragment, useEffect, useState } from "react";

import Section from "../section";
import InformationItem from "./item";
import { Map, Marker } from "../google-maps";
import { GoogleMaps } from "../../providers";
import { useConfig } from "../../config-content";

import "./index.scss";

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
		navigator.geolocation.getCurrentPosition(
			position => {
				resolve({
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				});
			},
			() => {
				reject(new Error("You blocked you're location"));
			},
		);
	});

const createGoogleMapsDirectionsURL = (
	location: google.maps.LatLngLiteral,
	destination: google.maps.LatLngLiteral,
) => {
	const baseURL = "https://www.google.com.au/maps/dir";
	const locationSection = `${location.lat},${location.lng}`;
	const destinationSection = `${destination.lat},${destination.lng}`;
	return `${baseURL}/${locationSection}/${destinationSection}/@${locationSection}`;
};

const bem = createBEM("Information");

const Information: FC = () => {
	const config = useConfig();

	const [expanded, setExpanded] = useState<number>(0);
	const [directionsLoading, setDirectionsLoading] = useState(false);

	const handleExpandClick = (index: number) => () => {
		setExpanded(index);
	};

	const getDirections = async () => {
		try {
			const location = await getLocation();
			const destination = config.location;
			const url = createGoogleMapsDirectionsURL(location, destination);
			window.open(url);
		} catch (error) {
			console.error(error);
		} finally {
			setDirectionsLoading(false);
		}
	};

	const handleGetDirections = () => {
		setDirectionsLoading(true);
	};

	useEffect(() => {
		if (directionsLoading) {
			void getDirections();
		}
	}, [directionsLoading]);

	return (
		<Section id="information" className={bem("")} contentClassName={bem("content", "Content")}>
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
				{config.information.sections[expanded]?.paragraphs?.map(paragraph => (
					<p key={paragraph} className="ParagraphOne">
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
								className={bem("right-location")}
								fullscreenControl
								panControl
								controlSize={30}
								mapTypeControl
								streetViewControl={false}
								zoomControlOptions={{
									position: 8.0,
								}}
								mapTypeControlOptions={{
									mapTypeIds: ["satellite", "roadmap"],
									position: 5.0,
									style: 0.0,
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
						<Button
							icon="directions"
							text={directionsLoading ? "Getting directions..." : "Get Directions"}
							onClick={handleGetDirections}
						/>
					</Fragment>
				)}
			</div>
		</Section>
	);
};

export default Information;
