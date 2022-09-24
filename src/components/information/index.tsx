import { createBEM } from "@oly_op/bem";
import { createElement, FC, Fragment, useState } from "react";

import InformationItem from "./item";
import { GoogleMaps } from "../../providers";
import PartyLocationMap from "./party-location-map";

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
	const [expanded, setExpanded] = useState<number>(0);

	const handleExpandClick = (index: number) => () => {
		setExpanded(index);
	};

	return (
		<section className={bem("")}>
			<div className={bem("content", "Content")}>
				<div className={bem("left")}>
					<InformationItem
						name="Where"
						value="Centennial Parklands"
						tabIndex={1}
						isExpanded={expanded === 0}
						onSelect={handleExpandClick(0)}
					/>
					<div className={bem(expanded === 0 && "left-gap")} />
					<InformationItem
						name="When"
						value="Saturday, January 21, 2023"
						tabIndex={2}
						isExpanded={expanded === 1}
						onSelect={handleExpandClick(1)}
					/>
					<div className={bem(expanded === 1 && "left-gap")} />
					<InformationItem
						name="Time"
						tabIndex={3}
						value="2pm"
						isExpanded={expanded === 2}
						onSelect={handleExpandClick(2)}
					/>
					<div className={bem(expanded === 2 && "left-gap")} />
				</div>
				<div
					className={bem("right-expanded", "right", "FlexColumnGapHalf")}
					style={{ marginTop: determineInformationRightTop(expanded) }}
				>
					{expanded === 0 && (
						<Fragment>
							<p className="ParagraphOne">
								The party will take place at Centennial Park. The exact location can be seen below
								in Google Maps.
							</p>
							<GoogleMaps>
								<PartyLocationMap />
							</GoogleMaps>
						</Fragment>
					)}
				</div>
			</div>
		</section>
	);
};

export default Information;
