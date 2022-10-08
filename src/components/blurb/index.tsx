import { createBEM } from "@oly_op/bem";
import { createElement, FC } from "react";

import Section from "../section";
import { useConfig } from "../../config-content";

import "./index.scss";

const bem = createBEM("Blurb");

const Blurb: FC = () => {
	const config = useConfig();
	return (
		<Section id="blurb" contentClassName={bem("", "Content FlexColumnGap")}>
			<h2 className={bem("title", "HeadingFour")}>{config.blurb.title}</h2>
			<p className={bem("catchLine", "content-paragraph", "ParagraphOne")}>
				{config.blurb.catchLine}
			</p>
			<div className={bem("content", "FlexColumnGapHalf")}>
				{config.blurb.paragraphs.map(paragraph => (
					<p className={bem("content-paragraph", "ParagraphOne")} key={paragraph}>
						{paragraph}
					</p>
				))}
			</div>
			<p className={bem("emojis", "ParagraphOne")}>{config.blurb.emojis}</p>
		</Section>
	);
};

export default Blurb;
