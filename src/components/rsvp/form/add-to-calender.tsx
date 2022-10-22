import Button from "@oly_op/react-button";
import { createElement, FC, useEffect } from "react";
import { atcb_action, atcb_init } from "add-to-calendar-button";

import { useConfig } from "../../../config-content";

import "add-to-calendar-button/assets/css/atcb.css";

const addZeroOrNot = (value: number) => {
	if (value < 10) {
		return `0${value}`;
	} else {
		return value;
	}
};

const AddToCalender: FC = () => {
	const config = useConfig();

	const start = config.dates.partyStart;
	const end = config.dates.partyEnd;

	const data: Parameters<typeof atcb_action>[0] = {
		name: config.title,
		iCalFileName: "Reminder-Event",
		location: `${config.location.lat},${config.location.lng}`,
		description: `${config.subTitle} ${config.blurb.catchLine}`,
		options: ["Apple", "Google", "iCal", "Microsoft365", "Outlook.com"],
		timeZone: "Australia/Sydney",
		startDate: `${start.getFullYear()}-${addZeroOrNot(start.getMonth() + 1)}-${start.getDate()}`,
		startTime: `${start.getHours()}:${addZeroOrNot(start.getMinutes())}`,
		endTime: `${end.getHours()}:${addZeroOrNot(end.getMinutes())}`,
	};

	useEffect(() => {
		atcb_init();
	}, []);

	const handleClick = () => {
		atcb_action(data);
	};

	return <Button icon="event" onClick={handleClick} text="Add to Calender" />;
};

export default AddToCalender;
