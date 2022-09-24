import { createBEM } from "@oly_op/bem";
import { createElement, FC } from "react";

import Title from "./components/title";
import Cover from "./components/cover";
import Information from "./components/information";

import "./main.scss";
import Blurb from "./components/blurb";
import Footer from "./components/footer";
import Countdown from "./components/countdown";

const bem = createBEM("Main");

const Main: FC = () => (
	<div className={bem("", "FlexColumn")}>
		<Title />
		<Cover />
		<Blurb />
		<Information />
		<Countdown />
		<Footer />
	</div>
);

export default Main;
