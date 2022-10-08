import { createBEM } from "@oly_op/bem";
import { createElement, FC } from "react";

import RSVP from "./components/rsvp";
import Blurb from "./components/blurb";
import Title from "./components/title";
import Cover from "./components/cover";
import Footer from "./components/footer";
import Countdown from "./components/countdown";
import Information from "./components/information";

import "./main.scss";

const bem = createBEM("Main");

const Main: FC = () => (
	<div className={bem("", "FlexColumn")}>
		<Title />
		<Cover />
		<Blurb />
		<RSVP />
		<Information />
		<Countdown />
		<Footer />
	</div>
);

export default Main;
