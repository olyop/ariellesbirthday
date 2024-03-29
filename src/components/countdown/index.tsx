import { createBEM } from "@oly_op/bem";
import ms from "ms";
import { FC, createElement, useEffect, useState } from "react";

import { useConfig } from "../../config-content";
import Section from "../section";
import "./index.scss";

const bem = createBEM("Countdown");

const numberFormatter = new Intl.NumberFormat();
const relativeTimeFormatter = new Intl.RelativeTimeFormat();

const determineCountdown = (timeToParty: Date) => {
	const PARTY_TIME = timeToParty.getTime();
	const TIME_TO_PARTY = PARTY_TIME - Date.now();
	const SECONDS_TO_PARTY = Number.parseInt((TIME_TO_PARTY / 1000).toFixed(0));
	const HOURS_TO_PARTY = Number.parseInt((SECONDS_TO_PARTY / 60 / 60).toFixed(0));
	const DAYS_TO_PARTY = Number.parseInt((HOURS_TO_PARTY / 24).toFixed(0));

	if (HOURS_TO_PARTY < 5) {
		return relativeTimeFormatter.format(SECONDS_TO_PARTY, "second");
	} else if (DAYS_TO_PARTY < 3) {
		return `${relativeTimeFormatter.format(HOURS_TO_PARTY, "hour")}, and ${numberFormatter.format(
			SECONDS_TO_PARTY,
		)}`;
	} else {
		return `${relativeTimeFormatter.format(DAYS_TO_PARTY, "day")}, ${relativeTimeFormatter.format(
			HOURS_TO_PARTY,
			"hour",
		)}, ${numberFormatter.format(SECONDS_TO_PARTY)} seconds`;
	}
};

const Countdown: FC = () => {
	const config = useConfig();
	const [countdown, setCountdown] = useState(determineCountdown(config.dates.partyStart));

	useEffect(() => {
		const interval = setInterval(() => {
			setCountdown(determineCountdown(config.dates.partyStart));
		}, ms("1s"));

		return () => clearInterval(interval);
	}, []);

	return (
		<Section id="countdown" contentClassName="FlexColumnGapHalf">
			<p className={bem("", "ParagraphTwo")}>{config.countdown.text}</p>
			<p className={bem("", "ParagraphOneBold")}>{countdown}</p>
		</Section>
	);
};

export default Countdown;
