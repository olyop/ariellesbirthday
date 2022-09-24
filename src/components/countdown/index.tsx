import { createBEM } from "@oly_op/bem";
import ms from "ms";
import { createElement, FC, Fragment, useEffect, useState } from "react";

import "./index.scss";

const bem = createBEM("Countdown");

const numberFormatter = new Intl.NumberFormat();
const relativeTimeFormatter = new Intl.RelativeTimeFormat();

const PARTY_TIME = new Date("2023-01-21T13:00:00").getTime();
// const PARTY_TIME = new Date(2022, 9 - 1, 25).getTime();

const determineCountdown = () => {
	const TIME_TO_PARTY = PARTY_TIME - Date.now();
	const SECONDS_TO_PARTY = parseInt((TIME_TO_PARTY / 1000).toFixed(0));
	const HOURS_TO_PARTY = parseInt((SECONDS_TO_PARTY / 60 / 60).toFixed(0));
	const DAYS_TO_PARTY = parseInt((HOURS_TO_PARTY / 24).toFixed(0));

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
	const [countdown, setCountdown] = useState(determineCountdown());

	useEffect(() => {
		const interval = setInterval(() => {
			setCountdown(determineCountdown());
		}, ms("1s"));

		return () => clearInterval(interval);
	}, []);
	return (
		<section>
			<div className="Content">
				<p className={bem("", "ParagraphOneBold")}>
					<Fragment>Party </Fragment>
					{countdown}
				</p>
			</div>
		</section>
	);
};

export default Countdown;
