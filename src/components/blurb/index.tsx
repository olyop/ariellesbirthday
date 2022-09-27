import { createBEM } from "@oly_op/bem";
import { createElement, FC, Fragment } from "react";

import RSVP from "../rsvp";
import Section from "../section";
import { useConfig } from "../../config-content";

import "./index.scss";

const bem = createBEM("Blurb");

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
	day: "numeric",
	month: "long",
});

const relativeTimeFormatter = new Intl.RelativeTimeFormat();

const Blurb: FC = () => {
	const config = useConfig();

	const RSVP_TIME = config.dates.rsvp.getTime();
	const TIME_TO_RSVP = RSVP_TIME - Date.now();

	const DAYS_TO_RSVP = parseInt((TIME_TO_RSVP / 1000 / 60 / 60 / 24).toFixed(0));

	const rsvpDate = dateTimeFormatter.format(RSVP_TIME);
	const rsvpDaysTo = relativeTimeFormatter.format(DAYS_TO_RSVP, "days");

	return (
		<Section id="blurb" contentClassName={bem("", "Content FlexColumnGap")}>
			<h2 className={bem("title", "HeadingFour")}>{config.blurb.title}</h2>
			<div className={bem("content", "FlexColumnGapHalf")}>
				{config.blurb.paragraphs.map(paragraph => (
					<p className="ParagraphOne" key={paragraph}>
						{paragraph}
					</p>
				))}
			</div>
			<div className={bem("rsvp", "FlexColumnGapHalf")}>
				<RSVP />
				<p className={bem("rsvp-date", "ParagraphOneBold")}>
					<Fragment>RSVP by </Fragment>
					{rsvpDate}
					<Fragment> (</Fragment>
					{rsvpDaysTo}
					<Fragment>)</Fragment>
				</p>
			</div>
		</Section>
	);
};

export default Blurb;
