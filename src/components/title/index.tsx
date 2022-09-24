import { createBEM } from "@oly_op/bem";
import { createElement, FC } from "react";

import { useConfig } from "../../config-content";

import "@oly_op/css-utilities/index.css";
// eslint-disable-next-line import/extensions, import/no-unresolved
import "@oly_op/react-button/index.css";
import "../../index.scss";

import "./index.scss";

const bem = createBEM("Title");

const Title: FC = () => {
	const { TITLE } = useConfig();
	return (
		<header>
			<div className={bem("", "Content")}>
				<h1 className={bem("title", "HeadingOne")}>{TITLE}</h1>
			</div>
		</header>
	);
};

export default Title;
