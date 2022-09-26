import { createBEM } from "@oly_op/bem";
import { createElement, FC } from "react";

import Section from "../section";

import "./index.scss";

const bem = createBEM("Cover");

const Cover: FC = () => (
	<Section id="cover" className={bem("")} contentClassName="Content">
		<div className={bem("images")}>
			<img
				alt="Arielle with Cow"
				src="/images/arielle-cow.jpg"
				className={bem("images-cover-cow", "images-cover")}
			/>
			<img
				alt="Arielle in River"
				src="/images/arielle-river.jpg"
				className={bem("images-cover-river", "images-cover")}
			/>
			<img
				alt="Arielle Climbing"
				src="/images/arielle-climbing.jpg"
				className={bem("images-cover-climbing", "images-cover")}
			/>
			<img
				alt="Arielle with Pancakes"
				src="/images/pancakes.jpg"
				className={bem("images-cover-pancakes", "images-cover")}
			/>
			<img
				alt="Arielle with Shiba"
				src="/images/arielle-shiba.jpg"
				className={bem("images-cover-shiba", "images-cover")}
			/>
		</div>
	</Section>
);

export default Cover;
