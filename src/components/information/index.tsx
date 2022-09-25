import { createBEM } from "@oly_op/bem";
import { createElement, FC, Fragment, useState } from "react";

import { Map, Marker } from "../google-maps";
import InformationItem from "./item";
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

const bem = createBEM("Information");

const Information: FC = () => {
	const config = useConfig();
	const [expanded, setExpanded] = useState<number>(0);

	const handleExpandClick = (index: number) => () => {
		setExpanded(index);
	};

	return (
		<section className={bem("")}>
			<div className={bem("content", "Content")}>
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
					{config.information.sections[expanded]?.paragraphs.map(paragraph => (
						<p key={paragraph} className="ParagraphOne">
							{paragraph}
						</p>
					))}
					{expanded === 0 && (
						<GoogleMaps>
							<Map
								zoom={18}
								className={bem("right-location")}
								fullscreenControl={false}
								panControl={false}
								controlSize={30}
								mapTypeControl
								streetViewControl={false}
								zoomControlOptions={{
									position: 11.0,
								}}
								mapTypeControlOptions={{
									mapTypeIds: ["satellite", "roadmap"],
									position: 11.0,
									style: 1.0,
								}}
								mapTypeId="satellite"
								center={{
									lat: -33.901496,
									lng: 151.241619,
								}}
							>
								<Marker
									position={{
										lat: -33.901496,
										lng: 151.241619,
									}}
								/>
							</Map>
						</GoogleMaps>
					)}
				</div>
			</div>
		</section>
	);
};

export default Information;
