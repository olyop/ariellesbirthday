import { createBEM } from "@oly_op/bem";
import { createElement, FC, Fragment } from "react";

import Form from "./form";
import Section from "../section";
import { useConfig } from "../../config-content";

import "./index.scss";

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
	dateStyle: "full",
});

const relativeTimeFormatter = new Intl.RelativeTimeFormat();

const bem = createBEM("RSVP");

const RSVP: FC = () => {
	const config = useConfig();

	const RSVP_TIME = config.dates.rsvp.getTime();
	const TIME_TO_RSVP = RSVP_TIME - Date.now();

	const DAYS_TO_RSVP = Number.parseInt((TIME_TO_RSVP / 1000 / 60 / 60 / 24).toFixed(0));

	const rsvpDate = dateTimeFormatter.format(RSVP_TIME);
	const rsvpDaysTo = relativeTimeFormatter.format(DAYS_TO_RSVP, "days");

	return (
		<Section id="rsvp" contentClassName={bem("", "FlexColumnGap")}>
			<Form />
			<p className={bem("date", "ParagraphOneBold")}>
				<Fragment>RSVP by </Fragment>
				{rsvpDate}
				<Fragment> (</Fragment>
				{rsvpDaysTo}
				<Fragment>)</Fragment>
			</p>
		</Section>
	);
};

export default RSVP;
