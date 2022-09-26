import { createBEM } from "@oly_op/bem";
import ms from "ms";
import { createElement, FC, useEffect, useRef } from "react";

import { useConfig } from "../../config-content";

import "@oly_op/css-utilities/index.css";
// eslint-disable-next-line import/extensions, import/no-unresolved
import "@oly_op/react-button/index.css";
import "../../index.scss";

import "./index.scss";

const bem = createBEM("Title");

const Title: FC = () => {
	const config = useConfig();
	const titleRef = useRef<HTMLHeadingElement>(null);
	const subTitleRef = useRef<HTMLHeadingElement>(null);
	useEffect(() => {
		const timeout = setTimeout(() => {
			if (titleRef.current && subTitleRef.current) {
				titleRef.current.style.opacity = "unset";
				titleRef.current.style.marginLeft = "unset";
				subTitleRef.current.style.opacity = "unset";
				subTitleRef.current.style.marginRight = "unset";
			}
		}, ms("250ms"));
		return () => clearTimeout(timeout);
	});
	return (
		<header className={bem("", "FlexColumnGap")}>
			<h1
				className={bem("main-title", "title", "HeadingOne")}
				ref={titleRef}
				style={{ marginLeft: 800, opacity: 0 }}
			>
				{config.title}
			</h1>
			<div className={bem("divider")} />
			<h2
				className={bem("sub-title", "title", "HeadingFive")}
				ref={subTitleRef}
				style={{ marginRight: 800, opacity: 0 }}
			>
				{config.subTitle}
			</h2>
		</header>
	);
};

export default Title;
